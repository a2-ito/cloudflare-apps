import { NextRequest, NextResponse } from "next/server";

interface OgpData {
  title?: string;
  type?: string;
  image?: string;
  ogpDescription?: string;
  siteName?: string;
  locale?: string;
  url?: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "URL parameter is required" },
      { status: 400 },
    );
  }

  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; OGP-Checker/1.0)",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${response.status}` },
        { status: response.status },
      );
    }

    const html = await response.text();
    const ogpData: OgpData = {};

    // Extract OGP meta tags
    const titleMatch = html.match(
      /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i,
    );
    if (titleMatch) ogpData.title = titleMatch[1];

    const typeMatch = html.match(
      /<meta[^>]+property=["']og:type["'][^>]+content=["']([^"']+)["']/i,
    );
    if (typeMatch) ogpData.type = typeMatch[1];

    const imageMatch = html.match(
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    );
    if (imageMatch) ogpData.image = imageMatch[1];

    const descriptionMatch = html.match(
      /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i,
    );
    if (descriptionMatch) ogpData.ogpDescription = descriptionMatch[1];

    const siteNameMatch = html.match(
      /<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i,
    );
    if (siteNameMatch) ogpData.siteName = siteNameMatch[1];

    const localeMatch = html.match(
      /<meta[^>]+property=["']og:locale["'][^>]+content=["']([^"']+)["']/i,
    );
    if (localeMatch) ogpData.locale = localeMatch[1];

    const urlMatch = html.match(
      /<meta[^>]+property=["']og:url["'][^>]+content=["']([^"']+)["']/i,
    );
    if (urlMatch) ogpData.url = urlMatch[1];

    // If no OGP data found, also try to extract basic title and description from HTML
    if (Object.keys(ogpData).length === 0) {
      const titleTagMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      if (titleTagMatch) ogpData.title = titleTagMatch[1];

      const descriptionMetaMatch = html.match(
        /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i,
      );
      if (descriptionMetaMatch)
        ogpData.ogpDescription = descriptionMetaMatch[1];
    }

    return NextResponse.json(ogpData);
  } catch (error) {
    console.error("Error fetching OGP data:", error);
    return NextResponse.json(
      { error: "Failed to fetch or parse the URL" },
      { status: 500 },
    );
  }
}

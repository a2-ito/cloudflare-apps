"use client";

import { useState } from "react";
import Image from "next/image";
import type { OgpCheckerMessages } from "@/types/tools";

interface OgpData {
  title?: string;
  type?: string;
  image?: string;
  ogpDescription?: string;
  siteName?: string;
  locale?: string;
  url?: string;
}

export default function OgpChecker({ t }: { t: OgpCheckerMessages }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [ogpData, setOgpData] = useState<OgpData | null>(null);
  const [error, setError] = useState("");

  const checkOgp = async () => {
    if (!url.trim()) {
      setError(t.invalidUrl);
      return;
    }

    try {
      new URL(url);
    } catch {
      setError(t.invalidUrl);
      return;
    }

    setLoading(true);
    setError("");
    setOgpData(null);

    try {
      const response = await fetch(
        `/api/ogp-check?url=${encodeURIComponent(url)}`,
      );
      const data = (await response.json()) as OgpData | { error: string };

      if (!response.ok) {
        setError("error" in data ? data.error : t.ogpError);
        return;
      }

      if (!data || Object.keys(data).length === 0) {
        setError(t.noOgpData);
        return;
      }

      setOgpData("error" in data ? null : data);
    } catch {
      setError(t.ogpError);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">{t.name}</h1>
      <p className="text-gray-600 mb-6">{t.description}</p>

      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={t.urlInput}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            onKeyPress={(e) => e.key === "Enter" && checkOgp()}
          />
          <button
            onClick={checkOgp}
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t.loading : t.check}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      {ogpData && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">OGP Data</h2>

          {ogpData.title && (
            <div className="p-4 bg-gray-50 rounded-md">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-medium text-gray-700">{t.title}:</span>
                  <p className="mt-1 text-gray-900">{ogpData.title}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(ogpData.title!)}
                  className="ml-2 px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
                >
                  {t.copy}
                </button>
              </div>
            </div>
          )}

          {ogpData.type && (
            <div className="p-4 bg-gray-50 rounded-md">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-medium text-gray-700">{t.type}:</span>
                  <p className="mt-1 text-gray-900">{ogpData.type}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(ogpData.type!)}
                  className="ml-2 px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
                >
                  {t.copy}
                </button>
              </div>
            </div>
          )}

          {ogpData.image && (
            <div className="p-4 bg-gray-50 rounded-md">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <span className="font-medium text-gray-700">{t.image}:</span>
                  <Image
                    src={ogpData.image}
                    alt="OGP Image"
                    width={600}
                    height={315}
                    className="mt-2 max-w-full h-auto rounded-md border border-gray-300"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <p className="mt-2 text-sm text-gray-600 break-all">
                    {ogpData.image}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(ogpData.image!)}
                  className="ml-2 px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
                >
                  {t.copy}
                </button>
              </div>
            </div>
          )}

          {ogpData.ogpDescription && (
            <div className="p-4 bg-gray-50 rounded-md">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-medium text-gray-700">
                    {t.ogpDescription}:
                  </span>
                  <p className="mt-1 text-gray-900">{ogpData.ogpDescription}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(ogpData.ogpDescription!)}
                  className="ml-2 px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
                >
                  {t.copy}
                </button>
              </div>
            </div>
          )}

          {ogpData.siteName && (
            <div className="p-4 bg-gray-50 rounded-md">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-medium text-gray-700">
                    {t.siteName}:
                  </span>
                  <p className="mt-1 text-gray-900">{ogpData.siteName}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(ogpData.siteName!)}
                  className="ml-2 px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
                >
                  {t.copy}
                </button>
              </div>
            </div>
          )}

          {ogpData.locale && (
            <div className="p-4 bg-gray-50 rounded-md">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-medium text-gray-700">{t.locale}:</span>
                  <p className="mt-1 text-gray-900">{ogpData.locale}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(ogpData.locale!)}
                  className="ml-2 px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
                >
                  {t.copy}
                </button>
              </div>
            </div>
          )}

          {ogpData.url && (
            <div className="p-4 bg-gray-50 rounded-md">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-medium text-gray-700">URL:</span>
                  <p className="mt-1 text-gray-900 break-all">{ogpData.url}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(ogpData.url!)}
                  className="ml-2 px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
                >
                  {t.copy}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

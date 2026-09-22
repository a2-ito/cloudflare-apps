import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;

// OpenNext (Cloudflare) 用: `next dev` 中でも Cloudflare バインディング(D1 など)を利用可能にする
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();

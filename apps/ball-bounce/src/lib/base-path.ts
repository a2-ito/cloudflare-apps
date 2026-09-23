// app.a2ito.work/ball-bounce で公開するため、アプリ全体をこのパス配下に置く。
// next.config.ts の basePath と、basePath が自動で付かない生の <img> や fetch の両方がここを参照する。
export const BASE_PATH = "/ball-bounce";

export const withBasePath = (path: string): string => `${BASE_PATH}${path}`;

export const getSessionUser = (request: Request) => {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/session=([^;]+)/);
  return match?.[1] ?? null;
};

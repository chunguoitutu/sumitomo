export function request(endPoint: string, init?: RequestInit) {
  const newUrl = (process.env.NEXT_PUBLIC_PREFIX_API || "") + endPoint;

  return fetch(newUrl, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || null),
    },
  });
}

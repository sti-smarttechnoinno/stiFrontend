export async function fetchFromBackend(endpoint: string, options: RequestInit = {}, timeoutMs = 8000): Promise<Response | null> {
  const urlsToTry: string[] = [];

  const primaryUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const fallbackUrlsRaw = process.env.BACKEND_FALLBACK_URLS || process.env.NEXT_PUBLIC_BACKEND_FALLBACK_URLS;

  if (primaryUrl) {
    const cleanUrl = primaryUrl.replace(/\/+$/, "");
    urlsToTry.push(cleanUrl);

    if (cleanUrl.startsWith("http://")) {
      urlsToTry.push(cleanUrl.replace("http://", "https://"));
    } else if (cleanUrl.startsWith("https://")) {
      urlsToTry.push(cleanUrl.replace("https://", "http://"));
    }
  }

  if (fallbackUrlsRaw) {
    const list = fallbackUrlsRaw.split(",").map((u) => u.trim().replace(/\/+$/, "")).filter(Boolean);
    urlsToTry.push(...list);
  } else if (!primaryUrl) {
    const port = process.env.BACKEND_PORT || "8000";
    urlsToTry.push(`http://127.0.0.1:${port}/api`);
    urlsToTry.push(`http://localhost:${port}/api`);
  }

  // Remove duplicates
  const uniqueUrls = Array.from(new Set(urlsToTry));

  for (const baseUrl of uniqueUrls) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
      const fullUrl = `${baseUrl}${cleanEndpoint}`;

      const res = await fetch(fullUrl, {
        ...options,
        redirect: "follow",
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (res.ok) {
        return res;
      }
    } catch (err) {
      // Continue to next URL fallback
    }
  }

  return null;
}

export async function fetchFromBackend(endpoint: string, options: RequestInit = {}, timeoutMs = 8000): Promise<Response | null> {
  const urlsToTry: string[] = [];

  const envUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL;
  if (envUrl) {
    const cleanUrl = envUrl.replace(/\/+$/, "");
    urlsToTry.push(cleanUrl);

    if (cleanUrl.startsWith("http://")) {
      urlsToTry.push(cleanUrl.replace("http://", "https://"));
    } else if (cleanUrl.startsWith("https://")) {
      urlsToTry.push(cleanUrl.replace("https://", "http://"));
    }
  }

  if (!envUrl) {
    urlsToTry.push("http://127.0.0.1:8000/api");
    urlsToTry.push("http://localhost:8000/api");
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

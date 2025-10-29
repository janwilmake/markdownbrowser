/**
 * Cloudflare Worker for markdown browser
 * Handles proxying fetch requests with proper headers
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle CORS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    // Handle /fetch endpoint
    if (url.pathname === "/fetch" && request.method === "POST") {
      try {
        const body = await request.json();
        const { url: targetUrl, extract, search, apiKey } = body;
        console.log({ targetUrl });
        if (!targetUrl) {
          return jsonResponse({ error: "Missing url parameter" }, 400);
        }

        // Determine if we should use the extract service
        const isExtractAvailable = extract && apiKey;
        const isSearchUrl =
          search && apiKey
            ? targetUrl.startsWith(search.replace("%s", ""))
            : false;

        let fetchUrl = targetUrl;
        const headers = new Headers();

        // Use extract service for HTML content if apiKey is available
        if (isSearchUrl) {
          // For search URLs
          headers.set("Authorization", `Bearer ${apiKey}`);
        } else {
          // For direct markdown/text fetches, set Accept header
          headers.set("Accept", "text/markdown, text/plain, */*");
        }

        // First attempt with Accept header
        let response = await fetch(fetchUrl, { headers });

        // Fallback: try without Accept header if first attempt failed
        if (!response.ok) {
          response = await fetch(targetUrl);
        }

        if (
          !response.ok ||
          response.headers.get("content-type")?.includes("text/html")
        ) {
          if (isExtractAvailable) {
            const extractUrl = extract.replace(
              "%s",
              encodeURIComponent(targetUrl)
            );
            const extractHeaders = new Headers();
            extractHeaders.set("Authorization", `Bearer ${apiKey}`);

            const extractResponse = await fetch(extractUrl, {
              headers: extractHeaders,
            });

            if (extractResponse.ok) {
              response = extractResponse;
            } else {
              throw new Error(
                "Extract failed: " + extractUrl + "; " + extractResponse.status
              );
            }
          } else {
            throw new Error("Got HTML. Can only do this with Parallel apiKey");
          }
        }

        const content = await response.text();
        const contentType =
          response.headers.get("content-type") || "text/plain";

        return jsonResponse({
          content,
          contentType,
          status: response.status,
          ok: response.ok,
          url: response.url,
        });
      } catch (error) {
        return jsonResponse(
          {
            error: error.message,
            details: "Failed to fetch the requested URL",
          },
          500
        );
      }
    }

    // Return 404 for unknown endpoints
    return new Response("Not Found", { status: 404 });
  },
};

/**
 * Helper function to return JSON response with CORS headers
 */
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

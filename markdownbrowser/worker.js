/**
 * Cloudflare Worker for fetching markdown content
 * Handles /fetch endpoint with proper content type negotiation
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle /fetch endpoint
    if (url.pathname === "/fetch") {
      return handleFetchEndpoint(url);
    }

    // All other requests fall through to static assets
    return new Response("Not Found", { status: 404 });
  },
};

/**
 * Handles the /fetch?url= endpoint
 * Fetches markdown/text content with proper error handling
 */
async function handleFetchEndpoint(url) {
  const targetUrl = url.searchParams.get("url");

  if (!targetUrl) {
    return jsonError("Missing url parameter", 400);
  }

  // Validate URL
  let parsedUrl;
  try {
    parsedUrl = new URL(targetUrl);
  } catch (e) {
    return jsonError("Invalid URL format", 400);
  }

  try {
    // First attempt with Accept headers
    let response = await fetch(targetUrl, {
      headers: {
        Accept: "text/markdown, text/plain, */*",
        "User-Agent": "MarkdownBrowser/1.0",
      },
    });

    // If that fails, try without Accept header
    if (!response.ok) {
      response = await fetch(targetUrl, {
        headers: {
          "User-Agent": "MarkdownBrowser/1.0",
        },
      });
    }

    if (!response.ok) {
      return jsonError(
        `Failed to fetch: ${response.status} ${response.statusText}`,
        response.status
      );
    }

    const contentType = response.headers.get("content-type") || "";

    // Check if HTML was returned (we don't want that)
    if (contentType.includes("text/html")) {
      return jsonError(
        "HTML content returned. This browser only supports markdown and plain text.",
        400
      );
    }

    const content = await response.text();

    return new Response(
      JSON.stringify({
        success: true,
        content,
        contentType,
        url: targetUrl,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    return jsonError(`Network error: ${error.message}`, 500);
  }
}

/**
 * Helper to return JSON error responses
 */
function jsonError(message, status = 400) {
  return new Response(
    JSON.stringify({
      success: false,
      error: message,
    }),
    {
      status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}

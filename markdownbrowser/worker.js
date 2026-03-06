/**
 * Cloudflare Worker for markdown browser
 * Handles proxying fetch requests with proper headers
 */
import indexHtml from "./index.html";
const MARKDOWN_HOMEPAGE = `# Markdown Browser

> A browser for the machine-readable web.

Browse any website as clean markdown, navigate [llms.txt](https://llmstxt.org) sitemaps, and see the internet through the eyes of AI agents.

## Features

- **llms.txt navigation** — Browse any site's agent-facing structure from a sidebar
- **Markdown extraction** — Convert any webpage to clean markdown, even without publisher support
- **[Markdown Form Links](https://markdownformlinks.wilmake.com)** — Interactive forms using standard markdown link syntax
- **Developer tools** — Token counts, response metadata, and spec-compliance checks

## Links

- [Blog: Introducing Markdown Browser](/BLOG.md): Why the markdown web needs a browser and what's next
- [llms.txt](/llms.txt): Machine-readable site index
- [GitHub](https://github.com/janwilmake/markdownbrowser): Source code
`;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle CORS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
      });
    }

    // Serve homepage
    if (url.pathname === "/") {
      const accept = request.headers.get("Accept") || "";
      if (accept.includes("text/markdown")) {
        return new Response(MARKDOWN_HOMEPAGE, {
          headers: {
            "Content-Type": "text/markdown; charset=utf-8",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }
      // Serve the HTML app
      return new Response(indexHtml, {
        headers: { "content-type": "text/html;charset=utf8" }
      });
    }

    // Handle /fetch endpoint
    if (url.pathname === "/fetch" && request.method === "POST") {
      try {
        const body = await request.json();
        const {
          url: targetUrl,
          extract,
          search,
          apiKey,
          searchApiKey,
          extractApiKey
        } = body;
        const effectiveSearchApiKey = searchApiKey || apiKey || "";
        const effectiveExtractApiKey = extractApiKey || apiKey || "";
        console.log({ targetUrl });
        if (!targetUrl) {
          return jsonResponse({ error: "Missing url parameter" }, 400);
        }

        // Use SELF binding for our own origin to avoid loopback 522
        const targetParsed = new URL(targetUrl);
        const isSelf =
          targetParsed.hostname === "markdownbrowser.com" ||
          targetParsed.hostname === "www.markdownbrowser.com";

        if (isSelf) {
          const selfRequest = new Request(targetUrl, {
            headers: { Accept: "text/markdown, text/plain, */*" }
          });
          const response = await env.SELF.fetch(selfRequest);
          const content = await response.text();
          const contentType =
            response.headers.get("content-type") || "text/plain";
          return jsonResponse({
            content,
            contentType,
            status: response.status,
            ok: response.ok,
            url: targetUrl,
            source: "native"
          });
        }

        // Determine if we should use the extract service
        const isExtractAvailable = !!extract;
        const isSearchUrl = search
          ? targetUrl.startsWith(search.replace("%s", ""))
          : false;

        let fetchUrl = targetUrl;
        let extracted = false;
        const headers = new Headers();

        // Use extract service for HTML content if apiKey is available
        if (isSearchUrl) {
          // For search URLs
          if (effectiveSearchApiKey) {
            headers.set("Authorization", `Bearer ${effectiveSearchApiKey}`);
          }
        } else {
          // For direct markdown/text fetches, set Accept header
          headers.set("Accept", "text/markdown, text/plain, */*");
        }

        // First attempt with Accept header
        let response = await fetch(fetchUrl, { headers });

        // Fallback: try without Accept header if first attempt failed
        if (!response.ok) {
          console.log("not ok", response.status, await response.text());
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
            if (effectiveExtractApiKey) {
              extractHeaders.set(
                "Authorization",
                `Bearer ${effectiveExtractApiKey}`
              );
            }

            const extractResponse = await fetch(extractUrl, {
              headers: extractHeaders
            });

            if (extractResponse.ok) {
              response = extractResponse;
              extracted = true;
            } else {
              throw new Error(
                "Extract failed: " + extractUrl + "; " + extractResponse.status
              );
            }
          } else {
            throw new Error(
              "Got HTML. Can only do this with an extract engine set up. Please configure one in Settings."
            );
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
          source: extracted ? "extracted" : "native"
        });
      } catch (error) {
        return jsonResponse(
          {
            error: error.message,
            details: "Failed to fetch the requested URL"
          },
          500
        );
      }
    }

    // Serve static assets for all other paths
    return env.ASSETS.fetch(request);
  }
};

/**
 * Helper function to return JSON response with CORS headers
 */
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}

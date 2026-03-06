import { withSimplerAuth } from "simplerauth-client";

interface Env {}

const handler = async (
  request: Request,
  env: Env,
  ctx: any
): Promise<Response> => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (!ctx.accessToken) {
    const isBrowser =
      request.headers.get("accept")?.includes("text/html") ?? false;
    return new Response(
      null,
      isBrowser
        ? { status: 302, headers: { Location: "/authorize" } }
        : { status: 401, headers: { "www-authenticate": "Bearer" } }
    );
  }

  // Extract target URL from /{url}
  const targetUrl = pathname.slice(1) + url.search;

  if (!targetUrl || !targetUrl.startsWith("http")) {
    return new Response(
      JSON.stringify({
        error: "Invalid path. Use /{url}",
        example: "/https://example.com"
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  try {
    const response = await fetch("https://api.parallel.ai/v1beta/extract", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ctx.accessToken,
        "parallel-beta": "search-extract-2025-10-10"
      },
      body: JSON.stringify({
        urls: [targetUrl],
        full_content: { max_chars_per_result: 100000 },
        excerpts: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({
          error: "Extract API error",
          status: response.status,
          details: errorText
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const data: any = await response.json();
    const result = data.results?.[0];

    if (!result?.full_content) {
      return new Response(
        JSON.stringify({ error: "No content extracted", url: targetUrl }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const title = result.title || targetUrl;
    const markdown = `# ${title}\n\nSource: ${targetUrl}\n\n${result.full_content}`;

    return new Response(markdown, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown",
        "Cache-Control": "public, max-age=300"
      }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};

export default {
  fetch: withSimplerAuth(handler, {
    isLoginRequired: false,
    oauthProviderPathPrefix: "/getKeys",
    oauthProviderHost: "platform.parallel.ai",
    scope: "key:read"
  })
};

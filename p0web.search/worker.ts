// https://contextarea.com/rules-httpsuithu-fec4g6jhnym87y

import { withSimplerAuth } from "simplerauth-client";

interface Env {
  // No PARALLEL_API_KEY needed - we use OAuth token
}

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

  // Extract search query from /search/{query}
  const searchMatch = pathname.match(/^\/search\/(.+)$/);

  if (!searchMatch) {
    return new Response(
      JSON.stringify({
        error: "Invalid path. Use /search/{query}",
        example: "/search/what is the GDP of France in 2023?"
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  const rawQuery = decodeURIComponent(searchMatch[1]);

  // Parse site: prefix for source policy
  const siteRegex = /^site:([^\s]+)\s+(.+)$/;
  const siteMatch = rawQuery.match(siteRegex);

  let objective: string;
  let sourcePolicy: { include_domains?: string[] } | undefined;

  if (siteMatch) {
    const domain = siteMatch[1];
    objective = siteMatch[2];
    sourcePolicy = {
      include_domains: [domain]
    };
  } else {
    objective = rawQuery;
  }

  // Build search request optimized for speed
  const searchRequest = {
    objective,
    processor: "base", // Fast processor for speed
    max_results: 10,
    max_chars_per_result: 500, // Smaller excerpts for speed
    ...(sourcePolicy && { source_policy: sourcePolicy })
  };

  try {
    // Use the OAuth access token from SimplerAuth
    const response = await fetch("https://api.parallel.ai/v1beta/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ctx.accessToken, // SimplerAuth provides this
        "parallel-beta": "search-extract-2025-10-10"
      },
      body: JSON.stringify(searchRequest)
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({
          error: "Search API error",
          status: response.status,
          details: errorText
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const data = await response.json();

    // Convert to markdown
    const markdown = formatResultsAsMarkdown(data, objective);

    return new Response(markdown, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown",
        "Cache-Control": "public, max-age=300" // Cache for 5 minutes
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

function estimateTokens(text: string): number {
  return Math.round(text.length / 5);
}

function formatResultsAsMarkdown(data: any, query: string): string {
  const results = data.results || [];

  let markdown = `# Search Results for: ${query}\n\n`;
  markdown += `*Search ID: ${data.search_id}*\n\n`;
  markdown += `Found ${results.length} results:\n\n`;
  markdown += `---\n\n`;

  results.forEach((result: any, index: number) => {
    markdown += `## ${index + 1}. [${result.title}](${result.url})\n\n`;
    markdown += `**URL:** ${result.url}\n\n`;

    if (result.excerpts && result.excerpts.length > 0) {
      // Calculate total tokens for all excerpts
      const excerptText = result.excerpts.join("\n\n");
      const tokens = estimateTokens(excerptText);

      markdown += `<details>\n`;
      markdown += `<summary>View excerpts (${result.excerpts.length} excerpts, ±${tokens} tokens)</summary>\n\n`;

      result.excerpts.forEach((excerpt: string, excerptIndex: number) => {
        markdown += `${excerptIndex + 1}. ${excerpt}\n\n`;
      });

      markdown += `</details>\n\n`;
    }

    markdown += `---\n\n`;
  });

  return markdown;
}

export default {
  fetch: withSimplerAuth(handler, {
    isLoginRequired: false,
    oauthProviderPathPrefix: "/getKeys",
    oauthProviderHost: "platform.parallel.ai",
    scope: "key:read"
  })
};

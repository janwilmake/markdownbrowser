# Introducing Markdown Browser - See the Web the Way AI Sees It

The web is bifurcating. For 30 years we've had one web — built for human eyes, full of colors, layouts, and animations. But now a second web is emerging: the machine-readable layer of markdown, structured data, and [llms.txt](https://llmstxt.org) files that AI agents actually consume. There's no browser for that second web. Until now.

https://markdownbrowser.com is a browser for the machine-readable web. It leverages the llms.txt standard to navigate each website. If there is no such file available by the author of the website, markdownbrowser relies on several strategies to create one and make any website available in simple markdown format.

![](demo.gif)

## Why Does This Need to Exist?

### 1. LLMs Can't Browse the Web Well

When an AI agent fetches a webpage today, it gets a wall of HTML full of nav bars, ads, cookie banners, tracking scripts, and boilerplate. The actual content is buried. Most of the tokens an agent spends on a webpage are wasted on layout noise, not information.

Markdown strips all that away. It's the semantic essence of a page — just the text, structure, links, and meaning. Markdown Browser lets you see exactly what's left when you strip a website down to what actually matters to an agent. Some sites hold up beautifully. Others are chaos that was being held together by CSS. Either way, it's illuminating — and if you publish content online, it's something you need to see.

### 2. llms.txt Is an Emerging Standard — But There's No Way to Browse It

Sites are starting to publish `/llms.txt` files — structured sitemaps designed specifically for AI consumption. It's a simple format that creates an overview of what's available on a website, and it's gaining traction among developers who want their documentation to be agent-accessible.

But until now, there's been no good way to _browse_ that ecosystem as a human. Markdown Browser makes llms.txt navigable — you get a sidebar with sections and links, like a developer portal for the machine-readable web. You can explore a site's entire agent-facing structure top-down, see what's exposed, and spot what's missing.

### 3. Developers Building AI Tools Need to Debug What Their Agents See

If you're building an agent that fetches web content, you've probably wrestled with scraping. It's fragile, expensive, and breaks whenever a site redesigns. Worse, you often can't tell _why_ your agent is confused by a page without manually inspecting the markdown it received.

Markdown Browser surfaces the metadata that matters: Was an extract API used? How many tokens did the page cost? How fast was the response? Is the content actually spec-compliant and functional, or is it garbled in a way that would trip up an agent? This is the devtools panel for the agent-browsable web.

### 4. Markdown Is Genuinely a Better Reading Experience

This one surprised us too. Once you start browsing in markdown, it's hard to go back for content-heavy pages. No popups. No layout shift. No cookie consent dialogs. No autoplaying videos. No "subscribe to our newsletter" modals. Just text, links, images, and code blocks — cleanly rendered.

It's like reader mode on steroids. And unlike browser reader modes that try to heuristically extract content from HTML (and often fail), the markdown web is _designed_ to be read this way. If a site publishes good markdown, the reading experience is genuinely superior.

### The Bigger Picture

We're at an inflection point. The web was built for humans, but humans are increasingly accessing it through AI intermediaries. Someone has to build the tools that make this transition smooth. Someone has to define how agents should see content, navigate sites, and understand context.

Markdown Browser is a step toward that future — a developer tool that helps us all understand what the agent-friendly web should look like, and whether our corner of the internet is ready for it.

## Goal: Developer Tool for the transition to the Agent-Friendly Web

I'm introducing Markdown Browser as a developer tool with the following goals:

- Ability to navigate markdown-only websites elegantly
- Ability to see the internet through the eyes of the agent
- Educate on the agent-friendliness of any website.
- See if the markdown version of a website is spec-compliant and functional, or if it isn't usable for AI.
- Get a feel for if the agent ever gets stuck or is limited in a way compared to the html-internet

The following are non-goals, or goals that I decided not to focus on at this stage:

- Ability to edit content you have the rights to.
- Login into the browser, store browsing history in personal storage, get insights.
- A way (and possibly, standard) for people to download new content from websites they're interested in, taking it fully offline.

## Core Elements

The browser has the following core elements that make it usable for everyday use:

**Search Engine**

Search API to use for searches. This defaults to search using [Parallel](https://parallel.ai), but can be changed in to any other search engine, as long as it supports markdown results.

**Extract Engine**

The extract engine is the engine that is used for turning a HTML page into markdown, which is needed when web publishers don't already publish their own markdown variants of all pages. Here, we are using an intelligent extraction strategy by default that not only scrapes the current page, but also all pages linked, to optimize for speed, and is cached on the cloudflare network. This is proudly supported by our tools website [llmtext](https://llmtext.com) and uses [Parallel](https://parallel.ai) under the hood.

**llms.txt**

The [llms.txt standard](https://llmstxt.org) is a simple format to create an overview of what is available on a website, and has many potential applications. So far, some developers have used it with their IDE and coding agents to fetch proper documentation context. With [llmtext mcp](https://github.com/janwilmake/LLMTEXT-mcp) a website with an llms.txt is also made available as MCP. With markdown browser, the llms.txt is used as a way to navigate the website for the user, allowing an easy way to navigate through the website top-down from a sidebar.

**Markdown Form Links**

One thing that's missing from the markdown web is interactivity. Regular markdown links can navigate, but they can't accept input. [Markdown Form Links](https://markdownformlinks.wilmake.com) is a tiny [marked](https://marked.js.org) extension that solves this by turning links with `{variable}` placeholders into HTML forms. No new syntax — it's just a standard markdown link with blanks:

```
[Search](https://google.com/search?q={query*})
```

This renders as a form with a text input and a submit button. The extension supports type hints (`{email:email}`), required fields (`{name*}`), default values (`{qty:number=1}`), and select dropdowns (`{size=S|M|L|XL}`). In any markdown viewer that doesn't support the extension, it degrades gracefully into a readable link.

The best example of this in practice is [GoogLLM](https://googllm.com), an agent-friendly Google search that returns clean markdown. Its entire search interface is a single markdown form link:

```
[Search](/{page=search|images|videos|places|news|shopping|scholar}/{query})
```

That one line gives you a dropdown to pick the search type and a text input for your query. In Markdown Browser, this renders as a usable search form. In a plain markdown viewer, it's still a perfectly readable link. This is what agent-friendly interactivity looks like — zero JavaScript required on the publisher's end, just markdown.

## Future work

**Shadow Sites**

Most websites don't serve markdown yet, and the extract engine can't always access the content needed. A future direction for Markdown Browser is the concept of shadow sites — allowing a website to be replaced with an agent-friendly alternative. When people visit a URL that is marked as having a shadow site, they'd get redirected to this shadow site to get the content they're looking for. We invite the open source community to create shadow sites for popular websites that don't serve markdown themselves, so we can more easily transition to an agent-friendly internet.

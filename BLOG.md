# Introducing Markdown Browser - A Developer Tool for making your website more agent-friendly

In the last few years we've seen dozens of startups building Agents that can automate browsing the web that was made for humans. But the internet is going to be used by agents 1000x more than humans soon. So shouldn't web publishers start being more concerned about how their content looks to agents? Shouldn't there be a tool to see how your content looks for AI agents?

https://markdownbrowser.com does just that. It's a browser that leverages the [llms.txt standard](https://llmstxt.org) to navigate each website. If there is no such file available by the author of the website, markdownbrowser relies on several strategies to create one and make any website available in simple markdown format.

This allows navigating markdown-version of any website, which allows developers to see the internet through the eyes of the agent.

![](demo.gif)

## Why Should You Care?

Whether you're a web publisher, a developer building agents, or just someone curious about where the internet is heading, Markdown Browser reveals something important: **the web is about to have a lot more non-human visitors**.

### If You Publish Content Online

Your website is about to get a lot more traffic from AI agents than from humans. Think about it - when someone asks ChatGPT to "find me the best project management tool for a small team," that agent is browsing dozens of websites on your behalf. If your site is agent-friendly, you're in the consideration set. If it's a mess of JavaScript spaghetti that agents can't parse, you're invisible.

This is SEO for the agent era. Just like businesses learned to optimize for Google's crawlers in the 2000s, you'll need to optimize for AI agents in the 2020s. Markdown Browser lets you see exactly what those agents see - and whether your content actually makes sense to them.

### If You're Building AI Agents

You've probably wrestled with web scraping. It's fragile, expensive, and breaks whenever a site redesigns. Markdown versions of the web are cheaper to process (fewer tokens wasted on HTML cruft), more reliable, and easier to reason about.

The more publishers adopt llms.txt and agent-friendly formats, the better your agents will perform. Markdown Browser helps accelerate that adoption by making the problem visible.

### If You're Just Curious

There's something fascinating about seeing the internet through different eyes. We've spent 30 years building a web optimized for human vision - colors, layouts, animations. But that's not how agents experience it. They see text, structure, and relationships.

Browsing in markdown strips away the visual noise and reveals the actual information architecture of websites. It's like looking at the skeleton of the web. Some sites have beautiful, logical structures. Others are chaos held together by CSS. Either way, it's illuminating.

### The Bigger Picture

We're at an inflection point. The web was built for humans, but humans are increasingly accessing it through AI intermediaries. Someone has to build the tools that make this transition smooth. Someone has to define how agents should see content, navigate sites, and understand context.

Markdown Browser is a small step toward that future - a developer tool that helps us all understand what the agent-friendly web should look like, and whether our corner of the internet is ready for it.

## Goal: Developer Tool for the transition to the Agent-Friendly Web

I'm introducing Markdown Browser as a developer tool with the following goals:

- Ability to navigate markdown-only websites elegantly
- Ability to see the internet through the eyes of the agent
- Educate on the agent-friendliness of any website.
- See if the markdown version of a website is spec-compliant and functional, or if it isn't usable for AI.
- Get a feel for if the agent ever gets stuck or is limited in a way compared to the html-internet

I also aim to build in the following features

- MCP-compliant OAuth to access private info
- Potential use within MCP: context-ingestion UI

The following are non-goals, or goals that I decided not to focus on at this stage:

- Ability to edit content you have the rights to.
- Login into the browser, store browsing history in personal DO, get insights.
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

This renders as a form with a text input and a submit button. The extension supports type hints (`{email*:email}`), required fields (`{name*}`), default values (`{qty:number=1}`), and select dropdowns (`{size=S|M*|L|XL}`). In any markdown viewer that doesn't support the extension, it degrades gracefully into a readable link.

The best example of this in practice is [GoogLLM](https://googllm.com), an agent-friendly Google search that returns clean markdown. Its entire search interface is a single markdown form link:

```
[Search](/{page=search|images|videos|places|news|shopping|scholar}/{query})
```

That one line gives you a dropdown to pick the search type and a text input for your query. In Markdown Browser, this renders as a usable search form. In a plain markdown viewer, it's still a perfectly readable link. This is what agent-friendly interactivity looks like — zero JavaScript required on the publisher's end, just markdown.

## Future work

**Shadow Sites**

Most websites don't serve markdown yet, and the extract engine can't always access the content needed. A future direction for Markdown Browser is the concept of shadow sites — allowing a website to be replaced with an agent-friendly alternative. When people visit a URL that is marked as having a shadow site, they'd get redirected to this shadow site to get the content they're looking for. We invite the open source community to create shadow sites for popular websites that don't serve markdown themselves, so we can more easily transition to an agent-friendly internet.

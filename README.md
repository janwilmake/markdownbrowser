In the last few years we've seen dozens of startups building Agents that can automate browsing the web that was made for humans. But the internet is going to be used by agents 1000x more than humans soon. So shouldn't we have a markdown internet as the primary internet that is used automatically by agents, and create browsers that 'make it manual' for humans?

https://markdownbrowser.com does just that. It's a browser that leverages the [llms.txt standard](https://llmstxt.org) to navigate each website.

![](demo.gif)

Goal: Developer Tool for the transition to the Agent-Friendly Web

- Ability to navigate markdown-only websites elegantly
- Ability to see the internet through the eyes of the agent
- Educate on the agent-friendliness of any website.
- See if the markdown version of a website is spec-compliant and functional, or if it isn't usable for AI.
- Get a feel for if the agent ever gets stuck or is limited in a way compared to the html-internet
- MCP-compliant OAuth to access private info
- Potential use within MCP: context-ingestion UI

Non-goals: Everyday use

- Ability to edit content you have the rights to.
- Login into the browser, store browsing history in personal DO, get insights.
- A way (and possibly, standard) for people to download new content from websites they're interested in, taking it fully offline.

Core principles:

- **Search Engine** - Search API to use for searches
- **Fetch Engine** - Fetch API to use for all fetching
- **llms.txt** - Provides the navigation
- **Shadow Sites** - Replace a website with an agent-friendly one

# Installation

We offer a standalone MacOS binary which can be downloaded [here](https://markdownbrowser.com/macos.zip), or simply use it through [markdownbrowser.com](https://markdownbrowser.com).

# Related projects

- [LLMTEXT](https://github.com/janwilmake/llmtext-mcp)
- [GoogLLM](https://googllm.com)
- [Agent-Friendly](https://github.com/janwilmake/agent-friendly)

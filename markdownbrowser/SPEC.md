<!-- https://contextarea.com/rules-httpsuithu-ae6op08m3668vv -->

RULES:
https://uithub.com/janwilmake/gists/tree/main/named-codeblocks.md

PROMPT:
Create a markdown browser for me as a cloudflare worker and a Static HTML file index.html

BOUNDARIES

- `macos/*` - only handles sending keystrokes to the webview and opening the website there and should NEVER go off the domain of markdownbrowser.com/?client=macos. not part of this spec.
- `worker.ts` - the worker handles auth profiles for user and with that, can send authenticated requests, it serves one tool `fetch` that returns markdown, metadata from headers, and information on agent-friendliness.
- `index.html` - the browser.

WORKER

- `POST /fetch` with `{extract,search,apiKey,url}`
- Fetching should accept text/markdown,text/plain,`*/*` but use another fetch without accept header as fallback.
- Only pass authorization header for extract and searches. if error, return that nicely.
- if apiKey is available, `config.extractEngine` is used any website returns html
- apiKey is used for search and extract urls as authorization bearer token

LAY-OUT:

- Style: use same look/feel as safari, but done purely in html, css, vanilla js. Minimal border-radius (4px). Tabs span full width with no gaps, separated by borders.
- Mobile friendly
- The address bar up top with back/next/refresh/toggle-menu icons, then address/search bar, then config icon on the right.
- Tabs below
- Below that, show the active tab rendered as markdown, with a sidebar at the left that can be toggled to show or hide

STORAGE (localStorage for now, but open to change):

```ts
type Config = {
  showSidebar: boolean;
  openTabIndex: number;
  tabs: {
    url: string;
    title: string;
    description: string;
    sidebar: boolean;
    content: string;
    prev: string[];
    next: string[];
  }[];
  llmstxt: { [hostname: string]: Parse };
  config: {
    searchEngine: string; // default: "https://search.p0web.com/search/%s"
    extractEngine: string; //default: "https://llmtext.com/%s"
    homepage: string; // default: "https://markdownbrowser.com/homepage"
    apiKey: string;
  };
};
```

ADDRESS BAR (and url loading)

- if no protocol given, prepend https://.
- also use a html datalist with all llmstxt hostnames from localstorage and also these hostnames, hardcoded: https://pastebin.contextarea.com/9B3pfv1V57HApHN.md
- `config.searchEngine` is used when no hostname is entered in url
- When fetching a url, use `/fetch?url=`
- Every time a url is loaded, look up llmstxt parse from localStorage or fetch from `{origin}/llms.txt` and insert into localStorage

CONFIG

- open config modal by clicking at a gear icon at the top right
- allows editing all localStorage `config` details
- add button to download `/macos.zip` and a button to open https://github.com/janwilmake/markdownbrowser, but don't show this if `?client=` query param is present

TABS

- use title and description from the llmstxt parse from the url if available, otherwise, parse it from the markdown
- favicons
- loading indicator spinner replaces favicon when page is loading
- new tab should open homepage, fill that in address bar, and focus address bar with all selected

NAVIGATION SIDEBAR

- Render it using the llms.txt parse
- The llms.txt can be parsed using this script that you can inline https://pastebin.contextarea.com/Oxc7VP7uscjFKm8.md
- If there is no llms.txt for the hostname, render error.
- Ensure to allow expanding/collapsing the menu using the sections. By default, expand all.
- Navigation is one level deep: flat list of links per `##` section. No nested URL path tree.
- Do not render the description for each item, only as tooltip.
- The llms.txt source (auto/website/crawl) is configured only in Settings, not in the sidebar.
- A searchbar to filter on the items in the navigation
- Search in navigation should open all expands

PAGE

- Render info on how it was rendered
  - used extract api?
  - how many tokens?
  - speed
- Render frontmatter (as a table)
- When fetching a url, use `/fetch?url=`. Ensure to prepend origin from the current url if url was relative.
- Ensure to use a proper markdown renderer like marked and also nicely render codeblocks and tables etc. ensure images/videos/etc are rendered with a max size, and ensure there's appropriate spacing everywhere.
- Links should open in current tab by default. Right-click or Cmd/Ctrl+click opens in a new tab.
- render images elegantly, with a max width of 50% of the screen
- custom syntax for links: uses [markdown-form-links](https://markdownformlinks.wilmake.com) extension for marked — links with `{variable}` placeholders become `<form>` elements with typed inputs, required fields, defaults, and select dropdowns.

EXTRA

- if location queryparam `?open={input}` was found, open a new tab with that value
- shortcuts
  - both cmd and ctrl
    - `w`: closing a tab
    - `n/t`: opening a tab
    - `r`: refresh
    - `l`: focus address bar
    - `.`: open config
  - ctrl+tab: next tab
  - ctrl+shift+tab: previous tab

Give me a cloudflare worker that has the fetch endpoint and a static file index.html with this functionality. NB: do not include html content in the worker, it can separately be served using public folder (also no env.ASSETS needed)

TO BE ITERATED

- Can this somehow be served as MCP UI as well? that'd make it a very interesting innovation!!! Could be shown as pip to see what the LLM has ingested.
- Can this be served as chrome / safari extension and as single-tab? could also be great in that way as a devtool
- Could it be possible to allow switching to the original site (using an iframe,potentially?) and is that useful for staying with the markdown longer?

- PARALLEL llms.txt

  - md should be better. ask team `/extract`

- INDEX.HTML

  - History behavior isn't working correctly
  - Markdown is parsed in a web worker (off main thread). Rendered tab divs are cached and hidden/shown on tab switch instead of re-rendered.

- WORKER

  - How to handle `Link` response headers?
  - How to do login properly for 401 content? either allow opening popup with real website, or send this to human (e.g. to phone). Probably: Keep auth profiles on backend. Ability to login the browser to an X account, then set profiles. Browser should have ability to see login is available
  - Imagine we'd support stream rendering results too! This'd be crazy cool for LLM outputs. We'd just need a slightly altered way of typing in urls.

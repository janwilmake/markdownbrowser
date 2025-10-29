<!-- https://contextarea.com/rules-httpsuithu-ae6op08m3668vv -->

RULES:
https://uithub.com/janwilmake/gists/tree/main/named-codeblocks.md

PROMPT:
Create a markdown browser for me as a cloudflare worker and a Static HTML file index.html

Worker

- `POST /fetch` with `{extract,search,apiKey,url}`
- Fetching should accept text/markdown,text/plain,`*/*` but use another fetch without accept header as fallback.
- Only pass authorization header for extract and searches. if error, return that nicely.
- if apiKey is available, `config.extract` is used any website returns html
- api key is used for search and extract urls as authorization bearer token

Lay-out:

- Style: use same look/feel as safari, but done purely in html, css, vanilla js
- Mobile friendly
- The address bar up top with back/next/refresh/toggle-menu icons, then address/search bar, then config icon on the right.
- Tabs below
- Below that, show the active tab rendered as markdown, with a sidebar at the left that can be toggled to show or hide

Local storage:

```ts
type Config = {
  showSidebar: boolean;
  llmstxt: { [hostname: string]: Parse };
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
  config: {
    search: string; // default: "https://search.p0web.com/search/%s"
    extract: string; //default: "https://llmtext.com/%s"
    homepage: string; // default: "https://markdownbrowser.com/homepage"
    shadow: { [hostname: string]: string };
    apiKey: string;
  };
};
```

ADDRESS BAR (and url loading)

- if no protocol given, prepend https://.
- also use a html datalist with all llmstxt hostnames from localstorage and also these hostnames, hardcoded: https://pastebin.contextarea.com/9B3pfv1V57HApHN.md
- `config.search` is used when no hostname is entered in url
- `config.shadow` object replaces hostnames with other hostnames in all urls
- When fetching a url, use `/fetch?url=`
- Every time a url is loaded, look up llmstxt parse from localStorage or fetch from `{origin}/llms.txt` and insert into localStorage

CONFIG

- open config modal by clicking at a gear icon at the top right
- allows editing all localStorage `config` details
- add button to `/macos.zip` but don't show this if `?client=` query param is present

TABS

- use title and description from the llmstxt parse from the url if available, otherwise, parse it from the markdown
- favicons

SIDEBAR

- Render it using the llms.txt parse
- The llms.txt can be parsed using this script that you can inline https://pastebin.contextarea.com/Oxc7VP7uscjFKm8.md
- If there is no llms.txt for the hostname, render error.
- Ensure to allow expanding/collapsing the menu using the sections By default, expand all.
- Add nested sections for the pathname that leads to the filename with small indentation
- Do not render the description for each item, only as tooltip.
- A searchbar to filter on the items in the navigation

PAGE

- Render frontmatter (as a table)
- When fetching a url, use `/fetch?url=`. Ensure to prepend origin from the current url if url was relative.
- Ensure to use a proper markdown renderer like marked and also nicely render codeblocks and tables etc.
- Links should always open in current tab and have a right click contextmenu that would open it in a new tab
- render images elegantly, with a max width of 50% of the screen
- custom syntax for links: links that contain variables as `{variableName}` should be rendered as text forms where each variable is a text input and the link text is the submit button.

EXTRA

- shortcuts (both cmd and ctrl)
  - w: closing a tab
  - n/t: opening a tab
  - r: refresh
  - l: focus address bar
  - .: open config
- if location queryparam `?open={url}` was found, open a new tab with that value

Give me a cloudflare worker that has the fetch endpoint and a static file index.html with this functionality. NB: do not include html content in the worker, it can separately be served using public folder (also no env.ASSETS needed)

<!-- https://contextarea.com/rules-httpsuithu-ae6op08m3668vv -->

RULES:
https://uithub.com/janwilmake/gists/tree/main/named-codeblocks.md

PROMPT:
Create a markdown browser for me as a cloudflare worker and a Static HTML file index.html

The features:

- Storage: local storage for { llmstxt: {[hostname:string]: Parse }, tabs: { url:string, title:string, description:string, sidebar:boolean, content:string, prev:string[], next:string[] }[]}
- Style: use same look/feel as safari, but done purely in html, css, vanilla js
- Mobile friendly

Worker

- `/fetch?url=` is handled in the worker, and should accept text/markdown,text/plain,_/_ but use another fetch without accept header as fallback. if error, return that nicely. also if html was returned return an error.

Lay out

- The address bar up top. if no protocol given, prepend https://. also use a html datalist with all llmstxt hostnames from localstorage and also these hostnames, hardcoded: https://pastebin.contextarea.com/9B3pfv1V57HApHN.md
- Tabs below
- Below that, show the active tab rendered as markdown, with a sidebar at the left that can be toggled to show or hide

TABS

- use title and description from the llmstxt parse from the url if available, otherwise, parse it from the markdown
- pinning tabs
- favicons

SIDEBAR

- Every time a url is loaded, look up llmstxt parse from localStorage or fetch from {origin}/llms.txt and insert into localStorage
- Render it using the parse
- The llms.txt can be parsed using this script that you can inline https://pastebin.contextarea.com/Oxc7VP7uscjFKm8.md
- If there is no llms.txt for the hostname, render error.
- Ensure to allow expanding/collapsing the menu using the sections By default, expand all.
- Add nested sections for the pathname that leads to the filename with small indentation
- Do not render the description for each item, only as tooltip.
- a searchbar to filter on the items in the navigation

PAGE

- render frontmatter (as a table)
- When fetching a url, use `/fetch?url=`. ensure to prepend origin from the current url if url was relative.
- Ensure to use a proper markdown renderer like marked and also nicely render codeblocks and tables etc.
- Links should always open in current tab and have a right click contextmenu that would open it in a new tab
- render images elegantly, with a max width of 50% of the screen
- have custom extended syntax that turns urls into forms, e.g. when having `{variable}` in the url

CONFIG

- open config by clicking at a gear icon at the top right
- format: `{search:"https://googllm.com/search/%s",extract:"https://llmtext.com/%s",shadow:{[hostname:string]:string}}`
  - search is used when no hostname is entered in url
  - extractor that allows loading any website that doesn't return markdown and `llms.txt`
  - shadow object replaces hostnames with other hostnames in all urls

EXTRA

- shortcuts for closing a tab, opening a tab, refresh ~(ctrl t,n,w,r)

Give me a cloudflare worker that has the fetch endpoint and a static file index.html with this functionality. NB: do not include html content in the worker, it can separately be served using public folder (also no env.ASSETS needed)

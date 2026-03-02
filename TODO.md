# MAKE IT PRETTY

- ✅ improve rendering of markdown
- ✅ Allow choosing the llms.txt source: `auto`, `crawl`, or `website`
- ✅ When `auto`, use `crawl.llmtext.com/{domain}/llms.txt` as fallback to `llms.txt` not being found in markdownbrowser
- ✅ Allow refreshing `llms.txt` at any time

# Make it more pretty

- ✅ simplify the navigation to just be one level deep for the ## in llms.txt, do not nest it with the urls
- ✅ Make styling more like safari. among other things, less rounded, and the tabs should span the full width available
- ✅ When clicking the refresh button of llms.txt it space out weirdly. make it a simple spin animation without resize
- ✅ Remove select button from menu to select auto/web/crawl (this should come from the settings and that should be enough)
- ✅ Make it render markdown to html faster and in a web-worker; some more optimizations may be possible to make it fast. When switching tabs, the html should be
  saved so it renders fast. maybe the div can just be hidden instead of removed when swithcin tabs. as long as it's fast
- ✅ Cmd+click a url should open it in a new tab
- ✅ Add devtools statusbar
- ✅ native fixes for opening urls

# PITCH IT

- review the blogpost
- improve
- evening: create thread, push to X + HN

# Later

- Automatic clean-up: If Durable Object SQLite storage becomes too expensive, we have all information needed to clean up entries.
- Security and authentication: The shadow-sites require authentication; the browser needs to handle this!
- Small web https://blog.kagi.com/small-web --> https://github.com/kagisearch/smallweb/blob/main/smallweb.txt & https://kagi.com/api/v1/smallweb/feed wawawiwa!!!! 😍 make this smallweb agent-accessible paid for by Parallel, turning each feed into a markdown-search-engine.

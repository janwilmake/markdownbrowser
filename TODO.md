Why

- the markdown browser always needs to crawl 1 level further than the visited url to not make it slow
- we also want to be able to crawl a subset of a website based on a filter (paths, or potentially agentically)
- we want the each page back asap.

Where to store?

- a DO has 10GB and would allow much faster filters on data of a specific domain
- an R2 has unlimited storage but the filtering on it isn't that fast, except if we use something like the new DuckDB WASM inside of a worker and store data in R2 in duckdb format. This would make the egress free making things much cheaper.

How to shard/index?

- by domain seems most logical since that's also how it's indexed using the URL
- another way is by user, but we want to share data between users!

Plan: Crawler with shared data between users

- Input: `crawl(url, { maxAge, staleWhileRevalidate, depth, path, async:"none"|"links"|"all" }, { Authorization: PARALLEL_API_KEY, Accept:"application/json" | "text/event-stream" | "multipart/form-data" | "text/markdown" })`
- Connects with DomainDO and finds needed documents there, tries getting markdown directly through llms.txt convention, and finally tries with `/extract` as fallback.
- DO storage: `documents: {url,title,author,description,created_at,modified_at,icon,index_created_at,index_updated_at,index_fetched_at,etag,metadata,size,content,links,visits}[]`
- Output: the extracted pages as SSE Stream or multipart/form-data

This gives the ability to browse the internet while viewing what the AI system would see, but very cost effectively because of the shared index. Latency will be a single round-trip if indexed. Creating the SQLite index even when the website already offers markdown variants is useful because it allows doing a filter on its data very fast. It will be slowest when using extract.

Limitations:

- **speed**: There's just one DO per domain, making it slower in some parts of the world. Can later be solved if needed using DO replication (use multistub upon insertion! 6 locations, fast everywhere. great technical blogpost. ask Brave)
- **storage**: some websites are incredibly large so this may be painful. we could later add on-domain sharding for larger websites or create more aggressive clean-up, but this is out of scope for the purposes of this proof of concept.

Needed from parallel team:

- extract full content should be valid markdown!!! high priority.
- extract should return author,modified_at,description,icon,etag

# After this

- think about offering several interfaces for the same data: llms.txt's, chat completions, mcp, uithub, MARKDOWNBROWSER OFC.
- work with team on different business use-cases for this data
- build **person disambiguation** and create an index of all social profiles of all people i follow on x. this is great synergy with travis & rob. also do voice only on X from now; prepare podcast by storytelling w/ edmund, also find p0 customers this way: learn more! https://parallel-web-systems.slack.com/archives/C089GK7980N/p1762156939950189.
- work with team on active monitoring (pranay)

# Other ideas during flight ✈️✈️✈️✈️

- **tadasant** is likely an anthropic ant, but also antalovicus so may be conincidence. show this to Travers, Tina, or Brave. could be a great seed for something bigger if this makes parallel want to invest in 'installthismcp' because we want something to push the boundaries of MCP and build a better relation with anthropic
- I can think just as well if not better with my eyes closed or even: during sleep. can be quite comfortable sleeping in a chair and easily typing (or even talking) when needed. do this more.
- I need to talk about my next contract:
  - Go to SF, get paid a fair amount
  - Contract devs like Maurice and the openapi-to-mcp guy: build out devrel more using open source
- I work just 32h a week for p0. those are rookie numbers, gotta at least double that here so i have a lot of bandwidth to help one another.

# Later: automatic clean-up

If Durable Object SQLite storage becomes too expensive, we have all information needed to clean up entries

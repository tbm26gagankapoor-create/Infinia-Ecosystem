# Domain B: Inference API & Models

## B1. Unified Inference API — M1 · Mar 28

Single OpenAI-compatible endpoint supporting 40+ open-source models. Drop-in replacement for any OpenAI SDK.

### Features

- OpenAI-compatible endpoint
- 40+ open-source models
- Drop-in SDK replacement

### User Flow

1. Developer copies API key (`tf-xxxx`) from dashboard.
2. Changes base URL in existing code: `base_url = "https://api.aigateway.ai/v1"`
3. Sets model to any supported model: `model = "meta-llama/llama-3.1-70b-instruct"`
4. Makes `POST /v1/chat/completions` with `Authorization: Bearer tf-xxxx`.
5. Receives response in exact OpenAI format. Usage object includes token counts for billing.
6. Each request generates a billing event: model, tokens (input/output), cost, latency, key ID.

### Error Handling

- **Invalid API key** → `401 {"error":{"type":"authentication_error","message":"Invalid API key"}}`
- **Rate limited** → `429` with `Retry-After` header
- **Model not found** → `404 {"error":{"type":"invalid_request_error","message":"Model not found"}}`

### Success Metrics

| Metric | Target |
|--------|--------|
| Models available at launch | 40+ |
| Developers successful on first API call | >80% |
| Users trying 2+ models (30d) | >50% |
| Week-1 to Week-2 retention | >70% |

---

## B2. Model Catalog — M1 · Mar 28

Browsable, searchable list of all models with rich metadata: provider, context window, cost, capabilities, speed, benchmarks.

### Features

- Browsable model list
- Search/filter
- Provider metadata
- Context window
- Cost per token
- Capabilities & speed
- Benchmarks

### User Flow

1. User navigates to Models page from dashboard sidebar.
2. Sees full model list with columns: Name, Provider, Context, Input Cost, Output Cost, Capabilities, Speed.
3. Uses search bar (Command/⌘K) to find models by name or family.
4. Filters by: capability (chat/code/vision), provider, price range, context window size, speed tier.
5. Clicks model row to expand detail view with benchmarks (MMLU, HumanEval), full description, and "Try in Playground" button.
6. Sorts by any column (cost, context window, speed).

### Success Metrics

| Metric | Target |
|--------|--------|
| Users visiting catalog within first session | >60% |
| Users using search/filter | >40% |
| Catalog visitors clicking "Try in Playground" | >25% |

---

## B3. Streaming Responses — M1 · Mar 28

Real-time token-by-token streaming via Server-Sent Events for all chat completion requests.

### Features

- Token-by-token streaming
- Server-Sent Events
- All chat completions

### User Flow

1. Client sends `POST /v1/chat/completions` with `"stream": true`.
2. Server responds with `Content-Type: text/event-stream`.
3. Tokens arrive as SSE events: `data: {"choices":[{"delta":{"content":"token"}}]}`.
4. Client renders tokens as they arrive (playground, SDK, custom app).
5. Stream ends with `data: [DONE]`. Connection closed. Final usage object in last chunk.

### Error Handling

- **Error mid-stream** → Error event sent before connection close. Client receives partial content + error indication.

### Success Metrics

| Metric | Target |
|--------|--------|
| Streaming adoption rate (vs non-streaming) | >90% |
| Playground sessions using streaming | >70% |
| OpenAI SDK drop-in compatibility confirmed | 100% |

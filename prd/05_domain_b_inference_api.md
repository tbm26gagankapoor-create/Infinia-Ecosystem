# Domain B: Inference API & Models

## B1. Unified Inference API — M1 · Mar 28

Dual-compatible inference API supporting both OpenAI and Anthropic SDK formats. Many open-source and fine-tuned models served from self-hosted K8s GPU cluster. Drop-in replacement for both OpenAI and Anthropic SDKs — developers change only the base URL and API key.

### Features

- OpenAI-compatible endpoint (`POST /v1/chat/completions`)
- Anthropic Messages API compatible endpoint (`POST /v1/messages`)
- Many open-source and fine-tuned models on self-hosted K8s GPU cluster
- Drop-in replacement for both OpenAI SDK and Anthropic SDK
- Dual auth header support (`Authorization: Bearer` for OpenAI, `x-api-key` for Anthropic)
- Internal format normalization — both wire formats convert to a unified internal format before routing to the model serving layer

### User Flow — OpenAI SDK

1. Developer copies API key (`tf-xxxx`) from dashboard.
2. Changes base URL in existing code: `base_url = "https://api.aigateway.ai/v1"`
3. Sets model to any supported model: `model = "meta-llama/llama-3.1-70b-instruct"`
4. Makes `POST /v1/chat/completions` with `Authorization: Bearer tf-xxxx`.
5. Receives response in exact OpenAI format. Usage object includes token counts for billing.
6. Each request generates a billing event: model, tokens (input/output), cost, latency, key ID.

### User Flow — Anthropic SDK

1. Developer copies API key (`tf-xxxx`) from dashboard.
2. Sets base URL in Anthropic SDK: `base_url = "https://api.aigateway.ai"`
3. Sets API key: `api_key = "tf-xxxx"`
4. Calls `client.messages.create(model="meta-llama/llama-3.1-70b-instruct", messages=[...], max_tokens=1024)`.
5. Receives response in exact Anthropic format. Usage object includes `input_tokens` and `output_tokens` for billing.
6. Each request generates a billing event: model, tokens (input/output), cost, latency, key ID.

### OpenAI Endpoint Spec

```
POST /v1/chat/completions
Authorization: Bearer tf-xxxx
Content-Type: application/json
```

Request:
```json
{
  "model": "meta-llama/llama-3.1-70b-instruct",
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Hello"}
  ],
  "max_tokens": 1024,
  "stream": false
}
```

Response:
```json
{
  "id": "chatcmpl-...",
  "object": "chat.completion",
  "created": 1711600000,
  "model": "meta-llama/llama-3.1-70b-instruct",
  "choices": [
    {
      "index": 0,
      "message": {"role": "assistant", "content": "Hello! How can I help you today?"},
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 18,
    "completion_tokens": 9,
    "total_tokens": 27
  }
}
```

### Anthropic Endpoint Spec

```
POST /v1/messages
x-api-key: tf-xxxx
Content-Type: application/json
anthropic-version: 2023-06-01
```

Request:
```json
{
  "model": "meta-llama/llama-3.1-70b-instruct",
  "max_tokens": 1024,
  "system": "You are a helpful assistant.",
  "messages": [
    {"role": "user", "content": "Hello"}
  ]
}
```

Response:
```json
{
  "id": "msg_...",
  "type": "message",
  "role": "assistant",
  "content": [
    {"type": "text", "text": "Hello! How can I help you today?"}
  ],
  "model": "meta-llama/llama-3.1-70b-instruct",
  "stop_reason": "end_turn",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 18,
    "output_tokens": 9
  }
}
```

### Error Handling — OpenAI Format

Errors on `/v1/chat/completions` follow OpenAI's error shape:

- **Invalid API key** → `401 {"error":{"type":"authentication_error","message":"Invalid API key"}}`
- **Insufficient credit** → `402 {"error":{"type":"billing_error","message":"Insufficient credit"}}`
- **Model not allowed** → `403 {"error":{"type":"permission_error","message":"Model not allowed for this key"}}`
- **Model not found** → `404 {"error":{"type":"invalid_request_error","message":"Model not found"}}`
- **Rate limited** → `429` with `Retry-After` header, `{"error":{"type":"rate_limit_error","message":"Rate limit exceeded"}}`

### Error Handling — Anthropic Format

Errors on `/v1/messages` follow Anthropic's error shape:

- **Invalid API key** → `401 {"type":"error","error":{"type":"authentication_error","message":"Invalid API key"}}`
- **Insufficient credit** → `402 {"type":"error","error":{"type":"billing_error","message":"Insufficient credit"}}`
- **Model not allowed** → `403 {"type":"error","error":{"type":"permission_error","message":"Model not allowed for this key"}}`
- **Model not found** → `404 {"type":"error","error":{"type":"not_found_error","message":"Model not found"}}`
- **Rate limited** → `429` with `retry-after` header, `{"type":"error","error":{"type":"rate_limit_error","message":"Rate limit exceeded"}}`

### Architecture

All models run on the self-hosted K8s GPU cluster. The API does not proxy to external providers. Both OpenAI and Anthropic request formats are normalized into a unified internal format by the Control Service (via Envoy ext_proc) before routing to the model serving layer. Responses are translated back into the caller's expected wire format.

### Success Metrics

| Metric | Target |
|--------|--------|
| Open-source and fine-tuned models available at launch | Many |
| Developers successful on first API call | >80% |
| Users trying 2+ models (30d) | >50% |
| Week-1 to Week-2 retention | >70% |
| OpenAI SDK drop-in compatibility confirmed | 100% |
| Anthropic SDK drop-in compatibility confirmed | 100% |

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

Real-time token-by-token streaming via Server-Sent Events for all inference requests. Supports both OpenAI and Anthropic streaming protocols.

### Features

- Token-by-token streaming
- Server-Sent Events
- OpenAI streaming format (`/v1/chat/completions` with `"stream": true`)
- Anthropic streaming format (`/v1/messages` with `"stream": true`)

### User Flow — OpenAI Streaming

1. Client sends `POST /v1/chat/completions` with `"stream": true`.
2. Server responds with `Content-Type: text/event-stream`.
3. Tokens arrive as SSE events: `data: {"choices":[{"delta":{"content":"token"}}]}`.
4. Client renders tokens as they arrive (playground, SDK, custom app).
5. Stream ends with `data: [DONE]`. Final usage object included in last chunk before `[DONE]`.

### User Flow — Anthropic Streaming

1. Client sends `POST /v1/messages` with `"stream": true`.
2. Server responds with `Content-Type: text/event-stream`.
3. Stream begins with `message_start` event containing the initial message object.
4. Each content block is wrapped: `content_block_start` → one or more `content_block_delta` (with `{"type":"text_delta","text":"token"}`) → `content_block_stop`.
5. Stream ends with `message_delta` (containing `stop_reason` and final `usage`) followed by `message_stop`.

**Anthropic SSE event sequence:**
```
event: message_start
data: {"type":"message_start","message":{"id":"msg_...","type":"message","role":"assistant","content":[],"model":"...","stop_reason":null,"usage":{"input_tokens":18,"output_tokens":0}}}

event: content_block_start
data: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"Hello"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"!"}}

event: content_block_stop
data: {"type":"content_block_stop","index":0}

event: message_delta
data: {"type":"message_delta","delta":{"stop_reason":"end_turn"},"usage":{"output_tokens":2}}

event: message_stop
data: {"type":"message_stop"}
```

### Error Handling

- **Error mid-stream (OpenAI)** → Error event sent as `data: {"error":{"type":"...","message":"..."}}` before `data: [DONE]`.
- **Error mid-stream (Anthropic)** → Error event sent as `event: error` with `data: {"type":"error","error":{"type":"...","message":"..."}}` before connection close.

### Success Metrics

| Metric | Target |
|--------|--------|
| Streaming adoption rate (vs non-streaming) | >90% |
| Playground sessions using streaming | >70% |
| OpenAI SDK streaming compatibility confirmed | 100% |
| Anthropic SDK streaming compatibility confirmed | 100% |

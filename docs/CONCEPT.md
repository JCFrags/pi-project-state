# Project State concept

Project State is one category with four different responsibilities.

```text
Workplan defines direction
        │
        ▼
Todo selects immediate actions ─────► work
        │                              │
        └──────────────────────────────▼
                                    Notes
                                      │
                                      ▼
                           Workplan checkpoint
                                      │
                                      ▼
                                    Memory
```

## Boundaries

| Area | Main question | Expected lifetime |
|---|---|---|
| Todo | What happens next? | Minutes to days |
| Notes | What are we learning now? | Current investigation |
| Workplan | What outcome are we pursuing? | Whole project |
| Memory | What remains useful later? | Across projects and sessions |

They share one CLI and one discoverable category, but they should not become one undifferentiated data structure. A todo item is not a project decision. A scratch note is not durable memory. A workplan is not a transcript.

## First-draft rule

The CLI is the common front door. Each command group keeps its own semantics and can later receive a separate storage adapter.

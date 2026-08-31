# Rough roadmap

## Stage 0 — command-shape prototype

- [x] One executable
- [x] Todo, notes, workplan, and memory command groups
- [x] Local JSON persistence
- [x] Basic documentation

## Stage 1 — define the real state protocol

- [ ] Stable schemas and migrations
- [ ] Atomic mutation and concurrent-write handling
- [ ] Branch-aware event replay
- [ ] Bounded output and paging
- [ ] Import/export commands

## Stage 2 — useful interfaces

- [ ] JSON output mode for agents and scripts
- [ ] Interactive terminal overview
- [ ] Pi adapter that presents the four tools as the Project State category
- [ ] Optional Git-backed project storage

## Stage 3 — integrations

- [ ] Connect existing Pi todo, notes, workplan, and memory implementations
- [ ] Preserve each tool's authority and retention rules
- [ ] Add plugin/storage adapter interfaces

The next design decision is whether this repository should own the state implementations or act as a common interface over existing providers.

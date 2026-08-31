# Project State CLI

A rough first draft of one command-line program for four related kinds of project state:

- **Todo** — what should happen next
- **Notes** — what we learn while working
- **Workplan** — where the project is going
- **Memory** — what should remain useful later

This repository is intentionally small and experimental. It proves the command shape before the storage model and integrations are finalized.

## Command shape

```text
pstate
├── status
├── todo
│   ├── list
│   ├── add <text>
│   └── done <id>
├── notes
│   ├── list
│   └── add <text>
├── workplan
│   ├── show
│   ├── set-goal <text>
│   └── checkpoint <text>
└── memory
    ├── list
    └── add <text>
```

## Try it

Node.js 20 or newer is required. No dependencies are needed.

```bash
npm link
pstate workplan set-goal "Ship the first useful Project State CLI"
pstate todo add "Design a stable storage protocol"
pstate notes add "Todos are immediate; the workplan is durable direction"
pstate memory add "Keep each state type separate behind one CLI"
pstate status
```

State is currently written to `.project-state/state.json` in the current directory.

You can also run it without linking:

```bash
node ./bin/project-state.js help
```

## Current limits

This is a prototype, not a production tool. It has:

- one local JSON state file;
- no locking or concurrent-write protection;
- no branch-aware event replay;
- no schemas or migration framework;
- no Pi extension adapter yet.

See [`docs/CONCEPT.md`](docs/CONCEPT.md), [`docs/CLI.md`](docs/CLI.md), and [`docs/ROADMAP.md`](docs/ROADMAP.md).

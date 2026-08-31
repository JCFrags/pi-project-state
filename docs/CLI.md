# CLI reference

The executable can be invoked as `pstate` or `project-state` after `npm link`.

## Overview

```bash
pstate status
pstate help
pstate version
```

## Todo

```bash
pstate todo list
pstate todo add "Write the parser"
pstate todo done T1
```

## Notes

```bash
pstate notes list
pstate notes add "The parser should stay dependency-free for the prototype"
```

## Workplan

```bash
pstate workplan show
pstate workplan set-goal "Publish a usable prototype"
pstate workplan checkpoint "Initial CLI shape pushed to GitHub"
```

## Memory

```bash
pstate memory list
pstate memory add "Use one CLI but keep state semantics separate"
```

## Storage

The prototype finds state relative to the current working directory:

```text
<cwd>/.project-state/state.json
```

This format is intentionally provisional.

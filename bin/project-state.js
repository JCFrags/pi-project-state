#!/usr/bin/env node
// @ts-nocheck

import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const VERSION = "0.0.1";
const statePath = join(process.cwd(), ".project-state", "state.json");

function emptyState() {
  return {
    version: 1,
    workplan: { goal: "", checkpoints: [] },
    todos: [],
    notes: [],
    memories: [],
  };
}

async function loadState() {
  try {
    return JSON.parse(await readFile(statePath, "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT") return emptyState();
    throw error;
  }
}

async function saveState(state) {
  await mkdir(dirname(statePath), { recursive: true });
  const temporaryPath = `${statePath}.tmp-${process.pid}`;
  await writeFile(temporaryPath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
  await rename(temporaryPath, statePath);
}

function nextId(prefix, items) {
  const greatest = items.reduce((maximum, item) => {
    const number = Number.parseInt(String(item.id).slice(prefix.length), 10);
    return Number.isFinite(number) ? Math.max(maximum, number) : maximum;
  }, 0);
  return `${prefix}${greatest + 1}`;
}

function requireText(parts, usage) {
  const value = parts.join(" ").trim();
  if (!value) fail(`Missing text. Usage: ${usage}`);
  return value;
}

function fail(message) {
  console.error(`Error: ${message}`);
  process.exit(1);
}

function printHelp() {
  console.log(`Project State CLI ${VERSION}

Usage:
  pstate status
  pstate todo list
  pstate todo add <text>
  pstate todo done <id>
  pstate notes list
  pstate notes add <text>
  pstate workplan show
  pstate workplan set-goal <text>
  pstate workplan checkpoint <text>
  pstate memory list
  pstate memory add <text>
  pstate help
  pstate version

State file: .project-state/state.json`);
}

function printItems(items, emptyMessage, format) {
  if (items.length === 0) {
    console.log(emptyMessage);
    return;
  }
  for (const item of items) console.log(format(item));
}

async function main() {
  const [group = "help", action, ...rest] = process.argv.slice(2);

  if (group === "help" || group === "--help" || group === "-h") {
    printHelp();
    return;
  }
  if (group === "version" || group === "--version" || group === "-v") {
    console.log(VERSION);
    return;
  }

  const state = await loadState();

  if (group === "status") {
    const openTodos = state.todos.filter((item) => !item.done).length;
    console.log(`Goal: ${state.workplan.goal || "(not set)"}`);
    console.log(`Todos: ${openTodos} open / ${state.todos.length} total`);
    console.log(`Notes: ${state.notes.length}`);
    console.log(`Checkpoints: ${state.workplan.checkpoints.length}`);
    console.log(`Memories: ${state.memories.length}`);
    return;
  }

  if (group === "todo") {
    if (action === "list" || !action) {
      printItems(
        state.todos,
        "No todos.",
        (item) => `${item.done ? "[x]" : "[ ]"} ${item.id} ${item.text}`,
      );
      return;
    }
    if (action === "add") {
      const item = {
        id: nextId("T", state.todos),
        text: requireText(rest, "pstate todo add <text>"),
        done: false,
        createdAt: new Date().toISOString(),
      };
      state.todos.push(item);
      await saveState(state);
      console.log(`Added ${item.id}: ${item.text}`);
      return;
    }
    if (action === "done") {
      const id = rest[0];
      const item = state.todos.find((candidate) => candidate.id === id);
      if (!item) fail(`Todo not found: ${id || "(missing id)"}`);
      item.done = true;
      item.completedAt = new Date().toISOString();
      await saveState(state);
      console.log(`Completed ${item.id}: ${item.text}`);
      return;
    }
    fail(`Unknown todo action: ${action}`);
  }

  if (group === "notes") {
    if (action === "list" || !action) {
      printItems(state.notes, "No notes.", (item) => `${item.id} ${item.text}`);
      return;
    }
    if (action === "add") {
      const item = {
        id: nextId("N", state.notes),
        text: requireText(rest, "pstate notes add <text>"),
        createdAt: new Date().toISOString(),
      };
      state.notes.push(item);
      await saveState(state);
      console.log(`Added ${item.id}: ${item.text}`);
      return;
    }
    fail(`Unknown notes action: ${action}`);
  }

  if (group === "workplan") {
    if (action === "show" || !action) {
      console.log(`Goal: ${state.workplan.goal || "(not set)"}`);
      printItems(
        state.workplan.checkpoints,
        "Checkpoints: none",
        (item) => `${item.id} ${item.text}`,
      );
      return;
    }
    if (action === "set-goal") {
      state.workplan.goal = requireText(rest, "pstate workplan set-goal <text>");
      await saveState(state);
      console.log(`Goal: ${state.workplan.goal}`);
      return;
    }
    if (action === "checkpoint") {
      const item = {
        id: nextId("K", state.workplan.checkpoints),
        text: requireText(rest, "pstate workplan checkpoint <text>"),
        createdAt: new Date().toISOString(),
      };
      state.workplan.checkpoints.push(item);
      await saveState(state);
      console.log(`Checkpoint ${item.id}: ${item.text}`);
      return;
    }
    fail(`Unknown workplan action: ${action}`);
  }

  if (group === "memory") {
    if (action === "list" || !action) {
      printItems(state.memories, "No memories.", (item) => `${item.id} ${item.text}`);
      return;
    }
    if (action === "add") {
      const item = {
        id: nextId("M", state.memories),
        text: requireText(rest, "pstate memory add <text>"),
        createdAt: new Date().toISOString(),
      };
      state.memories.push(item);
      await saveState(state);
      console.log(`Added ${item.id}: ${item.text}`);
      return;
    }
    fail(`Unknown memory action: ${action}`);
  }

  fail(`Unknown command group: ${group}. Run 'pstate help'.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

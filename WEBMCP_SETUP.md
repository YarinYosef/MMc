# WebMCP & Claude Code — Full Setup Guide

---

## What is Claude Code?

Claude Code is Anthropic's official CLI (Command Line Interface) for Claude. It runs in your
terminal and helps with software engineering tasks — reading files, editing code, running commands,
and connecting to external tools via **MCP (Model Context Protocol)**.

It is **not** the Claude in Chrome browser extension. Claude Code lives in the terminal.
The Chrome extension lives in the browser. They are separate products that do not share a session.

---

## The Three Tools Explained

There are three separate tools involved in connecting Claude Code to your browser.
Understanding what each one is prevents a lot of confusion.

---

### 1. Chrome DevTools MCP

**What it is:** An MCP server that gives Claude Code access to Chrome's **DevTools Protocol (CDP)**.
This is the same protocol that powers Chrome's built-in DevTools (F12).

**What it lets Claude Code do:**
- Open and navigate browser tabs
- Take screenshots
- Read the browser console (logs, errors)
- Inspect the DOM
- Analyze network requests
- Run JavaScript inside the browser page
- Automate interactions via Puppeteer

**How it works:**
```
Claude Code (terminal)
  └── chrome-devtools-mcp (MCP server)
        └── Chrome DevTools Protocol (CDP)
              └── Chrome browser
```

**Is this the "new way" (WebMCP)?** No. This is a structured, reliable version of the
**old way** — Claude Code controls the browser like a robot. It can take screenshots and
run JS, but it doesn't use `navigator.modelContext`. It's powerful for debugging,
performance analysis, and automation, just not the same paradigm as WebMCP.

**Install — Option A (CLI / MCP only):**
```bash
claude mcp add chrome-devtools --scope user npx chrome-devtools-mcp@latest
```

**Install — Option B (Plugin / MCP + Skills):**

> If you previously installed Chrome DevTools MCP, remove it from your config first.

Inside a Claude Code session:
```
/plugin marketplace add ChromeDevTools/chrome-devtools-mcp
/plugin install chrome-devtools-mcp
```
Restart Claude Code after installing. Verify with `/skills`.

The Plugin version includes **Skills** — slash commands like `/screenshot`, `/console`,
etc. — in addition to the raw MCP tools.

---

### 2. WebMCP (`navigator.modelContext`)

**What it is:** A new W3C web standard (Chrome 146+, early preview Feb 2026) where websites
expose their own structured tools directly to AI agents through a browser-native API.

**How it works:**
```
Website registers tools:
  navigator.modelContext.registerTool({ name: "add_to_watchlist", execute: ... })

AI agent calls them:
  add_to_watchlist({ symbol: "AAA", groupId: "default" })

Result: Direct function call — no screenshot, no DOM scraping, no image analysis
```

**Old way vs new way:**

| | Old Way | WebMCP (New Way) |
|--|---------|-----------------|
| How AI sees the page | Screenshot / DOM scrape | Structured tool list |
| How AI acts | Click simulation | Direct function call |
| Reliability | Brittle, breaks on UI changes | Exact, schema-validated |
| Speed | Slow (~67% more overhead) | Direct call |

The MMC Dashboard registers 4 tools via `src/components/WebMCPProvider.tsx`:

| Tool | Parameters | What it does |
|------|-----------|-------------|
| `get_watchlist` | none | Returns all groups + symbols |
| `add_to_watchlist` | `symbol`, `groupId` | Adds a ticker to a group |
| `remove_from_watchlist` | `symbol`, `groupId` | Removes a ticker |
| `create_watchlist_group` | `name` | Creates a new group |

**Proof you used WebMCP (not a file edit):**
- `src/json/watchlists.json` stays **unchanged** on disk
- The change lives only in the browser's `localStorage`
- No screenshots were taken

---

### 3. WebMCP Bridge

**What it is:** The missing link that connects Claude Code (terminal) to the browser's
`navigator.modelContext` tools. Without this, Claude Code has no channel into WebMCP.

There are two bridge options — **local (recommended)** and **cloud-hosted**.

---

#### Option A: `webmcp-bridge` (Local, Recommended)

**Repo:** [nathan-gage/webmcp-bridge](https://github.com/nathan-gage/webmcp-bridge)

A CLI + Chrome extension that bridges `navigator.modelContext` to MCP over **stdio + local WebSocket**.
No cloud relay, no API keys — everything runs on localhost.

**How it works:**
```
Claude Code (terminal)
  └── stdio → webmcp-bridge CLI
        └── WebSocket (127.0.0.1) → Chrome extension
              └── navigator.modelContext → Website tools
```

**Install:**

1. Install the CLI globally:
   ```bash
   npm install -g webmcp-bridge
   ```

2. Load the Chrome extension in Canary:
   - Open `chrome://extensions`
   - Enable **Developer mode**
   - Click **Load unpacked**
   - Select `~/webmcp-bridge/extension/`

3. Add to Claude Code (run outside a Claude Code session):
   ```bash
   claude mcp add webmcp-bridge webmcp-bridge
   ```

4. Restart Claude Code (`/exit` → `claude`)

> The extension badge turns green when tools are detected on the current tab.
> Security: localhost-only, random port (13100-13199), 256-bit shared secret, origin-validated.

---

#### Option B: Cloudflare Worker (Cloud-Hosted)

A cloud relay where the Chrome extension pushes tools to a Cloudflare Worker,
and Claude Code connects via HTTP transport. Requires an API key.

**How it works:**
```
Browser (localhost:3000)
  └── navigator.modelContext → 4 WebMCP tools registered
        └── Chrome extension reads the tools
              └── Pushes them to Cloudflare Worker backend
                    └── MCP HTTP server
                          └── Claude Code connects here
```

**Add it to Claude Code** (run in terminal, outside a Claude Code session):
```bash
claude mcp remove webmcp
claude mcp add --transport http webmcp "https://webmcp-backend-prod-v2.alexmnahas.workers.dev/mcp?key=YOUR_KEY"
```
Replace `YOUR_KEY` with your personal key from the WebMCP bridge extension.

> This MCP server only works while your browser is open on the app page with the extension active.
> The Cloudflare Worker acts as a relay — it has no tools of its own.

---

## Full Setup Checklist

### Browser Setup

- [ ] Install [Chrome Canary](https://www.google.com/chrome/canary/)
- [ ] Open `chrome://version` — confirm version is 146.0.7672.0 or higher
- [ ] Open `chrome://flags` → search **WebMCP** → enable **"WebMCP for testing"** → relaunch
- [ ] Load the `webmcp-bridge` extension: `chrome://extensions` → Developer mode → Load unpacked → `~/webmcp-bridge/extension/`
- [ ] Open `localhost:3000` in Chrome Canary — extension badge should turn green

### Verify WebMCP Is Working in the Browser

Open DevTools (F12) → Console tab, then run:

```js
// Should return ModelContext {}, not undefined
navigator.modelContext

// Should see this in the console on page load:
// "WebMCP: Model Context API detected. Registering tools..."
```

### Claude Code Setup

Run these in your terminal (not inside a Claude Code session):

```bash
# 1. Chrome DevTools MCP (browser control, debugging, screenshots)
claude mcp add chrome-devtools --scope user npx chrome-devtools-mcp@latest

# 2. WebMCP Bridge — Option A: Local (recommended)
npm install -g webmcp-bridge
claude mcp add webmcp-bridge webmcp-bridge

# 2. WebMCP Bridge — Option B: Cloud-hosted (alternative)
# claude mcp add --transport http webmcp "https://webmcp-backend-prod-v2.alexmnahas.workers.dev/mcp?key=YOUR_KEY"
```

Or for Chrome DevTools with Skills, inside a Claude Code session:
```
/plugin marketplace add ChromeDevTools/chrome-devtools-mcp
/plugin install chrome-devtools-mcp
```

### Restart Claude Code

MCP servers only load at session startup:
```bash
/exit
# then reopen Claude Code in your project directory
claude
```

---

## How to Use After Setup

```
"What's in my watchlist?"
→ Claude calls get_watchlist()
→ Returns structured JSON — no screenshot needed

"Add AAA to my watchlist"
→ Claude calls add_to_watchlist({ symbol: "AAA", groupId: "default" })
→ AAA appears live in the UI
→ watchlists.json on disk is NOT changed
→ Only localStorage is updated — that's your proof
```

---

## How Each Tool Relates to Each Other

```
Claude Code (terminal)
  ├── chrome-devtools-mcp ──────► Chrome DevTools Protocol
  │     └── Can: screenshot, run JS, inspect DOM, automate clicks
  │         (reliable old way — CDP-based, not WebMCP)
  │
  ├── webmcp-bridge (stdio) ───► localhost WebSocket → Chrome extension
  │     └── navigator.modelContext → app tools (get_watchlist, etc.)
  │         (new way — local, no cloud, recommended)
  │
  └── webmcp (MCP HTTP) ────────► Cloudflare Worker (alternative)
        └── Relay to browser's navigator.modelContext tools
              └── Can: call app-defined tools directly
```

You can use all three simultaneously. Use Chrome DevTools MCP for debugging and inspection;
use either WebMCP bridge for direct structured tool calls into the app.

---

## Debugging

| Symptom | Cause | Fix |
|---------|-------|-----|
| `navigator.modelContext` is `undefined` | Flag not enabled | Enable WebMCP flag in `chrome://flags`, relaunch Canary |
| No "Registering tools..." in console | Page not fully loaded or component not mounted | Hard refresh (`Ctrl+Shift+R`) |
| Claude Code doesn't see WebMCP tools | MCP server not added or session not restarted | Re-add MCP server, restart Claude Code |
| Claude in Chrome extension says "can't use it" | That extension is vision-based, not WebMCP | Use the WebMCP bridge extension instead |
| Tools registered multiple times (old bug) | `useEffect` re-ran on every store change | Fixed — `WebMCPProvider.tsx` now uses `useRef` and registers once on mount |
| WebMCP bridge has no tools | Browser not open or extension not active | Open `localhost:3000` in Canary with extension active before using Claude Code |
| `webmcp-bridge` CLI exits immediately | Extension not loaded or not connected | Load extension in `chrome://extensions`, check badge is green |
| Extension badge is grey | No WebMCP tools on current page | Navigate to `localhost:3000`, ensure WebMCPProvider is mounted |

---

## Key Files in This Project

| File | Purpose |
|------|---------|
| `src/components/WebMCPProvider.tsx` | Registers the 4 WebMCP tools via `navigator.modelContext` |
| `src/app/layout.tsx` | Mounts `WebMCPProvider` at the root (client-side only) |
| `src/stores/useWatchlistStore.ts` | Zustand store — what the WebMCP tools actually call |
| `src/json/watchlists.json` | Seed data — only used if localStorage is empty |

---

## Resources

- [Chrome for Developers — WebMCP early preview](https://developer.chrome.com/blog/webmcp-epp)
- [W3C WebMCP spec](https://github.com/webmachinelearning/webmcp)
- [webmcp-bridge — GitHub](https://github.com/nathan-gage/webmcp-bridge)
- [webmcp-bridge — npm](https://www.npmjs.com/package/webmcp-bridge)
- [Chrome DevTools MCP — GitHub](https://github.com/ChromeDevTools/chrome-devtools-mcp)
- [Chrome DevTools MCP — npm](https://www.npmjs.com/package/chrome-devtools-mcp)
- [Claude Code + Chrome docs](https://code.claude.com/docs/en/chrome)
- [MCP-B / WebMCP-org](https://github.com/WebMCP-org)
- [Model Context Tool Inspector extension](https://github.com/beaufortfrancois/model-context-tool-inspector)
- [Awesome WebMCP](https://github.com/webmcpnet/awesome-webmcp)
- [webmcp.link](https://webmcp.link/)

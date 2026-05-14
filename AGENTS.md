# Agent Instructions: Workflow & Context

**1. Issue Tracking & Knowledge (`bd`)**
Use **bd (beads)** exclusively for tasks and knowledge. Do NOT use markdown TODOs or MEMORY.md. Run `bd prime` for full context.
*   `bd ready` (find work) | `bd show <id>` (view)
*   `bd update <id> --claim` (claim) | `bd close <id>` (complete)
*   `bd remember` (persistent knowledge)

**2. Codebase Exploration (`graphify`) — MANDATORY**
You **MUST** use `graphify` (e.g., `/graphify .` or its MCP skill) to build and query the codebase knowledge graph **BEFORE** you are allowed to use traditional file commands like `ls`, `cat`, `grep`, or `find`. Use it to efficiently read project structure, architecture, and specific references.

**3. Documentation & Best Practices (`context7`)**
Always use the **Context7** MCP server (via `resolve-library-id`, `query-docs` tools, or `ctx7` CLI) to fetch the latest API documentation, setups, and configurations. Do not rely on assumptions or outdated training data for third-party implementations; always verify first.

**4. Non-Interactive Commands (CRITICAL)**
Always force commands to prevent hanging on y/n prompts:
*   **Files:** `cp -f`, `mv -f`, `rm -f` (use `-rf` for directories).
*   **Network:** `ssh` & `scp` with `-o BatchMode=yes`.
*   **Packages:** `apt-get -y`, `HOMEBREW_NO_AUTO_UPDATE=1 brew`.

**5. Session Completion (MANDATORY)**
Work is NOT complete until `git push` succeeds. NEVER stop before pushing or ask the user to push for you.
1. **Wrap Up:** File issues for remaining work, run quality gates (tests/linters), and close finished `bd` issues.
2. **Sync & Push:** 
   ```bash
   git pull --rebase
   bd dolt push
   git push
   git status # MUST show "up to date with origin"
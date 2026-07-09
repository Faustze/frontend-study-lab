# Contributing to Frontend Study Lab

Thank you for your interest in contributing! This document explains how to set up the project, make changes, and submit pull requests.

## Getting Prerequisites

- **Node.js** 22+ and **pnpm**
- **Python** 3.10+ (only if you're touching `backend/`)
- **Docker** (for the local Postgres database, only if touching `backend/`)
- **Git**
- **VS Code** (recommended) with extensions:
  - `Vue.volar` — Vue 3 language support
  - `dbaeumer.vscode-eslint` — ESLint integration
  - `ms-python.debugpy` — Python debugger (backend)

## Local Setup

### Frontend

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/frontend-study-lab.git
cd frontend-study-lab

# 2. Install dependencies
pnpm install

# 3. Create environment file
cp frontend/.env.example frontend/.env

# 4. Start dev server
pnpm run dev
```

The app will be available at `http://localhost:5173` (or next available port).

### Backend (only if you're changing `backend/`)

```bash
# 1. Local Postgres
docker-compose up -d db

# 2. Python virtual environment
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt

# 3. Environment file
cp .env.example .env   # fill in OAuth credentials if testing login

# 4. Migrate and run
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000` (`/health` should return `{"status": "ok"}`).

**Tip:** press **F5** in VS Code instead — `.vscode/launch.json` starts the DB, the backend (with the Python debugger attached), and the frontend (waiting for both to be ready) in one go.

## Project Structure

```md
frontend-study-lab/
├── backend/ # FastAPI backend (Python)
│ ├── app/
│ │ ├── routes/ # auth, progress endpoints
│ │ ├── models/ # SQLAlchemy models
│ │ ├── schemas/ # Pydantic schemas
│ │ ├── services/ # business logic
│ │ └── config.py # Settings (.env)
│ ├── alembic/ # database migrations
│ └── tests/ # Pytest suite
├── frontend/ # Main application code
│ ├── api/ # API client layer
│ ├── assets/scss/ # Global styles
│ ├── components/ # Reusable components (auth/, layout/, profile/, ui/, topic/)
│ ├── composables/ # Vue composables
│ ├── i18n/ # Translations (en/ru)
│ ├── mocks/ # MSW API mocks
│ ├── pages/ # Route pages
│ ├── stores/ # Pinia stores
│ ├── topics/ # Learning modules
│ │ ├── js-core/ # ✅ 7 completed modules
│ │ ├── js-dom/ # 🚧 empty
│ │ ├── js-async/ # 🚧 empty
│ │ ├── css/ # 🚧 empty
│ │ ├── scss/ # 🚧 empty
│ │ ├── typescript/ # 🚧 empty
│ │ ├── vue/ # 🚧 empty
│ │ └── nuxt/ # 🚧 empty
│ ├── types/ # TypeScript interfaces
│ ├── App.vue # Root component
│ ├── main.ts # Entry point
│ └── router.ts # Route definitions
├── docs/
│ ├── AGENTS.md # AI assistant rules
│ ├── plan-frontend.md # Frontend development roadmap
│ ├── plan-backend.md # Backend development roadmap
│ └── skeleton.md # Topic creation template
├── .husky/ # Git hooks
├── .github/workflows/ # CI, Backend CI, deploy, bot automation
├── .vscode/ # F5 launch config (db + backend debugger + frontend)
├── docker-compose.yml # Local Postgres for backend dev
├── package.json # Dependencies and scripts
└── README.md # Project overview
```

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feat/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

Branch naming:

- `feat/` — new feature or topic
- `fix/` — bug fix
- `docs/` — documentation changes
- `refactor/` — code refactoring

### 2. Make Changes

- Follow the existing code style (ESLint + Prettier run automatically on save)
- Add i18n translations for both EN and RU
- Update `_meta.json` when creating new topics

### 3. Test Your Changes

```bash
# Type checking
pnpm run typecheck

# Linting
pnpm run lint

# Fix lint errors automatically
pnpm run lint:fix

# Unit tests
pnpm run test:run

# Build (verifies everything compiles)
pnpm run build
```

If you touched `backend/`, also run (from `backend/`, with the venv active):

```bash
ruff check app tests scripts
mypy
pytest -q
```

These are exactly the checks `CI` and `Backend CI` run on the PR, so a clean run locally means the required status checks should pass too.

### 4. Commit

```bash
git add .
git commit -m "feat: add debounce topic page"
```

Commit message format:

- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation
- `style:` — formatting
- `refactor:` — code restructuring
- `test:` — adding tests

Husky will run lint-staged automatically before commit.

### 5. Push and Create PR

```bash
git push origin feat/your-feature-name
```

Then create a Pull Request on GitHub with:

- Clear description of changes
- Screenshots (if UI changes)
- Reference to related issue (if any)

## Adding a New Topic

Topics are the core learning modules. Each topic is a self-contained interactive demo.

### Quick Start

1. Read `docs/skeleton.md` for the template
2. Create folder: `frontend/topics/<category>/<module>/`
3. Add files:
   - `_meta.json` — metadata (title, difficulty, xp, order)
   - `<Module>.vue` — interactive demo page
   - `<module>.ts` — implementation

### Example: Adding "Event Delegation" to js-dom

```bash
mkdir -p frontend/topics/js-dom/event-delegation
```

**`_meta.json`:**

```json
{
  "title": "Event Delegation",
  "description": "Handle events on parent instead of individual children",
  "difficulty": "medium",
  "xp": 60,
  "order": 1,
  "tags": ["dom", "events", "performance"]
}
```

**`EventDelegation.vue`:**

```vue
<template>
  <section class="demo">
    <div class="demo-card">
      <div class="demo-header">
        <p class="demo-label">{{ $t("categories.js-dom.title") }}</p>
        <span class="difficulty difficulty-medium">Medium • +60 XP</span>
      </div>
      <h2>Event Delegation</h2>
      <p class="demo-copy">Brief explanation here...</p>
      <!-- Interactive demo -->
      <pre class="code">{{ codeExample }}</pre>
      <button class="complete-btn" :class="{ completed }" @click="onComplete">
        <span v-if="completed">{{ $t("common.completed") }}</span>
        <span v-else>{{ $t("common.complete") }} → +60 XP</span>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useProgressStore } from "@/stores/progress";

const progress = useProgressStore();
const completed = ref(progress.isModuleCompleted("event-delegation"));

function onComplete() {
  if (completed.value) return;
  progress.completeModule("event-delegation", 60);
  completed.value = true;
}

const codeExample = ["// Your code example here"].join("\n");
</script>

<style scoped lang="scss">
@use "@/assets/scss/demo-page";
// Page-specific styles
</style>
```

**`event-delegation.ts`:**

```typescript
export function delegate(
  parent: HTMLElement,
  event: string,
  selector: string,
  handler: Function,
) {
  parent.addEventListener(event, (e) => {
    const target = e.target as HTMLElement;
    if (target.matches(selector)) {
      handler(e, target);
    }
  });
}
```

### After Creating a Topic

- Routing is automatic (via `useTopics` composable)
- Navigation updates automatically
- XP and progress tracking work automatically
- Run `pnpm run lint` and `pnpm run build` to verify

## Code Style

- **TypeScript** — strict mode enabled
- **Vue** — Composition API with `<script setup>`
- **SCSS** — use variables from `assets/scss/_variables.scss`
- **i18n** — all UI strings must use `$t()` with both EN and RU translations
- **Naming** — PascalCase for components, camelCase for functions/variables

## Need Help?

- Open an issue on GitHub
- Contact: `faustze9@gmail.com`

## License

This project is licensed under [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/).

By contributing, you agree that your contributions will be licensed under the same license.

**Key points:**

- ✅ Free to use, modify, and distribute for non-commercial purposes
- ❌ Commercial use is not permitted without explicit permission
- 📧 For commercial licensing inquiries: `faustze9@gmail.com`

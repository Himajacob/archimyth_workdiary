---
name: archimyth-workdiary
description: Complete project context for the Archimyth Work Diary application — a construction site daily activity tracker. Use this for any development work on this codebase to understand architecture, conventions, file locations, API contracts, and known constraints before making changes.
---

# Archimyth Work Diary

A construction site management web application for tracking daily work activities, managing sites and clients, uploading progress photos, and generating a work diary. Built as a full-stack web app with a FastAPI backend and React + TypeScript frontend.

---

## Tech Stack

### Backend
- **Python 3.x** with **FastAPI** — REST API framework
- **SQLAlchemy 2.0** — ORM (sync, not async)
- **Alembic** — database migrations
- **PostgreSQL** hosted on **Neon** (serverless, scale-to-zero)
- **psycopg2** — PostgreSQL driver
- **python-jose** — JWT token generation and validation
- **bcrypt** — password hashing
- **Pydantic v2** — request/response schema validation
- **Google Drive API** (`google-api-python-client`) — photo storage backend
- **Brevo HTTP API** — transactional email (invites, password reset) — NOT SMTP, raw HTTP calls via `requests`
- **Uvicorn** — ASGI server (deployed on Render)

### Frontend
- **React 18** + **TypeScript**
- **Vite** — dev server and build tool
- **React Router v7** with **HashRouter** (required because Render serves static files — no server-side routing)
- **Tailwind CSS 3** — styling, custom theme color `#D9C7A6` (gold), font Adam
- **react-icons** (Feather icons via `Fi*`) — icon set
- **react-calendar** — calendar component in Work Entry
- **react-datepicker** — date picker

---

## Project Structure

```
archimyth_workdiary/
├── SKILL.md                    ← this file
├── backend/
│   ├── main.py                 ← FastAPI app entry, CORS, router registration
│   ├── requirements.txt
│   ├── .env                    ← DB URL, JWT secret, Google creds, Brevo key
│   ├── alembic/                ← migration files
│   ├── api/
│   │   ├── dependencies/
│   │   │   ├── current_user.py ← JWT auth dependency → injects current_user
│   │   │   └── db.py           ← SQLAlchemy session dependency
│   │   ├── routes/             ← HTTP endpoint handlers (thin layer, delegates to services)
│   │   │   ├── auth.py         ← login, register (with invite token), forgot/reset password
│   │   │   ├── client.py       ← client CRUD + GET /clients/{client_id}
│   │   │   ├── site.py         ← site CRUD, GET /sites/client/{client_id}, includes client_name
│   │   │   ├── users.py        ← user profile, invite, list, update, resend invite
│   │   │   ├── work_entry.py   ← create/update/get/delete work entries and items
│   │   │   ├── work_entry_photo.py ← photo upload/delete, gallery
│   │   │   ├── work_type.py    ← work type CRUD, activate/deactivate
│   │   │   └── google_auth.py  ← Google Drive OAuth flow
│   │   └── schemas/            ← Pydantic request/response models
│   ├── core/
│   │   ├── auth.py             ← JWT creation + validation
│   │   ├── email.py            ← Brevo HTTP email sender
│   │   ├── roles.py            ← role constants (admin, site_manager)
│   │   └── security.py         ← bcrypt password hashing
│   ├── database/
│   │   ├── base.py             ← SQLAlchemy declarative base
│   │   ├── session.py          ← session factory (SessionLocal)
│   │   └── models/             ← ORM model definitions (see Models section)
│   ├── data_access/            ← database query layer (one file per model)
│   │   ├── base_data_access.py ← generic create/update/delete helpers
│   │   └── *_data_access.py
│   └── services/               ← business logic layer (one file per domain)
│       └── *_service.py
└── frontend/
    ├── index.html              ← PWA meta tags, manifest link, apple-touch-icon
    ├── public/
    │   ├── manifest.json       ← PWA manifest (theme: #D9C7A6, display: standalone)
    │   ├── sw.js               ← minimal service worker (install + activate)
    │   ├── logo.png            ← app logo (used as PWA icon)
    │   └── fonts/              ← Adam font files (Bold, Medium, Light)
    └── src/
        ├── main.tsx            ← React root, HashRouter, service worker registration
        ├── App.tsx             ← all routes defined here
        ├── api/                ← API client modules (see API Clients section)
        ├── components/         ← all UI components (see Components section)
        ├── utils/
        │   └── auth.ts         ← token read/write/clear, getUserName(), getToken()
        └── styles/
            └── global.css      ← Tailwind directives, Adam font-face, custom animations
```

---

## Backend Architecture Pattern

Strict 4-layer architecture — always follow this when adding features:

```
Route (api/routes/)
  └── Schema validation (api/schemas/)
        └── Service (services/)           ← all business logic + permission checks here
              └── Data Access (data_access/) ← all DB queries here, no logic
                    └── Model (database/models/)
```

**Rules:**
- Routes are thin — they call service methods, handle HTTP exceptions, return responses
- Services hold all business logic, role checks (`current_user.role not in [...]`), and cross-entity orchestration
- Data access classes only query the DB using SQLAlchemy — no business logic
- Never query the DB directly from routes or services (use data_access layer)

---

## Database Models

### User
```
id, email (unique), password_hash, first_name, last_name
role: "admin" | "site_manager"
is_active: bool, is_invited: bool, invite_token: str | null
created_at, updated_at
```

### Client
```
id, name, address, contact_number, is_active
created_by (FK → user), created_at, updated_at
```

### Site
```
id, project_name, location, start_date, duration_days
status: "active" | "completed" | "on_hold"
client_id (FK → client), drive_folder_id (Google Drive)
is_active: bool, created_by, created_at, updated_at
```

### WorkType
```
id, name, is_active
created_by, created_at, updated_at
```
Work types are global (not per-site). Admins manage them.

### WorkEntry
```
id, site_id (FK → site), entry_date (date)
created_by, updated_by, created_at, updated_at
UNIQUE (site_id, entry_date)
```
One work entry per site per day.

### WorkEntryItem
```
id, work_entry_id (FK → work_entry), work_type_id (FK → work_type)
workers_count: int (≥ 0)
remarks: str (NOT NULL, NOT EMPTY — DB constraint check_remarks)
created_by, updated_by, created_at, updated_at
```
**CRITICAL:** The DB has a CHECK constraint `check_remarks`: `remarks IS NULL OR char_length(trim(remarks)) > 0`. Sending empty string `''` throws `IntegrityError`. Always strip and validate remarks before insert/update in `work_entry_service.py`.

### WorkEntryPhoto
```
id, work_entry_item_id (FK → work_entry_item)
file_path, file_size, file_type, drive_file_id (Google Drive)
created_at, updated_at
```

### GoogleToken
```
id, user_id (FK → user)
access_token, refresh_token, token_expiry
```

---

## All API Routes

### Auth (`/auth`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/login` | Email + password → JWT token |
| POST | `/auth/register` | Complete registration with invite token + password |
| POST | `/auth/forgot-password` | Send password reset email |
| POST | `/auth/reset-password` | Reset with token + new password |

### Clients (`/clients`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/clients/` | admin | Create client |
| GET | `/clients/` | any | List clients |
| GET | `/clients/{client_id}` | any | Get single client |
| PATCH | `/clients/{client_id}` | admin | Update client |

### Sites (`/sites`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/sites/` | admin | Create site |
| GET | `/sites/` | any | List sites (includes `client_name` field via batch join) |
| PATCH | `/sites/{site_id}` | admin/site_manager | Update site |
| GET | `/sites/client/{client_id}` | any | Sites for a client |

**Note:** `GET /sites/` returns `client_name` by batch-fetching clients in a single `SELECT` query and building a dict — avoid N+1 queries.

### Work Entries (`/work-entries`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/work-entries/` | admin/site_manager | Create or update entry (upsert by site+date) |
| GET | `/work-entries/` | any | Get entry by `site_id` + `entry_date` query params |
| DELETE | `/work-entries/{work_entry_id}` | any | Delete entire entry + photos |
| DELETE | `/work-entries/items/{item_id}` | any | Delete single work item + its photos |

### Work Entry Photos (`/work-entry-photos`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/work-entry-photos/` | any | Upload single photo for a work item (multipart) |
| DELETE | `/work-entry-photos/{photo_id}` | any | Delete photo |
| POST | `/work-entry-photos/site/{site_id}/upload` | any | Bulk gallery upload |
| GET | `/work-entry-photos/site/{site_id}` | any | Get all photos for a site |

### Work Types (`/work-types`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/work-types/` | admin | Create work type |
| GET | `/work-types/` | any | List work types (query param `active_only`) |
| PATCH | `/work-types/{id}/activate` | admin | Activate |
| PATCH | `/work-types/{id}/deactivate` | admin | Deactivate |

### Users (`/users`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/users/me` | any | Current user profile |
| PATCH | `/users/me` | any | Update own profile |
| POST | `/users/invite` | admin | Invite new user (sends email) |
| GET | `/users/` | admin | List all users |
| PATCH | `/users/{user_id}` | admin | Update any user |
| POST | `/users/{user_id}/resend-invite` | admin | Resend invite email |

### Google Auth (`/auth/google`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/auth/google/login` | Start OAuth flow → redirect to Google |
| GET | `/auth/google/callback` | Handle callback, store token |

---

## Frontend Components

### Layout
- **`DashboardLayout.tsx`** — main app shell with collapsible desktop sidebar (`sticky top-0 h-screen shrink-0`), mobile overlay menu, topbar with user avatar + settings button, `<PWAInstallBanner />` rendered here
- **`AuthLayout.tsx`** — minimal centered layout for login/register pages

### Pages / Feature Components
| Component | Route | Description |
|-----------|-------|-------------|
| `LoginForm.tsx` | `/` | Email + password login |
| `Register.tsx` | `/register` | Complete registration with invite token |
| `ResetPassword.tsx` | `/reset-password` | Password reset with token |
| `ClientList.tsx` | `/clients` | List clients, expand/edit inline, click tile → navigate to client's sites |
| `CreateClient.tsx` | `/clients/create` | Create client form |
| `ClientSites.tsx` | `/clients/:clientId/sites` | Sites for a client, fetches client name via `getClient()`, shimmer while loading |
| `SiteList.tsx` | `/sites` | List all sites with client name badge, click tile → work diary |
| `CreateSite.tsx` | `/sites/create` | Create site form |
| `WorkEntry.tsx` | `/work-diary`, `/sites/:siteId/work-entry` | Main work diary — calendar left, work item rows right |
| `WorkEntryRow.tsx` | (child of WorkEntry) | Single work item row — work type select, worker count, remarks, photo upload |
| `WorkEntryCalendar.tsx` | (child of WorkEntry) | Calendar date picker |
| `WorkTypeList.tsx` | `/work-types` | Manage work types — activate/deactivate |
| `CreateWorkType.tsx` | `/work-types/create` | Create work type form |
| `UserList.tsx` | `/users` | Admin user management — expand/edit/resend invite |
| `CreateUser.tsx` | `/users/create` | Invite user form |
| `SiteGallery.tsx` | `/sites/:siteId/gallery` | Photo gallery for a site |
| `PhotoCard.tsx` | (child) | Single photo with delete button |
| `GalleryUploadModal.tsx` | (modal) | Bulk photo upload modal |
| `UserSettingsModal.tsx` | (modal) | Edit own name/password modal |
| `PWAInstallBanner.tsx` | (global) | PWA install prompt — mobile bottom sheet or desktop toast |

### Reusable UI
- **`CustomSelect.tsx`** — styled dropdown with `hasError` prop for red border state
- **`Alert.tsx`** — success/error alert box
- **`SkeletonList.tsx`** — loading skeleton

---

## Frontend API Clients (`src/api/`)

All calls go through **`http.ts`** which:
- Auto-injects `Authorization: Bearer <token>` from localStorage
- On 401 → clears token, redirects to `/#/` (HashRouter)
- Accepts: `{ method, body, params, token }`

| File | Key exports |
|------|-------------|
| `auth.ts` | `login`, `register`, `forgotPassword`, `resetPassword` |
| `user.ts` | `getUsers`, `updateUser`, `inviteUser`, `resendInvite` |
| `client.ts` | `getClients`, `getClient`, `createClient`, `updateClient` |
| `site.ts` | `getSites`, `getSitesByClient`, `createSite`, `updateSite` |
| `workEntry.ts` | `getWorkEntry`, `saveWorkEntry`, `deleteWorkEntry`, `deleteWorkEntryItem` |
| `workEntryPhoto.ts` | `uploadPhoto`, `deletePhoto`, `getSiteGallery`, `galleryUpload` |
| `workType.ts` | `getWorkTypes`, `createWorkType`, `activateWorkType`, `deactivateWorkType` |
| `types.ts` | shared TypeScript interfaces |

---

## Auth & Roles

- JWT stored in `localStorage` via `utils/auth.ts`
- Two roles: `admin` and `site_manager`
- Admins can: manage users, manage clients, manage sites, manage work types, do everything
- Site managers can: create/update work entries and photos
- Role is stored in the JWT payload and decoded on the frontend (`getUserRole()`)
- `ProtectedRoute.tsx` guards all dashboard routes — redirects to `/` if no token

---

## Key UI Conventions

### Tile / Card pattern
All list items (clients, sites, users) use the same pattern:
- Outer `div` has `group cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all duration-300`
- Outer `div` has `onClick` for primary navigation or expand
- All inner buttons have `e.stopPropagation()` to avoid bubbling to outer click
- Main heading `h3` uses `group-hover:text-[#D9C7A6] transition-colors duration-200` for gold hover text
- Edit button sets BOTH `editingX` AND `expandedX` states so details panel auto-opens

### Error / Validation pattern
- Errors only get SET by `validate()` on form submit — never by individual field `onChange` handlers
- `onChange` handlers may only CLEAR errors if they were already showing
- Required fields show `*` in label, red border + `animate-shake` when `hasError` is true, error message below with `animate-slide-up`

### Number inputs
- Use local string state (`countStr`) for `type="number"` inputs to allow backspace to empty without snapping to 0
- `onChange`: block negatives, call `updateRow` only when non-empty, allow `""` as intermediate state
- `onBlur`: reset to `"0"` if empty or negative

### Toast notifications
- Single `Toast` state `{ type: "success" | "error", text: string } | null`
- Auto-dismiss via `setTimeout` in `useEffect`
- Fixed bottom-center, `animate-slide-up`, dark bg for success, red for error

### Shimmer loading
- `animate-pulse` with `bg-[#E8E5DF]` and specific `h-*` / `w-*` matching the real element dimensions

---

## Design System

| Token | Value |
|-------|-------|
| Brand gold | `#D9C7A6` |
| Dark text | `#1E1E1E` |
| Background | `#F7F7F5` |
| Card border | `#E8E5DF` |
| Focus border | `#D9C7A6` |
| Hover bg | `#F5F1EA` / `#F8F6F2` |
| Border radius | `rounded-2xl` (inputs, buttons), `rounded-3xl` (cards) |
| Font | Adam (custom), system fallback |
| Body text | `text-sm` in cards, `text-xs` for labels |

---

## PWA Setup

- `public/manifest.json` — name, theme color, display standalone, logo icons
- `public/sw.js` — minimal service worker (install + activate only)
- `main.tsx` — registers service worker on load
- `index.html` — all iOS PWA meta tags (`apple-mobile-web-app-capable`, `apple-touch-icon`, etc.)
- `PWAInstallBanner.tsx` — shows desktop toast (auto-dismiss 7s) or mobile bottom sheet (Android native prompt / iOS manual instructions). Dismissed state saved to `localStorage("pwa-dismissed")`.

---

## Known Constraints & Gotchas

1. **`check_remarks` DB constraint** — `WorkEntryItem.remarks` cannot be an empty string `''`. Must be `NULL` or non-empty after trim. The service layer strips and validates before insert. Frontend validates before submit.

2. **HashRouter** — The frontend uses `HashRouter` (URLs like `/#/clients`). `start_url` in manifest uses `./`. Never use `BrowserRouter` — Render serves static files and can't handle deep links.

3. **Neon scale-to-zero** — The DB may take a few hundred ms to wake up on first request after idle. This is expected and not a bug.

4. **Google Drive** — Photos are stored in Google Drive folders (one per site). The `drive_folder_id` on the `Site` model links them. Google OAuth tokens are stored in the `google_tokens` table.

5. **Brevo email** — Emails are sent via Brevo REST API in `core/email.py`. Uses API key auth. Not SMTP. Do not add SMTP config.

6. **`duration_days` input** — Must send `null` (not `0`) when the field is empty. Always use `val === "" ? null : Number(val)` in onChange.

7. **Camera on mobile web** — Photo upload uses `<input type="file" accept="image/*">` and `<input type="file" accept="image/*" capture="environment">`. These route through the OS file picker / camera app and do NOT need browser-level camera permission (`getUserMedia`). Do not add permission banners for file inputs.

8. **Sidebar sticky** — Desktop sidebar is `sticky top-0 h-screen shrink-0` so it doesn't grow with page content. Never change this to `relative` or `absolute` without understanding the intent.

9. **Work types are global** — They are not scoped to a site. All site managers share the same work type list. Only admins can create/activate/deactivate them.

10. **Tile click vs inner button** — All tiles use a wrapping `onClick` for primary action. All inner interactive elements (Edit, Delete, Save, View More) use `e.stopPropagation()` to prevent the wrapping click from firing.

---

## Deployment

| Service | Platform | Notes |
|---------|----------|-------|
| Backend | Render (web service) | Python, Uvicorn, auto-deploys from main branch |
| Frontend | Render (static site) | Vite build, `dist/` folder, HashRouter |
| Database | Neon (PostgreSQL) | Serverless, scale-to-zero |
| Photos | Google Drive | Stored via service account / OAuth |
| Email | Brevo | REST API, transactional only |

---

## Running Locally

### Backend
```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm run dev
```

Frontend dev server proxies API calls to `http://localhost:8000` (configured in `vite.config.ts`).

# Todo 앱 마이그레이션 기획 문서 (3차)
**2차 React(Vite) + localStorage → Next.js(App Router) + FastAPI 풀스택**

---

## 0. 개요

- **목적:** 2차 과제의 React Todo 앱을, 화면과 핵심 동작은 유지하되 **데이터를 서버(FastAPI + SQLite)가 관리**하는 풀스택 구조로 재구성한다.
- **스택:** Next.js 15 (App Router) · React · TypeScript · Tailwind CSS v4 · Axios / FastAPI · Uvicorn · SQLAlchemy · SQLite · Pydantic v2
- **핵심 원칙:** 새 기능을 만드는 과제가 아니라 **아키텍처를 옮기는** 과제다. 무엇이 클라이언트에 남고 무엇이 서버로 가는지, 렌더링 위치(Server/Client)가 어디인지를 의식하며 만든다.
- **2차 대비 가장 큰 변화:** 데이터의 진실의 원천이 `localStorage`(브라우저) → **DB(서버)** 로 이동. 단방향 흐름이 **클라이언트 ↔ 서버 왕복**으로 바뀐다.
- **이번 결정(범위):**
  - 2차의 **날짜/일간 뷰는 제거** → 단순 단일 Todo 목록. 데이터 모델 `{ id, content, completed }`.
  - 필수(0~6) + **도전(서버 기반 상태 필터링, 서버 기반 검색)** 까지 구현. 필터/검색 상태는 **URL 파라미터**로 관리하고 **서버(FastAPI)에서 필터링**한다.

---

## 1. 기능 배치 — 무엇을 프론트에, 무엇을 백엔드에 (미션 0)

> 2차에서 프론트(localStorage)가 하던 일 중 "데이터를 다루는 일"은 모두 백엔드로 넘긴다.

| 2차에서 하던 일 | 3차 위치 | 이유 |
|---|---|---|
| 데이터 저장 · 영속화 | **백엔드** (SQLite) | 서버 DB가 진실의 원천 |
| Todo 추가/수정/삭제/완료 로직 | **백엔드** (FastAPI 엔드포인트) | 데이터 변경은 서버에서 |
| 상태 필터링(전체/진행중/완료) | **백엔드** (`GET /todos?filter=`) | 도전1 — 클라 배열 필터링이 아니라 DB 조회 |
| 검색 | **백엔드** (`GET /todos?search=`) | 도전2 — DB `LIKE` 조회 |
| 화면 렌더링 · 목록 표시 | **프론트 (Server Component)** | 데이터를 받아 보여주기만 |
| 클릭/입력 등 인터랙션 | **프론트 (Client Component)** | `"use client"` 필요 |
| 필터/검색 "현재 상태" 보관 | **프론트 (URL 파라미터)** | 새로고침·공유·뒤로가기에도 유지 |
| 입력값 검증(빈 값 차단) | **프론트** | 즉시 피드백 |

---

## 2. 데이터 모델

2차의 `{ id, text, completed, date }` 에서 **`date` 제거**, `text` → `content` 로 명명(검색 대상이 "내용"이라 의미를 분명히).

```
Todo {
  id: number          # PK, 서버가 자동 발급 (2차의 Date.now() 대체)
  content: string     # 할 일 내용
  completed: boolean  # 완료 여부 (기본 false)
}
```

- 필터 매핑: **전체** = 전부 / **진행중(active)** = `completed=false` / **완료(completed)** = `completed=true`
- id를 **서버가 발급**하는 점이 2차와 다르다. 생성 응답으로 받은 id를 화면이 그대로 사용한다.

---

## 3. 시스템 구조 / 요청 흐름

```
[브라우저]
  │  ① 읽기(목록/단건): Server Component가 actions.ts 호출
  │  ② 쓰기(생성/수정/삭제/완료): Client Component가 fetch → route.ts
  ▼
[Next.js 서버]
  ├─ actions.ts   (서버에서 FastAPI 직접 호출 — 읽기)
  └─ app/api/.../route.ts  (프록시 — 쓰기 요청을 FastAPI로 전달)
  ▼
[FastAPI :8000]  →  [SQLite todos.db]
```

**route.ts vs actions.ts (과제 핵심 구분):**

|        | `actions.ts` | `route.ts` |
|--------|--------------|------------|
| 역할   | Server Component이 직접 호출하는 **서버 함수** | 클라이언트의 HTTP 요청을 FastAPI로 넘기는 **프록시** |
| 쓰임   | **읽기**(목록·단건 조회) | **쓰기**(생성·수정·삭제·완료 토글) |
| 호출   | `await getTodos()` (서버에서) | `fetch('/api/todos', ...)` (클라이언트에서) |

> 클라이언트가 FastAPI(`:8000`)로 **직접** 요청하지 않는 이유: 백엔드 주소를 브라우저에 노출하지 않고, CORS·인증 등을 한 곳(Next 서버)에서 통제하기 위함. 그래서 쓰기는 같은 출처의 `route.ts`를 거친다.

---

## 4. 화면 / 라우팅 (App Router)

| 경로 | 파일 | 종류 | 역할 |
|------|------|------|------|
| `/` | `app/page.tsx` | Server | `/todos`로 리다이렉트 |
| `/todos` | `app/todos/page.tsx` | **Server** | `searchParams`(filter·search) 읽어 `getTodos`로 목록 로드 |
| `/todos/new` | `app/todos/new/page.tsx` | Server 껍데기 + Client 폼 | 생성 폼 |
| `/todos/[todoId]` | `app/todos/[todoId]/page.tsx` | **Server** | `getTodo`로 단건 로드 → 수정 폼 |
| — | `app/todos/loading.tsx` | Server | 로딩 중 스켈레톤 |
| — | `app/todos/error.tsx` | **Client** | 에러 경계 |

**Client Component(`"use client"`):** `FilterTabs`(필터 URL 갱신), `SearchBar`(검색어 URL 갱신·디바운스), `TodoItem`(완료 토글·삭제), `TodoForm`(생성·수정 제출), `error.tsx`.
**Server Component(기본):** 목록/수정 페이지(데이터 fetch), `layout`, `loading`.

> 판단 기준: **인터랙션(클릭/입력/상태)** 이 있으면 Client, **데이터를 받아 보여주기만** 하면 Server.

---

## 5. 백엔드 API (FastAPI)

| Method | URL | 설명 |
|---|---|---|
| GET | `/todos?filter=&search=` | 목록. `filter`(all/active/completed) + `search`(내용 LIKE)를 **서버에서** 적용 |
| GET | `/todos/{id}` | 단건 조회 (수정 페이지 로드용) |
| POST | `/todos` | 생성 (`{content}`) |
| PUT | `/todos/{id}` | 수정 (`{content?, completed?}`) |
| DELETE | `/todos/{id}` | 삭제 |

- SQLAlchemy 모델 `Todo` + Pydantic 스키마(`TodoCreate`/`TodoUpdate`/`TodoResponse`) 분리.
- `main.py` 단일 파일에 모델·스키마·DB·라우터·CORS를 모두 둔다(과제 지정). 실무라면 파일을 역할별로 나눈다.
- CORS로 `http://localhost:3000`(Next dev) 허용.

---

## 6. 환경변수

| 파일 | 변수 | 용도 | 노출 |
|------|------|------|------|
| `frontend/.env.local` | `NEXT_PUBLIC_API_URL=http://localhost:3000/api` | 클라이언트 → route.ts | **브라우저 노출**(`NEXT_PUBLIC_`) |
| `frontend/.env.local` | `BACKEND_URL=http://localhost:8000` | 서버(actions/route) → FastAPI | 서버 전용 |
| `backend/.env.local` | `DATABASE_URL=sqlite:///./todos.db` | DB 위치 | 서버 전용 |

> `NEXT_PUBLIC_` 접두사가 있으면 클라이언트 번들에 포함되어 브라우저에서 보인다. 백엔드 주소(`BACKEND_URL`)는 접두사 없이 **서버에서만** 쓴다. `.env.local`은 `.gitignore`로 커밋 제외.

---

## 7. 구현 순서 (과제 미션 = 단계별 커밋)

1. 구조 + 본 기획 문서 + `.gitignore`
2. 프론트 세팅 (create-next-app, :3000)
3. 백엔드 세팅 (venv, FastAPI hello, :8000)
4. FastAPI CRUD API (+ filter/search) — `/docs`·curl로 검증
5. Next.js Todo 페이지(목록/생성/수정) + loading/error, Server/Client 구분
6. route.ts + actions.ts 연동 — 전체 CRUD 왕복
7. 환경변수 분리 — 하드코딩 URL 제거
8. 도전1 — 서버 기반 상태 필터링(URL 파라미터)
9. 도전2 — 서버 기반 검색(URL 파라미터, 필터와 동시 적용)

> 각 단계는 화면/엔드포인트 하나가 동작하는 단위로 끊고, 동작 확인 후 커밋한다.

---

## 8. 2차와의 핵심 차이 (회고 포인트)

- **데이터 위치:** localStorage(브라우저) → SQLite(서버). `useEffect`로 읽고 쓰던 것을 API 요청으로 대체.
- **렌더링 위치:** 2차는 전부 클라이언트. 3차는 기본 Server Component이고 인터랙션만 Client.
- **상태 관리:** 2차의 `useState` 필터 → 3차는 **URL 파라미터**(새로고침·공유에도 유지).
- **id 발급:** `Date.now()`(클라) → 서버 자동 발급.

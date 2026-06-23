# 3차 과제 — Next.js + FastAPI Todo 앱

2차 과제(React + localStorage)를 **Next.js(App Router) 프론트엔드 + FastAPI 백엔드** 풀스택 구조로 마이그레이션한 Todo 앱입니다. 데이터는 더 이상 브라우저가 아니라 **서버(SQLite)**가 관리합니다.

> 설계/배경 문서: [`../docs/migration-plan-3.md`](../docs/migration-plan-3.md)

## 구조

```
assignment-3/
├── frontend/   # Next.js 16 (App Router · TypeScript · Tailwind v4 · Axios)
└── backend/    # FastAPI (Uvicorn · SQLAlchemy · SQLite · Pydantic v2)
```

## 실행 방법

두 개의 터미널이 필요합니다.

### 1) 백엔드 (FastAPI, :8000)

```bash
cd assignment-3/backend
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env.local          # 환경변수 준비
uvicorn main:app --reload           # http://localhost:8000  (문서: /docs)
```

### 2) 프론트엔드 (Next.js, :3000)

```bash
cd assignment-3/frontend
npm install
cp .env.example .env.local          # 환경변수 준비
npm run dev                         # http://localhost:3000  (→ /todos 로 이동)
```

## 환경변수

| 파일 | 변수 | 용도 |
|------|------|------|
| `frontend/.env.local` | `NEXT_PUBLIC_API_URL` | 브라우저 → Next API Route(`/api`) 주소 (브라우저에 노출) |
| `frontend/.env.local` | `BACKEND_URL` | 서버(actions/route) → FastAPI 주소 (서버 전용) |
| `backend/.env.local` | `DATABASE_URL` | SQLite DB 위치 |

> `.env.local` 은 커밋되지 않습니다. 각 디렉터리의 `.env.example` 을 복사해서 사용하세요.

## 데이터 흐름 (route.ts vs actions.ts)

- **읽기(목록/단건)** — Server Component가 `app/actions.ts`로 **서버에서 FastAPI를 직접 호출**.
- **쓰기(생성/수정/삭제/완료)** — Client Component가 `fetch('/api/...')` → **`route.ts` 프록시** → FastAPI. 성공 후 `router.refresh()`로 목록 최신화.

## API (FastAPI)

| Method | URL | 설명 |
|---|---|---|
| GET | `/todos?filter=&search=` | 목록 (상태 필터 + 내용 검색을 서버에서 처리) |
| GET | `/todos/{id}` | 단건 조회 |
| POST | `/todos` | 생성 |
| PUT | `/todos/{id}` | 수정 |
| DELETE | `/todos/{id}` | 삭제 |

## 구현 기능

- **필수**: Todo CRUD, Server/Client Component 구분, route.ts·actions.ts 연동, 환경변수 분리, loading/error 화면
- **도전**: 서버 기반 상태 필터링(`?filter=`), 서버 기반 검색(`?search=`) — 둘 다 **URL 파라미터**로 관리하고 **FastAPI 서버에서** 필터링

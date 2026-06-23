"""
Todo API (FastAPI + SQLAlchemy + SQLite)

3차 과제 백엔드. 2차에서 브라우저 localStorage가 하던 "데이터 저장·조회"를
이 서버가 대신한다. 과제 지정대로 main.py 한 파일에 DB·모델·스키마·라우터를 모두 둔다.
(실무라면 파일을 역할별로 분리한다.)
"""

import os

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, StringConstraints
from sqlalchemy import Boolean, Column, Integer, String, create_engine
from sqlalchemy.orm import Session, declarative_base, sessionmaker
from typing import Annotated, Optional

# ─────────────────────────────────────────────────────────────
# 1) DB 설정
#    DATABASE_URL은 .env.local에서 읽고, 없으면 로컬 SQLite 파일을 기본값으로 쓴다.
# ─────────────────────────────────────────────────────────────
load_dotenv(".env.local")
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todos.db")

# SQLite는 기본적으로 "만든 스레드에서만 접근" 제약이 있는데,
# FastAPI는 여러 스레드에서 세션을 쓰므로 check_same_thread=False로 푼다.
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# ─────────────────────────────────────────────────────────────
# 2) DB 모델 (todos 테이블 구조)
#    2차의 { id, text, completed } 와 동일한 형태. text → content 로 명명.
#    날짜(date)는 3차 범위에서 제외했다.
# ─────────────────────────────────────────────────────────────
class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)  # 서버가 자동 발급
    content = Column(String, nullable=False)            # 할 일 내용
    completed = Column(Boolean, nullable=False, default=False)  # 완료 여부


# 첫 실행 시 todos.db 파일과 테이블을 생성한다.
Base.metadata.create_all(bind=engine)


# ─────────────────────────────────────────────────────────────
# 3) Pydantic 스키마 (요청/응답 데이터 구조)
#    - 내용 문자열은 양끝 공백을 제거하고 1글자 이상이어야 한다.
# ─────────────────────────────────────────────────────────────
# 공백 제거 + 최소 1글자 제약이 걸린 내용 문자열 타입
TodoContent = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]


class TodoCreate(BaseModel):
    """생성 요청 본문: 내용만 받는다(완료 여부는 기본 false)."""
    content: TodoContent


class TodoUpdate(BaseModel):
    """수정 요청 본문: 내용·완료 여부를 선택적으로 받는다(보낸 값만 갱신)."""
    content: Optional[TodoContent] = None
    completed: Optional[bool] = None


class TodoResponse(BaseModel):
    """응답 본문: DB의 Todo 객체를 그대로 직렬화한다."""
    id: int
    content: str
    completed: bool

    # SQLAlchemy 모델 객체(속성 접근)를 그대로 변환할 수 있게 한다.
    model_config = ConfigDict(from_attributes=True)


# ─────────────────────────────────────────────────────────────
# 4) FastAPI 앱 + CORS
#    Next.js dev 서버(localhost:3000)에서 호출하므로 그 출처를 허용한다.
# ─────────────────────────────────────────────────────────────
app = FastAPI(title="Todo API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─────────────────────────────────────────────────────────────
# 5) DB 세션 의존성
#    요청마다 세션을 하나 열고, 끝나면 반드시 닫는다.
# ─────────────────────────────────────────────────────────────
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 라우터 전반에서 쓰는 세션 의존성 타입 별칭
DbSession = Annotated[Session, Depends(get_db)]


# ─────────────────────────────────────────────────────────────
# 6) 엔드포인트 (CRUD)
# ─────────────────────────────────────────────────────────────
@app.get("/todos", response_model=list[TodoResponse])
def list_todos(db: DbSession):
    """전체 Todo 목록 (최신순)."""
    return db.query(Todo).order_by(Todo.id.desc()).all()


@app.get("/todos/{todo_id}", response_model=TodoResponse)
def get_todo(todo_id: int, db: DbSession):
    """단건 조회 (수정 페이지에서 사용). 없으면 404."""
    todo = db.get(Todo, todo_id)
    if todo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo를 찾을 수 없습니다.")
    return todo


@app.post("/todos", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
def create_todo(payload: TodoCreate, db: DbSession):
    """새 Todo 생성 (완료 여부는 false로 시작)."""
    todo = Todo(content=payload.content, completed=False)
    db.add(todo)
    db.commit()
    db.refresh(todo)  # 서버가 발급한 id를 응답에 채워 돌려준다.
    return todo


@app.put("/todos/{todo_id}", response_model=TodoResponse)
def update_todo(todo_id: int, payload: TodoUpdate, db: DbSession):
    """Todo 수정. 보낸 필드만 부분 갱신한다. 없으면 404."""
    todo = db.get(Todo, todo_id)
    if todo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo를 찾을 수 없습니다.")

    if payload.content is not None:
        todo.content = payload.content
    if payload.completed is not None:
        todo.completed = payload.completed

    db.commit()
    db.refresh(todo)
    return todo


@app.delete("/todos/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(todo_id: int, db: DbSession):
    """Todo 삭제. 없으면 404."""
    todo = db.get(Todo, todo_id)
    if todo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo를 찾을 수 없습니다.")
    db.delete(todo)
    db.commit()
    # 204 No Content: 본문 없음

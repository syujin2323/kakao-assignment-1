// 브라우저(Client Component)에서 쓰는 쓰기 요청 헬퍼.
// FastAPI로 직접 가지 않고, 같은 출처의 Next route.ts(/api/todos)로 보낸다 → route.ts가 FastAPI로 프록시.
import axios from "axios";
import type { Todo } from "./types";

// TODO(단계6): "/api"를 환경변수(NEXT_PUBLIC_API_URL)로 분리한다.
const api = axios.create({
  baseURL: "/api",
});

// 새 Todo 생성
export async function createTodo(content: string): Promise<Todo> {
  const res = await api.post<Todo>("/todos", { content });
  return res.data;
}

// Todo 수정 (내용/완료 여부 중 보낸 것만 갱신)
export async function updateTodo(
  id: number,
  data: { content?: string; completed?: boolean }
): Promise<Todo> {
  const res = await api.put<Todo>(`/todos/${id}`, data);
  return res.data;
}

// Todo 삭제
export async function deleteTodo(id: number): Promise<void> {
  await api.delete(`/todos/${id}`);
}

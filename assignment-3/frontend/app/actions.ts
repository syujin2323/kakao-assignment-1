// Server Actions — Server Component에서 직접 호출하는 "읽기" 함수들.
// 여기서는 route.ts를 거치지 않고 서버에서 FastAPI 백엔드를 직접 호출한다.
// (쓰기 = 생성/수정/삭제는 client.ts → route.ts 경로를 쓴다.)
"use server";

import { backend } from "@/lib/backend";
import type { FilterValue, Todo } from "@/lib/types";

// 전체 Todo 목록 조회. filter/search는 그대로 백엔드 쿼리 파라미터로 넘겨 서버에서 필터링한다.
// (filter/search 서버 처리는 도전1·2 단계에서 구현)
export async function getTodos(
  filter?: FilterValue,
  search?: string
): Promise<Todo[]> {
  const res = await backend.get<Todo[]>("/todos", {
    params: { filter, search },
  });
  return res.data;
}

// 단건 조회 — 수정 페이지에서 기존 내용을 채우기 위해 사용한다.
export async function getTodo(id: number): Promise<Todo> {
  const res = await backend.get<Todo>(`/todos/${id}`);
  return res.data;
}

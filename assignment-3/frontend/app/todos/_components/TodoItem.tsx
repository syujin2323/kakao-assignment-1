// 목록의 Todo 한 개 (Client Component)
// 완료 토글·삭제는 client.ts → route.ts(/api) → FastAPI 경로로 처리하고,
// 성공하면 router.refresh()로 Server Component(목록)를 다시 렌더해 최신 상태를 반영한다.
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { deleteTodo, updateTodo } from "@/lib/client";
import type { Todo } from "@/lib/types";

export default function TodoItem({ todo }: { todo: Todo }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  // 완료 ↔ 진행중 토글
  async function handleToggle() {
    setPending(true);
    try {
      await updateTodo(todo.id, { completed: !todo.completed });
      router.refresh();
    } catch {
      alert("상태 변경에 실패했어요.");
    } finally {
      setPending(false);
    }
  }

  // 삭제 (실수 방지를 위해 확인)
  async function handleDelete() {
    if (!window.confirm("이 할 일을 삭제할까요?")) return;
    setPending(true);
    try {
      await deleteTodo(todo.id);
      router.refresh();
    } catch {
      alert("삭제에 실패했어요.");
      setPending(false);
    }
  }

  return (
    <li className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2">
      <span
        className={
          todo.completed ? "text-gray-400 line-through" : "text-gray-800"
        }
      >
        {todo.content}
      </span>
      <div className="flex shrink-0 gap-1">
        <button
          onClick={handleToggle}
          disabled={pending}
          className="rounded-md px-2 py-1 text-sm text-green-600 transition hover:bg-green-50 disabled:opacity-50"
        >
          {todo.completed ? "되돌리기" : "완료"}
        </button>
        <Link
          href={`/todos/${todo.id}`}
          className="rounded-md px-2 py-1 text-sm text-gray-600 transition hover:bg-gray-100"
        >
          수정
        </Link>
        <button
          onClick={handleDelete}
          disabled={pending}
          className="rounded-md px-2 py-1 text-sm text-red-500 transition hover:bg-red-50 disabled:opacity-50"
        >
          삭제
        </button>
      </div>
    </li>
  );
}

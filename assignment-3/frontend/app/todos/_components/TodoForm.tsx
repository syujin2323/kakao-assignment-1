// 생성·수정 공용 폼 (Client Component)
// - todo prop이 없으면 "생성", 있으면 "수정" 모드.
// - 제출은 client.ts → route.ts(/api) → FastAPI 경로. 성공하면 목록으로 이동.
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { createTodo, updateTodo } from "@/lib/client";
import type { Todo } from "@/lib/types";

export default function TodoForm({ todo }: { todo?: Todo }) {
  const router = useRouter();
  const isEdit = todo !== undefined;

  const [content, setContent] = useState(todo?.content ?? "");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = content.trim();
    if (trimmed === "") {
      setError("할 일을 입력해주세요.");
      return;
    }

    setPending(true);
    setError("");
    try {
      if (isEdit) {
        await updateTodo(todo.id, { content: trimmed });
      } else {
        await createTodo(trimmed);
      }
      router.push("/todos");
      router.refresh(); // 목록(Server Component)을 최신 데이터로 다시 렌더
    } catch {
      setError("저장에 실패했어요. 잠시 후 다시 시도해주세요.");
      setPending(false);
    }
  }

  // 한글 등 IME 조합 중에 누른 Enter로 폼이 제출되는 것을 막는다(2차에서 겪은 조합 버그 예방).
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && (e.nativeEvent as KeyboardEvent).isComposing) {
      e.preventDefault();
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="할 일을 입력하세요"
        autoFocus
        className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="flex-1 rounded-lg bg-blue-500 px-4 py-2 font-medium text-white transition hover:bg-blue-600 disabled:opacity-50"
        >
          {isEdit ? "수정" : "추가"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/todos")}
          className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-600 transition hover:bg-gray-50"
        >
          취소
        </button>
      </div>
    </form>
  );
}

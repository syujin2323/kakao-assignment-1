// Todo 목록 페이지 (Server Component)
// 서버에서 actions.ts의 getTodos()로 데이터를 직접 불러와 렌더한다.
// 클릭/입력 같은 인터랙션은 자식 Client Component(TodoItem)가 담당한다.
import Link from "next/link";

import { getTodos } from "../actions";
import TodoItem from "./_components/TodoItem";

// 항상 최신 데이터를 보여주기 위해 정적 캐싱을 끈다(요청마다 서버 렌더).
export const dynamic = "force-dynamic";

export default async function TodosPage() {
  const todos = await getTodos();

  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">할 일 목록</h1>
        <Link
          href="/todos/new"
          className="rounded-lg bg-blue-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
        >
          + 추가
        </Link>
      </div>

      {todos.length === 0 ? (
        <p className="py-12 text-center text-gray-400">아직 할 일이 없어요.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </ul>
      )}
    </>
  );
}

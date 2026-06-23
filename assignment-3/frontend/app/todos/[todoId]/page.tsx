// Todo 수정 페이지 (Server Component)
// 서버에서 getTodo()로 기존 데이터를 불러와 TodoForm에 넘긴다.
// 없는 id면 getTodo가 던지는 에러를 error.tsx가 받아 처리한다.
import Link from "next/link";

import { getTodo } from "../../actions";
import TodoForm from "../_components/TodoForm";

export const dynamic = "force-dynamic";

export default async function EditTodoPage(props: {
  params: Promise<{ todoId: string }>;
}) {
  const { todoId } = await props.params;
  const todo = await getTodo(Number(todoId));

  return (
    <>
      <div className="mb-5 flex items-center gap-2">
        <Link
          href="/todos"
          className="text-gray-400 transition hover:text-gray-600"
        >
          ‹
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">할 일 수정</h1>
      </div>
      <TodoForm todo={todo} />
    </>
  );
}

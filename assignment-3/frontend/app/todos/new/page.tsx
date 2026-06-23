// Todo 생성 페이지 (Server Component 껍데기 + Client 폼)
// 입력/제출 같은 인터랙션은 TodoForm(Client Component)이 담당한다.
import Link from "next/link";

import TodoForm from "../_components/TodoForm";

export default function NewTodoPage() {
  return (
    <>
      <div className="mb-5 flex items-center gap-2">
        <Link
          href="/todos"
          className="text-gray-400 transition hover:text-gray-600"
        >
          ‹
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">새 할 일</h1>
      </div>
      <TodoForm />
    </>
  );
}

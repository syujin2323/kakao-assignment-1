function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2">
      <span className={todo.completed ? "text-gray-400 line-through" : "text-gray-800"}>
        {todo.text}
      </span>
      <div className="flex gap-1">
        <button
          onClick={() => onToggle(todo.id)}
          className="rounded-md px-2 py-1 text-sm text-green-600 hover:bg-green-50"
        >
          {todo.completed ? "되돌리기" : "완료"}
        </button>
        <button className="rounded-md px-2 py-1 text-sm text-gray-600 hover:bg-gray-100">수정</button>
        <button
          onClick={() => onDelete(todo.id)}
          className="rounded-md px-2 py-1 text-sm text-red-500 hover:bg-red-50"
        >
          삭제
        </button>
      </div>
    </li>
  );
}

export default TodoItem;
import { useState } from "react";

function TodoItem({
  todo,
  isEditing,
  onToggle,
  onStartEdit,
  onSubmitEdit,
  onCancelEdit,
  onDelete,
}) {
  const [draft, setDraft] = useState(todo.text);

  function startEdit() {
    setDraft(todo.text); // 편집 시작할 때 현재 텍스트로 입력창 채우기
    onStartEdit(todo.id);
  }

  function submitEdit() {
    if (draft.trim() === "") return; // 빈 값이면 저장 안 함
    onSubmitEdit(todo.id, draft.trim());
  }

  function handleKeyDown(e) {
    if (e.nativeEvent.isComposing) return; // 한글 조합 중 Enter 무시
    if (e.key === "Enter") submitEdit();
    if (e.key === "Escape") onCancelEdit();
  }

  if (isEditing) {
    return (
      <li className="flex items-center gap-2 rounded-lg border border-blue-300 px-3 py-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          className="flex-1 rounded-md border border-gray-300 px-2 py-1 focus:border-blue-500"
        />
        <button onClick={submitEdit} className="rounded-md px-2 py-1 text-sm text-blue-600 hover:bg-blue-50">
          저장
        </button>
        <button onClick={onCancelEdit} className="rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-gray-100">
          취소
        </button>
      </li>
    );
  }

  return (
    <li className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2">
      <span className={todo.completed ? "text-gray-400 line-through" : "text-gray-800"}>
        {todo.text}
      </span>
      <div className="flex gap-1">
        <button onClick={() => onToggle(todo.id)} className="rounded-md px-2 py-1 text-sm text-green-600 hover:bg-green-50">
          {todo.completed ? "되돌리기" : "완료"}
        </button>
        <button onClick={startEdit} className="rounded-md px-2 py-1 text-sm text-gray-600 hover:bg-gray-100">
          수정
        </button>
        <button onClick={() => onDelete(todo.id)} className="rounded-md px-2 py-1 text-sm text-red-500 hover:bg-red-50">
          삭제
        </button>
      </div>
    </li>
  );
}

export default TodoItem;
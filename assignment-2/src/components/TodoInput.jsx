import { useState } from "react";

function TodoInput({ onAddTodo }) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  function handleSubmit() {
    if (text.trim() === "") {
      setError("할 일을 입력해주세요.");
      return;
    }
    onAddTodo(text.trim());
    setText("");
    setError("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleSubmit();
    }
  }

  return (
    <div className="mb-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="할 일을 입력하세요"
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500"
        />
        <button
          onClick={handleSubmit}
          className="rounded-lg bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
        >
          추가
        </button>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default TodoInput;
function TodoInput() {
  return (
    <div className="mb-4 flex gap-2">
      <input
        type="text"
        placeholder="할 일을 입력하세요"
        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500"
      />
      <button className="rounded-lg bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600">
        추가
      </button>
    </div>
  );
}

export default TodoInput;
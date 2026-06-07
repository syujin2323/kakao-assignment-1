import { useState } from "react";
import DateNavigator from "./components/DateNavigator";
import TodoInput from "./components/TodoInput";
import FilterTabs from "./components/FilterTabs";
import TodoList from "./components/TodoList";

const INITIAL_TODOS = [
  { id: 1, text: "리액트 공부하기", completed: false, date: "2026-06-07" },
  { id: 2, text: "장보기", completed: true, date: "2026-06-07" },
  { id: 3, text: "운동하기", completed: false, date: "2026-06-07" },
];

function App() {
  const [todos, setTodos] = useState(INITIAL_TODOS);

  function handleAddTodo(text) {
    const newTodo = {
      id: Date.now(),
      text: text,
      completed: false,
      date: "2026-06-07", // 임시값 — 7단계에서 selectedDate와 연결
    };
    setTodos([...todos, newTodo]);
  }

  function handleToggle(id) {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  function handleDelete(id) {
    if (!window.confirm("이 할 일을 삭제할까요?")) return;
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <main className="mx-auto w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <h1 className="mb-4 text-center text-2xl font-bold text-gray-800">할 일 목록</h1>
        <DateNavigator />
        <TodoInput onAddTodo={handleAddTodo} />
        <FilterTabs />
        <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} />
      </main>
    </div>
  );
}

export default App;
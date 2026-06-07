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

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <main className="mx-auto w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <h1 className="mb-4 text-center text-2xl font-bold text-gray-800">할 일 목록</h1>
        <DateNavigator />
        <TodoInput />
        <FilterTabs />
        <TodoList todos={todos} />
      </main>
    </div>
  );
}

export default App;
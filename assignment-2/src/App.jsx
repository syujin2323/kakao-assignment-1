import { useState, useEffect } from "react";
import { getToday, addDays } from "./utils/date";
import { loadTodos, saveTodos } from "./utils/storage";
import DateNavigator from "./components/DateNavigator";
import TodoInput from "./components/TodoInput";
import FilterTabs from "./components/FilterTabs";
import TodoList from "./components/TodoList";

const TODAY = getToday();

function App() {
  const [todos, setTodos] = useState(loadTodos);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(TODAY);

  // todos가 바뀔 때마다 localStorage에 자동 저장
  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  function handleAddTodo(text) {
    const newTodo = {
      id: Date.now(),
      text: text,
      completed: false,
      date: selectedDate,
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

  function handleStartEdit(id) {
    setEditingId(id);
  }

  function handleSubmitEdit(id, text) {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, text: text } : todo)));
    setEditingId(null);
  }

  function handleCancelEdit() {
    setEditingId(null);
  }

  function handleChangeFilter(value) {
    setFilter(value);
  }

  function handlePrevDay() {
    setSelectedDate(addDays(selectedDate, -1));
  }

  function handleNextDay() {
    setSelectedDate(addDays(selectedDate, 1));
  }

  // 계산값 — 선택된 날짜로 거른 뒤, 상태 필터를 적용
  const visibleTodos = todos.filter((todo) => {
    if (todo.date !== selectedDate) return false;
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <main className="mx-auto w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <h1 className="mb-4 text-center text-2xl font-bold text-gray-800">할 일 목록</h1>
        <DateNavigator
          selectedDate={selectedDate}
          onPrevDay={handlePrevDay}
          onNextDay={handleNextDay}
        />
        <TodoInput onAddTodo={handleAddTodo} />
        <FilterTabs filter={filter} onChangeFilter={handleChangeFilter} />
        <TodoList
          todos={visibleTodos}
          editingId={editingId}
          onToggle={handleToggle}
          onStartEdit={handleStartEdit}
          onSubmitEdit={handleSubmitEdit}
          onCancelEdit={handleCancelEdit}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
}

export default App;
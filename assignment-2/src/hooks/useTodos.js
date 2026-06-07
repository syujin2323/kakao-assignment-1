import { useState, useEffect } from "react";
import { getToday, addDays } from "../utils/date";
import { loadTodos, saveTodos } from "../utils/storage";

export function useTodos() {
  const [todos, setTodos] = useState(loadTodos);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(getToday());

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

  // 계산값 — 선택된 날짜로 거른 뒤 상태 필터 적용
  const visibleTodos = todos.filter((todo) => {
    if (todo.date !== selectedDate) return false;
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return {
    visibleTodos,
    editingId,
    filter,
    selectedDate,
    handleAddTodo,
    handleToggle,
    handleDelete,
    handleStartEdit,
    handleSubmitEdit,
    handleCancelEdit,
    handleChangeFilter,
    handlePrevDay,
    handleNextDay,
  };
}
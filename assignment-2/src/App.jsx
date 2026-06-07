import { useTodos } from "./hooks/useTodos";
import DateNavigator from "./components/DateNavigator";
import TodoInput from "./components/TodoInput";
import FilterTabs from "./components/FilterTabs";
import TodoList from "./components/TodoList";

function App() {
  const {
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
  } = useTodos();

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
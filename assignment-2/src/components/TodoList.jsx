import TodoItem from "./TodoItem";

function TodoList({
  todos,
  editingId,
  onToggle,
  onStartEdit,
  onSubmitEdit,
  onCancelEdit,
  onDelete,
}) {
  if (todos.length === 0) {
    return <p className="py-6 text-center text-gray-400">표시할 할 일이 없어요.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isEditing={editingId === todo.id}
          onToggle={onToggle}
          onStartEdit={onStartEdit}
          onSubmitEdit={onSubmitEdit}
          onCancelEdit={onCancelEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

export default TodoList;
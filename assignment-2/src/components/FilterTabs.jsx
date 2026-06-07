const FILTERS = [
  { value: "all", label: "전체" },
  { value: "active", label: "진행 중" },
  { value: "completed", label: "완료" },
];

function FilterTabs({ filter, onChangeFilter }) {
  return (
    <div className="mb-4 flex gap-2">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          onClick={() => onChangeFilter(f.value)}
          className={
            filter === f.value
              ? "rounded-full bg-blue-500 px-3 py-1 text-sm text-white"
              : "rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600 hover:bg-gray-200"
          }
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

export default FilterTabs;
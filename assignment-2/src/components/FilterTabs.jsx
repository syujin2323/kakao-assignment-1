function FilterTabs() {
  return (
    <div className="mb-4 flex gap-2">
      <button className="rounded-full bg-blue-500 px-3 py-1 text-sm text-white">전체</button>
      <button className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600 hover:bg-gray-200">
        진행 중
      </button>
      <button className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600 hover:bg-gray-200">
        완료
      </button>
    </div>
  );
}

export default FilterTabs;
function DateNavigator() {
  return (
    <div className="mb-4 flex items-center justify-center gap-4">
      <button className="rounded-md px-2 py-1 text-gray-500 hover:bg-gray-100">‹</button>
      <span className="font-medium text-gray-700">2026-06-07 (토)</span>
      <button className="rounded-md px-2 py-1 text-gray-500 hover:bg-gray-100">›</button>
    </div>
  );
}

export default DateNavigator;
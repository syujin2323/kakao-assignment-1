import { formatDisplay } from "../utils/date";

function DateNavigator({ selectedDate, onPrevDay, onNextDay }) {
  return (
    <div className="mb-4 flex items-center justify-center gap-4">
      <button onClick={onPrevDay} className="rounded-md px-2 py-1 text-gray-500 hover:bg-gray-100">
        ‹
      </button>
      <span className="font-medium text-gray-700">{formatDisplay(selectedDate)}</span>
      <button onClick={onNextDay} className="rounded-md px-2 py-1 text-gray-500 hover:bg-gray-100">
        ›
      </button>
    </div>
  );
}

export default DateNavigator;
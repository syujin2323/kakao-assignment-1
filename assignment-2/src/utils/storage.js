const STORAGE_KEY = "todos";

// localStorage에서 할 일 목록 불러오기 (없거나 깨졌으면 빈 배열)
export function loadTodos() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

// 할 일 목록을 localStorage에 저장
export function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}
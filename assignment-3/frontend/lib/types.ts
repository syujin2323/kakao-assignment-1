// 앱 전반에서 쓰는 공용 타입 정의

// 백엔드(FastAPI)의 TodoResponse와 1:1 대응되는 Todo 모양
export type Todo = {
  id: number;
  content: string;
  completed: boolean;
};

// 상태 필터 값 (도전1에서 사용) — 전체/진행중/완료
export type FilterValue = "all" | "active" | "completed";

// 에러 경계 (Error Boundary) — 데이터 로딩/렌더 중 예외가 나면 이 화면이 대신 보인다.
// error.tsx는 반드시 Client Component여야 한다(상호작용 reset 버튼 포함).
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="py-12 text-center">
      <p className="mb-1 font-medium text-gray-800">문제가 발생했어요.</p>
      <p className="mb-4 text-sm text-gray-500">
        백엔드 서버(:8000)가 실행 중인지 확인해주세요.
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
      >
        다시 시도
      </button>
    </div>
  );
}

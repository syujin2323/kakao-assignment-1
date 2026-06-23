// /todos 하위 모든 화면(목록·생성·수정)이 공유하는 카드형 레이아웃.
// loading.tsx·error.tsx도 이 레이아웃 안에서 렌더되어 화면 틀이 일관되게 유지된다.
export default function TodosLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        {children}
      </div>
    </div>
  );
}

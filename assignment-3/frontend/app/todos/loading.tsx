// 목록 데이터를 불러오는 동안 보여줄 화면 (Server Component).
// 서버에서 데이터를 가져오는 동안 Next가 이 화면을 자동으로 띄운다.
export default function Loading() {
  return (
    <div className="py-12 text-center text-gray-400">불러오는 중…</div>
  );
}

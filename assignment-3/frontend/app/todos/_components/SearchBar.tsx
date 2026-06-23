// 검색창 (Client Component)
// 검색어를 URL 파라미터(?search=)로 관리하고, 실제 검색은 서버(FastAPI LIKE 조회)가 한다.
// 디바운스: 입력이 멈춘 뒤 300ms 후에만 URL을 갱신해 매 글자마다 요청하지 않는다.
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 입력 중인 검색어. 초기값은 URL의 현재 검색어.
  const [value, setValue] = useState(searchParams.get("search") ?? "");

  useEffect(() => {
    const current = searchParams.get("search") ?? "";
    // 이미 URL에 반영된 값이면 아무것도 하지 않는다(불필요한 재요청·무한 루프 방지).
    if (value.trim() === current) return;

    const timer = setTimeout(() => {
      // 기존 쿼리(예: filter)는 유지한 채 search만 바꾼다.
      const params = new URLSearchParams(searchParams.toString());
      if (value.trim() === "") {
        params.delete("search");
      } else {
        params.set("search", value.trim());
      }
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    }, 300);

    // 다음 입력이 들어오면 이전 타이머를 취소(디바운스의 핵심).
    return () => clearTimeout(timer);
  }, [value, pathname, router, searchParams]);

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="할 일 내용 검색"
      className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
    />
  );
}

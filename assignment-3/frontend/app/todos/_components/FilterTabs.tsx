// 상태 필터 탭 (Client Component)
// 2차에서는 useState로 필터를 들고 있었지만, 여기서는 "URL 파라미터(?filter=)"로 관리한다.
// → 새로고침·뒤로가기·URL 공유에도 필터 상태가 유지되고, 실제 필터링은 서버(FastAPI)가 한다.
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { FilterValue } from "@/lib/types";

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "active", label: "진행 중" },
  { value: "completed", label: "완료" },
];

export default function FilterTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 현재 필터 값(URL에서 읽음). 잘못된 값이면 전체로 본다.
  const raw = searchParams.get("filter");
  const current: FilterValue =
    raw === "active" || raw === "completed" ? raw : "all";

  function handleClick(value: FilterValue) {
    // 기존 쿼리(예: search)는 유지한 채 filter만 바꾼다.
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("filter");
    } else {
      params.set("filter", value);
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div className="mb-4 flex gap-2">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          onClick={() => handleClick(f.value)}
          className={
            current === f.value
              ? "rounded-full bg-blue-500 px-3 py-1 text-sm text-white"
              : "rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600 transition hover:bg-gray-200"
          }
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

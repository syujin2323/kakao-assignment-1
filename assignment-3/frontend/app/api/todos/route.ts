// API Route (프록시) — 클라이언트의 "생성" 요청을 받아 FastAPI 백엔드로 전달한다.
// 클라이언트가 FastAPI(:8000)로 직접 가지 않고 이 같은 출처(/api)를 거치게 해서,
// 백엔드 주소 노출·CORS 처리를 Next 서버 한 곳에서 통제한다.
import { isAxiosError } from "axios";
import { NextResponse, type NextRequest } from "next/server";

import { backend } from "@/lib/backend";

// POST /api/todos → FastAPI POST /todos
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const res = await backend.post("/todos", body);
    return NextResponse.json(res.data, { status: 201 });
  } catch (error) {
    // 백엔드가 돌려준 에러(상태코드/메시지)를 그대로 클라이언트에 전달
    if (isAxiosError(error) && error.response) {
      return NextResponse.json(error.response.data, {
        status: error.response.status,
      });
    }
    // 백엔드 연결 실패 등 그 외 오류
    return NextResponse.json({ detail: "서버 오류" }, { status: 500 });
  }
}

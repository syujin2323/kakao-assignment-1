// API Route (프록시) — 특정 Todo의 "수정/삭제" 요청을 FastAPI로 전달한다.
// Next 16에서 동적 세그먼트 params는 Promise이므로 await로 꺼낸다.
import { isAxiosError } from "axios";
import { NextResponse, type NextRequest } from "next/server";

import { backend } from "@/lib/backend";

type Context = { params: Promise<{ todoId: string }> };

// PUT /api/todos/{id} → FastAPI PUT /todos/{id}
export async function PUT(request: NextRequest, ctx: Context) {
  const { todoId } = await ctx.params;
  try {
    const body = await request.json();
    const res = await backend.put(`/todos/${todoId}`, body);
    return NextResponse.json(res.data);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return NextResponse.json(error.response.data, {
        status: error.response.status,
      });
    }
    return NextResponse.json({ detail: "서버 오류" }, { status: 500 });
  }
}

// DELETE /api/todos/{id} → FastAPI DELETE /todos/{id}
export async function DELETE(_request: NextRequest, ctx: Context) {
  const { todoId } = await ctx.params;
  try {
    await backend.delete(`/todos/${todoId}`);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return NextResponse.json(error.response.data, {
        status: error.response.status,
      });
    }
    return NextResponse.json({ detail: "서버 오류" }, { status: 500 });
  }
}

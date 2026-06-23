// 서버 전용 — Next 서버(actions.ts / route.ts)에서 FastAPI 백엔드를 호출하는 axios 인스턴스.
// 이 모듈은 절대 Client Component에서 import하지 않는다(백엔드 주소를 브라우저에 노출하지 않기 위함).
import axios from "axios";

// 백엔드 주소는 서버 전용 환경변수(BACKEND_URL)에서 읽는다. (NEXT_PUBLIC_ 접두사 없음 → 브라우저에 노출 안 됨)
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

export const backend = axios.create({
  baseURL: BACKEND_URL,
});

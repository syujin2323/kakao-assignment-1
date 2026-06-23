import { redirect } from "next/navigation";

// 루트(/)는 곧바로 Todo 목록 페이지로 보낸다.
export default function Home() {
  redirect("/todos");
}

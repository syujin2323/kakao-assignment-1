# Todo 앱 마이그레이션 기획 문서
**1차 Vanilla JS → React 함수 컴포넌트**

---

## 0. 개요

- **목적:** 1차 과제의 Vanilla JS Todo 앱을, 화면과 기능은 그대로 유지한 채 React 함수 컴포넌트 구조로 마이그레이션한다.
- **스택:** React 19 (함수 컴포넌트 + 훅), Vite, Tailwind CSS v4, localStorage
- **핵심 원칙:** 새 기능을 추가하는 과제가 아니다. 동작 결과는 1차와 동일해야 하고, 바뀌는 것은 "코드 구조"뿐이다.
- **유일한 동작 변경:** 수정 UI를 `prompt()` → 인라인 입력창으로 (과제 요구 사항).
- **재사용 코드:** 1차의 순수 헬퍼(`formatDate`, `parseDate`, 필터 로직)는 그대로 가져온다.

---

## 1. 기능 인벤토리

1차 `app.js`가 이미 과제 요구 기능을 전부 갖고 있다. 과제 step과 매핑:

| 기능 | 설명 | 과제 step |
|------|------|-----------|
| 날짜별 뷰 | 현재 날짜 표시(`YYYY-MM-DD (요일)`), 이전/다음 이동, 선택 날짜의 Todo만 표시, 생성 시 선택 날짜 저장 | 4 |
| Todo 추가 | 입력창 + 추가 버튼, 빈 값이면 생성 차단 + 안내 메시지, 선택 날짜로 생성 | 2 |
| 완료 / 되돌리기 | 토글, 완료 시 취소선 표시 | 2 |
| 수정 | 인라인 입력창으로 수정 (1차의 `prompt()` 대체) | 2 |
| 삭제 | 확인(`confirm`) 후 삭제 | 2 |
| 상태 필터 | 전체 / 진행중 / 완료 탭, 선택 탭 강조, 탭 전환 후에도 유지 | 3 |
| localStorage | 모든 변경 시 저장, 새로고침 후 유지, JSON 직렬화 | 5 |

> 필터는 1차와 동일하게 **선택된 날짜 안에서** 상태 필터를 적용한다.

---

## 2. 데이터 모델

1차 모델을 그대로 유지한다.

```js
{
  id: number,         // Date.now()
  text: string,       // 할 일 내용
  completed: boolean, // 완료 여부
  date: string,       // "YYYY-MM-DD" (생성 시 선택된 날짜)
}
```

- `completed`(boolean) 기준 필터 매핑: **전체** = 전부 / **진행중** = `!completed` / **완료** = `completed`
- 상태를 3단계 enum으로 만들 필요 없음 — boolean으로 충분.

---

## 3. 컴포넌트 트리

```
App
├── DateNavigator   날짜 표시 + 이전/다음 이동
├── TodoInput       입력창 + 추가 버튼 + 에러 메시지
├── FilterTabs      전체/진행중/완료 탭
└── TodoList        목록 컨테이너
    └── TodoItem     할 일 한 개 (목록 개수만큼 반복)
```

- `TodoItem`의 버튼(완료/수정/삭제)은 따로 쪼개지 않는다 (과분할 방지).

---

## 4. 상태 설계

데이터 흐름 원칙: **데이터는 아래로(props), 이벤트는 위로(콜백). state를 바꾸는 것은 항상 App.**

### App이 갖는 state (`useState` 4개)

| state | 타입 | 역할 |
|-------|------|------|
| `todos` | `Todo[]` | 모든 할 일 배열 (진실의 원천) |
| `selectedDate` | `string` | 선택된 날짜 `"YYYY-MM-DD"` |
| `filter` | `"all" \| "active" \| "completed"` | 현재 필터 탭 |
| `editingId` | `number \| null` | 편집 중인 todo의 id (없으면 null) |

### 계산값 (state 아님 — 렌더 중 계산)

- `visibleTodos` — `todos`를 `selectedDate`로 거르고 `filter`로 거른 목록 (= 1차의 `getFilteredTodos`)
- 날짜 라벨(`2026-06-07 (토)`), 목록이 비었는지 여부

> **핵심 규칙:** 다른 state로 계산해낼 수 있는 값은 `useState`에 넣지 않는다. `visibleTodos`를 state에 저장하면 수동 동기화 버그가 생긴다. 렌더할 때마다 계산하면 `todos`/`selectedDate`/`filter` 중 하나만 바뀌어도 목록이 자동으로 맞춰진다.

### 컴포넌트가 자체적으로 갖는 로컬 state

- `TodoInput` — 입력 중인 텍스트 + 에러 메시지. 검증을 통과한 것만 `onAddTodo(text)`로 위에 올린다.
- `TodoItem` — 편집 중일 때 입력창에 타이핑되는 텍스트.

### App이 갖는 핸들러 (state 변경 로직)

| 핸들러 | 동작 |
|--------|------|
| `handleAddTodo(text)` | id/date/completed=false로 todo 생성 후 `todos`에 추가 |
| `handleToggle(id)` | 해당 todo의 `completed` 반전 |
| `handleDelete(id)` | 확인 후 `todos`에서 제거 |
| `handleStartEdit(id)` | `editingId`를 id로 |
| `handleSubmitEdit(id, text)` | 검증 후 해당 todo의 `text` 수정, `editingId`를 null로 |
| `handleCancelEdit()` | `editingId`를 null로 |
| `handleChangeFilter(f)` | `filter` 변경 |
| `handlePrevDay()` / `handleNextDay()` | `selectedDate`를 하루 이동 |

---

## 5. props / 이벤트 흐름

| 컴포넌트 | 받는 props (↓) | 올리는 콜백 (↑) |
|----------|----------------|-----------------|
| `DateNavigator` | `selectedDate` | `onPrevDay`, `onNextDay` |
| `TodoInput` | (없음 — 입력/검증을 로컬에서) | `onAddTodo(text)` |
| `FilterTabs` | `filter` | `onChangeFilter(next)` |
| `TodoList` | `visibleTodos`, `editingId` | (TodoItem 콜백들을 그대로 전달) |
| `TodoItem` | `todo`, `isEditing` (= `editingId === todo.id`) | `onToggle(id)`, `onStartEdit(id)`, `onSubmitEdit(id, text)`, `onCancelEdit()`, `onDelete(id)` |

---

## 6. 부수효과 — localStorage

1차에선 추가/수정/삭제/완료 함수마다 `saveTodos()`를 직접 호출했다. React에선 한 곳으로 모은다.

**불러오기 (시작 시 1회) — lazy 초기값:**

```jsx
const [todos, setTodos] = useState(() => {
  const saved = localStorage.getItem("todos");
  return saved ? JSON.parse(saved) : [];
});
```

> `useState(load())`가 아니라 `useState(() => load())`. 함수를 넘기면 첫 렌더에만 실행된다.

**저장하기 (todos 변경 시 자동) — `useEffect`:**

```jsx
useEffect(() => {
  localStorage.setItem("todos", JSON.stringify(todos));
}, [todos]);
```

- 의존성 배열 `[todos]` = "`todos`가 바뀔 때마다 실행". 추가·수정·완료·삭제 어떤 경로든 `todos`만 바뀌면 자동 저장된다.
- 저장 대상은 `todos`만. `selectedDate`/`filter`는 새로고침 시 초기화 (1차와 동일, 과제 요구도 todos만).

---

## 7. 마이그레이션 순서 (구현 체크리스트)

화면에 뭔가 뜨는 것부터 시작해서 기능을 하나씩 얹는다. 각 단계가 독립적으로 동작하므로 디버깅이 쉽다.

1. **빈 껍데기** — 컴포넌트 파일 5개 + App 생성, 가짜 데이터로 UI만 Tailwind로 렌더 (state 없음)
2. **Read** — `todos` state 추가 → TodoList가 목록 렌더 *(step 2)*
3. **Create** — TodoInput + `onAddTodo` + 빈 값 검증 *(step 2)*
4. **완료 / 삭제** — `onToggle`, `onDelete` *(step 2)*
5. **인라인 수정** — `editingId` + `onStartEdit`/`onSubmitEdit` (`prompt` 대체) *(step 2)*
6. **필터** — FilterTabs + `visibleTodos` 계산값 *(step 3)*
7. **날짜 뷰** — DateNavigator + `selectedDate` *(step 4)*
8. **localStorage** — lazy 초기값 + `useEffect` *(step 5)*
9. **마무리** — 과제의 각 "확인 포인트" 점검, 리팩토링 토론

---

## 8. 파일 구조 (목표)

```
assignment-2/
└── src/
    ├── App.jsx
    ├── index.css            # @import "tailwindcss";
    ├── main.jsx
    ├── components/
    │   ├── DateNavigator.jsx
    │   ├── TodoInput.jsx
    │   ├── FilterTabs.jsx
    │   ├── TodoList.jsx
    │   └── TodoItem.jsx
    └── utils/
        └── date.js          # formatDate, parseDate (1차에서 이식)
```
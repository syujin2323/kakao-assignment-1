const todoInput = document.getElementById("todo-input");
const addButton = document.getElementById("add-button");
const todoList = document.getElementById("todo-list");
const message = document.getElementById("message");
const filterTabs = document.querySelectorAll(".filter-tab");
const prevDayButton = document.getElementById("prev-day");
const nextDayButton = document.getElementById("next-day");
const currentDateElement = document.getElementById("current-date");

// ===== 날짜 도우미 함수 =====
// Date 객체 → "YYYY-MM-DD" 문자열
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// "YYYY-MM-DD" 문자열 → Date 객체 (로컬 시간 기준, 날짜 밀림 방지)
function parseDate(dateString) {
  const parts = dateString.split("-"); // ["2026", "06", "02"]
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  return new Date(year, month - 1, day);
}

// ===== 로컬스토리지 저장 / 불러오기 =====
function saveTodos() {
  // 배열을 JSON 문자열로 바꿔서 저장
  localStorage.setItem("todos", JSON.stringify(todos));
}

function loadTodos() {
  // 저장된 문자열을 꺼내 배열로 되돌림 (저장된 게 없으면 빈 배열)
  const saved = localStorage.getItem("todos");
  return saved ? JSON.parse(saved) : [];
}

// ===== 상태 =====
let todos = loadTodos();
let currentFilter = "all";
let selectedDate = formatDate(new Date()); // 처음엔 오늘 날짜 나오게?

// ===== 현재 날짜 + 필터에 맞는 할 일만 골라내기 =====
function getFilteredTodos() {
  // (1) 먼저 선택된 날짜의 할 일만
  let result = todos.filter(function (todo) {
    return todo.date === selectedDate;
  });

  // (2) 그 다음 상태 필터 적용
  if (currentFilter === "active") {
    result = result.filter(function (todo) {
      return !todo.completed;
    });
  } else if (currentFilter === "completed") {
    result = result.filter(function (todo) {
      return todo.completed;
    });
  }

  return result;
}

// ===== 날짜 표시 그리기 =====
function renderDate() {
  const date = parseDate(selectedDate);
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  // 예: "2026-06-02 (월)"
  currentDateElement.textContent = `${selectedDate} (${dayNames[date.getDay()]})`;
}

// ===== 날짜 이동 =====
function changeDate(offset) {
  const date = parseDate(selectedDate);
  date.setDate(date.getDate() + offset); // 하루 더하거나 빼기
  selectedDate = formatDate(date);
  renderDate();
  renderTodos();
}

// ===== 할 일 목록 그리기 =====
function renderTodos() {
  todoList.innerHTML = "";

  const visibleTodos = getFilteredTodos();

  if (visibleTodos.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.className = "empty-message";
    emptyMessage.textContent = "표시할 할 일이 없어요.";
    todoList.appendChild(emptyMessage);
    return;
  }

  visibleTodos.forEach(function (todo) {
    const li = document.createElement("li");
    li.className = "todo-item";
    if (todo.completed) {
      li.classList.add("completed");
    }

    const span = document.createElement("span");
    span.className = "todo-text";
    span.textContent = todo.text;

    const completeButton = document.createElement("button");
    completeButton.className = "complete-button";
    completeButton.textContent = todo.completed ? "되돌리기" : "완료";
    completeButton.addEventListener("click", function () {
      toggleComplete(todo.id);
    });

    const editButton = document.createElement("button");
    editButton.className = "edit-button";
    editButton.textContent = "수정";
    editButton.addEventListener("click", function () {
      editTodo(todo.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.textContent = "삭제";
    deleteButton.addEventListener("click", function () {
      deleteTodo(todo.id);
    });

    const buttonGroup = document.createElement("div");
    buttonGroup.className = "button-group";
    buttonGroup.appendChild(completeButton);
    buttonGroup.appendChild(editButton);
    buttonGroup.appendChild(deleteButton);

    li.appendChild(span);
    li.appendChild(buttonGroup);
    todoList.appendChild(li);
  });
}

function addTodo() {
  const text = todoInput.value.trim();
  if (text === "") {
    message.textContent = "할 일을 입력해주세요.";
    return;
  }
  message.textContent = "";
  todos.push({
    id: Date.now(),
    text: text,
    completed: false,
    date: selectedDate,
  });
  todoInput.value = "";
  saveTodos();
  renderTodos();
}

function toggleComplete(id) {
  const target = todos.find(function (todo) {
    return todo.id === id;
  });
  target.completed = !target.completed;
  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  if (!confirm("정말 삭제할까요?")) return; // 취소를 누르면 여기서 멈추도록 삭제 안하게

  todos = todos.filter(function (todo) {
    return todo.id !== id;
  });
  saveTodos();
  renderTodos();
}

function editTodo(id) {
  const target = todos.find(function (todo) {
    return todo.id === id;
  });
  const newText = prompt("할 일을 수정하세요.", target.text);
  if (newText === null || newText.trim() === "") {
    return;
  }
  target.text = newText.trim();
  saveTodos();
  renderTodos();
}

// ===== 이벤트 연결 =====
addButton.addEventListener("click", addTodo);

filterTabs.forEach(function (tab) {
  tab.addEventListener("click", function () {
    currentFilter = tab.dataset.filter;
    filterTabs.forEach(function (eachTab) {
      eachTab.classList.remove("active");
    });
    tab.classList.add("active");
    renderTodos();
  });
});

// 이전/다음 날짜 버튼
prevDayButton.addEventListener("click", function () {
  changeDate(-1); // 하루 전
});
nextDayButton.addEventListener("click", function () {
  changeDate(1); // 하루 후
});

renderDate();
renderTodos();
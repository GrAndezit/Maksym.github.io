const input = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");

function createTodo(text) {
    const item = document.createElement("div");
    item.className = "todo-item";

    const left = document.createElement("div");
    left.className = "todo-left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    const span = document.createElement("span");
    span.textContent = text;

    left.appendChild(checkbox);
    left.appendChild(span);

    const delBtn = document.createElement("button");
    delBtn.className = "delete-btn";
    delBtn.innerHTML = "&times;";

    item.appendChild(left);
    item.appendChild(delBtn);

    checkbox.addEventListener("change", () => {
    item.classList.toggle("completed", checkbox.checked);
    });

    delBtn.addEventListener("click", () => {
    todoList.removeChild(item);
    });

    todoList.appendChild(item);
}

function handleAdd() {
    const text = input.value.trim();
    if (!text) return;
    createTodo(text);
    input.value = "";
    input.focus();
}

addBtn.addEventListener("click", handleAdd);

input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
    handleAdd();
    }
});
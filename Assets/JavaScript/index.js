let todoItemsContainer = document.getElementById("todoItemsContainer");
let addTodoButton = document.getElementById("addTodoButton");
let saveEditButton = document.getElementById("saveEditButton");
let userInputElement = document.getElementById("todoUserInput");

function getTodoListFromLocalStorage() {
    let stringifiedTodoList = localStorage.getItem("todoList");
    return stringifiedTodoList ? JSON.parse(stringifiedTodoList) : [];
}

let todoList = getTodoListFromLocalStorage();
let todosCount = todoList.length;

function saveTodoListToLocalStorage() {
    localStorage.setItem("todoList", JSON.stringify(todoList));
}

function onAddTodo() {
    let userInputElement = document.getElementById("todoUserInput");
    let userInputValue = userInputElement.value.trim();

    if (userInputValue === "") {
        alert("Enter valid text");
        return;
    }

    let newTodo = {
        text: userInputValue,
        uniqueNo: ++todosCount,
        isChecked: false
    };

    if (!todoList.some(todo => todo.text === newTodo.text)) {
        todoList.push(newTodo);
        createAndAppendTodo(newTodo);
    } else {
        alert("This todo item already exists.");
    }

    userInputElement.value = "";
    saveTodoListToLocalStorage();
}

addTodoButton.addEventListener('click', onAddTodo);

function onTodoStatusChange(checkboxId, labelId, todoId) {
    let checkboxElement = document.getElementById(checkboxId);
    let labelElement = document.getElementById(labelId);
    labelElement.classList.toggle('checked');
    
    let todoIndex = todoList.findIndex(todo => `todo${todo.uniqueNo}` === todoId);
    todoList[todoIndex].isChecked = !todoList[todoIndex].isChecked;
    saveTodoListToLocalStorage();
}

function onDeleteTodo(todoId) {
    let todoElement = document.getElementById(todoId);
    todoItemsContainer.removeChild(todoElement);

    let todoIndex = todoList.findIndex(todo => `todo${todo.uniqueNo}` === todoId);
    todoList.splice(todoIndex, 1);
    saveTodoListToLocalStorage();
}

function onEditTodo(todoId) {
    let todoIndex = todoList.findIndex(todo => `todo${todo.uniqueNo}` === todoId);
    let todoObject = todoList[todoIndex];
    userInputElement.value = todoObject.text;
    saveEditButton.style.display = "inline";
    
    saveEditButton.onclick = function() {
        todoObject.text = userInputElement.value.trim();
        saveTodoListToLocalStorage();
        todoItemsContainer.innerHTML = "";
        todoList.forEach(createAndAppendTodo);
        userInputElement.value = "";
        saveEditButton.style.display = "none";
    };
}

function createAndAppendTodo(todo) {
    let todoId = `todo${todo.uniqueNo}`;
    let checkboxId = `checkbox${todo.uniqueNo}`;
    let labelId = `label${todo.uniqueNo}`;

    let todoElement = document.createElement("li");
    todoElement.classList.add("todo-item-container", "d-flex", "flex-row");
    todoElement.id = todoId;
    todoItemsContainer.appendChild(todoElement);

    let inputElement = document.createElement("input");
    inputElement.type = "checkbox";
    inputElement.id = checkboxId;
    inputElement.checked = todo.isChecked;
    inputElement.classList.add("checkbox-input");
    inputElement.addEventListener('click', () => onTodoStatusChange(checkboxId, labelId, todoId));
    todoElement.appendChild(inputElement);

    let labelContainer = document.createElement("div");
    labelContainer.classList.add("label-container", "d-flex", "flex-row");
    todoElement.appendChild(labelContainer);

    let labelElement = document.createElement("label");
    labelElement.setAttribute("for", checkboxId);
    labelElement.id = labelId;
    labelElement.classList.add("checkbox-label");
    labelElement.textContent = todo.text;
    if (todo.isChecked) {
        labelElement.classList.add("checked");
    }
    labelContainer.appendChild(labelElement);

    let editIconContainer = document.createElement("div");
    editIconContainer.classList.add("edit-icon-container");
    labelContainer.appendChild(editIconContainer);

    let editIcon = document.createElement("i");
    editIcon.classList.add("bi", "bi-pen", "edit-icon");
    editIcon.addEventListener('click', () => onEditTodo(todoId));
    editIconContainer.appendChild(editIcon);

    let deleteIconContainer = document.createElement("div");
    deleteIconContainer.classList.add("delete-icon-container");
    labelContainer.appendChild(deleteIconContainer);

    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("far", "fa-trash-alt", "delete-icon");
    deleteIcon.addEventListener('click', () => onDeleteTodo(todoId));
    deleteIconContainer.appendChild(deleteIcon);
}

for (let todo of todoList) {
    createAndAppendTodo(todo);
}

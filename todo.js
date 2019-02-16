const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListeners();

function eventListeners(){ 
    form.addEventListener("submit", addTodo);
    document.addEventListener("DOMContentLoaded", loadAllTodosToUI); 
    secondCardBody.addEventListener("click", deleteTodo); 
    filter.addEventListener("keyup",filterTodos);
    clearButton.addEventListener("click", clearAllTodos);
}

function clearAllTodos(){

    if (confirm("Are you sure you want to delete all items?")){
        // delete items from storage
        while(todoList.firstElementChild != null) { // faster than innetHTML
            todoList.removeChild(todoList.firstElementChild);
        }
        localStorage.removeItem("todos");
        
    }

}

function filterTodos(e) {

    const filterValue = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll(".list-group-item");

    listItems.forEach(function(listItem){
        const text = listItem.textContent.toLowerCase();
        if(text.indexOf(filterValue) === -1){
            // not found
            
            listItem.setAttribute("style", "display : none !important");
        }
        else {
            listItem.setAttribute("style", "display : block");
        }


    });

}

function deleteTodo(e){
    
    if (e.target.className === "fa fa-remove") {
        e.target.parentElement.parentElement.remove();
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
        showAlert("success", "to do başarıyla silindi");

    }
}

function deleteTodoFromStorage(deletetodo) {
    let todos = getTodosFromStorage();

    todos.forEach(function(todo, index){
        if (todo === deletetodo){
            todos.splice(index,1); // delete items from array
        }
    });

    localStorage.setItem("todos", JSON.stringify(todos));
}

function loadAllTodosToUI(){
    let todos = getTodosFromStorage();

    todos.forEach(function(todo){
    addTodoToUI(todo);
    })
}

function control(newTodo) {
    const Storage = getTodosFromStorage();

    for( let key of Storage) {
        if (key === newTodo) {
            return false;
        }
    }
}
function addTodo(e){
    const newTodo = todoInput.value.trim();
 
    if (newTodo === "") {
        
        showAlert("danger","Please enter an item");
    }
    else if (control(newTodo) == false) {
        showAlert("danger", "This item is already exist");
        todoInput.value = "";

    }
    else {
        addTodoToUI(newTodo); 
        addTodoToStorage(newTodo);

        showAlert("success","This item added successfully");
    }
    e.preventDefault();

}
function getTodosFromStorage() { // get all todo items from storage
    let todos;

    if (localStorage.getItem("todos") === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
}

function addTodoToStorage(newTodo) {
    let todos = getTodosFromStorage();

    todos.push(newTodo);

    localStorage.setItem("todos", JSON.stringify(todos));
    

}

function showAlert(type, message) {
    const alert = document.createElement("div");

    alert.className = `alert alert-${type}`;

    alert.textContent = message;

    firstCardBody.appendChild(alert);

    setTimeout(function(){
        alert.remove();
    },1000);

}

function addTodoToUI(newTodo) { // add strings as a list item to UI

    // create list item
    const listItem = document.createElement("li");
    // create link
    const link = document.createElement("a");
    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class = 'fa fa-remove'></i>";

    listItem.className = "list-group-item d-flex justify-content-between";
    // add text node 

    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link);

    // add list items to the todo list

    todoList.appendChild(listItem);
    todoInput.value = "";

    
}

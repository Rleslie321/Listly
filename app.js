// Robert Leslie

// selecting various items ahead of time
let parentList = document.querySelector(".lists");
let lists = document.querySelectorAll(".list");
var item_btn = document.querySelector("#item-enter");
var item = document.getElementById("item");
var amount = document.getElementById('amount');
var cost = document.getElementById('cost');
var item_warning = document.querySelector("#item-warning");
var select = document.getElementById("department");
var category = document.querySelector("#category");
var cat_warning = document.querySelector("#cat-warning");
var cat_btn = document.querySelector("#cat-enter");

var sum = 0.00;
var total = document.querySelector('#total');

var delete_btn = document.querySelector("#delete-ico");
var edit_btn = document.querySelector("#edit-ico");
var deleting = false;
var editing = false;



// handling form submission for adding an item to the lists, validates form by changing the colors, and submits when ready
item_btn.addEventListener("click", (e) => {
    let warning = "Please fill out all fields";
    let cost_check = cost.value.match(/[^.\d]/);
    let item_len = item.value.length > 30;
    let amount_len = amount.value.length > 10;
    e.preventDefault();
    if (item.value == "" || item_len) {
        item.classList.add("border-red");
        if (item_len) {
            warning = "Item length must be under 30 characters"
        }
    } else if (item.classList.contains("border-red")) {
        item.classList.remove("border-red");
    }
    if (cost.value == "" || cost_check) {
        cost.classList.add("border-red");
        if (cost_check) {
            warning = "Please only enter numbers, including decimals"
        }
    } else if (cost.classList.contains("border-red")) {
        cost.classList.remove("border-red");
    }
    if (amount.value == "" || amount_len) {
        amount.classList.add("border-red");
        if (amount_len) {
            warning = "Amount length must be under 10 characters"
        }
    } else if (amount.classList.contains("border-red")) {
        amount.classList.remove("border-red");
    }
    // checks if the fields are empty, if they are under the recommended length, and if they are numeric
    if (item.value != "" && cost.value != "" && amount.value != "" && !cost_check && !item_len && !amount_len) {
        let selected = select.value;
        let value = item.value.charAt(0).toUpperCase() + item.value.slice(1);
        lists.forEach((listItem) => {
            if (listItem.children[0].textContent == selected) {
                listItem.children[1].innerHTML += `<li>${value} ${amount.value} \$${cost.value}</li>`
            }
        });
        sum += parseFloat(cost.value);
        total.textContent = `$${(Math.round(sum * 100) / 100).toFixed(2)}`;
        item.value = "";
        amount.value = "";
        cost.value = "";
    } else {
        item_warning.textContent = warning;
        setTimeout(() => {
            item_warning.textContent = "";
        }, 3000);
    }
});

// adding an event listener for when the screen is very small to collapse the list items
// it adds it to the parent element so that I can add and remove items
parentList.addEventListener('click', (e) => {
    let target = "none";
    if (e.target.parentElement.classList.contains("list")) {
        target = e.target.parentElement;
    } else if (e.target.parentElement.parentElement.classList.contains("list")) {
        if (e.target.classList.contains("fa-window-minimize")) {
            target = e.target.parentElement.parentElement;
        }
        // else condition is for when someone clicks on the x button, it will remove that category from the list
        else {
            if (confirm("Are you sure you want to delete this category?")) {
                let currValue = e.target.parentElement.textContent;
                let oldChild = null;
                e.target.parentElement.parentElement.remove(e.target.parentElement);
                for (child of select.children) {
                    if (currValue.trim() == child.value) {
                        oldChild = child;
                    }
                }
                select.removeChild(oldChild);
            }
        }
    }
    if (target != "none") {
        if (target.children[1].classList.contains("open")) {
            target.children[1].classList.remove('open');
        } else {
            target.children[1].classList.add('open');
        }
    }

});

// handle form submission for category button, checks if valid input, then calls addnewcategory if all clear
cat_btn.addEventListener('click', (e) => {
    e.preventDefault();
    if (category.value == "") {
        cat_warning.textContent = "Please enter a valid category";
        category.classList.add("border-red");
        setTimeout(() => {
            cat_warning.textContent = "";
            category.classList.remove("border-red");
        }, 3000);
    } else {
        addNewCategory(category.value);
        category.value = "";
    }
});

// function to add a new category to the list, also adds another option to the select feature from the item form
function addNewCategory(department) {
    parentList.innerHTML += `<div class="list"><h3>${department}<i class="far fa-window-minimize fa-xs"></i><i id="close" class="far fa-window-close"></i></h3><ul></ul></div>`;
    select.innerHTML += `<option value="${department}">${department}</option>`;
    lists = document.querySelectorAll(".list");
}

delete_btn.addEventListener('click', (e) => {
    if (!deleting) {
        delete_btn.innerHTML = `Done? <i class="fas fa-trash"></i>`
        e.preventDefault();
        lists.forEach((listItem) => {
            let h3 = listItem.children[0];
            h3.children[1].classList.add("show");
        });
        deleting = true;
    }else{
        delete_btn.innerHTML = `Delete <i class="fas fa-trash"></i>`
        e.preventDefault();
        lists.forEach((listItem) => {
            let h3 = listItem.children[0];
            h3.children[1].classList.remove("show");
        });
        deleting = false;
    }

});

edit_btn.addEventListener('click', (e) => {
    e.preventDefault();
});
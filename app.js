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
var category_sum = [];

var delete_btn = document.querySelector("#delete-ico");
var edit_btn = document.querySelector("#edit-ico");
var deleting = false;
var editing = false;
var layout = document.querySelector('#layout');
var cat_edit = null;
var cat_edit_btn = document.querySelector('#cat-edit-btn');
var cat_edit_warning = document.querySelector('#cat-edit-warning');
var item_edit = null;
var item_edit_parent = null;
var item_edit_btn = document.querySelector('#item-edit-btn');
var item_edit_warning = document.querySelector('#item-edit-warning');
var item_edit_cost = 0;
var item_edit_category = null;

window.onload = setup();

// function to setup the category_sum array with the default values or allow us to change if we choose a different layout (will add layouts later)
function setup(categories = ["Produce", "Grocery", "Meat", "Dairy", "Frozen", "Pet"]){
    for(cat of categories){
        var obj = {category:cat, sum:0}
        category_sum.push(obj);
    }
}

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
    if (amount_len) {
        amount.classList.add("border-red");
        warning = "Amount length must be under 10 characters"
        
    } else if (amount.classList.contains("border-red")) {
        amount.classList.remove("border-red");
    }
    // checks if the fields are empty, if they are under the recommended length, and if they are numeric
    if (item.value != "" && cost.value != "" && !cost_check && !item_len && !amount_len) {
        let selected = select.value.trim();
        let value = item.value.charAt(0).toUpperCase() + item.value.slice(1);
        lists.forEach((listItem) => {
            if (listItem.children[0].textContent.trim() == selected) {
                if(amount.value != ""){
                    listItem.children[1].innerHTML += `<li><strong>${value}</strong> (${amount.value}) \$${(Math.round(parseFloat(cost.value) * 100) / 100).toFixed(2)} <i id="close" class="fas fa-times-circle"></i><i id="edit" class="fas fa-pen"></i></li>`
                }else{
                    listItem.children[1].innerHTML += `<li><strong>${value}</strong> \$${(Math.round(parseFloat(cost.value) * 100) / 100).toFixed(2)} <i id="close" class="fas fa-times-circle"></i><i id="edit" class="fas fa-pen"></i></li>`
                }
            }
        });
        sum += parseFloat(cost.value);
        //update the value in category sum so we can delete it later
        category_sum.forEach((cat)=>{
            if(cat.category == selected){
                cat.sum += (Math.round(parseFloat(cost.value) * 100) / 100);
            }
        });
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
    if(editing){
        edit_remove();
    }
    if(deleting){
        delete_remove();
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
        // else if condition is for when someone clicks on the x button, it will remove that category from the list
        else if (e.target.classList.contains('fa-window-close')){
            if (confirm("Are you sure you want to delete this category?")) {
                let currValue = e.target.parentElement.textContent;
                let oldChild = null;
                e.target.parentElement.parentElement.remove(e.target.parentElement);
                for (child of select.children) {
                    if (currValue.trim() == child.value) {
                        oldChild = child;
                    }
                }
                let i = -1;
                category_sum.forEach((cat)=>{
                    if(cat.category == oldChild.value){
                        sum -= cat.sum;
                        total.textContent = `$${(Math.round((sum) * 100) / 100).toFixed(2)}`;
                        i = category_sum.indexOf(cat);
                    }
                });
                category_sum.splice(i, 1);
                console.log(category_sum);
                select.removeChild(oldChild);
                for(child of $('#department-edit')[0].children){
                    if (currValue.trim() == child.value) {
                        oldChild = child;
                    }
                }
                $('#department-edit')[0].removeChild(oldChild);
            }
        }
        // else if condition for when someone clicks on the edit button, it will edit the name of the category
        else if (e.target.classList.contains('fa-edit')){
            $('#categoryEditor').modal('toggle');
            cat_edit = e.target.parentElement;
            $('#category-edit')[0].value = `${cat_edit.textContent.trim()}`;
        }
    }
    // else if condition for when someone clicks on the delete button of one of the list items
    else if (e.target.classList.contains('fa-times-circle')){
        let deletedItem = e.target.parentElement;
        let deletedValue = deletedItem.innerHTML;
        let dolladollabillyall = deletedValue.indexOf('$');
        deletedValue = parseFloat(deletedValue.slice(dolladollabillyall+1, deletedValue.indexOf(' ',dolladollabillyall)));
        sum -= deletedValue;
        total.textContent = `$${(Math.round(sum * 100) / 100).toFixed(2)}`;
        let category = deletedItem.parentElement.previousElementSibling.textContent.trim()
        category_sum.forEach((item)=>{
            if(item.category == category){
                item.sum -= deletedValue;
            }
        });
        deletedItem.parentElement.removeChild(deletedItem);
    }
    // else if condition for when someone clicks on the edit button on one of the list items
    else if(e.target.classList.contains('fa-pen')){
        $('#item-editor').modal('toggle');
        item_edit = e.target.parentElement;
        item_edit_parent = item_edit.parentElement;
        item_edit_category = item_edit_parent.previousElementSibling.textContent.trim();
        let currVals = item_edit.textContent;
        let leftParen = currVals.indexOf('(');
        let rightParen = currVals.indexOf(')');
        let dollar = currVals.indexOf('$');
        if(leftParen != -1){
            $('#item-edit')[0].value = currVals.slice(0,leftParen).trim();
            $('#amount-edit')[0].value = currVals.slice(leftParen+1,rightParen).trim();
            item_edit_cost = currVals.slice(dollar+1).trim();
            $('#cost-edit')[0].value = item_edit_cost;
        }else{
            $('#item-edit')[0].value = currVals.slice(0, dollar).trim();
            $('#amount-edit')[0].value = "";
            item_edit_cost = currVals.slice(dollar+1).trim();
            $('#cost-edit')[0].value = item_edit_cost;
        }
        $('#department-edit').val(item_edit.parentElement.previousElementSibling.textContent.trim());
    }
    if (target != "none") {
        if (target.children[1].classList.contains("open")) {
            target.children[1].classList.remove('open');
        } else {
            target.children[1].classList.add('open');
        }
    }

});

// handle form submission for category button, checks if valid input, then checks if it has already been added, then calls addnewcategory if all clear
// if we are still editing or deleting then we simply remove the icons
cat_btn.addEventListener('click', (e) => {
    e.preventDefault();
    if (category.value == "") {
        cat_warning.textContent = "Please enter a valid category";
        category.classList.add("border-red");
        setTimeout(() => {
            cat_warning.textContent = "";
            category.classList.remove("border-red");
        }, 3000);
    }else if(checkCategory(category.value.charAt(0).toUpperCase() + category.value.slice(1))){
        cat_warning.textContent = "Category already exists";
        category.classList.add("border-red");
        setTimeout(() => {
            cat_warning.textContent = "";
            category.classList.remove("border-red");
        }, 3000);
    } 
    else {
        addNewCategory((category.value.charAt(0).toUpperCase() + category.value.slice(1)).trim());
        category.value = "";
    }
    if(editing){
        edit_remove();
    }
    if(deleting){
        delete_remove();
    }
});

// function to add a new category to the list, also adds another option to the select feature from the item form, and adds the category to the category sum array
function addNewCategory(department) {
    let newElement = document.createElement('div');
    newElement.classList.add('list');
    newElement.innerHTML = `<h3>${department}<i class="far fa-window-minimize fa-xs"></i><i id="close" class="far fa-window-close"></i><i class="fas fa-edit" id="edit"></i></h3><ul></ul>`;
    parentList.appendChild(newElement); //+= `<div class="list"></div>`;
    newElement = document.createElement('option');
    newElement.value = department;
    newElement.innerHTML = department;
    let newElement2 = document.createElement('option');
    newElement2.value = department;
    newElement2.innerHTML = department;
    select.appendChild(newElement);
    $('#department-edit')[0].appendChild(newElement2);
    lists = document.querySelectorAll(".list");
    category_sum.push({category:department, sum:0});
}

// function to check if a category has already been added, it does so by checking against every category added to the category sum array
function checkCategory(category){
    let exists = false;
    category_sum.forEach((item)=>{
        if(item.category == category){
            exists = true;
        }
    });
    return exists;
}

//event listener to either add the delete buttons to each list or remove them, will also remove the edit buttons if they are active
delete_btn.addEventListener('click', (e) => {
    e.preventDefault();
    if(editing){
        edit_remove();
    }
    if (!deleting) {
        delete_btn.innerHTML = `Done? <i class="fas fa-trash"></i>`;
        lists.forEach((listItem) => {
            let h3 = listItem.children[0];
            h3.children[1].classList.add("showIco");
        });
        icon_helper(".fa-times-circle")
        deleting = true;
    }else{
        delete_remove();
    }

});

//event listener to either add the edit buttons to each list or remove them, will also remove the delete buttons if they are active
edit_btn.addEventListener('click', (e) => {
    e.preventDefault();
    if(deleting){
        delete_remove();
    }
    if(!editing){
        edit_btn.innerHTML = `Done? <i class="fas fa-edit" id="edit"></i>`
        lists.forEach((listItem) => {
            let h3 = listItem.children[0];
            h3.children[2].classList.add("showIco");
        });
        icon_helper(".fa-pen");
        editing = true;
    }else{
        edit_remove();
    }
});

// function to remove the delete buttons from each list
function delete_remove(){
    delete_btn.innerHTML = `Delete <i class="fas fa-trash"></i>`
    lists.forEach((listItem) => {
        let h3 = listItem.children[0];
        h3.children[1].classList.remove("showIco");
        icon_helper(".fa-times-circle", false)
    });

    deleting = false;
}

//function to remove the edit buttons from each list
function edit_remove(){
    edit_btn.innerHTML = `Edit <i class="fas fa-edit" id="edit"></i>`
    lists.forEach((listItem) => {
        let h3 = listItem.children[0];
        h3.children[2].classList.remove("showIco");
    });
    icon_helper(".fa-pen", false);
    editing = false;
}

// helper method to showIco or remove the icon to each list item
function icon_helper(classname, showIco=true){
    document.querySelectorAll(classname).forEach((item)=>{
        if(showIco){
            item.classList.add("showIco");
        }else{
            item.classList.remove("showIco");
        }
    });
}

// change event listener for when someone selects a new layout from the select in the toolbar
//it deletes the children from the lists div, and removes the department select children, then it
//calls layout editor with the proper array per the selection
layout.addEventListener('change', (e)=>{
    while(parentList.firstChild){
        parentList.removeChild(parentList.firstChild);
    }
    while(select.firstChild){
        select.removeChild(select.firstChild);
    }
    if(e.target.value == 'default'){
        layout_editor(["Produce", "Grocery", "Meat", "Dairy", "Frozen", "Pet"]);
    }else if (e.target.value == 'Grocery Store'){
        layout_editor(["Produce", "Coffee/Cereal", "Baking", "Canned Goods", "International", "Bread/snacks", "Chips", "Meat", "Dairy", "Frozen"]);
    }
});

//helper function for calling setup for the sum array, then adds each category from the given array
function layout_editor(array){
    setup(array);
    array.forEach((item)=>{
        addNewCategory(item);
    });
}

// event listener for when someone clicks on the enter button in the category-edit modal
// checks if the input is empty, then checks if the category already exists
// if it passes this criteria then the category is edited and the modal is closed
cat_edit_btn.addEventListener('click', (e)=>{
    e.preventDefault();
    let attemptedCat = $('#category-edit')[0];
    if (attemptedCat.value == "") {
        cat_edit_warning.textContent = "Please enter a valid category";
        attemptedCat.classList.add("border-red");
        setTimeout(() => {
            cat_edit_warning.textContent = "";
            attemptedCat.classList.remove("border-red");
        }, 3000);
    }else if(checkCategory(attemptedCat.value.charAt(0).toUpperCase() + attemptedCat.value.slice(1))){
        cat_edit_warning.textContent = "Category already exists";
        attemptedCat.classList.add("border-red");
        setTimeout(() => {
            cat_edit_warning.textContent = "";
            attemptedCat.classList.remove("border-red");
        }, 3000);
    }else{
        let oldVal = cat_edit.textContent.trim();
        cat_edit.innerHTML = `${attemptedCat.value}<i class="far fa-window-minimize fa-xs place"></i><i id="close" class="far fa-window-close"></i><i class="fas fa-edit showIco" id="edit"></i>`
        Array.from(select.children).forEach((item)=>{
            console.log(item.value);
            if(oldVal == item.value){
                item.value = attemptedCat.value;
                item.innerHTML = attemptedCat.value;
            }
        });
        Array.from($('#department-edit')[0].children).forEach((item)=>{
            console.log(item.value);
            if(oldVal == item.value){
                item.value = attemptedCat.value;
                item.innerHTML = attemptedCat.value;
            }
        });
        $('#categoryEditor').modal('toggle');
    }
});
// preventing form submission from when someone hits enter while the modal is open
$('#category-edit-form').on('submit', (e)=>{
    e.preventDefault();
});


// event listener for when someone clicks the enter button on the item edit modal
// it validates the input, then adds it to the proper list depending on if it has an amount value
// then it updates the total on screen
item_edit_btn.addEventListener('click', (e)=>{
    let attemptedItem = $('#item-edit')[0];
    let attemptedAmount = $('#amount-edit')[0];
    let attemptedCost = $('#cost-edit')[0];
    let warning = "Please fill out all fields";
    let cost_check = attemptedCost.value.match(/[^.\d]/);
    let item_len = attemptedItem.value.length > 30;
    let amount_len = attemptedAmount.value.length > 10;
    e.preventDefault();
    if (attemptedItem.value == "" || item_len) {
        attemptedItem.classList.add("border-red");
        if (item_len) {
            warning = "Item length must be under 30 characters"
        }
    } else if (attemptedItem.classList.contains("border-red")) {
        attemptedItem.classList.remove("border-red");
    }
    if (attemptedCost.value == "" || cost_check) {
        attemptedCost.classList.add("border-red");
        if (cost_check) {
            warning = "Please only enter numbers, including decimals"
        }
    } else if (attemptedCost.classList.contains("border-red")) {
        attemptedCost.classList.remove("border-red");
    }
    if (amount_len) {
        attemptedAmount.classList.add("border-red");
        warning = "Amount length must be under 10 characters"
        
    } else if (attemptedAmount.classList.contains("border-red")) {
        attemptedAmount.classList.remove("border-red");
    }
    // checks if the fields are empty, if they are under the recommended length, and if they are numeric
    if (attemptedItem.value != "" && attemptedCost.value != "" && !cost_check && !item_len && !amount_len) {
        sum -= parseFloat(item_edit_cost);
        item_edit_parent.removeChild(item_edit);
        let selected = $('#department-edit')[0].value.trim();
        let value = attemptedItem.value.charAt(0).toUpperCase() + attemptedItem.value.slice(1);
        lists.forEach((listItem) => {
            if (listItem.children[0].textContent.trim() == selected) {
                if(attemptedAmount.value != ""){
                    listItem.children[1].innerHTML += `<li><strong>${value}</strong> (${attemptedAmount.value}) \$${(Math.round(parseFloat(attemptedCost.value) * 100) / 100).toFixed(2)} <i id="close" class="fas fa-times-circle"></i><i id="edit" class="fas fa-pen showIco"></i></li>`
                }else{
                    listItem.children[1].innerHTML += `<li><strong>${value}</strong> \$${(Math.round(parseFloat(attemptedCost.value) * 100) / 100).toFixed(2)} <i id="close" class="fas fa-times-circle"></i><i id="edit" class="fas fa-pen showIco"></i></li>`
                }
            }
        });
        sum += parseFloat(attemptedCost.value);
        //update the value in category sum so we can delete it later
        category_sum.forEach((cat)=>{
            if(cat.category == selected){
                cat.sum += (Math.round(parseFloat(attemptedCost.value) * 100) / 100);
            }
            if(cat.category == item_edit_category){
                cat.sum -= (Math.round(parseFloat(item_edit_cost) * 100) / 100);
                console.log(category_sum);
            }
        });
        total.textContent = `$${(Math.round(sum * 100) / 100).toFixed(2)}`;
        $('#item-editor').modal('toggle');
    } else {
        item_edit_warning.textContent = warning;
        setTimeout(() => {
            item_edit_warning.textContent = "";
        }, 3000);
    }
});
// preventing form submission from when someone hits enter while the item modal is open
$('#item-edit-form').on('submit', (e)=>{
    e.preventDefault();
});
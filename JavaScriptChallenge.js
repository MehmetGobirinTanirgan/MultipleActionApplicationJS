const titleElmnt = document.getElementById("entry-title");
const entryElmnt = document.getElementById("entrytextarea");
const submitElmnt = document.getElementById("submitbtn");
const mainlist = document.getElementById("mainlist");
const entrylist = document.getElementById("entrylist");
const searchElement = document.getElementById("search");
const submitBtn = document.getElementById("entrysubmit");


eventListeners();

function eventListeners() {
    submitElmnt.addEventListener("click", entryWrite);
    mainlist.addEventListener("click", deleteEntry);
    searchElement.addEventListener("keyup", searchEntry);
    document.addEventListener("DOMContentLoaded", keepAliveEntries);
    entrylist.addEventListener("click", bringEntry);
};


function entryWrite(e) {
    const entryText = entryElmnt.value.trim();
    const entryTitle = titleElmnt.value.trim();
    entryCreate(entryTitle, entryText)
    e.preventDefault();
};

function entryCreate(entryTitle, entryText) {
    let check;
    if (entryText === "" || entryTitle === "") {
        displayAlert("Boş alan bırakma!");
    } else {
        check = searchTitleISExist(entryTitle, entryText);
        if (check === true) {
            const newlistitem = document.createElement("li");
            newlistitem.className = "main-list-items";
            const newEntryTitle = document.createElement("h4");
            newEntryTitle.innerHTML = `<a href="#">${entryTitle}</a> <a href="#"><i style="float: right;" class="fas fa-trash-alt"></i></a>`;
            newlistitem.appendChild(newEntryTitle);
            const newEntryText = document.createElement("p");
            newEntryText.textContent = entryText;
            newlistitem.appendChild(newEntryText);
            mainlist.appendChild(newlistitem);
            entryTitleToList(entryTitle);
            clearEntryTexts();
            updateStorage();
        }
    }
};
function entryTitleToList(entryTitle) {
    const newlistitem = document.createElement("li");
    newlistitem.innerHTML = `<a href="#">${entryTitle}</a>`;
    entrylist.appendChild(newlistitem);
};

function clearEntryTexts() {
    entryElmnt.value = "";
    titleElmnt.value = "";
};

function deleteEntry(e) {
    if (e.target.className === "fas fa-trash-alt") {
        e.target.parentElement.parentElement.parentElement.remove();
        deleteFromEntryList(e.target.parentElement.previousElementSibling);
    }
};

function deleteFromEntryList(e) {
    let child = entrylist.firstElementChild;
    let control = false;
    while (control === false) {
        if (child.firstElementChild.textContent === e.textContent) {

            child.remove();
            control = true;
        } else {
            child = child.nextElementSibling;
            control = false;
        }
    }
    updateStorage();
};

function searchEntry(e) {
    const searchThis = e.target.value;
    searchForEntry(searchThis);
};

function searchForEntry(searchThis) {

    let child = mainlist.firstElementChild;
    let length = mainlist.childElementCount;
    let checkText = child.firstElementChild.firstElementChild.textContent.toLowerCase();
    let searchText = searchThis.toLowerCase();
    for (let i = 0; i < length; i++) {
        if (checkText.indexOf(searchText) === -1) {
            child.setAttribute("style", "display: none !important");
        } else {
            child.setAttribute("style", "display: block");
        }
        child = child.nextElementSibling;
        checkText = child.firstElementChild.firstElementChild.textContent.toLowerCase();
    };
};

function updateStorage() {
    let child = mainlist.firstElementChild;
    let length = mainlist.childElementCount;

    const arr = [];
    let entryArr = [];
    if (length == 0) {
        localStorage.clear();
    } else {
        for (let i = 0; i < length; i++) {
            entryArr =[];
            let subChild = child.firstElementChild;
            if (child.childElementCount > 2) {
                entryArr.push(subChild.firstElementChild.textContent);      
                for (let j = 1; j < child.childElementCount; j++) {
                    subChild = subChild.nextElementSibling;
                    entryArr.push(subChild.textContent); 
                }
             }else{
                entryArr = [subChild.firstElementChild.textContent, subChild.nextElementSibling.textContent];
            }
            arr.push(entryArr);
            child = child.nextElementSibling;
        } 
    }
    localStorage.setItem("entries", JSON.stringify(arr));
};

function displayAlert(message) {
    const alert = document.createElement("div");
    alert.className = "alert alert-secondary";
    alert.textContent = message;
    alert.style.width = "fit-content";
    alert.style.display = "flex";
    alert.style.justifyContent = "center";
    alert.style.alignItems = "center";
    submitBtn.appendChild(alert);
    setTimeout(function () {
        alert.remove();
    }, 1000);
};

function keepAliveEntries() {
    let entries;
    if (localStorage.getItem("entries") === null) {
        entries = [];
    } else {
        entries = JSON.parse(localStorage.getItem("entries"));
    }
    entries.forEach(function (entry) {
        for(let i= 1; i < entry.length ; i++){
            entryCreate(entry[0], entry[i]);
        }
    });
};

function bringEntry(e) {
    searchForEntry(e.target.textContent);
};

function searchTitleISExist(searchTitle, entryText) {
    let child = mainlist.firstElementChild;
    let length = mainlist.childElementCount;
    let check;
    if (length > 0) {
        for (let i = 0; i < length; i++) {
            if (child.firstElementChild.firstElementChild.textContent.toLowerCase() === searchTitle.toLowerCase()) {
                newEntry = document.createElement("p");
                newEntry.textContent = entryText;
                child.appendChild(newEntry);
                check = false;
                updateStorage();
                break;
            }else {
                check = true;
            }
            child = child.nextElementSibling;
        };
    } else {
        check = true;
    }
    return check;
};

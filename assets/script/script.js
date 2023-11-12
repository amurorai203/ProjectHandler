var startTime = "9:00";
var endTime = "18:00";
var periodSeparatorMinutes = 60;
var sectionSlot = [];
var currentDayElt = $("#currentDay");
var slotElt = $(".container");
var today = dayjs();
var currentHour = today.format("HH");
var savedData = [];
const dataStore = "Chellenge 7 data";
var loadData = JSON.parse(localStorage.getItem(dataStore));

// console.log(loadData);

// Define class to store TimeSlot and Project Item
const slotClass = {
    slotTime: "00:00",
    slotItem: ""
}

// Display current date
currentDayElt.text(today.format("dddd, MMMM D[th]"));

// Define function to display Timeslot, project item and save Btn
// It input 3 parameters Timeslot, Project Item and flag to display past, present and future color
function rendorSlot(descText, descItem, mode){
    var divElt = $("<div>");
    divElt.addClass("input-group mb-3");
    // Define span as the Timeslot HTML element
    var spanElt = $("<span>");
    spanElt.addClass("input-group-text");
    spanElt.text(descText);
    // Define text as the Project Item HTML element
    var textElt = $("<input>");
    switch (mode) {
        // Define to use C as present
        case "C":
            textElt.addClass("form-control textarea present");
            break;
        // Define to use P as past
        case "P":
            textElt.addClass("form-control textarea past");
            break;
        //Else(F) as future
        default:
            textElt.addClass("form-control textarea future");
    }
    if (descItem !== ""){
        textElt.val(descItem);
    }
    // Define img as the saveBtn
    var saveBtnElt = $("<img>");
    saveBtnElt.addClass("input-group-button saveBtn");
    saveBtnElt.attr("src", "./assets/img/save-button.jpg");
    //Add span, text and img to div element
    divElt.append(spanElt);
    divElt.append(textElt);
    divElt.append(saveBtnElt);
    //Add div to the container
    slotElt.append(divElt);
}

// Define function to retrieve Project item from datastore 
function loadExistSlot(slot){
    var returnString = "";
    if (loadData != null){
        var objLocated = loadData.find(({slotTime}) => slotTime  === slot);
        returnString = objLocated.slotItem;
    }
    return returnString;
}

// Define function to create all slottime, projectitem and saveBtn
function buildSlot(){
    var currentDatetime = dayjs(today.format("YYYY-MM-DD ") + startTime);
    var endDatetime = dayjs(today.format("YYYY-MM-DD ") + endTime);
    var nextDatetime = currentDatetime;

    do {
        // Dynamically calculate and generate slots using periodSeparatorMinutes
        var processDatetime = nextDatetime;
        var itemElt = processDatetime.format("hh:mmA");
        nextDatetime = processDatetime.add(periodSeparatorMinutes, "minute");
        var nextHour = processDatetime.format("HH");
        var objItem = Object.create(slotClass);
        objItem.slotTime = itemElt;
        objItem.slotItem = loadExistSlot(itemElt);
        sectionSlot.push(objItem);
        // Determine past, present and future state 
        if (nextHour === currentHour){
            rendorSlot(itemElt, objItem.slotItem, "C");
        } else if (nextHour > currentHour){
            rendorSlot(itemElt, objItem.slotItem, "F");
        } else {
            rendorSlot(itemElt, objItem.slotItem, "P");
        }
    } while (nextDatetime < endDatetime)

}

buildSlot();

// Retrieve ProjectItem based on clicked saveBtn and then store t datastore
$("img").on("click", function(event){
    var element = event.target;
    var objKey = element.parentElement.children[0].textContent;
    var objValue = element.parentElement.children[1].value;
    // console.log(objKey + ":" + objValue);

    (sectionSlot.find(({slotTime}) => slotTime  === objKey)).slotItem = objValue;
    localStorage.setItem(dataStore, JSON.stringify(sectionSlot));
})
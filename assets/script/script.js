var startTime = "9:00";
var endTime = "18:00";
var periodSeparatorMinutes = 60;
var sectionSlot = [];
var currentDayElt = $("#currentDay");
var slotElt = $(".container");
var today = dayjs();
var currentHour = today.format("HH");
var savedData = [];
var loadData = JSON.parse(localStorage.getItem("Chellenge 7 data"));

console.log(loadData);

const slotClass = {
    slotTime: "00:00",
    slotItem: ""
}


currentDayElt.text(today.format("dddd, MMMM D[th]"));

function rendorSlot(descText, descItem, mode){

    var divElt = $("<div>");
    divElt.addClass("input-group mb-3");
    var spanElt = $("<span>");
    spanElt.addClass("input-group-text");
    spanElt.text(descText);
    var textElt = $("<input>");
    switch (mode) {
        case "C":
            textElt.addClass("form-control textarea present");
            break;
        case "P":
            textElt.addClass("form-control textarea past");
            break;
        default:
            textElt.addClass("form-control textarea future");
    }
    if (descItem !== ""){
        textElt.val(descItem);
    }
    var saveBtnElt = $("<img>");
    saveBtnElt.addClass("input-group-button saveBtn");
    saveBtnElt.attr("src", "./assets/img/save-button.jpg");
    divElt.append(spanElt);
    divElt.append(textElt);
    divElt.append(saveBtnElt);

    slotElt.append(divElt);
}

function loadExistSlot(slot){
    // console.log("Look for: " + slot);
    var returnString = "";
    if (loadData != null){
        var objLocated = loadData.find(({slotTime}) => slotTime  === slot);
        returnString = objLocated.slotItem;
    }

    // console.log(objLocated.slotItem);
    return returnString;
}

function buildSlot(){
    var currentDatetime = dayjs(today.format("YYYY-MM-DD ") + startTime);
    var endDatetime = dayjs(today.format("YYYY-MM-DD ") + endTime);
    var nextDatetime = currentDatetime;

    do {
        var processDatetime = nextDatetime;
        var itemElt = processDatetime.format("hh:mmA");
        nextDatetime = processDatetime.add(periodSeparatorMinutes, "minute");
        var nextHour = processDatetime.format("HH");
        var objItem = Object.create(slotClass);
        objItem.slotTime = itemElt;
        objItem.slotItem = loadExistSlot(itemElt);
        // objItem.slotItem = "Handle Challenge " + nextHour;
        // console.log(objItem.slotItem);
        sectionSlot.push(objItem);

        if (nextHour === currentHour){
            rendorSlot(itemElt, objItem.slotItem, "C");
        } else if (nextHour > currentHour){
            rendorSlot(itemElt, objItem.slotItem, "F");
        } else {
            rendorSlot(itemElt, objItem.slotItem, "P");
        }
    } while (nextDatetime < endDatetime)

    // console.log(sectionSlot);
}

buildSlot();
// localStorage.setItem("Chellenge 7 data", JSON.stringify(sectionSlot));

$("img").on("click", function(event){
    var element = event.target;
    var objKey = element.parentElement.children[0].textContent;
    var objValue = element.parentElement.children[1].value;
    console.log(objKey + ":" + objValue);
})
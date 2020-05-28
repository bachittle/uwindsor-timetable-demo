import {courseSearch} from './search.js';
import {myAlerts, share} from './alerts.js';
import { countCookie } from './cookie.js';
import { addToTimetable, modalData, canvasGen, mobileSwitch, changeLetters } from './content.js';
import { addedCourses, cachedTableGen, deleteTimetable, deleteCourse } from './timetable.js';
import { templateAjax } from './ajax.js';

//touch click helper
(function ($) {
    $.fn.tclick = function (onclick) {

        this.bind("touchstart", function (e) { 
            onclick.call(this, e); 
            e.stopPropagation(); 
            e.preventDefault(); 
        });

        this.bind("click", function (e) { 
           onclick.call(this, e);  //substitute mousedown event for exact same result as touchstart         
        });   

        return this;
    };
})(jQuery);



let isMobile = false;
function checkSize() {
    let width = window.innerWidth;
    let temp;
    if (width > 850) {
        temp = false;
    }
    else {
        temp = true;
    }
    if (temp !== isMobile) {
        isMobile = temp;
        mobileSwitch(isMobile);

    }
}
checkSize();

$(window).on("resize", function(event) {
    checkSize();
});

$(document).on("mouseover", ".resize-btn", function(event) {
    if ($(event.target).hasClass("resize-hor")) {
        $(event.target).css("cursor", "col-resize");
    }
    else if ($(event.target).hasClass("resize-ver")) {
        $(event.target).css("cursor", "row-resize");
    }
});

$(document).on("mouseleave", ".resize-btn", function(event) {
    $(event.target).css("cursor", "default");
});

let origCoords; // {x: int, y: int}
let mouseType;
$(document).on("mousedown touchstart", ".resize-btn", function(event) {
  // console.log(event);
    if ($(event.target).hasClass("resize-hor")) {
        $("body").css("cursor", "col-resize");
        mouseType = "hor";
    }
    else if ($(event.target).hasClass("resize-ver")) {
        $("body").css("cursor", "row-resize");
        mouseType = "ver";
    }
    origCoords = {x: event.clientX, y: event.clientY};
});

$(document).on("mousemove touchmove", function(event) {
    if (mouseType === "hor") {
        const val = 100 - (origCoords.x - event.clientX) / 8;
        $("#content")[0].style.width = `${val}%`;
      // console.log($("#content")[0].style.width);
        //console.log(val / 100);
        let change = {
            "Time": "Hr",
            "Monday": "Mon",
            "Tuesday": "Tue",
            "Wednesday": "Wed",
            "Thursday": "Thu",
            "Friday": "Fri",
        };
        for (let i = 7; i <= 11; i++) {change[`${i}:00AM`] = `${i}AM`;}
        change[`12:00PM`] = `12PM`;
        for (let i = 1; i <= 12; i++) {change[`${i}:00PM`] = `${i}PM`;}

        changeLetters(val < 100, 1);
        Object.keys(change).forEach(key => {
            if (val < 100) {
                $(`th:contains(${key})`).text(change[key]);
            }
            else {
                $(`th:contains(${change[key]})`).text(key);
            } 
        });
        /*
        $("thead").css("font-size", `${Math.pow(val / 100, 2)}rem`)
        $("tbody").css("font-size", `${Math.pow(val / 100, 2)}rem`)
        */
    }
    else if (mouseType === "ver") {
        const val = 15 - (origCoords.y - event.clientY) / 11;
      // console.log(val);
        $("tbody").css("line-height", `${val > 12 ? val : 12}px`);
    }
});
$(document).on("mouseup touchend", function(event) {
    mouseType = undefined;
        $("body").css("cursor", "default");
});

$(document).on("click", ".addSection", function(event) {
    const index = $(".addSection").index(this);
    addToTimetable(index);
});
$(document).on("click", ".course", function(event) {
    const item = $(event.currentTarget);
    const values = item.attr("id").split(";");
    const course = Object.assign(addedCourses[values[0]]);
    course.sections = [course.sections[values[1]]];
    modalData(course, values);
});

$(document).on("click", "#delete-tt", function(event) {
    deleteTimetable();
});

$(document).on("click", ".deletebtn", function(event) {
    const code = $(event.target).attr("value");
    deleteCourse(code);
});

$(document).on("click", ".ttbtn", function(event) {
    const obj = $(event.target);
    const modal = $("#modalLong");
    const header = modal.find(".modal-header");
    const footer = modal.find(".modal-footer");
    const body = modal.find(".modal-body");
    header.empty();
    body.empty();
    footer.empty();

    if (obj.attr("id") === "image") {
        canvasGen(function(canvas, buttons) {
            let button = $(`<button data-toggle="modal" data-target="#modalLong"></button>`);
            $("#links").append(button);
            button.click();
            button.remove();
            header.append(`<h2>Timetable Image</h2>`);
            body.append(canvas);
            footer.append(buttons);
        });
    }
    else if (obj.attr("id") === "delete") {
        header.append(`<h2>Delete Current Timetable</h2>`);
        body.append("<p>Are you sure you want to delete this table?</p>")
        footer.append(`<button type="button" class="btn btn-danger" id="delete-tt" data-dismiss="modal">Yes</button>`);
        footer.append(`<button type="button" class="btn btn-secondary" data-dismiss="modal">No</button>`);
    }
});

courseSearch.dynamic();

$(document).ready(templateAjax("search", function() {
    cachedTableGen();
    const count = countCookie();
    if ($("#wrapfabtest").height() > 0) {
        if (count % 4 == 2) {
            myAlerts.top.alert("UWindsor deserves a proper timetable creator. Share the love! 😃", share.reddit(), share.facebook());
        }
        else if (count % 4 == 3) {
            myAlerts.top.alert("This was made by a fellow UWindsor CS Student. Check out his code if you're a fellow nerd! 🤓", share.github());
        }
    }
    else {
        myAlerts.top.alert("I see you're using an adblocker 😢. Help a broke uni kid out.", share.reddit(), share.facebook());
    }

    courseSearch.static();
}));

export {isMobile};
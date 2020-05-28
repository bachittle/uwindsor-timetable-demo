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

window.mobileCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

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
        myAlerts.top.alert("I see you're using an adblocker 😢", share.reddit(), share.facebook());
    }

    courseSearch.static();
}));

export {isMobile};
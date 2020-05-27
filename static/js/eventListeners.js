import {courseSearch} from './search.js';
import {myAlerts, share} from './alerts.js';
import { countCookie } from './cookie.js';
import { addToTimetable, modalData, canvasGen } from './content.js';
import { addedCourses, cachedTableGen, deleteTimetable } from './timetable.js';
import { templateAjax } from './ajax.js';

// may not be compatible with lots of older browsers... keep this as an after-thought, not necessary
// window.history.pushState({}, "Search", "/search");

courseSearch.dynamic();
$(document).on("click", ".addSection", function(event) {
    const index = $(".addSection").index(this);
    addToTimetable(index);
});
$(document).on("click", ".course", function(event) {
    const item = $(event.currentTarget);
    const values = item.attr("id").split(";");
    const course = Object.assign(addedCourses[values[0]]);
    course.sections = [course.sections[values[1]]];
    modalData(course);
});

$(document).on("click", "#delete-tt", function(event) {
    deleteTimetable();
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

$(document).ready(templateAjax("search", function() {
    cachedTableGen();
    const count = countCookie();
    if (count % 4 == 2) {
        myAlerts.top.alert("UWindsor deserves a proper timetable creator. Share the love! 😃", share.reddit(), share.facebook());
    }
    else if (count % 4 == 3) {
        myAlerts.top.alert("This was made by a fellow UWindsor CS Student. Check out his code if you're a fellow nerd! 🤓", share.github());
    }
    courseSearch.static();
}));

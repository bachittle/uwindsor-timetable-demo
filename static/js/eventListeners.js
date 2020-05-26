import {courseSearch} from './search.js';
import {myAlerts, share} from './alerts.js';
import { countCookie } from './cookie.js';
import { addToTimetable, modalData, canvasGen } from './content.js';
import { addedCourses, cachedTableGen } from './timetable.js';
import { templateAjax } from './ajax.js';

// may not be compatible with lots of older browsers... keep this as an after-thought, not necessary
// window.history.pushState({}, "Search", "/search");

courseSearch.dynamic();
$(document).on("click", ".addSection", function(event) {
    const index = $(".addSection").index(this);
    addToTimetable(index);
});
$(document).on("click", ".course", function(event) {
    const item = $(event.target);
    const values = item.attr("id").split(";");
    const course = Object.assign(addedCourses[values[0]]);
    course.sections = [course.sections[values[1]]];
    console.log({course});
    modalData(course);
});

$(document).on("click", ".ttbtn", function(event) {
    const obj = $(event.target);
    if (obj.attr("id") === "image") {
        canvasGen();
    }
    else if (obj.attr("id") === "delete") {

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

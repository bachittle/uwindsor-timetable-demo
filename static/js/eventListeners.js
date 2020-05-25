import {checkRoutes} from './ajax.js';
import {courseSearch} from './search.js';
import {myAlerts, share} from './alerts.js';
import { idCookie, countCookie } from './cookie.js';
import { addToTimetable } from './content.js';

// may not be compatible with lots of older browsers... keep this as an after-thought, not necessary
// window.history.pushState({}, "Search", "/search");

courseSearch.dynamic();
$(document).on("click", ".addSection", function(event) {
    const index = $(".addSection").index(this);
    addToTimetable(index);
});

$(document).ready(checkRoutes(function() {
    const id = idCookie();
    const count = countCookie();
    if (count % 4 == 2) {
        myAlerts.top.alert("UWindsor deserves a proper timetable creator. Share the love! 😃", share.reddit(), share.facebook());
    }
    else if (count % 4 == 3) {
        myAlerts.top.alert("This was made by a fellow UWindsor CS Student. Check out his code if you're a fellow nerd! 🤓", share.github());
    }
    courseSearch.static();
}));

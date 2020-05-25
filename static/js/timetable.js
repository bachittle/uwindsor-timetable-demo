import { userData, timetableAJAX } from './ajax.js';
import { addToTimetable } from './content.js';
const size = {
    row: 16,
    col: 5
};

let addedCourses = {};

/* beautifies the mess of a table by adding lines every 3 rows */
function addLines() {
    for (let i = 0; i <= size.row * 2; i++) {
        for (let j = 0; j < size.col; j++) {
            if (i % 2 == 0) {
                $(`td#x${j}y${i*3}`).addClass("table-line-big");
            }
            else {
                $(`td#x${j}y${i*3}`).addClass("table-line");
            }
        }
    }
}


function addCourse(course) {
    if (!(addedCourses.hasOwnProperty(course.code))) {
        addedCourses[course.code] = course;
        delete course.code;
        course.sections = [course.sections];
    }
    else {
        addedCourses[course.code].sections.push(course.sections);
    }
}

// helper function for makeMatrix
const getIndex = {
    time: function(time) {

    },
    day: function(day) {

    }
};
function makeMatrix() {
    const dayID = {
        "mo": 0,
        "tu": 1,
        "we": 2,
        "th": 3,
        "fr": 4,
    };

    const timeID = {
        "7AM": 0,
        "8AM": 1,
        "9AM": 2,
        "10AM": 3,
        "11AM": 4,
        "12PM": 5,
        "1PM": 6,
        "2PM": 7,
        "3PM": 8,
        "4PM": 9,
        "5PM": 10,
        "6PM": 11,
        "7PM": 12,
        "8PM": 13,
        "9PM": 14,
        "10PM": 15,
    };
    console.log({addedCourses});
    Object.keys(addedCourses).forEach(key => {
        const val = addedCourses[key];
        val.sections.forEach(section => {
            if (!Object.hasOwnProperty("matrix")) {
                //section.matrix = `x${getIndex.time()}y${getIndex.day()}`;
            }
        });
    });
}

// course object is a shallow copy, therefore it can be modified. 
function timetableGen(course) {
    $("#content").empty();
    //userData(course, function(data) {
        timetableAJAX(function() {
            //console.log(data);
            addLines();
            addCourse(course);
            makeMatrix();
        });
    //});
}

export {timetableGen};
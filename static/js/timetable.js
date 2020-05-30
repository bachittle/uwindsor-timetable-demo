import { timetableAJAX, ttCookieAjax } from './ajax.js';
import { getCookie } from './cookie.js';
import { welcomeScreen, cardTop } from './content.js';
import { cleanCode } from './search.js';
import { isMobile } from './eventListeners.js';
const size = {
    row: 16,
    col: 5
};

// dictionary of courses that will be generated as a table. 
let addedCourses = {};
let currentDate;

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
// helper function for makeMatrix
const getIndex = {
    // get an array of indeces in timetable-1h.html that correspond to the times. This is in the y-axis.
    time: function(time) {
        let start = time.start;
        let end = time.end;
        const fun = function(val) {
            let hourIndex = val.slice(0, val.search(":")) + val.slice(val.search("[AP]M"));
            if (hourIndex[0] === "0") {
                hourIndex = hourIndex.slice(1);
            }
            hourIndex = timeID[hourIndex] * 6;
            let minIndex = val.slice(val.search(":") + 1, val.search("[AP]M")).trim();
            minIndex = Math.round(+minIndex / 10);
            return hourIndex + minIndex;
        };
        if (start !== undefined && end !== undefined) {
            start = fun(start);
            end = fun(end);
        }
        else {
            return undefined;
        }
        //console.log({start, end});
        let arr = new Array(end - start);
        for (let i = 0; i < end - start; i++) {
            arr[i] = start + i;
        }
        return arr;
    },
    day: function(days) {
        if (days === undefined) {
            return undefined;
        }
        // x axis coordinate based on the days being added
        let dateArr = [];

        // tuesday and thursday (TTH from pdf)
        if ((days.match(/T/g) || []).length === 2) {
            dateArr.push("tu", "th");
        }
        else {
            // just tuesday
            if (days.search("T") !== -1 && days.search("H") === -1) {
                dateArr.push("tu");
            }
            if (days.search("TH") !== -1) {
                dateArr.push("th");
            }
        }
        // monday wednesday friday
        if (days.search("M") !== -1) {
            dateArr.push("mo");
        }
        if (days.search("W") !== -1) {
            dateArr.push("we");
        }
        if (days.search("F") !== -1) {
            dateArr.push("fr");
        }
        for (let i = 0; i < dateArr.length; i++) {
            dateArr[i] = dayID[dateArr[i]];
        }
        return dateArr;
    }
};
function makeMatrix(course) {
    const section = course.sections;
    if (!Object.hasOwnProperty("matrix")) {
        const timeIndeces = getIndex.time(section.time);
        const dayIndeces = getIndex.day(section.days);
        section.matrix = {x: dayIndeces, y: timeIndeces};
        return section.matrix;
    }
}

const be = {};
function matrixConflict(matrix) {
    if (matrix.x === undefined || matrix.y === undefined) {
        return true;
    }
    // empty dict check
    if (!jQuery.isEmptyObject(addedCourses)) {
        try {
            Object.keys(addedCourses).forEach(code => {
                const course = addedCourses[code];
                course.sections.forEach(section => {
                    const testMatrix = section.matrix;
                    //console.log({matrix, testMatrix});
                    matrix.x.forEach(xVal => {
                        //console.log({xVal, x: testMatrix.x})
                        if (testMatrix.x.includes(xVal)) {
                            matrix.y.forEach(yVal => {
                                //console.log({yVal, y: testMatrix.y})
                                if (testMatrix.y.includes(yVal)) {
                                    throw be;
                                }
                            });
                        }
                    });
                });
            });
        }
        catch(e) {
            if (e !== be) throw e;
            else {
                return true;
            }
        }
        return false;
    }
    else {
        return false;
    }
}

function addCoursesToTimetable() {
    cardTop();
    //console.log({addedCourses});
    Object.keys(addedCourses).forEach(key => {
        const course = addedCourses[key];
        let type = "";
        if (course.type) {
            type = " " + course.type;
        }
        let j = 0;
        course.sections.forEach(section => {
            const matrix = section.matrix;
            matrix.x.forEach(xVal => {
                const times = matrix;
                const mobileVal = isMobile ? "" : course.type;
                $(`#x${xVal}y${matrix.y[0]}`)
                    .addClass("bg-primary")
                    .attr("rowspan", matrix.y.length)
                    .append(
`<button 
    type="button" 
    data-toggle="modal" 
    data-target="#modalLong" 
    id="${key};${j}" 
    class="course btn btn-block btn-primary"
>
    <h1 value="${ course.type }">${cleanCode(key)} ${ isMobile ? "" : course.type }</h1>
    <p value="${section.time.start}-${section.time.end}">${section.time.start}-${section.time.end}</p>
</button>`
                    );
                for (let i = 1; i < matrix.y.length; i++) {
                    $(`#x${xVal}y${matrix.y[i]}`).remove();
                }
            });
            j++;
        });
    });
}

function deleteCourse(codeStr) {
    const code = codeStr.split(",");
    const course = addedCourses[code[0]];
    course.sections.splice(+code[1], 1);
    if (course.sections.length === 0) {
        delete addedCourses[code[0]];
    }
    timetableGen();
    console.log({code, addedCourses});
}

$(document).on("click", ".deletebtn", function(event) {
    
});

// course object is a shallow copy, therefore it can be modified. 
function timetableGen(course) {
    $("#content").removeClass("course-tt");
    $("#content").empty();
    $("#buttons").empty();
    //userData(course, function(data) {
        timetableAJAX(function(data) {
            $("#content").append(data);
            $("#buttons").append(
`<div class="tt-buttons card card-body">
    <div class="d-flex justify-content-around">
        <!--
        <button id="image" type="button" data-toggle="modal" data-target="#modalLong" class="ttbtn btn btn-lg btn-info">save as image</button>
        -->
        <button id="image" type="button" class="ttbtn btn btn-lg btn-info">save as image</button>
        <button id="delete" type="button" data-toggle="modal" data-target="#modalLong" class="ttbtn btn btn-lg btn-danger">delete table</button>
    </div>
</div>`
            )
            $("#buttons").show();
            //$("tr").attr("style", "line-height: 5px;")

            //console.log(data);
            addLines();
            //console.log(addedCourses);
            if (course !== undefined) {
                if (currentDate === undefined) {
                    currentDate = course.date;
                }
                if (course.date === currentDate) {
                    delete course.date;
                    if (!matrixConflict(makeMatrix(course))) {
                        addCourse(course);
                    }
                    else {
                        $("#error").text("error: time conflict").show();
                    }
                }
                else {
                    $("#error").text("error: date conflict").show();
                }
            }
            $("#content").addClass("course-tt");
            //$("#content")[0].style = "display: block;";
            addCoursesToTimetable();
        });
    //});
}

function cachedTableGen() {
    const tt = getCookie("tt");
    if (tt) {
        ttCookieAjax(tt, function(data) {
            addedCourses = data;
            addCoursesToTimetable();
        });
    }
    else {
        // welcomeScreen();
    }
}

function deleteTimetable() {
    addedCourses = {};
    window.location.href = "/";
}


export {timetableGen, addedCourses, currentDate, cachedTableGen, deleteTimetable, deleteCourse};
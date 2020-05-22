import {currentDate} from './form.js';

let table = {}; 
let size = '1h';
let dayID = {
    "mo": 0,
    "tu": 1,
    "we": 2,
    "th": 3,
    "fr": 4,
};

let timeID = {
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

let matrix = [];
for (let i = 0; i < 5; i++) {
    matrix[i] = new Array(96);
}

function getHTMLTable(fun) {
    $.ajax({
        data: {
            size
        },
        type: 'get',
        url: '/timetable'
    })
    .done(function(data) {
        $("#timetable").append(data);
        fun();
    });
}

function getTimeIndex(time) {
    let index = timeID[time.slice(0, time.search(":")) + time.match("[AP]M")] * 6;
    index += Math.round(time.slice(time.search(":") + 1, time.search(" [AP]M")) / 10);
    return index;
}

function showTimetable(course, courseCode) {
    getHTMLTable(function() {
        if (course !== undefined && courseCode !== undefined) {
            if (!(table.hasOwnProperty(currentDate))) {
                table[currentDate] = {};
            }
            if (table[currentDate].hasOwnProperty(courseCode)) {

            }
            else {
                table[currentDate][courseCode] = course;
            }
            Object.keys(table[currentDate]).forEach(key => {
                let course = table[currentDate][key];
                course["sections"].forEach(section => {
                    console.log(section);
                    // mapping the times to coordinates
                    // y axis coordinate based on the time
                    let startIndex = getTimeIndex(section.time.start);
                    let endIndex = getTimeIndex(section.time.end);
                    console.log(startIndex);
                    console.log(endIndex);
                   
                    // x axis coordinate based on the days being added
                    let dateArr = [];
                    let days = section.days;

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
 
                    console.log(dateArr);
                    dateArr.forEach(day => {
                        let dayIndex = dayID[day];
                        let delta = endIndex - startIndex;
                        for (let i = 0; i < delta; i++) {
                            // matrix prevents overwrites
                            // TODO: fix this
                            if (matrix[dayIndex][startIndex] !== 0) {
                                let id = "#x" + dayIndex + "y" + (startIndex);
                                if (i === 0) {
                                    $(id).addClass("course").attr("rowspan", delta);
                                }
                                else {
                                    $(id).remove();
                                }
                                matrix[dayIndex][startIndex] = 0;
                            }
                        }
                    });
                });
            });
        }
    });
}

export {showTimetable};
import * as timetable from './timetable.js';
var BreakException = {};

function load_search_data(val) {
    //console.log(val);
    $.ajax({
        data: {
            date: val,
            type: type
        },
        type: 'get',
        url: '/search_data'
    })
    .done(function(data) {
        //console.log(data);
        courses = data;
    });
}

function update_search_results(searchCode) {
    $("#search-results").empty();
    let num = 0;
    try {
        /*
        courses.forEach(course => {
            // console.log(course);
            if (course.search("[A-Z][A-Z][A-Z][A-Z]-[0-9][0-9][0-9][0-9]-[0-9]*") === -1 && course.toLowerCase().search(searchCode.toLowerCase()) !== -1) {
                $('#search-results').append("<a class=\"search-result\"href=\"javascript:void(0)\">" + course + "</a>");
                num++;
            }
            if (num === 10) throw BreakException;
        });
        */
       const options = {
           includeScore: true,
           keys: [type]
       };
       const fuse = new Fuse(courses, options);
       const result = fuse.search(searchCode);
       let limit = 10;
       let set = new Set();
       for (let i = 0; i < limit; i++) {
            if (result[i] !== undefined) {
                if (result[i].item.code.search("[0-9][0-9][0-9][0-9]-[0-9]") == -1 && !set.has(result[i].item[type])) {
                    set.add(result[i].item[type]);
                    $('#search-results').append("<a class=\"search-result\"href=\"javascript:void(0)\">" + result[i].item[type] + "</a>");
                }
                else {
                    limit++;
                }
            }
       }
    }
    catch(e) {
        if (e !== BreakException) throw e;
    }
}

function classInfo(dataDict) {
    $("#success").empty();
    let tempArr = [];
    Object.keys(dataDict).forEach(key => {
        let data = dataDict[key]
        let sectionsClass = $("<div></div>").addClass("sections card card-body");
        sectionsClass.attr("id", key);
        sectionsClass.append("<h2>"+data.name+"</h2>");
        sectionsClass.append("<h3>Type: "+data.type+"</h3>")
        let num = 0;
        data.sections.forEach(section => {
            //console.log(section);
            let sectionClass = $("<div></div>").attr("id", "sec" + section.number);
            sectionClass.append("<hr>");
            sectionClass.append("<h3>Section "+section.number+"</h3>")
            sectionClass.append("<hr>");
            if (section["full?"]) {
                sectionClass.append("<p>FULL</p>")
            }
            if (section.credits !== undefined)
                sectionClass.append("<p>Credits: "+section.credits+"</p>")
            if (section.days !== undefined)
                sectionClass.append("<p>Days: "+section.days+"</p>")
            if (section.time.start !== undefined)
                sectionClass.append("<p>Start Time: "+section.time.start+"</p>")
            if (section.time.end !== undefined)
                sectionClass.append("<p>End Time: "+section.time.end+"</p>")
            if (section.room !== undefined && section.room.replace(/\s/g, '').length)
                sectionClass.append("<p>Room: "+section.room+"</p>")
            if (section.prof !== undefined)
                sectionClass.append("<p>Professor: "+section.prof+"</p>")
            if (section.number)
                sectionClass.append("<button class=\"addSection btn btn-warning\">Add To Timetable</button>")
            
            sectionsClass.append(sectionClass);
        });
        // summer 2020 made the pdf data inverted. Why uwindsor?!
        if (currentDate !== "s2020") {
            $("#success").append(sectionsClass);
        }
        else {
            tempArr.push(sectionsClass);
        }
    });
    if (currentDate === "s2020") {
        for (let i = tempArr.length - 1; i >= 0; i--) {
            $("#success").append(tempArr[i]);
        }
    }
} 

$(document).on('click', 'a.search-result', function(event) {
    $("#codeInput").val(event.target.text);
    $("#search-results").empty();
});

$(document).on('click', 'a.nav-link', function(event) {
    if (event.target.text === "Timetable") {
        window.history.pushState({}, "Timetable", "/timetable")
        timetable.showTimetable();
    }
});

$(window).on("hashchange", function(event) {
    //console.log(event);
});

function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

// clicking on the add section button
$(document).on('click', '.addSection', function(event) {
    topFunction();
    $("#success").empty();
    $('#success').hide();
    let sectionNumber = $(event.target).parent().attr("id").slice(3);
    let key = $(event.target).parent().parent().attr("id"); 
    let course = currentCourseJSON[key];
    let isCorrectNumber = false;
    let hasTime = false;
    let sectionIndex = 0;
    try {
        course.sections.forEach(section => {
            //console.log(section.number);
            //console.log(sectionNumber);
            if (sectionNumber === section.number) {
                isCorrectNumber = true;
                if (section.days && section.time) {
                    hasTime = true;
                }
                throw BreakException;
            }
            sectionIndex++;
        });
    }
    catch(e) {
        if (e !== BreakException) throw e;
    }
    if (isCorrectNumber) {
        if (hasTime) {
            window.history.pushState({}, "Timetable", "/timetable")
            timetable.showTimetable(course, key);
        }
        else {
            $("#error").text("Days and/or Times not defined").show();
        }
    }
    else {
        $("#error").text("Invalid course number").show();
    }
});

$(document).ready(function() {
    // dont need this in document.ready?
    if (window.location.href.indexOf("timetable") !== -1) {
        timetable.showTimetable();
    }
    load_data($('#dateInput').val());
    $('#searchType').on('change', function(event) {
        type = event.target.value;
        load_data($("#dateInput").val());
    });
    $('#dateInput').on('change', function(event) {
        load_data(event.target.value);
    });
    $('#codeInput').keyup(function(event) {
        if (event.target.value !== "" && event.key !== "Enter") {
            // console.log(event);
            update_search_results(event.target.value);
        }
        else {
            $("#search-results").empty();
        }
    });
    $('form').on('submit', function(event) {
        event.preventDefault();
        const options = {
           includeScore: true,
           keys: [type]
       };
       const fuse = new Fuse(courses, options);
       const result = fuse.search(searchCode);
       
       /*
        let foundCourse = false;
        currentDate = $('#dateInput').val();
        if (courseCode !== "" && !courses.includes(courseCode)) {
            courses.forEach(course => {
                console.log(course);
                try {
                    if (course.toLowerCase().search(courseCode.toLowerCase()) !== -1) {
                        courseCode = course;
                        foundCourse = true;
                        throw BreakException;
                    }
                }
                catch(e) {
                    if (e !== BreakException) throw e;
                }
            });
        }
        else if (courseCode !== "") {
            foundCourse = true;
        }
        if (foundCourse) {
            $.ajax({
                data: {
                    code: courseCode,
                    date: currentDate
                },
                type: 'POST',
                url: '/submit'
            })
            .done(function(data) {
                if (data.error) {
                    $("#error").text(data.error).show();
                    $('#success').hide();
                }
                else {
                    $('#success').show();
                    //console.log(data);
                    currentCourseJSON = data;
                    classInfo(data);
                    $('#error').hide();
                }
            });
        }
        else {
            $("#error").text("No course found").show();
            $("#success").hide();
        }
        */
        $("#search-results").empty();
        $("#timetable").empty();
    });
});

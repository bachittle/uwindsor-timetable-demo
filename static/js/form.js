let courses = [];
var BreakException = {};
let courseCode = "";
let currentCourseJSON;

function load_date_json(val) {
    //console.log(val);
    $.ajax({
        data: {
            date: val
        },
        type: 'POST',
        url: '/date_data'
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
        courses.forEach(course => {
            // console.log(course);
            if (course.search("[A-Z][A-Z][A-Z][A-Z]-[0-9][0-9][0-9][0-9]-[0-9]*") === -1 && course.toLowerCase().search(searchCode.toLowerCase()) !== -1) {
                $('#search-results').append("<a href=\"javascript:void(0)\">" + course + "</a>");
                num++;
            }
            if (num === 10) throw BreakException;
        });
    }
    catch(e) {
        if (e !== BreakException) throw e;
    }
}

function classInfo(dataArr) {
    $("#success").empty();
    $("#success").append("<br>");
    dataArr.forEach(data => {
        let sectionsClass = $("<div></div>").addClass("sections card card-body");
        sectionsClass.append("<h2>"+data.name+"</h2>");
        sectionsClass.append("<h3>Type: "+data.type+"</h3>")
        let num = 0;
        data.sections.forEach(section => {
            //console.log(section);
            let sectionClass = $("<div></div>").attr("id", "sec" + section.number);
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
        $("#success").append(sectionsClass);
        $("#success"). append("<br>");
    });
} 

$(document).on('click', 'a', function(event) {
    $("#codeInput").val(event.target.text);
    $("#search-results").empty();
});

$(document).on('click', '.addSection', function(event) {
    let sectionNumber = $(event.target).parent().attr("id").slice(3)
    currentCourseJSON.sections.forEach(section => {
        if (sectionNumber === section.number) {
            console.log(sectionNumber);
        }
    });
});

$(document).ready(function() {
    load_date_json($('select').val());
    $('select').on('change', function(event) {
        load_date_json(event.target.value);
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
        courseCode = $('#codeInput').val();
        if (courseCode !== "" && !courses.includes(courseCode)) {
            courses.forEach(course => {
                console.log(course.search(courseCode));
                try {
                    if (course.toLowerCase().search(courseCode.toLowerCase()) !== -1) {
                        courseCode = course;
                        throw BreakException;
                    }
                }
                catch(e) {
                    if (e !== BreakException) throw e;
                }
            });
        }
        $.ajax({
            data: {
                code: courseCode,
                date: $('select').val()
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
                currentCourseJSON = data;
                classInfo(data)
                $('#error').hide();
            }
        });

        $("#search-results").empty();
        event.preventDefault();
    });
});
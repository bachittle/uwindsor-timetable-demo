import { form, searchResults } from './search.js';
import {timetableGen} from './timetable.js';

function welcomeScreen() {
    $("#content").show();
    $("#content").empty();
    $("#content").append(`<h1>Hello World!</h1>`);
}

// dynamically adds course info to DOM
function courseInfo(dataArr, body, title, type="cards") {
    consoleLog({dataArr});
    body.empty();
    let tempArr = [];
    dataArr.forEach(data => {
        let key = data["code"];
        let sectionsClass = $("<div></div>");
        if (type === "cards") {
            sectionsClass.addClass("sections card card-body");
        }
        sectionsClass.attr("id", key);
        let name = data.name;
        const index = data.name.search(/\bScie\b/g);
        if (index != -1) {
            name = name.slice(0, index) + "Science" + name.slice(index + "Scie".length);
        }
        if (title === undefined) {
            sectionsClass.append("<h2>"+name+"</h2>");
        }
        else {
            title.empty();
            title.append("<h2>"+name+"</h2>");
        }
        sectionsClass.append("<h3>Type: "+data.type+"</h3>")
        let num = 0;
        data.sections.forEach(section => {
            //consoleLog(section);
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
                if (type === "cards")
                sectionClass.append("<button class=\"addSection btn btn-warning\">Add To Timetable</button>")
            
            sectionsClass.append(sectionClass);
        });
        body.append(sectionsClass);
    });
}

function addToTimetable(sectionIndex) {
    consoleLog(searchResults);
    let courseIndex = 0;
    let section;
    for (let i = 0; i < searchResults.length; i++) {
        if (sectionIndex < searchResults[i].sections.length) {
            section = searchResults[i].sections[sectionIndex];
            break;
        }
        else {
            courseIndex++;
            sectionIndex -= searchResults[i].sections.length;
        }
    }
    // shallow copy so that cache stays intact
    let courseToAdd = Object.assign({}, searchResults[courseIndex])
    courseToAdd.sections = section;
    courseToAdd.date = form.date;
    timetableGen(courseToAdd);
}

function modalData(course) {
    const modal = $("#modalLong");
    courseInfo([course], modal.find(".modal-body"), modal.find(".modal-title"), "modal");
    const footer = modal.find(".modal-footer"); 
    footer.empty();
    footer.append(`<button type="button" class="btn btn-danger" data-dismiss="modal">Delete</button>`);
    footer.append(`<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`);
}

function canvasGen() {
    const modal = $("#modalLong");
    const header = modal.find(".modal-header");
    const footer = modal.find(".modal-footer");
    header.empty();
    footer.empty();
    header.append(`<h2>Timetable Image</h2>`);
    const body = modal.find(".modal-body");
    body.empty();
    const wpr = window.devicePixelRatio;

    /*
    let canvas = $("<canvas></canvas>")[0];
        // Make it visually fill the positioned parent
    canvas.style.width ='100%';
    canvas.style.height='100%';
    // ...then set the internal size to match
    canvas.width = 1000; 
    canvas.height = 850;
    consoleLog({width: canvas.width, height: canvas.height});
    const ctx = canvas.getContext("2d");
    ctx.scale(0.56, 0.56);
    ctx.translate(0, -700);
    */

    let buttons = "";
    buttons += `<button type="button" id="save-img" class="btn btn-secondary" data-dismiss="modal">Save</button>`;
    buttons += `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`;
    html2canvas($("#content").find("#timetable")[0], {y: 428}).then(canvas => {
        canvas.style.width ='100%';
        canvas.style.height='200%';
        body.append(canvas);
        footer.append(buttons);
        $(document).on("click", "#save-img", function(event) {
            console.log("test");
            var link = $("<a>test</a>")
            link.attr('download', 'timetable.png');
            link.attr('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
            $("#content").append(link);
            $(link).click();
        });
    });

}

export {welcomeScreen, courseInfo, addToTimetable, modalData, canvasGen};
import { form, searchResults } from './search.js';
import {timetableGen} from './timetable.js';

// dynamically adds course info to DOM
function courseInfo(dataArr) {
    $("#content").empty();
    let tempArr = [];
    dataArr.forEach(data => {
        let key = data["code"];
        let sectionsClass = $("<div></div>").addClass("sections card card-body");
        sectionsClass.attr("id", key);
        let name = data.name;
        const index = data.name.search(/\bScie\b/g);
        if (index != -1) {
            name = name.slice(0, index) + "Science" + name.slice(index + "Scie".length);
        }
        sectionsClass.append("<h2>"+name+"</h2>");
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
        $("#content").append(sectionsClass);
    });
}

function addToTimetable(sectionIndex) {
    console.log(searchResults);
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

export {courseInfo, addToTimetable};
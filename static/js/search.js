// interacting with search.html to search for courses in a user-friendly way

import { courseInfo } from "./content.js";

// variables in this scope
let form = {
    type: undefined,
    date: undefined,
    search: undefined 
};
let allCourses;   // data to be searched on, json format follows s2020_min.json
let searchResults; // result of search used to store data elsewhere

// load data from json file in backend to search for courses and get results similar to google 
function loadData() {
    if (form.date !== undefined && form.type !== undefined) {
        $.ajax({
            data: {
                date: form.date,
                type: form.type 
            },
            type: 'get',
            url: '/load_search_data'
        })
        .done(function(data) {
            allCourses = data;
        });
    }
}

// searches the global variable courses upon the specified search term in form.search
function fuseSearch() {
    if (form.search) {
        console.time("fuse");
        const options = {
            includeScore: true,
            keys: [form.type]
        };
        const fuse = new Fuse(allCourses, options);
        const result = fuse.search(form.search);
        let limit = 10;
        searchResults = {};
        for (let i = 0; i < limit; i++) {
            // console.log(limit);
            // no point in going past the length of the array...
            if (i > result.length) break;
            if (result[i] !== undefined) {
                const res = result[i];
                let finalResult = res.item[form.type];
                if (form.type === "profs") {
                    finalResult = undefined;
                    // search for a specific prof in a section
                    const options = {
                        includeScore: true,
                        keys: ["prof"],
                        threshold: 0.5
                    }
                    const fuse = new Fuse(res.item.sections, options);
                    const result = fuse.search(form.search);
                    // console.log({"name": "second result", result});
                    if (result[0] !== undefined) {
                        finalResult = result[0].item.prof;
                    }
                }
                if (finalResult) {
                    let index = finalResult.search("[0-9][0-9][0-9][0-9]-[0-9]");
                    if (index != -1) {
                        finalResult = finalResult.slice(0, index + 4);
                    }
                    else {
                        $('#search-results').append(`<li class="list-group-item"><a class="search-result btn btn-block"href="javascript:void(0)">${finalResult}</a></li>`);
                    }
                    if (finalResult in searchResults) {
                        if (form.date === "s2020") {
                            searchResults[finalResult].unshift(res.item);
                        }
                        else {
                            searchResults[finalResult].push(res.item);
                        }
                    }
                    else {
                        searchResults[finalResult] = [res.item];
                    }
               }
                else {
                    limit++;
                }
            }
            else {
                limit++;
            }
        }
        console.timeEnd("fuse");
    }
}

// updates javascript data to data from the form, as well as dynamically updating fields in the form
// includes a switch case for every key in form
function updateField(field) {
    switch (field) {
        case 'type':
            form.type = $("#searchType").val();
            // this code changes the label dynamically to the field in searchType
            $("label[for=searchInput]").text(`Search for ${$(`option[value=${form.type}]`).text()}`);
            loadData();
            break;
        case 'date': 
            form.date = $("#dateInput").val();
            loadData();
            break;
        case 'search':
            form.search = $("#searchInput").val();
            fuseSearch();
            break;
    }
}

const be = {};
function submitForm() {
    let val = $("#searchInput").val();
    //console.log(val);
    let error;
    if (searchResults === undefined) {
        error = "invalid search, nothing inputted into search";
    }
    else {
        try {
            let arr = searchResults;
            if (!Array.isArray(searchResults)) {
                arr = Object.keys(searchResults);
            }
            else {
                fuseSearch();
            }
            arr.forEach(key => {
                if (key.hasOwnProperty("code") && key.code.trim() == val) {
                    throw be;
                }
            });
            if ($(".search-result").length > 0) {
                val = $($(".search-result")[0]).text();
                $("#searchInput").val(val);
            }
            else {
                error = "invalid search, please try again";
            }
        }
        catch(e) {
            console.log("test");
            if (e !== be) throw e;
        }
    }
    if (error === undefined) {
        searchResults = searchResults[val];
        if (form.type === "name") {
            allCourses.forEach(course => {
                let codeToCheck = searchResults[0].code;
                if (form.date === "s2020") {
                    if (codeToCheck !== course.code && codeToCheck.search(course.code) !== -1) {
                        searchResults.push(course);
                    }
                }
                else {
                    if (codeToCheck !== course.code && course.code.search(codeToCheck) !== -1) {
                        searchResults.push(course);
                    }

                }
            });
        }

        $("#search-results").empty().hide();
        $("#content").show();
        $("#error").hide();
        courseInfo(searchResults);
    }
    else {
        $("#content").hide();
        $("#error").text(error).show();
    }
}

const courseSearch = {
    // for interacting with DOM elements already loaded from search.html
    static: function() {
        $("#search").show();
        // default values on load
        Object.keys(form).forEach(key => {
            updateField(key);
        });

        $("#searchType").on('change', function(event) {
            updateField("type");
        });
        $("#dateInput").on('change', function(event) {
            updateField("date");
        });

        $(window).keydown(function(event) {
            if (event.keyCode == 13) {
                event.preventDefault();
                return false;
            }
        });
        $('#searchInput').keyup(function(event) {
            if (event.target.value !== "") {
                if (event.key === "Enter") {
                    submitForm();
                }
                else {
                    $("#search-results").empty().show();
                    updateField("search");
                }
            }
            else {
                $("#search-results").hide();
            }
        });

        $('form').on('submit', function(event) {
            event.preventDefault();
            submitForm();
        });
    },
    // dynamic DOM data, such as search results
    dynamic: function() {
        $(document).on('click', 'a.search-result', function(event) {
            $("#searchInput").val(event.target.text);
            $("#search-results").empty().hide();
            submitForm();
        });
    }
};

export {form, searchResults, courseSearch};
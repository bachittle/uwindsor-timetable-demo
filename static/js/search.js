// interacting with search.html to search for courses in a user-friendly way

// variables in this scope
let form = {
    type: undefined,
    date: undefined,
    search: undefined 
};
let allCourses;   // data to be searched on, json format follows s2020_min.json
let globalResult; // result of search used to store data elsewhere

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
        // console.time("fuse");
        const options = {
            includeScore: true,
            keys: [form.type]
        };
        const fuse = new Fuse(allCourses, options);
        const result = fuse.search(form.search);
        // console.timeEnd("fuse");
        console.log({"name": "first result", result});
        let limit = 10;
        let set = new Set();
        for (let i = 0; i < limit; i++) {
            if (result[i] !== undefined) {
                const res = result[i];
                let finalResult = res.item[form.type];
                if (form.type === "profs") {
                    const fuse = new Fuse(res.item.profs);
                    const result = fuse.search(form.search);
                    console.log({"name": "second result", result});
                    finalResult = result[0].item;
                }
                if (res.item.code.search("[0-9][0-9][0-9][0-9]-[0-9]") == -1 && !set.has(finalResult)) {
                    set.add(res.item[form.type]);
                    $('#search-results').append("<a class=\"search-result\"href=\"javascript:void(0)\">" + finalResult + "</a>");
                }
                else {
                    limit++;
                }
            }
            else {
                limit++;
            }
        }
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

const courseSearch = {
    // for interacting with DOM elements already loaded from search.html
    static: function() {
        // default values on load
        Object.keys(form).forEach(key => {
            updateField(key);
        });
        console.table(form);

        $("#searchType").on('change', function(event) {
            updateField("type");
        });
        $("#dateInput").on('change', function(event) {
            updateField("date");
        });

        $('#searchInput').keyup(function(event) {
            $("#search-results").empty();
            if (event.target.value !== "" && event.key !== "Enter") {
                updateField("search");
            }
        });
    },
    // dynamic DOM data, such as search results
    dynamic: function() {
        
    }
};

export {courseSearch};
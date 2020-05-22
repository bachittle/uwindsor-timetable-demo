/** all things ajax, to help de-couple the interaction between backend and frontend */

/*
 *  checkRoutes: depending on the href, there needs to be ajax to add the required html
 *      to make this site reactive. 
 */

// key is the url route and value is the ajax data to send to the backend
const routes = {
    "timetable": {
        size: '1h'
    },
    "search": {}
};
function checkRoutes(callbackfn) {
    Object.keys(routes).forEach(route => {
        if (window.location.href.indexOf(route) !== -1) {
            $.ajax({
            data: routes[route], 
            type: 'get',
            url: `/${route}`
            })
            .done(function(data) {
                $(`#${route}`).append(data);
                callbackfn();
            });
        }
    });
}
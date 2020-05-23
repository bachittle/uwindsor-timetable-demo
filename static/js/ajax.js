/** all things ajax, to help de-couple the interaction between backend and frontend */

// key is the url route and value is the ajax data to send to the backend
const routes = {
    "timetable": {
        size: '1h'
    }
};

/*
 *  checkRoutes: depending on the href, there needs to be ajax to add the required html
 *      to make this site reactive. 
 */
function checkRouteAJAX(route, callbackfn) {
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
function checkRoutes(callbackfn) {
    // root implies welcome page and search 
    if (location.pathname == '/') {
        // TODO
        // checkRouteAJAX("welcome"); 
        checkRouteAJAX("search", callbackfn);
    }
    Object.keys(routes).forEach(route => {
        // console.log(location.pathname);
        if (window.location.href.indexOf(route) !== -1) {
            checkRouteAJAX(route, callbackfn);
        }
    });
}

export {checkRoutes};
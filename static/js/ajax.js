/** all things ajax, to help de-couple the interaction between backend and frontend */
import {idCookie, getCookie, setCookie} from './cookie.js';

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

/* gets cookie information from backend, deprecated? */
function cookieAJAX() {
    console.log(document.cookie);
    console.log(getCookie("id"));
    $.ajax({
        data: {
            cookie: getCookie("id")
        },
        type: 'get',
        url: '/new_cookie'
    })
    .done(function(data) {
        console.log(data);
        setCookie("id", data.cookie, 100);
    });
}

function timetableAJAX(fun) {
    const size = "1h";
    $.ajax({
        data: {
            size
        },
        type: 'get',
        url: '/timetable'
    })
    .done(function(data) {
        $("#content").append(data);
        fun();
    });
}

function userData(jsonData, fun) {
    const isNew = idCookie();
    $.ajax({
        data: {
            id: getCookie("id"),
            data: JSON.stringify(jsonData),
            isNew
        },
        type: 'get',
        url: '/get_user'
    })
    .done(function(data) {
        fun(data);
    })
}

export {checkRoutes, timetableAJAX, userData};
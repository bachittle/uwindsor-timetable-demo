/** all things ajax, to help de-couple the interaction between backend and frontend */
import { getCookie, setCookie} from './cookie.js';

function templateAjax(route, fun) {
    $.ajax({
        type: "get",
        url: `/${route}`
    }).then(function(data) {
        $(`#${route}`).append(data);
        fun();
    })
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

/*
    ttCookieAJAX: generates json from cookie data, in the format required for addedCookies object
        in timtable.js. 

        tt: string looks like this: COMP-1000-1;91:COMP-2310;91:...
            course code followed by section number, delimited by ;
            each value delimited by :
*/
function ttCookieAjax(tt, fun) {
    let val = "";
    $.ajax({
        data: {
            tt
        },
        type: "post",
        url: "load_timetable_data"
    }).then(data => fun(data));
}

export { templateAjax, timetableAJAX, ttCookieAjax };
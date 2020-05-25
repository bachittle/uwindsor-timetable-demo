function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    console.log(expires);
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/;SameSite=Strict;";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function countCookie() {
    let cookie = 0;
    if (getCookie("count") && !isNaN(getCookie("count"))) {
        cookie = +getCookie("count") + 1;
    }
    setCookie("count", `${cookie}`, 100);
    return cookie;
}

// returns true if new cookie is generated. False if there already is a cookie
function idCookie() {
    if (!getCookie("id") || isNaN(getCookie("id"))) {
        const cookie = String(Math.floor(Math.random() * 1000000)) + String(Date.now());
        setCookie("id", cookie, 100);
        return true;
    }
    else {
        return false;
    }
}

export {countCookie, idCookie, getCookie, setCookie};
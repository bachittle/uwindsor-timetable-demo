function defaultShareFun(url, target, data, targetType) {
    let newShare = $(data);
    if (targetType === undefined) {
        const shareFun = `window.open("${url}", "${target}", 'width=626,height=436');return false;`
        return newShare.attr("onclick", shareFun);
    }
    else {
        return newShare.attr("href", url).attr("target", targetType)
    }
}
const linkToShare = encodeURIComponent("https://utable.net");
let share = {
    reddit: () => {return defaultShareFun(
        `https://reddit.com/submit?url=${linkToShare}`,
        "share-reddit", 
        `<a href="#" type="button" class="btn btn-social btn-reddit m-2"><span class="fa fa-reddit"></span> Reddit</a>`
    );},
    facebook: () => {return defaultShareFun(
        `https://www.facebook.com/sharer/sharer.php?u=${linkToShare}`,
        "share-facebook", 
        `<a href="#" type="button" class="btn btn-social btn-facebook m-2"><span class="fa fa-facebook"></span> Facebook</a>`
    );},
    github: () => {return defaultShareFun(
        `https://github.com/bachittle/uwindsor-timetable-demo`,
        "share-github", 
        `<a type="button" class="btn btn-social btn-github m-2"><i class="fa fa-github"></i> Github Link</a>`,
        "_blank"
    );}
}

const myAlerts = {
    top: {
        alert: function(name, ...args) {
            $("#top-alert").empty().show();
            $("#top-alert").append(name);
            const button = `
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            <br>
            `;
            $("#top-alert").append(button);
            args.forEach(argument => {
                $("#top-alert").append(argument);
            });
            
            $("#top-alert").alert();
        },
        hide: function() {
            $("#top-alert").hide();
        }
    },
    hide: function() {
        Object.keys(myAlerts).forEach(key => {
            if (key !== "stop") {
                myAlerts[key].hide();   
            }
        });
    }
};
export {myAlerts, share};
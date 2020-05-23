import {checkRoutes} from './ajax.js';
import {courseSearch} from './search.js';

// may not be compatible with lots of older browsers... keep this as an after-thought, not necessary
// window.history.pushState({}, "Search", "/search");

courseSearch.dynamic();

$(document).ready(checkRoutes(function() {
    courseSearch.static();
}));
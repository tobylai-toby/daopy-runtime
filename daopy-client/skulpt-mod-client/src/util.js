// Global Sk object

var Sk = {}; // jshint ignore:line
globalThis.Sk=Sk;
// global.Sk = Sk; // jshint ignore:line
Sk.build = {
    githash: "daopy",
    date: "no-date"
};

/**
 * Global object no matter where we're running
 */
let global=globalThis;
Sk.global =
    typeof global !== "undefined" ? global : // jshint ignore:line
    typeof self !== "undefined" ? self : // jshint ignore:line
    typeof window !== "undefined" ? window : // jshint ignore:line
    {};
Sk.global.evalx=(code)=>Function("return eval")()(code);
Sk.global.ENABLE_DATE_NOW=false;
Sk.global.Date_now=function(){
    return Sk.global.ENABLE_DATE_NOW?new Date():new Date(0);
};
// Sk.global.char_e=String.fromCharCode(101);// char code of e
/**
 * Export "object" to global namespace as "name".
 *
 * @param {string} name name to export the object to
 * @param {*} object object to export
 */
Sk.exportSymbol = function (name, object) {
    var parts = name.split(".");
    var curobj = Sk.global;
    var part, idx;

    for (idx = 0; idx < (parts.length - 1); idx++) {
        part = parts[idx];

        if (curobj.hasOwnProperty(part)) {
            curobj = curobj[part];
        } else {
            curobj = curobj[part] = {};
        }
    }

    if (typeof object !== "undefined") {
        part = parts[idx];
        curobj[part] = object;
    }
};

Sk.isArrayLike = function (object) {
    if ((object instanceof Array) || (object && object.length && (typeof object.length == "number"))) {
        return true;
    }
    return false;
};

Sk.js_beautify = function (x) {
    return x;
};

Sk.exportSymbol("Sk", Sk);
Sk.exportSymbol("Sk.global", Sk.global);
Sk.exportSymbol("Sk.build", Sk.build);
Sk.exportSymbol("Sk.exportSymbol", Sk.exportSymbol);
Sk.exportSymbol("Sk.isArrayLike", Sk.isArrayLike);
Sk.exportSymbol("Sk.js_beautify", Sk.js_beautify);
module.exports={Sk};
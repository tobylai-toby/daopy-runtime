var skulpt=require("./skulpt-mod/dist/skulpt.min.js");
require("./skulpt-mod/dist/skulpt-stdlib.js");
function installReadFn(readFn,mods){
    return function (file) {
        if (mods[file]!=undefined) {
            return mods[file]
        } else {
            return readFn(file)
        }
    }
}
function builtinRead(x) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
        throw "File not found: '" + x + "'";
    return Sk.builtinFiles["files"][x];
}
function run(code,extReadFn=null) {
    function outputFunc(text) {
        console.log(text);
    }
    var readFn=builtinRead;
    if(extReadFn!==null){
        readFn=extReadFn;
    }
    Sk.configure({
        __future__: Sk.python3,
        output: outputFunc,
        read: readFn,
        systemexit: true,
        fileopen: file => {
            console.log("skulpt file open ", file);
        },
        filewrite: file => {
            console.log("skulpt file write ", file);
        },
    });
    var myPromise = Sk.misceval.asyncToPromise(function () {
        return Sk.importMainWithBody("<stdin>", false, code, true)
    });
    myPromise.then(function (mod) {},function (err) {console.error(err.toString());});
}
module.exports = {
    run,installReadFn,Sk,builtinRead
}
const daopy = require("./daopy.js");
const daopy_modules = require("./daopy-dist/daopy_modules.js");
// global.world={
//     say:(msg)=>{console.log(msg)},
//     onChat:(fn)=>{
//         fn({name:"world",msg:"hello"});
//     }
// };
// global.voxels=global.http=global.resources={};
// daopy.run(`
// from dao3 import *
// `, daopy.installReadFn(daopy.builtinRead,daopy_modules));
daopy.loadProjectAndRun({
    entry:"index",
    mods:{
        "./index.py":"import utils\nprint(utils.add(1))\nwith open('./utils.py') as fp: print(fp.read())",
        "./utils.py":"def add(n):return n+1",
    }
},daopy.installReadFn(daopy.builtinRead,daopy_modules))
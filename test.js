const daopy = require("./daopy.js");
const daopy_modules = require("./daopy-dist/daopy_modules.js");
// global.world={
//     say:(msg)=>{console.log(msg)},
//     onChat:(fn)=>{
//         fn({name:"world",msg:"hello"});
//     }
// };
global.voxels=global.http=global.resources=global.storage=global.world=global.remoteChannel=global.rtc={};
// daopy.run(`
// from dao3 import *
// `, daopy.installReadFn(daopy.builtinRead,daopy_modules));
daopy.loadProjectAndRun({
    entry:"index",
    mods:{
        "./index.py":`from dao3 import *
utils.js.eval("console.log('hi')")
print(world)`,
    }
},daopy.installReadFn(daopy.builtinRead,daopy_modules))
const daopy = require("./daopy.js");
const daopy_modules = require("./dist/daopy_modules.js");
global.world={
    say:(msg)=>{console.log(msg)},
    onChat:(fn)=>{
        fn({name:"world",msg:"hello"});
    }
};
global.voxels=global.http=global.resources={};
daopy.run(`
from dao3 import *
`, daopy.installReadFn(daopy.builtinRead,daopy_modules));
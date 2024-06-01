const fs=require("fs");
const path=require("path");

const modules={"./module/dao3/":"./dao3/"}
const res={};
const files=[];

function loadModuleFiles(dir,module_){
    fs.readdirSync(dir,{recursive:true}).forEach(file=>{
        let fpath=path.join(dir,file);
        if(fs.statSync(fpath).isFile()){
            let modpath="./"+path.join(module_,file).replace(/\\/g,"/");
            console.log(fpath,modpath)
            res[modpath]=fs.readFileSync(fpath,"utf-8").replace(/\r/g,"");
        }
    })
}


function build(){
    for(let module_ in modules){
        loadModuleFiles(module_,modules[module_]);
    }
    if(!fs.existsSync("./dist"))fs.mkdirSync("./dist");
    // fs.copyFileSync("./module/dao3/daopy-utils.js","./dist/daopy-utils.js");
    fs.writeFileSync("./dist/daopy_modules.js",`/*auto-generated*/module.exports=${JSON.stringify(res)}`);
}
build();
// const defineProperty = function (obj, property) {
//     return Sk.misceval.callsimOrSuspend(Sk.builtins.property, new Sk.builtin.func(function (self) {
//         if (typeof obj === 'function') {
//             return obj(self)
//         } else {
//             return Sk.ffi.remapToPy(self[obj][property])
//         }
//     }), new Sk.builtin.func(function (self, val) {
//         if (typeof property === 'function') {
//             property(self, val)
//         } else {
//             self[obj][property] = val.v;
//         }
//     }))
// }

const wrapObj = function (obj, mod) {
    return Sk.ffi.proxy(obj);
}

// function genkwaFunc(func, isJsArgs) {
//     const kwaFunc = function (kwa, ...args) {
//         if (!isJsArgs) {
//             args = new Sk.builtins['tuple'](args); /*vararg*/
//         }
//         const kwargs = new Sk.builtin.dict(kwa);
//         return func(args, kwargs)
//     }
//     kwaFunc['co_kwargs'] = true;
//     return kwaFunc;
// }

// const wrapFunc = function (func, mod) {
//     return Sk.ffi.toPy(func);
// }

// const wrapClass = function (class_, mod) {
//     return Sk.ffi.proxy(class_)
// }

var $builtinmodule = function (name) {
    var mod = {};

    // utils
    mod.utils=Sk.misceval.callsimOrSuspend(Sk.misceval.buildClass(mod, function ($gbl1, $loc1) {
        $loc1.js=Sk.misceval.callsimOrSuspend(Sk.misceval.buildClass(mod, function ($gbl, $loc) {
            $loc.eval=new Sk.builtin.func(function(self,code){
                return Sk.ffi.remapToPy((1,eval)(code.v));
            });
        }));
    }));
    let global=globalThis;
    for (let k of Object.keys(global)) {
        mod[k] = wrapObj(global[k], mod);
    }
    return mod;
};
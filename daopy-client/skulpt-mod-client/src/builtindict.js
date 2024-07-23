// Note: the hacky names on int, long, float have to correspond with the
// uniquization that the compiler does for words that are reserved in
// Javascript. This is a bit hokey.

Sk.builtins = {
    "round"     : null,
    "len"       : null,
    "min"       : null,
    "max"       : null,
    "sum"       : null,
    "abs"       : null,
    "fabs"      : null,
    "ord"       : null,
    "chr"       : null,
    "hex"       : null,
    "oct"       : null,
    "bin"       : null,
    "dir"       : null,
    "repr"      : null,
    "open"      : null,
    "isinstance": null,
    "hash"      : null,
    "getattr"   : null,
    "hasattr"   : null,
    "id"        : null,
    
    "sorted"    : null,
    "any"       : null,
    "all"       : null,
    
    // iterator objects if py2 mode we replace these with sk_methods
    "enumerate" : Sk.builtin.enumerate,
    "filter"    : Sk.builtin.filter_,
    "map"       : Sk.builtin.map_,
    "range"     : Sk.builtin.range_,
    "reversed"  : Sk.builtin.reversed,
    "zip"       : Sk.builtin.zip_,

    "BaseException"      : Sk.builtin.BaseException, 
    "AttributeError"     : Sk.builtin.AttributeError,
    "ArithmeticError"    : Sk.builtin.ArithmeticError,
    "ValueError"         : Sk.builtin.ValueError,
    "Exception"          : Sk.builtin.Exception,
    "ZeroDivisionError"  : Sk.builtin.ZeroDivisionError,
    "AssertionError"     : Sk.builtin.AssertionError,
    "ImportError"        : Sk.builtin.ImportError,
    "ModuleNotFoundError": Sk.builtin.ModuleNotFoundError,
    "IndentationError"   : Sk.builtin.IndentationError,
    "IndexError"         : Sk.builtin.IndexError,
    "LookupError"        : Sk.builtin.LookupError,
    "KeyError"           : Sk.builtin.KeyError,
    "TypeError"          : Sk.builtin.TypeError,
    "UnicodeDecodeError" : Sk.builtin.UnicodeDecodeError,
    "UnicodeEncodeError" : Sk.builtin.UnicodeEncodeError,
    "NameError"          : Sk.builtin.NameError,
    "UnboundLocalError"  : Sk.builtin.UnboundLocalError,
    "IOError"            : Sk.builtin.IOError,
    "NotImplementedError": Sk.builtin.NotImplementedError,
    "SystemExit"         : Sk.builtin.SystemExit,
    "OverflowError"      : Sk.builtin.OverflowError,
    "OperationError"     : Sk.builtin.OperationError,
    "NegativePowerError" : Sk.builtin.NegativePowerError,
    "RuntimeError"       : Sk.builtin.RuntimeError,
    "RecursionError"     : Sk.builtin.RecursionError,
    "StopIteration"      : Sk.builtin.StopIteration,
    "SyntaxError"        : Sk.builtin.SyntaxError,
    "SystemError"        : Sk.builtin.SystemError,
    "KeyboardInterrupt"  : Sk.builtin.KeyboardInterrupt,

    "float_$rw$": Sk.builtin.float_,
    "int_$rw$"  : Sk.builtin.int_,
    "bool"      : Sk.builtin.bool,
    "complex"   : Sk.builtin.complex,
    "dict"      : Sk.builtin.dict,
    "file"      : Sk.builtin.file,
    "frozenset" : Sk.builtin.frozenset,
    "function"  : Sk.builtin.func,
    "generator" : Sk.builtin.generator,
    "list"      : Sk.builtin.list,
    "long_$rw$" : Sk.builtin.lng,
    "method"    : Sk.builtin.method,
    "object"    : Sk.builtin.object,
    "slice"     : Sk.builtin.slice,
    "str"       : Sk.builtin.str,
    "set"       : Sk.builtin.set,
    "tuple"     : Sk.builtin.tuple,
    "type"      : Sk.builtin.type,

    "input"     : null,
    "raw_input" : new Sk.builtin.func(Sk.builtin.raw_input),
    "setattr"   : null,
    /*'read': Sk.builtin.read,*/
    "jseval"    : Sk.builtin.jseval,
    "jsmillis"  : Sk.builtin.jsmillis,
    "quit"      : new Sk.builtin.func(Sk.builtin.quit),
    "exit"      : new Sk.builtin.func(Sk.builtin.quit),
    "print"     : null,
    "divmod"    : null,
    "format"    : null,
    "globals"   : null,
    "issubclass": null,
    "iter"      : null,

    // Functions below are not implemented
    // "bytearray" : Sk.builtin.bytearray,
    // "callable"  : Sk.builtin.callable,
    // "delattr"   : Sk.builtin.delattr,
    // "eval_$rw$" : Sk.builtin.eval_,
    "execfile"  : Sk.builtin.execfile,
    
    "help"      : Sk.builtin.help,
    // "locals"    : Sk.builtin.locals,
    "memoryview": Sk.builtin.memoryview,
    // "next"      : Sk.builtin.next_,
    // "pow"       : Sk.builtin.pow,
    "reload"    : Sk.builtin.reload,
    "super_$rw$"     : Sk.builtin.super_,
    "unichr"    : new Sk.builtin.func(Sk.builtin.unichr),
    "vars"      : Sk.builtin.vars,
    "apply_$rw$": Sk.builtin.apply_,
    "buffer"    : Sk.builtin.buffer,
    "coerce"    : Sk.builtin.coerce,
    "intern"    : Sk.builtin.intern,


    "property"     : Sk.builtin.property,
    "classmethod"  : Sk.builtin.classmethod,
    "staticmethod" : Sk.builtin.staticmethod,

    "Ellipsis": Sk.builtin.Ellipsis
};

const pyNone = Sk.builtin.none.none$;
const emptyTuple = new Sk.builtin.tuple();
const pyZero = new Sk.builtin.int_(0);

Sk.abstr.setUpModuleMethods("builtins", Sk.builtins, {
    // __build_class__: {
    //     $meth: Sk.builtin.__build_class__,
    //     $flags: {},
    //     $textsig: null,
    //     $doc:"doc deleted"
    // },

    __import__: {
        $meth(name, globals, _locals, formlist, level) {
            if (!Sk.builtin.checkString(name)) {
                throw new Sk.builtin.TypeError("__import__() argument 1 must be str, not " + name.tp$name);
            } else if (name === Sk.builtin.str.$empty && level.v === 0) {
                throw new Sk.builtin.ValueError("Empty module name");
            }
            // check globals - locals is just ignored __import__
            globals = globLocToJs(globals, "globals") || {};
            formlist = Sk.ffi.remapToJs(formlist);
            level = Sk.ffi.remapToJs(level);

            return Sk.builtin.__import__(name, globals, undefined, formlist, level);
        },
        $flags: {
            NamedArgs: ["name", "globals", "locals", "fromlist", "level"],
            Defaults: [pyNone, pyNone, emptyTuple, pyZero],
        },
        $textsig: null,
        $doc:"doc deleted",
    },

    abs: {
        $meth: Sk.builtin.abs,
        $flags: { OneArg: true },
        $textsig: "($module, x, /)",
        $doc:"doc deleted",
    },

    all: {
        $meth: Sk.builtin.all,
        $flags: { OneArg: true },
        $textsig: "($module, iterable, /)",
        $doc:"doc deleted",
    },

    any: {
        $meth: Sk.builtin.any,
        $flags: { OneArg: true },
        $textsig: "($module, iterable, /)",
        $doc:"doc deleted",
    },

    ascii: {
        $meth: Sk.builtin.ascii,
        $flags: {OneArg: true},
        $textsig: "($module, obj, /)",
        $doc:"doc deleted"
    },

    bin: {
        $meth: Sk.builtin.bin,
        $flags: { OneArg: true },
        $textsig: "($module, number, /)",
        $doc:"doc deleted",
    },

    // breakpoint: {
    //     $meth: Sk.builtin.breakpoint,
    //     $flags: {},
    //     $textsig: null,
    //     $doc:"doc deleted"
    // },

    callable: {
        $meth: Sk.builtin.callable,
        $flags: { OneArg: true },
        $textsig: "($module, obj, /)",
        $doc:"doc deleted",
    },

    chr: {
        $meth: Sk.builtin.chr,
        $flags: { OneArg: true },
        $textsig: "($module, i, /)",
        $doc:"doc deleted",
    },

    compile: {
        $meth: Sk.builtin.compile,
        $flags: {MinArgs: 3, MaxArgs:6},
        $textsig: "($module, /, source, filename, mode, flags=0,\n        dont_inherit=False, optimize=-1)",
        $doc:"doc deleted"
    },

    delattr: {
        $meth: Sk.builtin.delattr,
        $flags: { MinArgs: 2, MaxArgs: 2 },
        $textsig: "($module, obj, name, /)",
        $doc:"doc deleted",
    },

    dir: {
        $meth: Sk.builtin.dir,
        $flags: { MinArgs: 0, MaxArgs: 1 },
        $textsig: null,
        $doc:"doc deleted",
    },

    divmod: {
        $meth: Sk.builtin.divmod,
        $flags: { MinArgs: 2, MaxArgs: 2 },
        $textsig: "($module, x, y, /)",
        $doc:"doc deleted",
    },

    eval_$rw$: {
        $name: "eval",
        $meth: function (source, globals, locals) {
            // check globals
            const tmp_globals = globLocToJs(globals, "globals");
            // check locals
            const tmp_locals = globLocToJs(locals, "locals");
            return Sk.misceval.chain(Sk.builtin.evalx(source, tmp_globals, tmp_locals), (res) => {
                reassignGlobLoc(globals, tmp_globals);
                reassignGlobLoc(locals, tmp_locals);
                return res;
            });
        },
        $flags: { MinArgs: 1, MaxArgs: 3 },
        $textsig: "($module, source, globals=None, locals=None, /)",
        $doc:"doc deleted",
    },

    exec: {
        $meth: function (source, globals, locals) {
            // check globals
            const tmp_globals = globLocToJs(globals, "globals");
            // check locals
            const tmp_locals = globLocToJs(locals, "locals");
            return Sk.misceval.chain(Sk.builtin.exec(source, tmp_globals, tmp_locals), (new_locals) => {
                reassignGlobLoc(globals, tmp_globals);
                reassignGlobLoc(locals, tmp_locals);
                return Sk.builtin.none.none$;
            });
        },
        $flags: { MinArgs: 1, MaxArgs: 3 },
        $textsig: "($module, source, globals=None, locals=None, /)",
        $doc:"doc deleted",
    },

    format: {
        $meth: Sk.builtin.format,
        $flags: { MinArgs: 1, MaxArgs: 2 },
        $textsig: "($module, value, format_spec='', /)",
        $doc:"doc deleted",
    },

    getattr: {
        $meth: Sk.builtin.getattr,
        $flags: { MinArgs: 2, MaxArgs: 3 },
        $textsig: null,
        $doc:"doc deleted",
    },

    globals: {
        $meth: Sk.builtin.globals,
        $flags: { NoArgs: true },
        $textsig: "($module, /)",
        $doc:"doc deleted",
    },

    hasattr: {
        $meth: Sk.builtin.hasattr,
        $flags: { MinArgs: 2, MaxArgs: 2 },
        $textsig: "($module, obj, name, /)",
        $doc:"doc deleted",
    },

    hash: {
        $meth: Sk.builtin.hash,
        $flags: { OneArg: true },
        $textsig: "($module, obj, /)",
        $doc:"doc deleted",
    },

    hex: {
        $meth: Sk.builtin.hex,
        $flags: { OneArg: true },
        $textsig: "($module, number, /)",
        $doc:"doc deleted",
    },

    id: {
        $meth: Sk.builtin.id,
        $flags: { OneArg: true },
        $textsig: "($module, obj, /)",
        $doc:"doc deleted",
    },

    input: {
        $meth: Sk.builtin.input,
        $flags: { MinArgs: 0, MaxArgs: 1 },
        $textsig: "($module, prompt=None, /)",
        $doc:"doc deleted",
    },

    isinstance: {
        $meth: Sk.builtin.isinstance,
        $flags: { MinArgs: 2, MaxArgs: 2 },
        $textsig: "($module, obj, class_or_tuple, /)",
        $doc:"doc deleted",
    },

    issubclass: {
        $meth: Sk.builtin.issubclass,
        $flags: { MinArgs: 2, MaxArgs: 2 },
        $textsig: "($module, cls, class_or_tuple, /)",
        $doc:"doc deleted",
    },

    iter: {
        $meth: Sk.builtin.iter,
        $flags: { MinArgs: 1, MaxArgs: 2 },
        $textsig: "($module, iterable /)",
        $doc:"doc deleted",
    },

    len: {
        $meth: Sk.builtin.len,
        $flags: { OneArg: true },
        $textsig: "($module, obj, /)",
        $doc:"doc deleted",
    },

    locals: {
        $meth: Sk.builtin.locals,
        $flags: { NoArgs: true },
        $textsig: "($module, /)",
        $doc:"doc deleted",
    },

    max: {
        $meth: Sk.builtin.max,
        $flags: { FastCall: true },
        $textsig: null,
        $doc:"doc deleted",
    },

    min: {
        $meth: Sk.builtin.min,
        $flags: { FastCall: true },
        $textsig: null,
        $doc:"doc deleted",
    },

    next: {
        $name: "next",
        $meth: Sk.builtin.next_,
        $flags: { MinArgs: 1, MaxArgs: 2 },
        $textsig: null,
        $doc:"doc deleted",
    },

    oct: {
        $meth: Sk.builtin.oct,
        $flags: { OneArg: true },
        $textsig: "($module, number, /)",
        $doc:"doc deleted",
    },

    open: {
        $meth: Sk.builtin.open,
        $flags: {
            MinArgs: 1,
            MaxArgs: 3,
            //NamedArgs: ["file, mode, buffering, encoding, errors, newline, closefd, opener"],
            //Defaults: [new Sk.builtin.str("r"), new Sk.builtin.int_(-1), Sk.builtin.none.none$, Sk.builtin.none.none$, Sk.builtin.none.none$, Sk.builtin.bool.true$, Sk.builtin.none.none$]
        },
        $textsig: null,
        // $textsig: "($module, /, file, mode='r', buffering=-1, encoding=None,\n     errors=None, newline=None, closefd=True, opener=None)",
        // this is the python 2 documentation since we don't support the py3 version
        $doc:"doc deleted",
    },

    ord: {
        $meth: Sk.builtin.ord,
        $flags: { OneArg: true },
        $textsig: "($module, c, /)",
        $doc:"doc deleted",
    },

    pow: {
        $meth: Sk.builtin.pow,
        $flags: { MinArgs: 2, MaxArgs: 3 },
        $textsig: "($module, x, y, z=None, /)",
        $doc:"doc deleted",
    },

    print: {
        $meth: Sk.builtin.print,
        $flags: { FastCall: true },
        $textsig: null,
        $doc:"doc deleted",
    },

    repr: {
        $meth: Sk.builtin.repr,
        $flags: { OneArg: true },
        $textsig: "($module, obj, /)",
        $doc:"doc deleted",
    },

    round: {
        $meth: Sk.builtin.round,
        $flags: {
            NamedArgs: ["number", "ndigits"],
        },
        $textsig: "($module, /, number, ndigits=None)",
        $doc:"doc deleted",
    },

    setattr: {
        $meth: Sk.builtin.setattr,
        $flags: { MinArgs: 3, MaxArgs: 3 },
        $textsig: "($module, obj, name, value, /)",
        $doc:"doc deleted",
    },

    sorted: {
        $meth: Sk.builtin.sorted,
        $flags: {
            NamedArgs: [null, "cmp", "key", "reverse"],
            Defaults: [Sk.builtin.none.none$, Sk.builtin.none.none$, Sk.builtin.bool.false$],
        }, // should be fast call leave for now
        $textsig: "($module, iterable, /, *, key=None, reverse=False)",
        $doc:"doc deleted",
    },

    sum: {
        $meth: Sk.builtin.sum,
        $flags: {
            NamedArgs: [null, "start"],
            Defaults: [new Sk.builtin.int_(0)],
        },
        $textsig: "($module, iterable, /, start=0)", //changed in python 3.8 start
        $doc:"doc deleted",
    },

    vars: {
        $meth: Sk.builtin.vars,
        $flags: { MinArgs: 0, MaxArgs: 1 },
        $textsig: null,
        $doc:"doc deleted",
    },
});

// function used for exec and eval
function globLocToJs(glob_loc, name) {
    let tmp = undefined;
    if (glob_loc === undefined || Sk.builtin.checkNone(glob_loc)) {
        glob_loc = undefined;
    } else if (!(glob_loc instanceof Sk.builtin.dict)) {
        throw new Sk.builtin.TypeError(name + " must be a dict or None, not " + Sk.abstr.typeName(glob_loc));
    } else {
        tmp = {};
        // we only support dicts here since actually we need to convert this to a hashmap for skulpts version of
        // compiled code. Any old mapping won't do, it must be iterable!
        glob_loc.$items().forEach(([key, val]) => {
            if (Sk.builtin.checkString(key)) {
                tmp[key.$mangled] = val;
            }
        });
    }
    return tmp;
}

function reassignGlobLoc(dict, obj) {
    if (dict === undefined || Sk.builtin.checkNone(dict)) {
        return;
    }
    for (let key in obj) {
        // this isn't technically correct - if they use delete in the exec this breaks
        dict.mp$ass_subscript(new Sk.builtin.str(Sk.unfixReserved(key)), obj[key]);
    }
}


Sk.setupObjects = function (py3) {
    if (py3) {
        Sk.builtins["filter"] = Sk.builtin.filter_;
        Sk.builtins["map"] = Sk.builtin.map_;
        Sk.builtins["zip"] = Sk.builtin.zip_;
        Sk.builtins["range"] = Sk.builtin.range_;
        delete Sk.builtins["reduce"];
        delete Sk.builtins["xrange"];
        delete Sk.builtins["StandardError"];
        delete Sk.builtins["unicode"];
        delete Sk.builtins["basestring"];
        delete Sk.builtins["long_$rw$"];
        Sk.builtin.int_.prototype.$r = function () {
            return new Sk.builtin.str(this.v.toString());
        };
        delete Sk.builtin.int_.prototype.tp$str;
        delete Sk.builtin.bool.prototype.tp$str;
        delete Sk.builtins["raw_input"];
        delete Sk.builtins["unichr"];
        delete Sk.builtin.str.prototype.decode;
        Sk.builtins["bytes"] = Sk.builtin.bytes;
        Sk.builtins["ascii"] = new Sk.builtin.sk_method(
            {
                $meth: Sk.builtin.ascii,
                $flags: { OneArg: true },
                $textsig: "($module, obj, /)",
                $doc:"doc deleted",
            },
            null,
            "builtins"
        );
    } else {
        Sk.builtins["range"] = new Sk.builtin.sk_method(
            {
                $meth: Sk.builtin.range,
                $name: "range",
                $flags: { MinArgs: 1, MaxArgs: 3 },
            },
            undefined,
            "builtins"
        );
        Sk.builtins["xrange"] = new Sk.builtin.sk_method(
            {
                $meth: Sk.builtin.xrange,
                $name: "xrange",
                $flags: { MinArgs: 1, MaxArgs: 3 },
            },
            null,
            "builtins"
        );
        Sk.builtins["reduce"] = new Sk.builtin.sk_method(
            {
                $meth: Sk.builtin.reduce,
                $name: "reduce",
                $flags: { MinArgs: 2, MaxArgs: 3 },
            },
            null,
            "builtins"
        );
        Sk.builtins["filter"] = new Sk.builtin.func(Sk.builtin.filter);
        Sk.builtins["map"] = new Sk.builtin.func(Sk.builtin.map);
        Sk.builtins["zip"] = new Sk.builtin.func(Sk.builtin.zip);
        Sk.builtins["StandardError"] = Sk.builtin.Exception;
        Sk.builtins["unicode"] = Sk.builtin.str;
        Sk.builtins["basestring"] = Sk.builtin.str;
        Sk.builtins["long_$rw$"] = Sk.builtin.lng;
        Sk.builtin.int_.prototype.$r = function () {
            const v = this.v;
            if (typeof v === "number") {
                return new Sk.builtin.str(v.toString());
            } else {
                return new Sk.builtin.str(v.toString() + "L");
            }
        };
        Sk.builtin.int_.prototype.tp$str = function () {
            return new Sk.builtin.str(this.v.toString());
        };
        Sk.builtin.bool.prototype.tp$str = function () {
            return this.$r();
        };
        Sk.builtins["raw_input"] = new Sk.builtin.func(Sk.builtin.raw_input);
        Sk.builtins["unichr"] = new Sk.builtin.func(Sk.builtin.unichr);
        Sk.builtin.str.prototype.decode = Sk.builtin.str.$py2decode;
        delete Sk.builtins["bytes"];
        delete Sk.builtins["ascii"];
    }
};

Sk.exportSymbol("Sk.setupObjects", Sk.setupObjects);
Sk.exportSymbol("Sk.builtins", Sk.builtins);

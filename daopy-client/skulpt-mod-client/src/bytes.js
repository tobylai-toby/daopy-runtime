require("fastestsmallesttextencoderdecoder");

// Mapping from supported valid encodings to normalized encoding name
const supportedEncodings = {
    utf: "utf-8",
    utf8: "utf-8",
    utf_8: "utf-8",
    latin_1: "latin1", // browser spec
    ascii: "ascii",
    utf16: "utf-16",
    utf_16: "utf-16",
};

var space_reg = /\s+/g;
var underscore_hyphen_reg = /[_-]+/g;
function normalizeEncoding(encoding) {
    const normalized = encoding.replace(space_reg, "").replace(underscore_hyphen_reg, "_").toLowerCase();
    const supported = supportedEncodings[normalized];
    if (supported === undefined) {
        return encoding;
    } else {
        return supported;
    }
}
const UtfEncoder = new TextEncoder();
const UtfDecoder = new TextDecoder();

/**
 * @constructor
 * @param {undefined|Uint8Array|Array|number|string} source Using constructor with new should be a js object
 * @return {Sk.builtin.bytes}
 * @extends {Sk.builtin.object}
 */
Sk.builtin.bytes = Sk.abstr.buildNativeClass("bytes", {
    constructor: function bytes(source) {
        if (!(this instanceof Sk.builtin.bytes)) {
            throw new TypeError("bytes is a constructor use 'new'");
        }
        // deal with internal calls
        if (source === undefined) {
            this.v = new Uint8Array();
        } else if (source instanceof Uint8Array) {
            this.v = source;
        } else if (Array.isArray(source)) {
            Sk.asserts.assert(
                source.every((x) => x >= 0 && x <= 0xff),
                "bad internal call to bytes with array"
            );
            this.v = new Uint8Array(source);
        } else if (typeof source === "string") {
            // fast path must be binary string https://developer.mozilla.org/en-US/docs/Web/API/DOMString/Binary
            // i.e. the reverse of this.$jsstr();
            let cc;
            const uint8 = new Uint8Array(source.length);
            const len = source.length;
            for (let i = 0; i < len; i++) {
                cc = source.charCodeAt(i);
                if (cc > 0xff) {
                    throw new Sk.builtin.UnicodeDecodeError("invalid string at index " + i + " (possibly contains a unicode character)");
                }
                uint8[i] = cc;
            }
            this.v = uint8;
        } else if (typeof source === "number") {
            this.v = new Uint8Array(source);
        } else {
            throw new TypeError(`bad internal argument to bytes constructor (got '${typeof source}': ${source})`);
        }
    },
    slots: /**@lends {Sk.builtin.bytes.prototype} */ {
        tp$getattr: Sk.generic.getAttr,
        tp$doc:"",
        tp$new(args, kwargs) {
            if (this !== Sk.builtin.bytes.prototype) {
                return this.$subtype_new(args, kwargs);
            }
            kwargs = kwargs || [];
            let source, pySource, dunderBytes, encoding, errors;
            if (args.length <= 1 && +kwargs.length === 0) {
                pySource = args[0];
            } else {
                [pySource, encoding, errors] = Sk.abstr.copyKeywordsToNamedArgs(
                    "bytes",
                    [null, "encoding", "errors"],
                    args,
                    kwargs
                );
                ({ encoding, errors } = checkGetEncodingErrors("bytes", encoding, errors));
                if (!Sk.builtin.checkString(pySource)) {
                    throw new Sk.builtin.TypeError("encoding or errors without a string argument");
                }
                return strEncode(pySource, encoding, errors);
            }

            if (pySource === undefined) {
                return new Sk.builtin.bytes();
            } else if ((dunderBytes = Sk.abstr.lookupSpecial(pySource, Sk.builtin.str.$bytes)) !== undefined) {
                const ret = Sk.misceval.callsimOrSuspendArray(dunderBytes, []);
                return Sk.misceval.chain(ret, (bytesSource) => {
                    if (!Sk.builtin.checkBytes(bytesSource)) {
                        throw new Sk.builtin.TypeError("__bytes__ returned non-bytes (type " + Sk.abstr.typeName(bytesSource) + ")");
                    }
                    return bytesSource;
                });
            } else if (Sk.misceval.isIndex(pySource)) {
                source = Sk.misceval.asIndexSized(pySource, Sk.builtin.OverflowError);
                if (source < 0) {
                    throw new Sk.builtin.ValueError("negative count");
                }
                return new Sk.builtin.bytes(source);
            } else if (Sk.builtin.checkBytes(pySource)) {
                return new Sk.builtin.bytes(pySource.v);
            } else if (Sk.builtin.checkString(pySource)) {
                throw new Sk.builtin.TypeError("string argument without an encoding");
            } else if (Sk.builtin.checkIterable(pySource)) {
                let source = [];
                let r = Sk.misceval.iterFor(Sk.abstr.iter(pySource), (byte) => {
                    const n = Sk.misceval.asIndexSized(byte);
                    if (n < 0 || n > 255) {
                        throw new Sk.builtin.ValueError("bytes must be in range(0, 256)");
                    }
                    source.push(n);
                });
                return Sk.misceval.chain(r, () => new Sk.builtin.bytes(source));
            }
            throw new Sk.builtin.TypeError("cannot convert '" + Sk.abstr.typeName(pySource) + "' object into bytes");
        },
        $r() {
            let num;
            let quote = "'";
            const hasdbl = this.v.indexOf(34) !== -1;
            let ret = "";

            for (let i = 0; i < this.v.length; i++) {
                num = this.v[i];
                if (num < 9 || (num > 10 && num < 13) || (num > 13 && num < 32) || num > 126) {
                    ret += makehexform(num);
                } else if (num === 9 || num === 10 || num === 13 || num === 39 || num === 92) {
                    switch (num) {
                        case 9:
                            ret += "\\t";
                            break;
                        case 10:
                            ret += "\\n";
                            break;
                        case 13:
                            ret += "\\r";
                            break;
                        case 39:
                            if (hasdbl) {
                                ret += "\\'";
                            } else {
                                ret += "'";
                                quote = '"';
                            }
                            break;
                        case 92:
                            ret += "\\\\";
                            break;
                    }
                } else {
                    ret += String.fromCharCode(num);
                }
            }
            ret = "b" + quote + ret + quote;
            return new Sk.builtin.str(ret);
        },
        tp$str() {
            return this.$r();
        },
        tp$iter() {
            return new bytes_iter_(this);
        },
        tp$richcompare(other, op) {
            if (this === other && Sk.misceval.opAllowsEquality(op)) {
                return true;
            } else if (!(other instanceof Sk.builtin.bytes)) {
                return Sk.builtin.NotImplemented.NotImplemented$;
            }
            const v = this.v;
            const w = other.v;
            if (v.length !== w.length && (op === "Eq" || op === "NotEq")) {
                /* Shortcut: if the lengths differ, the bytes differ */
                return op === "Eq" ? false : true;
            }
            let i;
            const min_len = Math.min(v.length, w.length);
            for (i = 0; i < min_len; i++) {
                if (v[i] !== w[i]) {
                    break; // we've found a different element
                }
            }
            switch (op) {
                case "Lt":
                    return (i === min_len && v.length < w.length) || v[i] < w[i];
                case "LtE":
                    return (i === min_len && v.length <= w.length) || v[i] <= w[i];
                case "Eq":
                    return i === min_len;
                case "NotEq":
                    return i < min_len;
                case "Gt":
                    return (i === min_len && v.length > w.length) || v[i] > w[i];
                case "GtE":
                    return (i === min_len && v.length >= w.length) || v[i] >= w[i];
            }
        },
        tp$hash() {
            return new Sk.builtin.str(this.$jsstr()).tp$hash();
        },
        tp$as_sequence_or_mapping: true,
        mp$subscript(index) {
            if (Sk.misceval.isIndex(index)) {
                let i = Sk.misceval.asIndexSized(index, Sk.builtin.IndexError);
                if (i !== undefined) {
                    if (i < 0) {
                        i = this.v.length + i;
                    }
                    if (i < 0 || i >= this.v.length) {
                        throw new Sk.builtin.IndexError("index out of range");
                    }
                    return new Sk.builtin.int_(this.v[i]);
                }
            } else if (index instanceof Sk.builtin.slice) {
                const ret = [];
                index.sssiter$(this.v.length, (i) => {
                    ret.push(this.v[i]);
                });
                return new Sk.builtin.bytes(new Uint8Array(ret));
            }
            throw new Sk.builtin.TypeError("byte indices must be integers or slices, not " + Sk.abstr.typeName(index));
        },
        sq$length() {
            return this.v.length;
        },
        sq$concat(other) {
            if (!(other instanceof Sk.builtin.bytes)) {
                throw new Sk.builtin.TypeError("can't concat " + Sk.abstr.typeName(other) + " to bytes");
            }
            const ret = new Uint8Array(this.v.length + other.v.length);
            let i;
            for (i = 0; i < this.v.length; i++) {
                ret[i] = this.v[i];
            }
            for (let j = 0; j < other.v.length; j++, i++) {
                ret[i] = other.v[j];
            }
            return new Sk.builtin.bytes(ret);
        },
        sq$repeat(n) {
            if (!Sk.misceval.isIndex(n)) {
                throw new Sk.builtin.TypeError("can't multiply sequence by non-int of type '" + Sk.abstr.typeName(n) + "'");
            }
            n = Sk.misceval.asIndexSized(n, Sk.builtin.OverflowError);
            const len = n * this.v.length;
            if (len > Number.MAX_SAFE_INTEGER) {
                throw new Sk.builtin.OverflowError();
            } else if (n <= 0) {
                return new Sk.builtin.bytes();
            }
            const ret = new Uint8Array(len);
            let j = 0;
            while (j < len) {
                for (let i = 0; i < this.v.length; i++) {
                    ret[j++] = this.v[i];
                }
            }
            return new Sk.builtin.bytes(ret);
        },
        sq$contains(tgt) {
            return this.find$left(tgt) !== -1;
        },
        tp$as_number: true,
        nb$remainder: Sk.builtin.str.prototype.nb$remainder,
    },
    proto: {
        $jsstr() {
            // returns binary string - not bidirectional for non ascii characters - use with caution
            // i.e. new Sk.builtin.bytes(x.$jsstr()).v  may be different to x.v;
            let ret = "";
            for (let i = 0; i < this.v.length; i++) {
                ret += String.fromCharCode(this.v[i]);
            }
            return ret;
        },
        get$tgt(tgt) {
            if (tgt instanceof Sk.builtin.bytes) {
                return tgt.v;
            }
            tgt = Sk.misceval.asIndexOrThrow(tgt, "argument should be integer or bytes-like object, not {tp$name}");
            if (tgt < 0 || tgt > 0xff) {
                throw new Sk.builtin.ValueError("bytes must be in range(0, 256)");
            }
            return tgt;
        },
        get$raw(tgt) {
            if (tgt instanceof Sk.builtin.bytes) {
                return tgt.v;
            }
            throw new Sk.builtin.TypeError("a bytes-like object is required, not '" + Sk.abstr.typeName(tgt) + "'");
        },
        get$splitArgs: checkSepMaxSplit,
        find$left: mkFind(false),
        find$right: mkFind(true),
        find$subleft: function findSubLeft(uint8, start, end) {
            end = end - uint8.length + 1;
            let i = start;
            while (i < end) {
                if (uint8.every((val, j) => val === this.v[i + j])) {
                    return i;
                }
                i++;
            }
            return -1;
        },
        find$subright(uint8, start, end) {
            let i = end - uint8.length;
            while (i >= start) {
                if (uint8.every((val, j) => val === this.v[i + j])) {
                    return i;
                }
                i--;
            }
            return -1;
        },
        $subtype_new(args, kwargs) {
            const instance = new this.constructor();
            // we call bytes new method with all the args and kwargs
            const bytes_instance = Sk.builtin.bytes.prototype.tp$new(args, kwargs);
            instance.v = bytes_instance.v;
            return instance;
        },
        sk$asarray() {
            const ret = [];
            this.v.forEach((x) => {ret.push(new Sk.builtin.int_(x));});
            return ret;
        },
        valueOf() {
            return this.v;
        },
    },
    flags: {
        str$encode: strEncode,
        $decode: bytesDecode,
        check$encodeArgs: checkGetEncodingErrors,
    },
    methods: {
        __getnewargs__: {
            $meth() {
                return new Sk.builtin.tuple(new Sk.builtin.bytes(this.v));
            },
            $flags: { NoArgs: true },
            $textsig: null,
            $doc: null,
        },
        capitalize: {
            $meth() {
                const len = this.v.length;
                if (len === 0) {
                    return new Sk.builtin.bytes(this.v);
                }
                const final = new Uint8Array(len);
                let val = this.v[0];
                final[0] = islower(val) ? val - 32 : val;
                for (let i = 1; i < len; i++) {
                    val = this.v[i];
                    final[i] = isupper(val) ? val + 32 : val;
                }
                return new Sk.builtin.bytes(final);
            },
            $flags: { NoArgs: true },
            $textsig: null,
            $doc:"",
        },
        center: {
            $meth: mkJust("center", false, true),
            $flags: { MinArgs: 1, MaxArgs: 2 },
            $textsig: null,
            $doc:"",
        },
        count: {
            $meth(tgt, start, end) {
                tgt = this.get$tgt(tgt);
                ({ start, end } = Sk.builtin.slice.startEnd$wrt(this, start, end));
                let count = 0;
                if (typeof tgt === "number") {
                    for (let i = start; i < end; i++) {
                        if (this.v[i] === tgt) {
                            count++;
                        }
                    }
                } else {
                    const upto = end - tgt.length + 1;
                    for (let i = start; i < upto; i++) {
                        if (tgt.every((val, j) => val === this.v[i + j])) {
                            count++;
                            i += tgt.length - 1;
                        }
                    }
                }
                return new Sk.builtin.int_(count);
            },
            $flags: { MinArgs: 1, MaxArgs: 3 },
            $textsig: null,
            $doc:"",
        },
        decode: {
            $meth: bytesDecode,
            $flags: { NamedArgs: ["encoding", "errors"] },
            $textsig: "($self, /, encoding='utf-8', errors='strict')",
            $doc:"",
        },
        endswith: {
            $meth: mkStartsEndsWith("endswith", (subarray, tgt) => {
                const start = subarray.length - tgt.length;
                return start >= 0 && tgt.every((val, i) => val === subarray[start + i]);
            }),
            $flags: { MinArgs: 1, MaxArgs: 3 },
            $textsig: null,
            $doc:"",
        },
        expandtabs: {
            $meth(tabsize) {
                tabsize = Sk.misceval.asIndexSized(tabsize, Sk.builtin.OverflowError, "an integer is required (got type {tp$nam})");
                const final = [];
                let linepos = 0;
                for (let i = 0; i < this.v.length; i++) {
                    const val = this.v[i];
                    if (val === 9) {
                        const inc = tabsize - (linepos % tabsize);
                        final.push(...new Array(inc).fill(32));
                        linepos += inc;
                    } else if (val === 10 || val === 13) {
                        final.push(val);
                        linepos = 0;
                    } else {
                        final.push(val);
                        linepos++;
                    }
                }
                return new Sk.builtin.bytes(new Uint8Array(final));
            },
            $flags: { NamedArgs: ["tabsize"], Defaults: [8] },
            $textsig: null,
            $doc:"",
        },
        find: {
            $meth: function find(tgt, start, end) {
                return new Sk.builtin.int_(this.find$left(tgt, start, end));
            },
            $flags: { MinArgs: 1, MaxArgs: 3 },
            $textsig: null,
            $doc:"",
        },
        hex: {
            $meth() {
                let final = "";
                for (let i = 0; i < this.v.length; i++) {
                    final += this.v[i].toString(16).padStart(2, "0");
                }
                return new Sk.builtin.str(final);
            },
            $flags: { NoArgs: true },
            $textsig: null,
            $doc:"",
        },
        index: {
            $meth: function index(tgt, start, end) {
                const val = this.find$left(tgt, start, end);
                if (val === -1) {
                    throw new Sk.builtin.ValueError("subsection not found");
                } else {
                    return new Sk.builtin.int_(val);
                }
            },
            $flags: { MinArgs: 1, MaxArgs: 3 },
            $textsig: null,
            $doc:"",
        },
        isalnum: {
            $meth: mkIsAll((val) => isdigit(val) || islower(val) || isupper(val)),
            $flags: { NoArgs: true },
            $textsig: null,
            $doc:"",
        },
        isalpha: {
            $meth: mkIsAll((val) => (val >= 65 && val <= 90) || (val >= 97 && val <= 122)),
            $flags: { NoArgs: true },
            $textsig: null,
            $doc:"",
        },
        isascii: {
            $meth: mkIsAll((val) => val >= 0 && val <= 0x7f, true),
            $flags: { NoArgs: true },
            $textsig: null,
            $doc:"",
        },
        isdigit: {
            $meth: mkIsAll(isdigit),
            $flags: { NoArgs: true },
            $textsig: null,
            $doc:"",
        },
        islower: {
            $meth: makeIsUpperLower(islower, isupper),
            $flags: { NoArgs: true },
            $textsig: null,
            $doc:"",
        },
        isspace: {
            $meth: mkIsAll(isspace),
            $flags: { NoArgs: true },
            $textsig: null,
            $doc:"",
        },
        istitle: {
            $meth: function istitle() {
                let inword = false;
                let cased = false;
                for (let i = 0; i < this.v.length; i++) {
                    const val = this.v[i];
                    if (isupper(val)) {
                        if (inword) {
                            return Sk.builtin.bool.false$;
                        }
                        inword = true;
                        cased = true;
                    } else if (islower(val)) {
                        if (!inword) {
                            return Sk.builtin.bool.false$;
                        }
                        cased = true;
                    } else {
                        inword = false;
                    }
                }
                return cased ? Sk.builtin.bool.true$ : Sk.builtin.bool.false$;
            },
            $flags: { NoArgs: true },
            $textsig: null,
            $doc:"",
        },
        isupper: {
            $meth: makeIsUpperLower(isupper, islower),
            $flags: { NoArgs: true },
            $textsig: null,
            $doc:"",
        },
        join: {
            $meth(iterable) {
                const final = [];
                let i = 0;
                return Sk.misceval.chain(
                    Sk.misceval.iterFor(Sk.abstr.iter(iterable), (item) => {
                        if (!(item instanceof Sk.builtin.bytes)) {
                            throw new Sk.builtin.TypeError(
                                "sequence item " + i + ": expected a bytes-like object, " + Sk.abstr.typeName(item) + " found"
                            );
                        }
                        i++;
                        if (final.length) {
                            final.push(...this.v);
                        }
                        final.push(...item.v);
                    }),
                    () => new Sk.builtin.bytes(new Uint8Array(final))
                );
            },
            $flags: { OneArg: true },
            $textsig: "($self, iterable_of_bytes, /)",
            $doc:"",
        },
        ljust: {
            $meth: mkJust("ljust", false, false),
            $flags: { MinArgs: 1, MaxArgs: 2 },
            $textsig: null,
            $doc:"",
        },
        lower: {
            $meth: mkCaseSwitch((val) => (isupper(val) ? val + 32 : val)),
            $flags: { NoArgs: true },
            $textsig: null,
            $doc:"",
        },
        lstrip: {
            $meth: mkStrip(true, false),
            $flags: { MinArgs: 0, MaxArgs: 1 },
            $textsig: "($self, bytes=None, /)",
            $doc:"",
        },
        partition: {
            $meth: mkPartition(false),
            $flags: { OneArg: true },
            $textsig: "($self, sep, /)",
            $doc:"",
        },
        replace: {
            $meth(oldB, newB, count) {
                oldB = this.get$raw(oldB);
                newB = this.get$raw(newB);
                count = count === undefined ? -1 : Sk.misceval.asIndexSized(count, Sk.builtin.OverflowError);
                count = count < 0 ? Infinity : count;
                const final = [];
                let found = 0,
                    i = 0;
                while (i < this.v.length && found < count) {
                    const next = this.find$subleft(oldB, i, this.v.length);
                    if (next === -1) {
                        break;
                    }
                    for (let j = i; j < next; j++) {
                        final.push(this.v[j]);
                    }
                    final.push(...newB);
                    i = next + oldB.length;
                    found++;
                }
                for (i; i < this.v.length; i++) {
                    final.push(this.v[i]);
                }
                return new Sk.builtin.bytes(new Uint8Array(final));
            },
            $flags: { MinArgs: 2, MaxArgs: 3 },
            $textsig: "($self, old, new, count=-1, /)",
            $doc:"",
        },
        rfind: {
            $meth(tgt, start, end) {
                return new Sk.builtin.int_(this.find$right(tgt, start, end));
            },
            $flags: { MinArgs: 1, MaxArgs: 3 },
            $textsig: null,
            $doc:"",
        },
        rindex: {
            $meth: function rindex(tgt, start, end) {
                const val = this.find$right(tgt, start, end);
                if (val === -1) {
                    throw new Sk.builtin.ValueError("subsection not found");
                } else {
                    return new Sk.builtin.int_(val);
                }
            },
            $flags: { MinArgs: 1, MaxArgs: 3 },
            $textsig: null,
            $doc:"",
        },
        rjust: {
            $meth: mkJust("rjust", true, false),
            $flags: { MinArgs: 1, MaxArgs: 2 },
            $textsig: null,
            $doc:"",
        },
        rpartition: {
            $meth: mkPartition(true),
            $flags: { OneArg: true },
            $textsig: "($self, sep, /)",
            $doc:"",
        },
        rsplit: {
            $meth: function rSplit(sep, maxsplit) {
                ({ sep, maxsplit } = this.get$splitArgs(sep, maxsplit));

                const result = [];
                let splits = 0,
                    i = this.v.length;

                if (sep !== null) {
                    while (i >= 0 && splits < maxsplit) {
                        const next = this.find$subright(sep, 0, i);
                        if (next === -1) {
                            break;
                        }
                        result.push(new Sk.builtin.bytes(this.v.subarray(next + sep.length, i)));
                        i = next;
                        splits++;
                    }
                    result.push(new Sk.builtin.bytes(this.v.subarray(0, i)));
                } else {
                    i--;
                    while (splits < maxsplit) {
                        while (isspace(this.v[i])) {
                            i--;
                        }
                        if (i < 0) {
                            break;
                        }
                        const index = i + 1;
                        i--;
                        while (i >= 0 && !isspace(this.v[i])) {
                            i--;
                        }
                        result.push(new Sk.builtin.bytes(this.v.subarray(i + 1, index)));
                        splits++;
                    }
                    if (i >= 0) {
                        while (isspace(this.v[i])) {
                            i--;
                        }
                        if (i >= 0) {
                            result.push(new Sk.builtin.bytes(this.v.subarray(0, i + 1)));
                        }
                    }
                }
                return new Sk.builtin.list(result.reverse());
            },
            $flags: { NamedArgs: ["sep", "maxsplit"], Defaults: [Sk.builtin.none.none$, -1] },
            $textsig: "($self, /, sep=None, maxsplit=-1)",
            $doc:"",
        },
        rstrip: {
            $meth: mkStrip(false, true),
            $flags: { MinArgs: 0, MaxArgs: 1 },
            $textsig: "($self, bytes=None, /)",
            $doc:"",
        },
        split: {
            $meth: function Split(sep, maxsplit) {
                ({ sep, maxsplit } = this.get$splitArgs(sep, maxsplit));

                const result = [];
                const mylen = this.v.length;
                let splits = 0,
                    i = 0;

                if (sep !== null) {
                    while (i < mylen && splits < maxsplit) {
                        const next = this.find$subleft(sep, i, mylen);
                        if (next === -1) {
                            break;
                        }
                        result.push(new Sk.builtin.bytes(this.v.subarray(i, next)));
                        i = next + sep.length;
                        splits++;
                    }
                    result.push(new Sk.builtin.bytes(this.v.subarray(i, mylen)));
                } else {
                    while (splits < maxsplit) {
                        while (isspace(this.v[i])) {
                            i++;
                        }
                        if (i === mylen) {
                            break;
                        }
                        const index = i;
                        i++;
                        while (i < mylen && !isspace(this.v[i])) {
                            i++;
                        }
                        result.push(new Sk.builtin.bytes(this.v.subarray(index, i)));
                        splits++;
                    }
                    if (i < mylen) {
                        while (isspace(this.v[i])) {
                            i++;
                        }
                        if (i < mylen) {
                            result.push(new Sk.builtin.bytes(this.v.subarray(i, mylen)));
                        }
                    }
                }
                return new Sk.builtin.list(result);
            },
            $flags: { NamedArgs: ["sep", "maxsplit"], Defaults: [Sk.builtin.none.none$, -1] },
            $textsig: "($self, /, sep=None, maxsplit=-1)",
            $doc:"",
        },
        splitlines: {
            $meth(keepends) {
                keepends = Sk.misceval.isTrue(keepends);
                const final = [];
                let sol = 0;
                let eol;
                let i = 0;
                const len = this.v.length;
                while (i < len) {
                    const val = this.v[i];
                    if (val === 13) {
                        // \r
                        const rn = this.v[i + 1] === 10; // \r\n
                        if (keepends) {
                            eol = rn ? i + 2 : i + 1;
                        } else {
                            eol = i;
                        }
                        final.push(new Sk.builtin.bytes(this.v.subarray(sol, eol)));
                        i = sol = rn ? i + 2 : i + 1;
                    } else if (val === 10) {
                        // \n
                        eol = keepends ? i + 1 : i;
                        final.push(new Sk.builtin.bytes(this.v.subarray(sol, eol)));
                        i = sol = i + 1;
                    } else {
                        i++;
                    }
                }
                if (sol < len) {
                    final.push(new Sk.builtin.bytes(this.v.subarray(sol, len)));
                }
                return new Sk.builtin.list(final);
            },
            $flags: { NamedArgs: ["keepends"], Defaults: [false] },
            $textsig: "($self, /, keepends=False)",
            $doc:"",
        },
        startswith: {
            $meth: mkStartsEndsWith("startswith", (subarray, tgt) => tgt.length <= subarray.length && tgt.every((val, i) => val === subarray[i])),
            $flags: { MinArgs: 1, MaxArgs: 3 },
            $textsig: null,
            $doc:"",
        },
        strip: {
            $meth: mkStrip(true, true),
            $flags: { MinArgs: 0, MaxArgs: 1 },
            $textsig: "($self, bytes=None, /)",
            $doc:"",
        },
        swapcase: {
            $meth: mkCaseSwitch((val) => (isupper(val) ? val + 32 : islower(val) ? val - 32 : val)),
            $flags: { NoArgs: true },
            $textsig: null,
            $doc:"",
        },
        title: {
            $meth() {
                const len = this.v.length;
                const final = new Uint8Array(len);
                let inword = false;
                for (let i = 0; i < len; i++) {
                    const val = this.v[i];
                    if (isupper(val)) {
                        final[i] = inword ? val + 32 : val;
                        inword = true;
                    } else if (islower(val)) {
                        final[i] = inword ? val : val - 32;
                        inword = true;
                    } else {
                        final[i] = val;
                        inword = false;
                    }
                }
                return new Sk.builtin.bytes(final);
            },
            $flags: { NoArgs: true },
            $textsig: null,
            $doc:"",
        },
        // translate: {
        //     $meth() {
        //         throw new Sk.builtin.NotImplementedError("translate() bytes method not implemented in Skulpt");
        //     },
        //     $flags: { NoArgs: true },
        //     $textsig: "($self, table, /, delete=b'')",
        //     $doc:"",
        // },
        upper: {
            $meth: mkCaseSwitch((val) => (islower(val) ? val - 32 : val)),
            $flags: { NoArgs: true },
            $textsig: null,
            $doc:"",
        },
        zfill: {
            $meth(width) {
                width = Sk.misceval.asIndexSized(width, Sk.builtin.IndexError);
                const fill_len = width - this.v.length;
                if (fill_len <= 0) {
                    return new Sk.builtin.bytes(this.v);
                }
                const final = new Uint8Array(width);
                let i = 0,
                    j;
                if (this.v[0] === 43 || this.v[0] === 45) {
                    final[0] = this.v[0];
                    i++;
                }
                final.fill(48, i, i + fill_len);
                for (j = i, i = i + fill_len; i < width; i++, j++) {
                    final[i] = this.v[j];
                }
                return new Sk.builtin.bytes(final);
            },
            $flags: { OneArg: true },
            $textsig: null,
            $doc:"",
        },
    },
    classmethods: {
        fromhex: {
            $meth: function fromhex(string) {
                if (!Sk.builtin.checkString(string)) {
                    throw new Sk.builtin.TypeError("fromhex() argument must be str, not " + Sk.abstr.typeName(string));
                }
                string = string.$jsstr();
                const spaces = /\s+/g;
                const ishex = /^[abcdefABCDEF0123456789]{2}$/;
                const final = [];
                let index = 0;
                function pushOrThrow(upto) {
                    for (let i = index; i < upto; i += 2) {
                        let s = string.substr(i, 2);
                        if (!ishex.test(s)) {
                            throw new Sk.builtin.ValueError("non-hexadecimal number found in fromhex() arg at position " + (i + 1));
                        }
                        final.push(parseInt(s, 16));
                    }
                }
                let match;
                while ((match = spaces.exec(string)) !== null) {
                    pushOrThrow(match.index);
                    index = spaces.lastIndex;
                }
                pushOrThrow(string.length);
                return new this(final);
            },
            $flags: { OneArg: true },
            $textsig: "($type, string, /)",
            $doc:"",
        },
    },
});

function checkGetEncodingErrors(funcname, encoding, errors) {
    // check the types of encoding and errors
    if (encoding === undefined) {
        encoding = "utf-8";
    } else if (!Sk.builtin.checkString(encoding)) {
        throw new Sk.builtin.TypeError(
            funcname + "() argument " + ("bytesstr".includes(funcname) ? 2 : 1) + " must be str not " + Sk.abstr.typeName(encoding)
        );
    } else {
        encoding = encoding.$jsstr();
    }
    if (errors === undefined) {
        errors = "strict";
    } else if (!Sk.builtin.checkString(errors)) {
        throw new Sk.builtin.TypeError(
            funcname + "() argument " + ("bytesstr".includes(funcname) ? 3 : 2) + " must be str not " + Sk.abstr.typeName(errors)
        );
    } else {
        errors = errors.$jsstr();
    }
    return { encoding: encoding, errors: errors };
}

function checkErrorsIsValid(errors) {
    if (!(errors === "strict" || errors === "ignore" || errors === "replace")) {
        throw new Sk.builtin.LookupError(
            "Unsupported or invalid error type '" + errors + "'"
        );
    }
}

function strEncode(pyStr, encoding, errors) {
    const source = pyStr.$jsstr();
    encoding = normalizeEncoding(encoding);
    checkErrorsIsValid(errors);
    let uint8;
    if (encoding === "ascii") {
        uint8 = encodeAscii(source, errors);
    } else if (encoding === "utf-8") {
        uint8 = UtfEncoder.encode(source);
    } else {
        throw new Sk.builtin.LookupError("Unsupported or unknown encoding: '" + encoding + "'");
    }
    return new Sk.builtin.bytes(uint8);
}

function encodeAscii(source, errors) {
    const data = [];
    for (let i in source) {
        const val = source.charCodeAt(i);
        if (val > 0x7f) {
            if (errors === "strict") {
                const hexval = makehexform(val);
                throw new Sk.builtin.UnicodeEncodeError(
                    "'ascii' codec can't encode character '" + hexval + "' in position " + i + ": ordinal not in range(128)"
                );
            } else if (errors === "replace") {
                data.push(63); // "?"
            }
        } else {
            data.push(val);
        }
    }
    return new Uint8Array(data);
}

function makehexform(num) {
    var leading;
    if (num <= 265) {
        leading = "\\x";
    } else {
        leading = "\\u";
    }
    num = num.toString(16);
    if (num.length === 3) {
        num = num.slice(1, 3);
    }
    if (num.length === 1) {
        num = leading + "0" + num;
    } else {
        num = leading + num;
    }
    return num;
}

function decodeAscii(source, errors) {
    let final = "";
    for (let i = 0; i < source.length; i++) {
        const val = source[i];
        if (val > 0x7f) {
            if (errors === "strict") {
                throw new Sk.builtin.UnicodeDecodeError(
                    "'ascii' codec can't decode byte 0x" + val.toString(16) + " in position " + i + ": ordinal not in range(128)"
                );
            } else if (errors === "replace") {
                final += String.fromCharCode(65533);
            }
        } else {
            final += String.fromCharCode(val);
        }
    }
    return final;
}

function decode(decoder, source, errors, encoding) {
    const string = decoder.decode(source);
    if (errors === "replace") {
        return string;
    } else if (errors === "strict") {
        const i = string.indexOf("�");
        if (i === -1) {
            return string;
        }
        throw new Sk.builtin.UnicodeDecodeError(
            `'${encoding}' codec can't decode byte 0x ${source[i].toString(16)} in position ${i}: invalid start byte`
        );
    }
    return string.replace(/�/g, "");
}

function bytesDecode(encoding, errors) {
    ({ encoding, errors } = checkGetEncodingErrors("decode", encoding, errors));
    encoding = normalizeEncoding(encoding);

    checkErrorsIsValid(errors);

    let jsstr;
    if (encoding === "ascii") {
        jsstr = decodeAscii(this.v, errors);
    } else if (encoding === "utf-8") {
        jsstr = decode(UtfDecoder, this.v, errors, encoding);
    } else {
        let decoder;
        try {
            decoder = new TextDecoder(encoding);
        } catch (e) {
            throw new Sk.builtin.LookupError(`Unsupported or unknown encoding: ${encoding}. ${e.message}`);
        }
        jsstr = decode(decoder, this.v, errors, encoding);
    }
    return new Sk.builtin.str(jsstr);
}

function mkStartsEndsWith(funcname, is_match) {
    return function (prefix, start, end) {
        if (!(prefix instanceof Sk.builtin.bytes || prefix instanceof Sk.builtin.tuple)) {
            throw new Sk.builtin.TypeError(funcname + " first arg must be bytes or a tuple of bytes, not " + Sk.abstr.typeName(prefix));
        }
        ({ start, end } = Sk.builtin.slice.startEnd$wrt(this, start, end));
        if (end < start) {
            return Sk.builtin.bool.false$;
        }
        const slice = this.v.subarray(start, end);

        if (prefix instanceof Sk.builtin.tuple) {
            for (let iter = Sk.abstr.iter(prefix), item = iter.tp$iternext(); item !== undefined; item = iter.tp$iternext()) {
                item = this.get$raw(item);
                if (is_match(slice, item)) {
                    return Sk.builtin.bool.true$;
                }
            }
            return Sk.builtin.bool.false$;
        } else {
            return is_match(slice, prefix.v) ? Sk.builtin.bool.true$ : Sk.builtin.bool.false$;
        }
    };
}

function mkFind(isReversed) {
    return function find(tgt, start, end) {
        tgt = this.get$tgt(tgt);
        ({ start, end } = Sk.builtin.slice.startEnd$wrt(this, start, end));
        if (end < start) {
            return -1;
        }
        let idx;
        if (typeof tgt === "number") {
            idx = isReversed ? this.v.lastIndexOf(tgt, end - 1) : this.v.indexOf(tgt, start);
            return idx >= start && idx < end ? idx : -1;
        }
        if (isReversed) {
            return this.find$subright(tgt, start, end);
        } else {
            return this.find$subleft(tgt, start, end);
        }
    };
}

function mkPartition(isReversed) {
    return function partition(sep) {
        sep = this.get$raw(sep);
        let pos;
        if (isReversed) {
            pos = this.find$subright(sep, 0, this.v.length);
            if (pos < 0) {
                return new Sk.builtin.tuple([new Sk.builtin.bytes(), new Sk.builtin.bytes(), this]);
            }
        } else {
            pos = this.find$subleft(sep, 0, this.v.length);
            if (pos < 0) {
                return new Sk.builtin.tuple([this, new Sk.builtin.bytes(), new Sk.builtin.bytes()]);
            }
        }
        return new Sk.builtin.tuple([
            new Sk.builtin.bytes(this.v.subarray(0, pos)),
            new Sk.builtin.bytes(sep),
            new Sk.builtin.bytes(this.v.subarray(pos + sep.length)),
        ]);
    };
}

function mkStrip(isLeft, isRight) {
    return function stripBytes(chars) {
        let strip_chrs;
        if (chars === undefined || chars === Sk.builtin.none.none$) {
            // default is to remove ASCII whitespace
            strip_chrs = new Uint8Array([9, 10, 11, 12, 13, 32, 133]);
        } else {
            strip_chrs = this.get$raw(chars);
        }
        let start = 0,
            end = this.v.length;
        if (isLeft) {
            while (start < end && strip_chrs.includes(this.v[start])) {
                start++;
            }
        }
        if (isRight) {
            while (end > start && strip_chrs.includes(this.v[end - 1])) {
                end--;
            }
        }
        const final = new Uint8Array(end - start);
        for (let i = 0; i < final.length; i++) {
            final[i] = this.v[i + start];
        }
        return new Sk.builtin.bytes(final);
    };
}

function mkJust(funcname, isRight, isCenter) {
    return function justify(width, fillbyte) {
        if (fillbyte === undefined) {
            fillbyte = 32;
        } else if (!(fillbyte instanceof Sk.builtin.bytes) || fillbyte.v.length != 1) {
            throw new Sk.builtin.TypeError(funcname + "() argument 2 must be a byte string of length 1, not " + Sk.abstr.typeName(fillbyte));
        } else {
            fillbyte = fillbyte.v[0];
        }
        const mylen = this.v.length;
        width = Sk.misceval.asIndexSized(width, Sk.builtin.OverflowError);
        if (width <= mylen) {
            return new Sk.builtin.bytes(this.v);
        }
        const final = new Uint8Array(width);
        let fill1, fill2;
        if (isCenter) {
            fill1 = Math.floor((width - mylen) / 2);
            fill2 = (width - mylen) % 2 ? fill1 + 1 : fill1;
        } else if (isRight) {
            fill1 = width - mylen;
            fill2 = 0;
        } else {
            fill1 = 0;
            fill2 = width - mylen;
        }
        final.fill(fillbyte, 0, fill1);
        for (let i = 0; i < mylen; i++) {
            final[i + fill1] = this.v[i];
        }
        final.fill(fillbyte, width - fill2);
        return new Sk.builtin.bytes(final);
    };
}

function isspace(val) {
    return (val >= 9 && val <= 13) || val === 32;
}
function islower(val) {
    return val >= 97 && val <= 122;
}
function isupper(val) {
    return val >= 65 && val <= 90;
}
function isdigit(val) {
    return val >= 48 && val <= 57;
}

function checkSepMaxSplit(sep, maxsplit) {
    maxsplit = Sk.misceval.asIndexSized(maxsplit, Sk.builtin.OverflowError);
    maxsplit = maxsplit < 0 ? Infinity : maxsplit;

    sep = Sk.builtin.checkNone(sep) ? null : this.get$raw(sep);
    if (sep !== null && !sep.length) {
        throw new Sk.builtin.ValueError("empty separator");
    }
    return { sep: sep, maxsplit: maxsplit };
}

function mkIsAll(passTest, passesZero) {
    return function isAll() {
        if (this.v.length === 0) {
            return passesZero ? Sk.builtin.bool.true$ : Sk.builtin.bool.false$;
        }
        return this.v.every((val) => passTest(val)) ? Sk.builtin.bool.true$ : Sk.builtin.bool.false$;
    };
}

function makeIsUpperLower(passTest, failTest) {
    return function () {
        let flag = false;
        for (let i = 0; i < this.v.length; i++) {
            if (failTest(this.v[i])) {
                return Sk.builtin.bool.false$;
            }
            if (!flag && passTest(this.v[i])) {
                flag = true;
            }
        }
        return flag ? Sk.builtin.bool.true$ : Sk.builtin.bool.false$;
    };
}

function mkCaseSwitch(switchCase) {
    return function lowerUpperSwapCase() {
        const final = new Uint8Array(this.v.length);
        for (let i = 0; i < this.v.length; i++) {
            final[i] = switchCase(this.v[i]);
        }
        return new Sk.builtin.bytes(final);
    };
}

/**
 * @constructor
 * @param {Sk.builtin.bytes} bytes
 */
var bytes_iter_ = Sk.abstr.buildIteratorClass("bytes_iterator", {
    constructor: function bytes_iter_(bytes) {
        this.$index = 0;
        this.$seq = bytes.v;
    },
    iternext() {
        const next = this.$seq[this.$index++];
        if (next === undefined) {
            return undefined;
        }
        return new Sk.builtin.int_(next);
    },
    methods: {
        __length_hint__: Sk.generic.iterLengthHintWithArrayMethodDef,
    },
    flags: { sk$unacceptableBase: true },
});

Sk.exportSymbol("Sk.builtin.bytes", Sk.builtin.bytes);

var $builtinmodule=function(i){var s={};return s.ascii_lowercase=new Sk.builtin.str("abcdefghijklmnopqrstuvwxyz"),s.ascii_uppercase=new Sk.builtin.str("ABCDEFGHIJKLMNOPQRSTUVWXYZ"),s.ascii_letters=new Sk.builtin.str(s.ascii_lowercase.v+s.ascii_uppercase.v),s.lowercase=new Sk.builtin.str("abcdefghijklmnopqrstuvwxyz"),s.uppercase=new Sk.builtin.str("ABCDEFGHIJKLMNOPQRSTUVWXYZ"),s.letters=new Sk.builtin.str(s.lowercase.v+s.uppercase.v),s.digits=new Sk.builtin.str("0123456789"),s.hexdigits=new Sk.builtin.str("0123456789abcdefABCDEF"),s.octdigits=new Sk.builtin.str("01234567"),s.punctuation=new Sk.builtin.str("!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"),s.whitespace=new Sk.builtin.str("\t\n\v\f\r "),s.printable=new Sk.builtin.str(s.digits.v+s.letters.v+s.punctuation.v+" \t\n\r\v\f"),s.split=new Sk.builtin.func(function(...i){return Sk.misceval.callsimArray(Sk.builtin.str.prototype.split,i)}),s.capitalize=new Sk.builtin.func(function(i){return Sk.misceval.callsimArray(Sk.builtin.str.prototype.capitalize,[i])}),s.join=new Sk.builtin.func(function(i,t){return void 0===t&&(t=new Sk.builtin.str(" ")),Sk.misceval.callsimArray(Sk.builtin.str.prototype.join,[t,i])}),s.capwords=new Sk.builtin.func(function(i,t){if(Sk.builtin.pyCheckArgsLen("capwords",arguments.length,1,2),!Sk.builtin.checkString(i))throw new Sk.builtin.TypeError("s must be a string");if(void 0===t&&(t=new Sk.builtin.str(" ")),!Sk.builtin.checkString(t))throw new Sk.builtin.TypeError("sep must be a string");for(var n=Sk.misceval.callsimArray(s.split,[i,t]).v,e=[],r=0;r<n.length;r++){var l=n[r],l=Sk.misceval.callsimArray(s.capitalize,[l]);e.push(l)}return Sk.misceval.callsimArray(s.join,[new Sk.builtin.list(e),t])}),s};
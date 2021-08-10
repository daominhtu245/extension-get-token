const UglifyJS = require('uglify-es');
const { getOptions } = require('loader-utils');
const makeDecodeFun = require('./decodeFunc');

function shuffle(string) {
    var parts = string.split('');
    for (var i = parts.length; i > 0;) {
        var random = parseInt(Math.random() * i);
        var temp = parts[--i];
        parts[i] = parts[random];
        parts[random] = temp;
    }
    return parts.join('');
}

const makeStrKey = () => {
    return shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=');
};

function minifyJs(buffer) {
    const strKey = makeStrKey();
    const strings = {};

    function encodeBase64Str(str) {
        const __keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        const fromCharCode = (str) => String.fromCharCode(str);
        const charCodeAt = (str, i) => str.charCodeAt(i);
        function __encode(input) {
            let output = "";
            let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            let i = 0;

            input = __utf8_encode(input);

            while (i < input.length) {

                chr1 = charCodeAt(input, i++);
                chr2 = charCodeAt(input, i++);
                chr3 = charCodeAt(input, i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                __keyStr.charAt(enc1) + __keyStr.charAt(enc2) +
                __keyStr.charAt(enc3) + __keyStr.charAt(enc4);

            }

            return output;
        };
        function __utf8_encode(string) {
            string = string.replace(/\r\n/g,"\n");
            let utftext = "";

            for (let n = 0; n < string.length; n++) {

                let c = charCodeAt(string, n);

                if (c < 128) {
                    utftext += fromCharCode(c);
                }
                else if((c > 127) && (c < 2048)) {
                    utftext += fromCharCode((c >> 6) | 192);
                    utftext += fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += fromCharCode((c >> 12) | 224);
                    utftext += fromCharCode(((c >> 6) & 63) | 128);
                    utftext += fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        }

        return __encode(str)
    }

    function makeRandomStr(length, r) {
        var result = '';
        var charactersLength = r.length;
        for ( var i = 0; i < length; i++ ) {
            result += r.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    function encodeString(a) {
        let r = strKey;
        const str = encodeBase64Str(a);
        const key = makeRandomStr(1, r);
        let o = r.indexOf(key);
        let t = '';
        for (let i = 0; i < str.length; i++) {
            t += r[(o + r.indexOf(str[i])) % r.length];
        }

        return key + t;
    };

    const constDefs = {
        // SERVER_URL: process.env.SERVER_URL,
    };

    const consolidate = new UglifyJS.TreeTransformer(null, function(node) {
        if (node instanceof UglifyJS.AST_Toplevel) {
            const strKeys = Object.keys(strings);
            if (!strKeys.length) {
                return node;
            }

            var defs = new UglifyJS.AST_Const({
                definitions: strKeys.map(function(key){
                    var x = strings[key];
                    x.node.value = encodeString(x.node.value);
                    return new UglifyJS.AST_VarDef({
                        name  : new UglifyJS.AST_SymbolConst({ name: x.name }),
                        value : x.node,
                    });
                })
            });
            node.body = makeDecodeFun(strKey).concat(node.body);
            node.body.unshift(defs);
            return node;
        }

        if (node instanceof UglifyJS.AST_String && !node.value.startsWith('../') && node.quote == '\'') {
            const n = UglifyJS.parse(`var a= {k: decodeString(${getStringName(node).name}), l: 99}`).body;
            return n[0].definitions[0].value.properties[0].value;
        }
    });

    var count = 0;
    function getStringName(node) {
        var str = node.value;
        if (strings[str]) return strings[str];
        var name = "_s" + (++count);
        return strings[str] = { name: name, node: node };
    }

    const content = buffer.toString('utf8');
    const ast = UglifyJS.parse(content);
    return UglifyJS.minify(ast.transform(consolidate).print_to_string()).code;
}

module.exports = function loader(source) {
    const str = minifyJs(source);
    return str;
}

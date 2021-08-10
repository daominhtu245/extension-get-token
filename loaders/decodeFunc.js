const UglifyJS = require('uglify-es');

const makeDecodeFun = (strKey = 'ABCDEFmnopqrstuGHIJKLMNOPQRSTUVWXYZabcdefghijklvwxyz0123456789+/=') => {
    const decodeStringFun =
    `
    function decodeBase64Str(str) {
        const __keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        const fromCharCode = (str) => String.fromCharCode(str);
        const charCodeAt = (str, i) => str.charCodeAt(i);
        function __decode(input) {
            let output = "";
            let chr1, chr2, chr3;
            let enc1, enc2, enc3, enc4;
            let i = 0;

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            while (i < input.length) {

                enc1 = __keyStr.indexOf(input.charAt(i++));
                enc2 = __keyStr.indexOf(input.charAt(i++));
                enc3 = __keyStr.indexOf(input.charAt(i++));
                enc4 = __keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + fromCharCode(chr3);
                }

            }

            output = __utf8_decode(output);

            return output;

        };
        function __utf8_decode(utftext) {
            let string = "";
            let i = 0;
            let c = 0; let c1 = 0; let c2 = 0;
            let c3 = 0;
            while ( i < utftext.length ) {

                c = charCodeAt(utftext, i);

                if (c < 128) {
                    string += fromCharCode(c);
                    i++;
                }
                else if((c > 191) && (c < 224)) {
                    c2 = charCodeAt(utftext, i+1);
                    string += fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                }
                else {
                    c2 = charCodeAt(utftext, i+1);
                    c3 = charCodeAt(utftext, i+2);
                    string += fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }

            }

            return string;
        };

        return __decode(str)
    }

    function decodeString(e) {
        let r = '${strKey}';
        if (!e || e.length < 2) {
            return '';
        }

        let o = r.length - r.indexOf(e[0]);
        let t = '';
        for (let i = 1; i < e.length; i++) {
            t += r[(r.indexOf(e[i]) + o) % r.length];
        }

        return decodeBase64Str(t);
    }
    `;

    return UglifyJS.parse(decodeStringFun).body
}

module.exports = makeDecodeFun;

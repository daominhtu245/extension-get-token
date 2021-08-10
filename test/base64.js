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
        let c = c1 = c2 = 0;

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
    r = 'ABCDEFmnopqrstuGHIJKLMNOPQRSTUVWXYZabcdefghijklvwxyz0123456789+/=';
    const str = encodeBase64Str(a);
    const key = makeRandomStr(1, r);
    let o = r.indexOf(key);
    let t = '';
    for (let i = 0; i < str.length; i++) {
        t += r[(o + r.indexOf(str[i])) % r.length];
    }

    return key + t;
};

function decodeString(e) {
    r = 'ABCDEFmnopqrstuGHIJKLMNOPQRSTUVWXYZabcdefghijklvwxyz0123456789+/=';
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

var k = encodeString('Trang này')
console.log(k)
var l = decodeString(k)
console.log(l)

const acorn = require("acorn");
const walk = require("acorn-walk");
const { generate } = require("astring");

const run = async () => {
    const code = `
    const { getOptions } = require('loader-utils');
    const makeDecodeFun = require('./decodeFunc');

    const run = async () => {
        const userId = await __chrome.getCookie('https://facebook.com', "c_user");
        console.log(userId);
        const test = __utils.lowerCase('Hoang Huu Hoi');
        console.log(test);
    }

    run();
    `;
    const code2 = `
        const run2 = async () => {
            console.log('userId');
        }
    `;
    const parsed = acorn.parse(code, {ecmaVersion: 2020});
    const parsed2 = acorn.parse(code2, {ecmaVersion: 2020});

    walk.full(parsed, node => {
        if (node.type == 'Literal' && (typeof node.value === 'string' || node.value instanceof String)) {
            if (node.value == 'c_user') {
                node.value = 'ssss'
                node.raw = '\'ssss\''

                const newNode = acorn.parse('var k = {s: decodeStr(_s1), u: 99}', {ecmaVersion: 2020});
                console.log(newNode.body[0].declarations[0].init.properties[0].value);
            }
            console.log(`There's a ${node.type} value is ${node.value}`)
        }
    });
    parsed.body = parsed2.body.concat(parsed.body);
console.log(parsed.body);
    // console.log(generate(parsed))
};
run();

const _funcServiceGetInfo = require("./func/getinfo");
const _funcServiceGetListPage = require("./func/getListPage");
const _funcServiceGetListCustomerPage = require("./func/pageGetListCutomer");
const _funcServicePageInbox = require("./func/pageInbox");
const _http = require("../core/http");
const _facebook =  require("../services/facebook");

const runDemo = async () => {
    // get info
    const taskGetInfo = {
        _id: '123',
        extension_token: '333',
        func: _funcServiceGetInfo.createNewFunc(),
        params: {},
        callback: _funcServiceGetInfo.createNewCallback(),
    };

    const app = {};
    app['sendRequest'] = _http.__sendRequest;
    app['getCookie'] = _facebook.__getCookie;

    try {
        const funcParams = taskGetInfo['params'];
        const func = `(${taskGetInfo['func']})(app, funcParams)`;
        const responseData = await eval(func);
        const callbackData = {
            data: responseData
        };
        const callbackFunc = `(${taskGetInfo['callback']})(app, callbackData)`;
        let result = await eval(callbackFunc);
    } catch (e) {
        console.log('Lỗi rồi')
        console.log(e)
    }
};

const runPage = async () => {
    // get info
    const task = {
        _id: '123',
        extension_token: '333',
        func: _funcServicePageInbox.createNewFunc(),
        params: {
            cookie: ''
        },
        callback: _funcServicePageInbox.createNewCallback(),
    };

    const app = {};
    app['pageInbox'] = _facebook.__pageInbox

    try {
        const funcParams = task['params'];
        const func = `(${task['func']})(app, funcParams)`;
        const responseData = await eval(func);
        const callbackData = {
            data: responseData
        };
        const callbackFunc = `(${task['callback']})(app, callbackData)`;
        await eval(callbackFunc);
    } catch (e) {
        console.log('Lỗi rồi')
        console.log(e)
    }
}

module.exports = {
    runDemo,
    runPage
};

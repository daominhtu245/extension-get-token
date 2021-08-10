#
```json
{
    "_id": "123",
    "extension_token": "333",
    "func": "(app, params) => {console.log(params)}",
    "params": {
        "access_token": "9999"
    },
    "callback": "(app, data) => {goi api}"
}
```

```javascript
const app = {};
app['sendRequest'] = ({method: '', data: ''}) => ();
app['setStorage'] = ({method: '', data: ''}) => ();
app['getStorage'] = ({method: '', data: ''}) => ();
app['setCookie'] = ({method: '', data: ''}) => ();
app['getCookie'] = ({method: '', data: ''}) => ();

const task = {
    "_id": "123",
    "extension_token": "333",
    "func": "(app, params) => new Promise((res, rej) => {console.log(params); res(123);})}",
    "params": {
        "access_token": "9999"
    },
    "callback": "(app, data) => new Promise((res, rej) => res(222))"
};

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
    console.log(e)
}
```

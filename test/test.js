const _utils = require('../src/core/utils')
const _queue = require('../src/core/queue')


const tasks = _queue.__init();

const doTask = async (task) => {
    console.log('Do task:', task);
    await _utils.__sleep(2000);
    console.log('Task Complete:', task);
};

const runTaskFromQueue = async () => {
    if (!_queue.__isEmpty(tasks)) {
        const task = _queue.__dequeue(tasks);
        await doTask(task);
    }

    await _utils.__sleep(500);
    runTaskFromQueue();
};

const run = async () => {
    runTaskFromQueue();

    for (let i = 0; i < 10; i++) {
        await _utils.__sleep(1000);
        console.log('Enqueue:', i);
        _queue.__enqueue(tasks, i);
    }
};

console.log(_utils.__encrypt('abc', 123));
/*  
    From: https://github.com/yue/yode/blob/master/src/bootstrap.js
    setImmediate and process.nextTick makes use of uv_check and uv_prepare to
    run the callbacks, however since we only run uv loop on requests, the
    callbacks wouldn't be called until something else activated the uv loop,
    which would delay the callbacks for arbitrary long time. So we should
    initiatively activate the uv loop once setImmediate and process.nextTick is
    called.
    This is required inorder to make the timers work nicely due to merger of event loops
*/

function noop(): void {
    return;
}

const wrapWithActivateUvLoop = (func: Function) => {
    return (...args: any[]): any => {
        const activateUvLoop = (process as any).activateUvLoop || noop;
        activateUvLoop();
        return func(...args);
    };
};

function main(): void {
    process.nextTick = wrapWithActivateUvLoop(process.nextTick);
    global.setImmediate = wrapWithActivateUvLoop(global.setImmediate);
    global.setTimeout = wrapWithActivateUvLoop(global.setTimeout);
    global.setInterval = wrapWithActivateUvLoop(global.setInterval);
}

main();

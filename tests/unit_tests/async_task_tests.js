define(['kage', 'QUnit'], function(kage, QUnit) {
    module('kage.util');
    asyncTest('kage.util.AsyncTask', function() {
        var done = false;
        var onStart = false;
        var onFinish = false;
        var task_return = null;
        var async = new kage.util.AsyncTask(function() {
            done = true;
            return 'task_call';
        });

        async.onStart(function() {
            onStart = true;
        });

        async.onFinish(function(data) {
            task_return = data;
            onFinish = true;
            ok(onStart, 'onStart callback called');
            ok(onFinish, 'onFinish callback called');
            ok(done, 'task executed');
            equal(task_return, 'task_call', 'task return value passed to onFinish callback');
            
            throws(function() {
                new kage.util.AsyncTask(null);
            }, 'if task is not callable should throw an exception');
            start();
        });

        async.start();
    });
});
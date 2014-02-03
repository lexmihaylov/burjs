define(['kage','QUnit'], function(kage, QUnit) {
    return function() {
        asyncTest('kage.util.AsyncTask', function() {
            var done = false;
            var on_start = false;
            var on_finish = false;
            var task_return = null;
            var async = new kage.util.AsyncTask(function() {
                done = true;
                return 'task_call';
            });
            
            async.on_start(function() {
                on_start = true;
            });
            
            async.on_finish(function(data) {
                task_return = data;
                on_finish = true;
                ok(on_start, 'on_start callback called');
                ok(on_finish, 'on_finish callback called');
                ok(done, 'task executed');
                equal(task_return, 'task_call', 'task return value passed to on_finish callback');
                start();
            });
            
            async.start();
        });
    };
});
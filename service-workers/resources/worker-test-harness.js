(function ()
{
    var completion_promise = new Promise(function(resolve, reject)
    {
        add_completion_callback(function(tests, harness_status) {
            var results = {
                tests: tests.map(function(test) {
                    return test.structured_clone();
                }),
                status: harness_status.structured_clone()
            };
            resolve(results);
        });
    });

    on_event(self, 'message', function(ev)
    {
        var message = ev.data;
        if (message.type && message.type == 'get') {
            var port = ev.ports[0];

            completion_promise.then(function(results) {
                var message = {
                    type: 'complete',
                    tests: results.tests,
                    status: results.status
                };
                port.postMessage(message);
            });
        }
    });
})();


importScripts('../../resources/testharness.js');
importScripts('worker-test-harness.js');

var test_cache_list = ['enum-1', 'enum-2', 'enum-3'];

promise_test(function(test)
{
    return Promise.all(test_cache_list.map(function(key) {
        return caches.create(key);
    })).

    then(function() {
        var enum_state = { keys_seen: [] };
        var forEach_promise = caches.forEach(
                test.step_func(function(value, key, storage) {
                    assert_in_array(key, test_cache_list,
                        'forEach should only visit existing Caches.');
                    assert_own_property(this, 'keys_seen',
                        'forEach should invoke callback on object passed as ' +
                        'thisArg.');
                    assert_not_equals(this.keys_seen.indexOf(key), -1,
                        'forEach should visit each Cache exactly once.');
                    this.keys_seen.push(key);
                    return Promise.resolve();
        }), enum_state);

        return Promise.all([forEach_promise, Promise.resolve(enum_state)]);
    }).

    then(test.step_func(function(results) {
        var enum_state = results[1];
        assert_array_equals(enum_state.keys_seen, test_cache_list,
            'forEach should visit all Caches before fulfilling promise.');
    }));

    // FIXME: Define the behavior for CacheStorage being mutated during a
    // forEach iteration. e.g. should creation/deletion of a Cache from within a
    // forEach callback function be deferred until the next iteration?

    // FIXME: Define the behavior for recursive invocation for
    // CacheStorage.forEach from within a callback function.

    // FIXME: Define the sequence restriction for invoking the enumeration
    // callback with respect to the context calling CacheStorage.forEach. I.e.:
    //   var promise = caches.forEach(callback_function);
    // The spec should make it clear that |callback_function| is not expected to
    // have been invoked over all the caches until |promise| resolves.
}, 'CacheStorage.forEach');

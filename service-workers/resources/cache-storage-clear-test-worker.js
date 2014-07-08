importScripts('/resources/testharness.js');
importScripts('worker-test-harness.js');

var test_cache_list = ['clear-test-1', 'clear-test-2', 'clear-test-3'];

promise_test(function(test)
{
    return Promise.all(test_cache_list.map(function(key) {
        return caches.create(key);
    })).

    then(function() {
        return Promise.all(
                test_cache_list.map(function(key) {
                    return caches.has(key);
                }));
    }).

    then(test.step_func(function(results) {
        assert_array_equals(results, [true, true, true],
            'CacheStorage.has should return true for existing caches');
    })).

    then(function() {
        return caches.clear();
    }).

    then(function() {
        return Promise.all(
                test_cache_list.map(function(key) {
                    return caches.has(key);
                }));
    }).

    then(test.step_func(function(results) {
        assert_array_equals(results, [false, false, false],
            'CacheStorage.has should not return true after CacheStorage.clear');
    }));
}, 'CacheStorage.clear');

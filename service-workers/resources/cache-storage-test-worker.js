importScripts('/resources/testharness.js');
importScripts('worker-test-harness.js');

promise_test(function(test)
{
    return caches.create('foo').
    then(test.step_func(function(cache) {
        assert_true(cache, 'CacheStorage.create should return a valid Cache.');
        assert_true(cache instanceof Cache,
            'CacheStorage.create should return a valid Cache.');
    }));
}, 'CacheStorage.create');

promise_test(function(test)
{
    return caches.create().

    // FIXME: Define the behavior for .create() with an empty or
    // non-string cache name.
    then(test.unreached_func(
            'CacheStorage.create should reject invalid name.'),
        function() {});
}, 'CacheStorage.create with invalid cache name');

promise_test(function(test)
{
    return caches.create('bar').

    then(test.step_func(function() {
        return caches.has('bar');
    })).
    then(test.step_func(function(result) {
        assert_true(result, 'CacheStorage.has should return true for ' +
            'existing cache');
    }));
}, 'CacheStorage.has with existing cache');

promise_test(function(test)
{
    return caches.has('cheezburger').
    then(test.step_func(function(result) {
        assert_false(result,
            'CacheStorage.has should return false for non-existent cache');
    }));
}, 'CacheStorage.has with non-existent cache');

promise_test(function(test)
{
    return caches.has().

    // FIXME: Define the behavior for .has() with an invalid or undefined name.
    // Perhaps it should reject instead of returning false.
    then(test.step_func(function(result) {
        // FIXME: Could fail due to the cache creation with an undefined name
        // above. Tests shouldn't interact since these are all async_tests.
        assert_false(result,
            'CacheStorage.has should return false for invalid cache name.');
    }));
}, 'CacheStorage.has with invalid cache name');

promise_test(function(test)
{
    var cache_name = 'to-be-deleted';

    return caches.create(cache_name).

    then(function() {
        return caches.delete(cache_name);
    }).
    then(function() {},
        test.unreached_func(
                'CacheStorage.delete should not reject existing cache')).

    then(function() {
        return caches.has(cache_name);
    }).
    then(test.step_func(function(cache_exists) {
        assert_false(cache_exists,
            'CacheStorage.has should not return true after fulfilment of ' +
            'CacheStorage.delete promise');
    }));
}, 'CacheStorage.delete with existing cache');

promise_test(function(test)
{
    return caches.delete('cheezburger').
    then(test.unreached_func('CacheStorage.delete should not fulfil promise ' +
            'to delete non-existent cache.'),
        function() {});
}, 'CacheStorage.delete with non-existent cache');

// FIXME: Define and test behavior for invalid cache name with delete().

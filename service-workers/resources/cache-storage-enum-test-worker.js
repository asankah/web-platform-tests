importScripts('/resources/testharness.js');
importScripts('worker-test-harness.js');

var test_cache_list = ['enum-1', 'enum-2', 'enum-3'];

promise_test(function(test)
{
    return caches.size().
    then(test.step_func(function(cache_count) {
        assert_equals(0, cache_count,
            'CacheStorage.size should return 0 for a new ServiceWorker.');
    })).

    then(function() {
        return caches.keys();
    }).
    then(test.step_func(function(keys) {
        assert_equals(keys.length, 0,
            'CacheStorage.keys should return an empty list for a new ' +
            'ServiceWorker.');
    })).

    then(function() {
        return caches.values();
    }).
    then(test.step_func(function(values) {
        assert_equals(values.length, 0,
            'CacheStorage.values should return an empty list for a new ' +
            'ServiceWorker');
    })).

    then(function() {
        return Promise.all(test_cache_list.map(function(key) {
            return caches.create(key);
        }));
    }).

    then(function() {
        return caches.size();
    }).
    then(test.step_func(function(cache_count) {
        assert_equals(3, cache_count,
            'CacheStorage.count should count each cache that\'s successfully ' +
            'created.');
    })).

    then(function() {
        return caches.keys();
    }).
    then(test.step_func(function(keys) {
        assert_true(Array.isArray(keys),
            'CacheStorage.keys should return an Array.');
        assert_array_equals(keys, test_cache_list,
            'CacheStroage.keys should only return existing caches');
    })).

    then(function() {
        return caches.values();
    }).
    then(test.step_func(function(values) {
        assert_true(Array.isArray(values),
            'CacheStorage.values should return an Array.')
        values.forEach(function(value) {
            // FIXME: Test that each value is a Cache object.
            assert_true(value instanceof Object,
                'CacheStorage.values should return an Array of Cache objects');
        });
        assert_equals(values.length, test_cache_list.length,
            'CacheStorage.values should only return existing caches.');
    }));
}, 'CacheStorage enumerators');

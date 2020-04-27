var redis = require('redis');
var client = redis.createClient();

// client.on('connect', function () {
//     console.log('connected');
// });

client.set('framework', 'lofasz', function (err, reply) {
    console.log(reply);
});

client.get('framework', function (err, reply) {
    console.log(reply);
});

client.quit();
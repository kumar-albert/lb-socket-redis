/**
 * RedisServer
 * 
 * @param {String} host IP address of redis server
 * @param {Number} port Port Number of redis server
 * @author Kumar Albert
 */
function RedisServer(host, port) {
	var redis = require("redis");
	var self = this;
    var config = {
    	host: host || 'localhost',
    	port: port || 6379
    };

    /**
     * Subscriber for reading messages from redis server
     * @type {Object} subClient
     */
    self.subClient = redis.createClient(config);

    /**
     * Publisher for publish message to redis server
     * @type {Object} pubClient
     */
    self.pubClient = redis.createClient(config);

    /**
     * Subscribe method used to subscribe channel in redis server
     * @param  {String} channel
     */
    self.subscribe = function(channel, cb) {
    	var err = null;
    	var success = '';
    	if (typeof(channel) === "string") {
    		self.subClient.subscribe(channel);
    		success = channel + " channel subscribed!";
    	} else {
    		err = new Error("Channel name should be string");
    	}
    	return cb ? cb(err, success) : success;
    }

    /**
     * Publish method used to sublish message to channel in redis server
     * @param  {String} channel
     * @param  {any} data
     */
    self.publish = function(channel, data, cb) {
    	self.subClient.on("subscribe", function (channel, count) {
    		var stringifiedData = data;
    		if (typeof(data) === "object") {
    			stringifiedData = JSON.stringify(data);
    		}
	        self.pubClient.publish(channel, stringifiedData, function(err, response) {
	        	return cb ? cb(err, response) : response;
	        });
	    });
    }
}

module.exports = RedisServer;
var Hashtable = (function(UNDEFINED) {
    var FUNCTION = "function", STRING = "string", UNDEF = "undefined";

    // Require Array.prototype.splice, Object.prototype.hasOwnProperty and encodeURIComponent. In environments not
    // having these (e.g. IE <= 5), we bail out now and leave Hashtable null.
    if (typeof encodeURIComponent == UNDEF ||
        Array.prototype.splice === UNDEFINED ||
        Object.prototype.hasOwnProperty === UNDEFINED) {
        return null;
    }

    function toStr(obj) {
        return (typeof obj == STRING) ? obj : "" + obj;
    }

    function hashObject(obj) {
        var hashCode;
        if (typeof obj == STRING) {
            return obj;
        } else if (typeof obj.hashCode == FUNCTION) {
            // Check the hashCode method really has returned a string
            hashCode = obj.hashCode();
            return (typeof hashCode == STRING) ? hashCode : hashObject(hashCode);
        } else {
            return toStr(obj);
        }
    }

    function merge(o1, o2) {
        for (var i in o2) {
            if (o2.hasOwnProperty(i)) {
                o1[i] = o2[i];
            }
        }
    }

    function equals_fixedValueHasEquals(fixedValue, variableValue) {
        return fixedValue.equals(variableValue);
    }

    function equals_fixedValueNoEquals(fixedValue, variableValue) {
        return (typeof variableValue.equals == FUNCTION) ?
            variableValue.equals(fixedValue) : (fixedValue === variableValue);
    }

    function createKeyValCheck(kvStr) {
        return function(kv) {
            if (kv === null) {
                throw new Error("null is not a valid " + kvStr);
            } else if (kv === UNDEFINED) {
                throw new Error(kvStr + " must not be undefined");
            }
        };
    }

    var checkKey = createKeyValCheck("key"), checkValue = createKeyValCheck("value");

    /*----------------------------------------------------------------------------------------------------------------*/

    function Bucket(hash, firstKey, firstValue, equalityFunction) {
        this[0] = hash;
        this.entries = [];
        this.addEntry(firstKey, firstValue);

        if (equalityFunction !== null) {
            this.getEqualityFunction = function() {
                return equalityFunction;
            };
        }
    }

    var EXISTENCE = 0, ENTRY = 1, ENTRY_INDEX_AND_VALUE = 2;

    function createBucketSearcher(mode) {
        return function(key) {
            var i = this.entries.length, entry, equals = this.getEqualityFunction(key);
            while (i--) {
                entry = this.entries[i];
                if ( equals(key, entry[0]) ) {
                    switch (mode) {
                        case EXISTENCE:
                            return true;
                        case ENTRY:
                            return entry;
                        case ENTRY_INDEX_AND_VALUE:
                            return [ i, entry[1] ];
                    }
                }
            }
            return false;
        };
    }

    function createBucketLister(entryProperty) {
        return function(aggregatedArr) {
            var startIndex = aggregatedArr.length;
            for (var i = 0, entries = this.entries, len = entries.length; i < len; ++i) {
                aggregatedArr[startIndex + i] = entries[i][entryProperty];
            }
        };
    }

    Bucket.prototype = {
        getEqualityFunction: function(searchValue) {
            return (typeof searchValue.equals == FUNCTION) ? equals_fixedValueHasEquals : equals_fixedValueNoEquals;
        },

        getEntryForKey: createBucketSearcher(ENTRY),

        getEntryAndIndexForKey: createBucketSearcher(ENTRY_INDEX_AND_VALUE),

        removeEntryForKey: function(key) {
            var result = this.getEntryAndIndexForKey(key);
            if (result) {
                this.entries.splice(result[0], 1);
                return result[1];
            }
            return null;
        },

        addEntry: function(key, value) {
            this.entries.push( [key, value] );
        },

        keys: createBucketLister(0),

        values: createBucketLister(1),

        getEntries: function(destEntries) {
            var startIndex = destEntries.length;
            for (var i = 0, entries = this.entries, len = entries.length; i < len; ++i) {
                // Clone the entry stored in the bucket before adding to array
                destEntries[startIndex + i] = entries[i].slice(0);
            }
        },

        containsKey: createBucketSearcher(EXISTENCE),

        containsValue: function(value) {
            var entries = this.entries, i = entries.length;
            while (i--) {
                if ( value === entries[i][1] ) {
                    return true;
                }
            }
            return false;
        }
    };

    /*----------------------------------------------------------------------------------------------------------------*/

    // Supporting functions for searching hashtable buckets

    function searchBuckets(buckets, hash) {
        var i = buckets.length, bucket;
        while (i--) {
            bucket = buckets[i];
            if (hash === bucket[0]) {
                return i;
            }
        }
        return null;
    }

    function getBucketForHash(bucketsByHash, hash) {
        var bucket = bucketsByHash[hash];

        // Check that this is a genuine bucket and not something inherited from the bucketsByHash's prototype
        return ( bucket && (bucket instanceof Bucket) ) ? bucket : null;
    }

    /*----------------------------------------------------------------------------------------------------------------*/

    function Hashtable() {
        var buckets = [];
        var bucketsByHash = {};
        var properties = {
            replaceDuplicateKey: true,
            hashCode: hashObject,
            equals: null
        };

        var arg0 = arguments[0], arg1 = arguments[1];
        if (arg1 !== UNDEFINED) {
            properties.hashCode = arg0;
            properties.equals = arg1;
        } else if (arg0 !== UNDEFINED) {
            merge(properties, arg0);
        }

        var hashCode = properties.hashCode, equals = properties.equals;

        this.properties = properties;

        this.put = function(key, value) {
            checkKey(key);
            checkValue(value);
            var hash = hashCode(key), bucket, bucketEntry, oldValue = null;

            // Check if a bucket exists for the bucket key
            bucket = getBucketForHash(bucketsByHash, hash);
            if (bucket) {
                // Check this bucket to see if it already contains this key
                bucketEntry = bucket.getEntryForKey(key);
                if (bucketEntry) {
                    // This bucket entry is the current mapping of key to value, so replace the old value.
                    // Also, we optionally replace the key so that the latest key is stored.
                    if (properties.replaceDuplicateKey) {
                        bucketEntry[0] = key;
                    }
                    oldValue = bucketEntry[1];
                    bucketEntry[1] = value;
                } else {
                    // The bucket does not contain an entry for this key, so add one
                    bucket.addEntry(key, value);
                }
            } else {
                // No bucket exists for the key, so create one and put our key/value mapping in
                bucket = new Bucket(hash, key, value, equals);
                buckets.push(bucket);
                bucketsByHash[hash] = bucket;
            }
            return oldValue;
        };

        this.get = function(key) {
            checkKey(key);

            var hash = hashCode(key);

            // Check if a bucket exists for the bucket key
            var bucket = getBucketForHash(bucketsByHash, hash);
            if (bucket) {
                // Check this bucket to see if it contains this key
                var bucketEntry = bucket.getEntryForKey(key);
                if (bucketEntry) {
                    // This bucket entry is the current mapping of key to value, so return the value.
                    return bucketEntry[1];
                }
            }
            return null;
        };

        this.containsKey = function(key) {
            checkKey(key);
            var bucketKey = hashCode(key);

            // Check if a bucket exists for the bucket key
            var bucket = getBucketForHash(bucketsByHash, bucketKey);

            return bucket ? bucket.containsKey(key) : false;
        };

        this.containsValue = function(value) {
            checkValue(value);
            var i = buckets.length;
            while (i--) {
                if (buckets[i].containsValue(value)) {
                    return true;
                }
            }
            return false;
        };

        this.clear = function() {
            buckets.length = 0;
            bucketsByHash = {};
        };

        this.isEmpty = function() {
            return !buckets.length;
        };

        var createBucketAggregator = function(bucketFuncName) {
            return function() {
                var aggregated = [], i = buckets.length;
                while (i--) {
                    buckets[i][bucketFuncName](aggregated);
                }
                return aggregated;
            };
        };

        this.keys = createBucketAggregator("keys");
        this.values = createBucketAggregator("values");
        this.entries = createBucketAggregator("getEntries");

        this.remove = function(key) {
            checkKey(key);

            var hash = hashCode(key), bucketIndex, oldValue = null;

            // Check if a bucket exists for the bucket key
            var bucket = getBucketForHash(bucketsByHash, hash);

            if (bucket) {
                // Remove entry from this bucket for this key
                oldValue = bucket.removeEntryForKey(key);
                if (oldValue !== null) {
                    // Entry was removed, so check if bucket is empty
                    if (bucket.entries.length == 0) {
                        // Bucket is empty, so remove it from the bucket collections
                        bucketIndex = searchBuckets(buckets, hash);
                        buckets.splice(bucketIndex, 1);
                        delete bucketsByHash[hash];
                    }
                }
            }
            return oldValue;
        };

        this.size = function() {
            var total = 0, i = buckets.length;
            while (i--) {
                total += buckets[i].entries.length;
            }
            return total;
        };
    }

    Hashtable.prototype = {
        each: function(callback) {
            var entries = this.entries(), i = entries.length, entry;
            while (i--) {
                entry = entries[i];
                callback(entry[0], entry[1]);
            }
        },

        equals: function(hashtable) {
            var keys, key, val, count = this.size();
            if (count == hashtable.size()) {
                keys = this.keys();
                while (count--) {
                    key = keys[count];
                    val = hashtable.get(key);
                    if (val === null || val !== this.get(key)) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        },

        putAll: function(hashtable, conflictCallback) {
            var entries = hashtable.entries();
            var entry, key, value, thisValue, i = entries.length;
            var hasConflictCallback = (typeof conflictCallback == FUNCTION);
            while (i--) {
                entry = entries[i];
                key = entry[0];
                value = entry[1];

                // Check for a conflict. The default behaviour is to overwrite the value for an existing key
                if ( hasConflictCallback && (thisValue = this.get(key)) ) {
                    value = conflictCallback(key, thisValue, value);
                }
                this.put(key, value);
            }
        },

        clone: function() {
            var clone = new Hashtable(this.properties);
            clone.putAll(this);
            return clone;
        }
    };

    Hashtable.prototype.toQueryString = function() {
        var entries = this.entries(), i = entries.length, entry;
        var parts = [];
        while (i--) {
            entry = entries[i];
            parts[i] = encodeURIComponent( toStr(entry[0]) ) + "=" + encodeURIComponent( toStr(entry[1]) );
        }
        return parts.join("&");
    };

    return Hashtable;
})();

/******************************End Hastable*******************************/

var express = require("express");
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

var url = 'mongodb://localhost:27017/ChatApp';
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
var fs = require("fs");

var listUser = new Hashtable();
var listFriend = new Hashtable();

server.listen(process.env.PORT || 3000);

io.sockets.on('connection', function (socket) {
    console.log(socket.id);

    socket.on('UserOnline', function (data) {
        listUser.put(socket.id, data);
        listFriend.put( data,socket.id);
        console.log(data + " is online");
    });


    socket.on('LoadMessage', function (data) {
        try {
            var account = listUser.get(socket.id);
            var friendAccount = data;

            MongoClient.connect(url, function (err, db) {
                if (err) {
                    console.log('Unable to connect to the mongoDB server');
                } else {
                    //HURRAY!! We are connected. :)
                    console.log('Connection established to', url);

                    // Get the documents collection
                    var collection = db.collection('Message');

                    collection.find({userSend: friendAccount,userRecieve:account}).toArray(function (err, result) {
                        if (err) {
                            console.log(err);
                        } else if (result.length) {
                            io.sockets.emit(account+"LoadMessage", { Content: result });
                            io.sockets.emit(friendAccount+"Viewed", { Content: data });
                            collection.deleteMany( {userSend: friendAccount,userRecieve:account}, function(err, results) {
                                console.log("Delete Success");
                            });
                        } else {
                            console.log('No record!');
                        }
                        //Close connection
                        db.close();
                    });
                }
            });
        }
        catch(err) {
            console.log("Load message failed");
        }

    });

    socket.on('disconnect', function (data) {
        try {
            console.log(listUser.get(socket.id) + " is offline");
            listFriend.remove(listUser.get(socket.id));
            listUser.remove(socket.id);
        }catch(err) {
            console.log("Delete from Hashtable failed");
        }
    });

    //Viewed

    socket.on('Viewed', function (data) {
        io.sockets.emit(data+"Viewed", { Content: data });
    });
    //Recieved
    socket.on('Recieved', function (data) {
        io.sockets.emit(data+"Recieved", { Content: data });
    });
    //Stop typing
    socket.on('StopTyping', function (data) {
        var json = JSON.parse(JSON.stringify(data));
        io.sockets.emit(json.userSend + "StopTyping", { Content: data });
    });
    socket.on('Typing', function (data) {
        var json = JSON.parse(JSON.stringify(data));
        io.sockets.emit(json.userSend+"Typing", { Content: data });
    });

    socket.on('SendToServer', function (data) {


        var json = JSON.parse(JSON.stringify(data));
        //Sent data to client
        io.sockets.emit(json.userRecieve, { Content: data });
        io.sockets.emit(json.userSend + "Sent", { Content: "" });
        //Mongo save
        try {
            if(listFriend.get(json.userRecieve) == null)
            {
                MongoClient.connect(url, function (err, db) {
                    if (err) {
                        console.log('Unable to connect to the mongoDB server');
                    } else {
                        console.log('Connection established to', url);
                        // Get the documents collection
                        var collection = db.collection('Message');

                        // Insert some users
                        collection.insert([json], function (err, result) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log('Success');
                            }
                            //Close connection
                            db.close();
                        });
                    }
                });
            }
        }
        catch(err) {
            console.log("Save message to Mongodb failed");
        }

        //End mongodb
    });
});




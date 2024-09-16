const mongoose = require('mongoose');

let gfsBucket, gfsBucketPoster;

function initializeBuckets() {
    return new Promise((resolve, reject) => {
        if (mongoose.connection.readyState === 1) {
            // If the connection is already open, initialize buckets immediately
            createBuckets(mongoose.connection);
            resolve();
        } else {
            // If the connection isn't open yet, wait for it
            mongoose.connection.once('open', () => {
                createBuckets(mongoose.connection);
                resolve();
            });
            
            mongoose.connection.on('error', (err) => {
                reject(new Error(`MongoDB connection error: ${err}`));
            });
        }
    });
}

function createBuckets(conn) {
    gfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "audio"
    });

    gfsBucketPoster = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "poster"
    });
}

async function getGridFSBucket(type = 'audio') {
    if (!gfsBucket || !gfsBucketPoster) {
        await initializeBuckets();
    }
    return type === 'audio' ? gfsBucket : gfsBucketPoster;
}

module.exports = { getGridFSBucket };
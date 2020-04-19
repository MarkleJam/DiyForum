const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const Config = require("./config.js");

class Db {

    static getInstance() {
        //This solves creating instance many times
        if(! Db.instance) {
            Db.instance = new Db();
        } 
        return Db.instance;
    }

    constructor() {
        console.log("Connecting!");
        this.dbClient = '';
        this.connect();
        console.log("Big Cong! Connected!");
    }

    connect() {
        let _that = this;
        return new Promise(function(resolve, reject) {
            if(!_that.dbClient) {
                //This solves multi query! We do not need to connect every time
                MongoClient.connect(Config.dbUrl, { useNewUrlParser: true }, (err, client) => {

                    if(err) {
                        reject(err);
                    } else {
                        var db = client.db(Config.dbName);
                        _that.dbClient = db;
                        resolve(_that.dbClient);
                    }
                });
            } else {
                resolve(_that.dbClient);
            }
        })
    }

    find(collectionName,json) {
        return new Promise((resolve, reject)=>{
            var result;
            this.connect().then(function(db) {
                result = db.collection(collectionName).find(json);
                result.toArray((err, docs) => {
                    if(err) {
                        reject(err);
                        return;
                    }
                    //console.log(docs);
                    resolve(docs);
                })
            })        
        });
    }

    update(collectionName, oldJson, newJson) {
        return new Promise((resolve, reject)=>{
            this.connect().then((db)=>{
                db.collection(collectionName).updateOne(oldJson, {
                    $set:newJson
                }, (err, result)=>{
                    if(err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                })
            })
        })
    }

    insert(collectionName, json) {
        return new Promise((resolve, reject)=>{
            this.connect().then((db)=>{
                console.log("The collection name is:" + collectionName);
                
                db.collection(collectionName).insertOne(json, function(err, result){
                    if(err) {
                        reject(err);
                        return;
                    } else {
                        console.log("Insert successfully!");
                        
                        resolve(result);
                    }
                })
            })
        })
    }

    delete(collectionName, json) {
        return new Promise((resolve, reject)=>{
            this.connect().then((db)=>{
                db.collection(collectionName).removeOne(json, function(err, result){
                    if(err) {
                        reject(err);
                        return;
                    } else {
                        resolve(result);
                    }
                })
            })
        })
    }

    getObjectID(id) {
        return new ObjectID(id);
    }
}

module.exports = Db.getInstance();
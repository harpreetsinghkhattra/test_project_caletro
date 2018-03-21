import {MongoClient} from 'mongodb';

export class Connection{
    /** Mongodb connection */
    static connect(cb){
        let uri = "mongodb://127.0.0.1";

        MongoClient.connect(uri, (err, client)=> 
            {
                if(err) cb(err, null);
                if(client){
                    const db = client.db('lawyerup');
                    cb(null, db, client);
                }
            }
        );
    }
}
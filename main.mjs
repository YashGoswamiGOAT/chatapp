import {MongoClient} from "mongodb";

function ResetServer()
{
    const uri = 'mongodb+srv://yashgoswamiyg2003:qZ51QvOE3PPvfqM6@cluster0.cms1csg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0' ;
    this.client = new MongoClient(uri);
    client.connect().then(async ( )=>{
        console.log('Connected') ;
        await client.db('app').collection('appData').deleteMany({}) ;
        await client.db('app').collection('appData').insertOne({
            name : 'Chat App V1.2'
        })
        client.close();
    })
}
export class ChatEngine {
    constructor(){
        const uri = 'mongodb+srv://yashgoswamiyg2003:qZ51QvOE3PPvfqM6@cluster0.cms1csg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0' ;
        this.client = new MongoClient(uri);
    }
    async connect(){
        return await this.client.connect();
    }
    async disconnect(){
        return await this.client.close();
    }
    async RegisterUser(user){
        let user_ = await this.client.db('app').collection('users').findOne({username : user.username}) ;
        if (user_) return {
            status : 'UserExist',
            message : 'User already exists'
        } ;
        return {...(await this.client.db('app').collection('users').insertOne(user)),status : 'Success'};
    }
    async GetUser(username,password){
        return await this.client.db('app').collection('users').findOne({username : username,password : password}) ;
    }
}
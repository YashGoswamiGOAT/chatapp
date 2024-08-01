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
        await this.client.db('app').collection('profiles').insertOne({
            username : user.username,
            profile : user.profile.avatar
        }) ;
        return {...(await this.client.db('app').collection('users').insertOne({
            username : user.username,
            name : user.name,
            password : user.password,
            recents : []
            })),status : 'Success'};
    }
    async SendMessage(message){
        await this.client.db('app').collection('messages').insertOne(message) ;
    }
    async GetMessages(sender,receiver){
        return await this.client.db('app').collection('messages').find({
            $or : [
                {from : sender,to : receiver},
                {from : receiver,to : sender}
            ]
        }).toArray() ;
    }
    async GetMessagesAdmin(){
        return await this.client.db('app').collection('messages').find({
            $or : [
                {from : 'admin'},
                {from : 'admin'},
            ]
        }).toArray() ;
    }
    async GetProfiles(username){
        return await this.client.db('app').collection('users').find({
            username : {$ne : username}
        }).toArray() ;
    }
    async GetUser(username,password){
        return await this.client.db('app').collection('users').findOne({username : username,password : password}) ;
    }
}
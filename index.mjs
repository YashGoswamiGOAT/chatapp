import express from 'express' ;
import cors from 'cors' ;
import FileUpload from 'express-fileupload' ;
import {ChatEngine} from "./main.mjs";

const app = express() ;
app.use(cors()) ;
app.use(FileUpload()) ;
app.use(express.json()) ;

app.post('/signup', async (req, res) => {
    let user = req.body ;
    const chatEngine = new ChatEngine() ;
    await chatEngine.connect() ;
    const response = await chatEngine.RegisterUser({
        username :req.body.username,
        name :req.body.name,
        password:req.body.password,
        profile : {
            avatar : req.files.avatar
        }
    }) ;
    await chatEngine.disconnect() ;
    res.send(response) ;
}) ;

app.post('/login', async (req, res) => {
    let user = req.body ;
    const chatEngine = new ChatEngine() ;
    await chatEngine.connect() ;
    const response = await chatEngine.GetUser(req.body.username,req.body.password) ;
    await chatEngine.disconnect() ;
    res.send(response) ;
}) ;

app.listen(3001) ;
import express from "express"
import dotenv from"dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import mongoose from "mongoose"
import authRoutes from "./routers/AuthRoutes.js";
import contactsRoutes from "./routers/ContactRoutes.js"
import setupSocket from "./socket.js"
import messageRoutes from "./routers/MessagesRoutes.js"

dotenv.config();//all the env variables will be inside process.env which has writtened inside .env

const app=express();
const port=process.env.PORT || 3001;
const databaseURL=process.env.DATABASE_URL;

app.use(cors({
    origin: [process.env.ORIGIN],
    methods:["GET","POST","PUT","PATCH","DELETE"],
    credentials: true,
}))
//METHODS AVALIABEL WITH THIS ORIGIN ALL THE REST API METHODS -- put and patch are for updation
//use all the middle ware first so the follow up program works good

app.use("/uploads/profiles",express.static("uploads/profiles"));
//we are telling the express server that whenever some users comes to this route and calls an image then we need to serve the assets form our directory to the request

app.use(cookieParser());
app.use(express.json());//to have our body in json format for whatever request is made and the payload inside would be in json format
//now setup our usermodel with mongoose (setup architecture for application , we use model view controller (mvc architcture) model are the database models views are the views for our application and controller are the logic to get data form our server and actual functioning of the server code)
//views -react models-mongodb models controlers-actual logic
app.use('/api/auth', authRoutes);
app.use("/api/contacts",contactsRoutes);
app.use("/api/messages",messageRoutes);

const server = app.listen(port,()=>{
    console.log(`server is running at http://localhost:${port}`);
})
setupSocket(server);
mongoose.connect(databaseURL).then(()=>console.log('DB Connection Sucessful.')).catch(err=>console.log(err.message));

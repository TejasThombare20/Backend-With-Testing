import express from 'express';
import dotenv from "dotenv"
import cookieParser from 'cookie-parser';
import { connectToDB } from "./utils/db.js";
import AuthRouter from "./routes/auth.js"
import NoteRouter from "./routes/notes.js"
dotenv.config()
const app  =  express()
const port = process.env.PORT || 8001

connectToDB();
app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res) => {
    res.json("Base URL work properly")
})

app.use("/api/auth",AuthRouter)
app.use("/api/notes",NoteRouter)


app.listen(port,()=>{
 console.log(`App listening on ${port}`)
})

export default app
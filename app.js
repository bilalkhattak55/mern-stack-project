const express = require("express");
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routing/user-routes";
import postRouter from "./routing/post-routes";
import cors from "cors";

const app = express();
dotenv.config();

// middle wares
app.use(cors());
app.use(express.json());
app.use('/user', userRouter);
app.use('/posts', postRouter);

// connections    mongoose password="0314bilal";
mongoose.connect(
    `mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@cluster0.4nfslkb.mongodb.net/?retryWrites=true&w=majority`
)
.then(()=> {
    const port = 5000;
    app.listen(port, () => {
        console.log(`connection successful & listening to port ${port}`)
    })
})
.catch((err) => {
    console.log(err)
})


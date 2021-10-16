const express = require('express');
const mongoose = require("mongoose");
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// DB CONFIG
const db = require("./config/keys").mongoURL

//CONNECT TO MONGODB
mongoose.connect(db)
    .then(() => console.log("connected to mongodb"))
    .catch(err => console.log(err));



app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);


const port = process.env.PORT || 5000

app.listen(port, () => { console.log(`server running on port ${port}`) })
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");
var cookieParser = require('cookie-parser')
const fs = require("fs");
const jwt = require('jsonwebtoken')
const ws = require('ws') // WEB SOCKER

const app = express(); // initializing express

app.use(cookieParser()); // need cookieParser middleware before we can do anything with cookies
app.use(cors({credentials: true}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//creating upload folder
// if (!fs.existsSync("./upload")) {
//   fs.mkdirSync("./upload");
// }

// app.use("/static", express.static("uploads/users")); // allows user navigate to backend uploads/users folder
// app.use("/static/products", express.static("uploads/products")); // allows user navigate to backend uploads/users folder

// app.use(express.static(__dirname + "/public"));
// app.use("/upload", express.static("upload"));

const port = process.env.PORT || 5000; // default port for sever

// connecting to mongoDB using mongoose
// let databaseConnection = "";
// if (process.env.NODE_ENV === "production") {
//   databaseConnection = process.env.MONGO_URL_PRO;
// } else if (process.env.NODE_ENV === "development") {
//   databaseConnection = process.env.MONGO_URL_DEV;
// } else {
//   databaseConnection = process.env.MONGO_URL_PRO;
// }
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database running");
  })
  .catch((err) => {
    console.log(`Database connection went wrong, ${err}`);
  });

//APP ROUTERS
const userRoutes = require("./routes/User"); //user routes
// const adminRoutes = require("./routes/Admin"); // admin routes

//APP ROUTES
app.get("/", (req, res) =>
  res.status(200).json({ status: true, message: "API IS WORKING" })
);

app.use("/api", userRoutes); // All User routes

// app.use("/api/admin", adminRoutes); // ALL ADMN ROUTES

//sever connection
const server = app.listen(port, () =>
  console.log(
    `Server listening to port ${port}` //your environment is ${process.env.NODE_ENV}`
  )
);

const webSocketServer = new ws.WebSocketServer({server})
webSocketServer.on('connection', (connection, req)=>{
  // once connected, get the user that is connected using cookie token
  // console.log([...webSocketServer.clients].length) // to see all connected users
  let userCookie = req.headers.cookie?.split(';')?.find(token => token.startsWith('_token='))?.split('=')[1]
  if(!userCookie){
    userCookie = req.headers.cookie?.split(';')?.find(token => token.startsWith(' _token='))?.split('=')[1]
  }
  if(userCookie){
    let user = jwt.verify(userCookie,process.env.JWT_SECRET_KEY)
    if(user){
      let {id, name} = user
      connection.id = id
      connection.username = name
    }
  }

  let webSocketClients = [...webSocketServer.clients]
  // NOTIFY USERS OF ALL CONNECTED USERS
  webSocketClients.forEach(client => {
    client.send(JSON.stringify(
      [...webSocketServer.clients].map(client => (
        {id:client.id, name:client.username}
      )
    )))
    // console.log(client.id)
  })

  // WHEN A CONNECTION/USER SENDS A MESSAGE TO RECIPIENT
  connection.on('message', (mesData)=>{
    mesData = JSON.parse(mesData)
    let webSocketClients = [...webSocketServer.clients]
    //FILTER TO GET THE RECIPIENT. NOTE IF YOU USE FIND, IT WILL RETURN ONLY ONE INSTANCE AND WE KNOW THAT ONE USER MAYBE CONNECTED TO SEVERAL DEVICES AT A TIME, THUS THE REASON FOR FILTER
    webSocketClients?.filter(client => client.id == mesData.recipient)?.forEach(client => {
      client.send(JSON.stringify(mesData))
    });
  })
})

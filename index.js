const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");
var cookieParser = require('cookie-parser')
const fs = require("fs");

const ws = require('ws') // WEB SOCKER

const app = express(); // initializing express

app.use(cookieParser()); // need cookieParser middleware before we can do anything with cookies
app.use(cors());
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
// const orderRoutes = require("./routes/Orders"); // order routes
// const productRoutes = require("./routes/Product"); // order routes

//APP ROUTES
app.get("/", (req, res) =>
  res.status(200).json({ status: true, message: "API IS WORKING" })
);

app.use("/api", userRoutes); // All User routes
// app.use("/api/user", userRoutes); // All User routes
// app.use("/api/user", orderRoutes); // ALL ORDER ROUTES

// app.use("/api/admin", adminRoutes); // ALL ADMN ROUTES

// app.use("/api", productRoutes); // ALL PRODUCT ROUTES

//sever connection
const server = app.listen(port, () =>
  console.log(
    `Server listening to port ${port}` //your environment is ${process.env.NODE_ENV}`
  )
);

const webSocketServer = new ws.WebSocketServer({server})
webSocketServer.on('connection', (connection, req)=>{
  // once connected, get the user that is connected using cookie token
  // console.log('CONNECTED....WEB SOCKET', req.headers.cookie)
  // connection.send('HELLO')
  console.log([...webSocketServer.clients].length) // to see all connected users
})

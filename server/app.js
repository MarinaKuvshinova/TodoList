const express = require('express');
const morgan = require('morgan');
const routes = require("./routes/index");
const cors = require("cors");
const bodyParser = require('body-parser');

const app = express();
const PORT =  process.env.PORT || 4000;


app.set('port', PORT);

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cors());
app.use(routes);




//const FBAuth =

// const admin = require('./firebase');
// const db = admin.firestore();
// const config = {
//     apiKey: "AIzaSyCjQGIc2mLaE1Lz_ORzYcw5Nf89ChvbQ4w",
//     authDomain: "todolist-ffba3.firebaseapp.com",
//     databaseURL: "https://todolist-ffba3.firebaseio.com",
//     projectId: "todolist-ffba3",
//     storageBucket: "todolist-ffba3.appspot.com",
//     messagingSenderId: "638607746682",
//     appId: "1:638607746682:web:f000c09387f9ccab013dc3"
// };
//
// const {signUp, signIn} = require('./routes/users');
// const firebase = require('firebase');
// firebase.initializeApp(config);







module.exports = app;
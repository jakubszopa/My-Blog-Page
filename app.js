const express = require('express');
const app = express();
const path = require('path');
const mongodbStore = require('connect-mongodb-session');

const db = require('./data/database');
const routes = require("./routes/blog");
const session = require('express-session');
const MongoDBStore = mongodbStore(session);

const sessionStore = new MongoDBStore({
    uri: 'mongodb://127.0.0.1:27017',
    databaseName: 'myblog',
    collection: 'sessions'
})

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('public')); // static files in public
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'Secret password',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    },
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}))

app.use(routes);

db.connectToDatabase().then(function () {
    app.listen(3000);
})
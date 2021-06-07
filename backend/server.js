const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const bodyParser = require('body-parser');
const User = require('./user');
const speakeasy = require('speakeasy');
const uuid = require('uuid');
const QRcode = require('qrcode');
const { JsonDB } = require('node-json-db')
const { Config } = require('node-json-db/dist/lib/JsonDBConfig');


const db = new JsonDB(new Config('myDatabase', true, false, '/'))

mongoose.connect(
    "mongodb+srv://dbBasheer:admin@cluster0.kdjbt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, () => {
        console.log("Mongoose is Connected")
    })

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))

app.use(session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true
}));

app.use(cookieParser("secretcode"));
app.use(passport.initialize());
app.use(passport.session());
require('./passportConfig')(passport);

// routes
app.post("/register", (req, res) => {
    User.findOne({ username: req.body.username }, async (err, doc) => {
        if (err) throw err;
        if (doc) res.send("This user already exists, choose a different username");
        if (!doc) {
            const id = uuid.v4();
            const secret = speakeasy.generateSecret();
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            const img = await QRcode.toDataURL(secret.otpauth_url);

            const newUser = new User({
                username: req.body.username,
                password: hashedPassword,
                secret: secret.base32,
                userId: id,
                qr: img,
            });
            await newUser.save();
            res.send({ message: "User Created", success: true, qr: img });
        }
    })
});

app.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) throw err;
        if (!user) res.send("No User Exists");

        else {
            console.log(user)
            res.send({ success: true, verify: false, id: user._id })
        }
    })(req, res, next);
});

app.post('/verify', (req, res, next) => {
    const { token, id } = req.body
    console.log(id)
    User.findById(id).then((user) => {
        if (user) {

            const verified = speakeasy.totp.verify({
                secret: user.secret,
                encoding: 'base32',
                token
            })
            if (verified) {
                req.logIn(user, (err) => {
                    if (err) throw err;
                    console.log(err)
                    res.send("Successfully Authenticated");
                    console.log('line', req.user)
                    console.log(verified);
                });

                res.send({ verified: true })
            } else {
                console.log(verified)

                res.send({ verified: false })
            }
        }
    })
})

app.get("/user", (req, res) => {
    res.send(req.user); // once the user is authenticated, it gets stored in req.user 
});

// server start

const PORT = 4000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
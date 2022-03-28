const express = require('express');
const db = require('../data/database')
const bcrypt = require('bcryptjs')

const router = express.Router()

router.get('/', async function (req, res) {

    const posts = await db
    .getDb()
    .collection('posts')
    .find({})
    .toArray();

    res.render('main-page', {posts: posts});
})

router.get('/signup', function (req, res) {
    res.render('signup');
})

router.post('/signup', async function (req, res) {
    const userData = {
        userEmail: req.body.email,
        userPassword: req.body.password,
    };

    const hashedPassword = await bcrypt.hash(userData.userPassword, 12)

    const result = await db
    .getDb()
    .collection('accounts')
    .insertOne(
        {email: userData.userEmail,
        password: hashedPassword
        }
    );
    console.log(result);

    res.redirect('login');
});

router.get('/login', function (req, res) {

    let sessionInputData = req.session.inputData;

    if (!sessionInputData) {
      sessionInputData = {
        hasError: false,
        email: '',
        password: ''
      };
    }
  
    res.render('login', { inputData: sessionInputData });

});

router.post('/login', async function (req, res) {
    const userData = {
        userEmail: req.body.email,
        userPassword: req.body.password,
    };

    const ExistingUser = await db
    .getDb()
    .collection('accounts')
    .findOne({
        email: userData.userEmail
    });

    if(!ExistingUser) {
        req.session.inputData = {
            hasError: true,
            message: 'Could not log you in - please check your credentials!',
            email: enteredEmail,
            password: enteredPassword
          };
          return res.redirect('/login');
    }

    const passwords = bcrypt.compare(userData.userPassword, ExistingUser.password);

    if(!passwords) {
        req.session.inputData = {
            hasError: true,
            message: 'Could not log you in - please check your credentials!',
            email: enteredEmail,
            password: enteredPassword
          };
    }

    if(passwords) {
        console.log('Hasło sie zgadza!');
    }



});

router.get('/admin', function (req, res) {
    res.render('admin')
})

router.get('/logout', function (req, res) {
    res.render('/')
})

module.exports = router;
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      //port : 3000,
      user : 'postgres',
      password : 'test',
      database : 'smart-brain'
    }
});

const app = express();
app.use(cors());
app.use(express.json());

/*
db.select('*').from('users').then(data => {
    console.log(data);
});
*/

app.get('/', (res) => { res.send('success') })
// dependency injection of db and bcrypt
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) })
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
// Although this isn't being used yet it's already built in case of a future feature addition 
// of users being able to access a personal profile page that they can edit
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })
// /image updates number of entries (+1)
app.put('/image', (req, res) => { image.handleImage(req, res, db) })
// receives the input, calls the API with the input that was received, returns data
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })


app.listen(process.env.PORT || 3000, () => { console.log(`app is running on port ${process.env.PORT}`) });
//console.log(process.env.path)
/*
    / --> res = this is working
    /signin --> POST = success/fail
    /register --> POST = user
    /profile/:userId --> GET = user
    /image --> PUT --> user
*/
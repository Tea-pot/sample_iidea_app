const express = require('express');
const path = require('path');
const exphbs  = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');


const app = express();
//express middleware
/*
app.use( function(req, res, next) {
  //console.log(Date.now());
  req.name = 'Kamil K';
  next();
});
*/
//Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Passport Cnfig
require('./config/passport')(passport);
//DB MongoAtlas Config
const db =  require('./config/database');


//Map global promise - get rid of warning
mongoose.Promise = global.Promise;
//connect to  mongoose see config database-> 'mongodb://localhost/vidide-dev'
mongoose.connect(db.mongoURI, {
  useNewUrlParser: true
} /*{
  useMongoClient: true
} -no longer needed*/
)
.then(()=> console.log('MongoDB connected'))
.catch(err => console.log(err));

/*no longer needet we have exported route to ideas.js*/

// HAndlebars middleware
app.engine('handlebars', exphbs({
  defaultLayouts: 'main'
}));
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Method override middleware
app.use(methodOverride('_method'));
//Express session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
  //cookie: { secure: true }
}));

//Ming to put middleware of Passport after EXpress
app.use(passport.initialize());
app.use(passport.session());

//Static Folder __dirname current dir and 'dir' we would like to use
app.use(express.static(path.join(__dirname, 'public')));

//Flash
app.use(flash());
// Global variables
app.use( function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
})

// create routes -> we are handling GET request
app.get('/', (req, res) => {
  //console.log(req.name);
  const title = 'welcome';
  res.render('index', {
    title: title
  });
});
// above, res object is sending to the browser -> we're getting INDEX
// About
app.get('/about', (req, res) => {
  res.render('about');
});


//Udse routes -> see const ideas
app.use('/ideas', ideas);
app.use('/users', users);

const port = process.env.PORT || 5000;
// heroku can can decide of port -> process.env.PORT


app.listen(port, ()=> {
  console.log(`server started on port ${port}`);
});
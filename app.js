if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
};
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const app = express();
const MongoStore = require('connect-mongo');
const session = require('express-session');
const dbUrl = process.env.ATLASDB_URL;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MongoDB Connection
mongoose.connect(process.env.ATLASDB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true, // SSL is enabled by default in MongoDB Atlas, no need for 'sslValidate'
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("ERROR IN MONGO SESSION", err);
});


const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24  * 60 * 60 * 1000,
        maxAge:  7 * 24  * 60 * 60 * 1000,
        httpOnly: true 
    },
};

// Session setup with MongoStore for persistent sessions
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key', // Use environment variable for production
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' } // Ensure cookies are secure in production (HTTPS)
}));
// MongoDB Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  linkedin: String,
  github: String,
});

const User = mongoose.model('User', userSchema);

// Nodemailer Transporter Setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'gamec8821@gmail.com',  // Your Gmail account
    pass: 'pgaf wxxo semj zzru',  // Use environment variable for password (not hardcoded)
  },
});

// Routes

// Home Route
app.get("/", (req, res) => {
  res.render("home");
});

// Display all user cards
app.get('/cards', async (req, res) => {
  try {
    const users = await User.find({}); // Await the result of the database query
    res.render('card', { users });
  } catch (err) {
    console.log(err);
    res.send('Error fetching users');
  }
});

// Render the form page
app.get('/register', (req, res) => {
  res.render('form'); // Render the form page
});

// Handle form submission for registration
app.post('/register', async (req, res) => {
  const { name, email, phone, address, linkedin, github } = req.body;

  // Check for missing fields
  if (!name || !email || !phone || !address || !linkedin || !github) {
    return res.status(400).send('All fields are required');
  }

  // Save user to MongoDB
  const newUser = new User({ name, email, phone, address, linkedin, github });
  try {
    // Save user in MongoDB
    await newUser.save();

    // Prepare email content
    const mailOptions = {
      from: 'gamec8821@gmail.com', // Use environment variable for email
      to: 'raghavrock098@gmail.com', // Recipient email
      subject: 'New Order Request',
      html: `
        <h3>New Order Request</h3>
        <p><strong>User:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Address:</strong> ${address}</p>
        <p><strong>LinkedIn:</strong> <a href="${linkedin}" target="_blank">${linkedin}</a></p>
        <p><strong>GitHub:</strong> <a href="${github}" target="_blank">${github}</a></p>
      `,
    };

    // Send email with registration details
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.send('Error occurred');
      } else {
        console.log('Email sent: ' + info.response);
        res.redirect('/cards'); // Redirect to the user cards page after successful registration
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('Error saving user');
  }
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

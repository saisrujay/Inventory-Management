//importing the dependencies
const dotenv = require('dotenv');
const exp = require('express');
const mongo = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoute = require('./routes/userRoute');
const productRoute = require('./routes/productRoute');
const contactRoute = require('./routes/contactRoute');
const error = require('./middlewares/errorMiddleware');
const cookieParser = require('cookie-parser');
const path = require("path");

// for env files
dotenv.config();

const app = exp();

//Middlewares

//The json middleware is used to parse JSON data sent in the request body. 
// It allows you to access the parsed JSON data in your route handlers.
app.use(exp.json());
// The cookieParser middleware parses and populates the req.cookies object with any cookies sent in the request. It allows you to access and manipulate cookies in your route handlers.
app.use(cookieParser());
app.use(exp.urlencoded({extended: false}));
// body-parser is a popular middleware used to parse the request body. In this case, the json middleware specifically handles JSON data sent in the request body and makes it available in your route handlers.
app.use(bodyParser.json());
// CORS (Cross-Origin Resource Sharing) is a mechanism that allows servers to specify who can access their resources (e.g., APIs) and how they can be accessed from a different origin (domain, protocol, or port). It is a 
// security measure implemented by web browsers to protect users from unauthorized cross-origin requests.
app.use(
    cors({   // // Allow requests from this origin
        origin: ["http://localhost:3000", "https://pinvent-app.vercel.app"],
        credentials: true,
      })
)
// app.use: This is an Express.js method used to add middleware to the application's middleware stack.
// By using app.use with the "/uploads" URL path and the express.static middleware, any files located in the "uploads" directory will be accessible from the "/uploads" route in your application.
// For example, if you have a file named "image.jpg" in the "uploads" directory, it can be accessed in the browser using the URL "/uploads/image.jpg".
app.use("/uploads", exp.static(path.join(__dirname,"uploads")));

//Routes Middleware
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/contactus", contactRoute);

// routing
app.get("/", function(req, res) {
    res.send("Home Page");
});

// error middleware
app.use(error);

const PORT_NO = process.env.PORT || 5000

//connecting to database and starting the server

mongo.set('strictQuery', false);
mongo.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT_NO , () => {
            console.log(`Server started at port ${ PORT_NO }`); 
        });
    })
    .catch( function(err) {
        console.log(err);
    });
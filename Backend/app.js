//importing the dependencies
const dotenv = require('dotenv');
const exp = require('express');
const mongo = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoute = require('./routes/userRoute');
const productRoute = require('./routes/productRoute');
const error = require('./middlewares/errorMiddleware');
const cookieParser = require('cookie-parser');
const path = require("path");

dotenv.config();

const app = exp();

//Middlewares
app.use(exp.json());
app.use(cookieParser());
app.use(exp.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use("/uploads",exp.static(path.join(__dirname,"uploads")));

//Routes Middleware
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);

// routing
app.get("/", function(req, res) {
    res.send("Home Page");
});

// error middleware
app.use(error);

const PORT_NO = process.env.PORT || 3000

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
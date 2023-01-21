//importing the dependencies
const dotenv = require('dotenv');
const exp = require('express');
const mongo = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoute = require('./routes/userRoute');
const error = require('./middlewares/errorMiddleware');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = exp();

//Middlewares
app.use(exp.json());
app.use(cookieParser());
app.use(exp.urlencoded({extended: false}));
app.use(bodyParser.json());

//Routes Middleware
app.use("/api/users", userRoute);

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
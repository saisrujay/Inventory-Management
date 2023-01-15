//importing the dependencies
const dotenv = require('dotenv');
const exp = require('express');
const mongo = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();

const app = exp();

const PORT_NO = process.env.PORT || 3000

//connecting to database and starting the server

mongo.set('strictQuery', false);
mongo.connect(process.env.MONGO_URI).then(() => {
    app.listen(PORT_NO , () => {
        console.log(`Server started at port ${ PORT_NO }`); 
    });
}).catch( function(err) {
    console.log(err);
});
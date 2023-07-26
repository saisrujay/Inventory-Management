//The thrown error will propagate up the call stack until it is 
// caught by an error handling middleware or the default Express error handler.


const error = (err,req,res,next) => {
    const status = res.statusCode ? res.statusCode : 500;
    res.status(status);

    res.json({
        message : err.message,
        stack : process.env.NODE_ENV === "development" ? err.stack : null,
    });
};

module.exports = error;
const error = (err,req,res,next) => {
    const status = err.statusCode ? res.statusCode : 500;
    res.status(status);

    res.json({
        message : err.message,
        stack : err.stack
    });
};
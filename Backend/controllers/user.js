const user = async (req, res) => {
    if(!req.body.email) {
        res.status(400);
        throw new Error("Add an email address");
    }
    res.send("Registered user");
};

module.exports = {
    user
}
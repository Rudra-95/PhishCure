const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
    console.log("Connected to DB");
    const users = await User.find({});
    console.log("All users in DB:", users);

    const user = await User.findOne({ username: "Rudra", password: "rphis5" });
    console.log("Found Rudra?", user);
    
    process.exit(0);
})
.catch(err => {
    console.error(err);
    process.exit(1);
});

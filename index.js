const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');

const User = require("./models/register.model");
const databaseConnection = require('./database/conn');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "100mb" }));



/**Requests */
app.get("/", (req, res) => {
    res.status(200).send("Server Running Successfully");
});

app.post("/register", async (req, res) => {
    const data = req.body;

    try {
        const addUser = await new User({ ...data });
        await addUser.save();
        res.status(200).json({ message: "User Added" });

    } catch (error) {
        res.status(400).json({ message: "Somting went wrong" });
    }
})

app.post("/login", async (req, res) => {
    let { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "email not registered" });
        if (user.password != password)
            return res.status(400).json({ message: "password incorrect" });
        res.status(200).json({
            message: "You are successfully logged in",
            user_id: user._id,
            success: true,
        });
    } catch (error) {
        res.status(400).json({ message: "Somting went wrong" });
    }
})

app.post("/dashboard", async (req, res) => {

    try {
        let user = await User.findById(req.body.userId).select('firstName lastName');
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: "User not registered" });
    }
})

app.get("/users", async (req, res) => {
    try {
        let user = await User.find({}).select('firstName lastName userName email active');
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: "User not registered" });
    }
})

app.post("/deleteUser", async (req, res) => {
    try {
        let user = await User.findById(req.body.deleteUserId)
        user.active = false;
        await user.save();
        res.status(200).json({ message: "User Deleted" });
    } catch (error) {
        res.status(400).json({ message: "Somting went wrong" });
    }
})

app.post("/editUser/:id", async (req, res) => {
    let { firstName, lastName, userName } = req.body;
    try {
        let user = await User.findById(req?.params?.id)
        if (firstName) {
            user.firstName = firstName;
        }
        if (lastName) {
            user.lastName = lastName;
        }
        if (userName) {
            user.userName = userName;
        }
        await user.save();
        res.status(200).json({ message: "User Updated" });
    } catch (error) {
        res.status(400).json({ message: "Somting went wrong" });
    }
})

databaseConnection().then(() => {
    try {
        app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
    } catch (err) {
        console.error("Error : Could not connect to server");
    };
}).catch((err) => {
    console.error("Error : Invalid database connection");
});
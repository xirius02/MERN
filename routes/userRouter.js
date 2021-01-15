
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");





router.get("/test", (req, res) => {
    res.send("hello, its working");
});

router.post("/register", async (req, res) => {
    try {
        
    const {email, password, passwordCheck, displayName } = req.body;

    //validate

    if (!email || !password || !passwordCheck)
        return res.status(400).json({msg: "not all fields have been entered."});
    if(password.length < 5)
        return res
            .status(400)
            .json({msg: "the password need to be at least characters long"});

    if(password !== passwordCheck)
        return res
            .status(400)
            .json({msg: "enter the same password twice for verification"});
            
            const existingUser = await User.findOne({ email: email });
            if (existingUser) 
            return res
            .status(400)
            .json({msg: "an account with this email already exists"});

            if (!displayName) displayName = email;

            const salt = await bcrypt.genSalt();
            const passwordHash = await bcrypt.hash(password, salt);
            
            const newUser = new User({
                
                email,
                password: passwordHash,
                displayName
            });
        const savedUser = await newUser.save();
        res.json(savedUser);
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
});

router.post("/login", async(req, res) => {
try{
    const {email, password} = req.body;

    //validation
    if (!email || !password)
    return res.status(400).json({msg: "not all fields have been entered."});

    const user = await User.findOne({ email: email});
    if(!user)
    return res
    .status(400)
    .json({msg: "no account with this email has been registered"});
    
const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch)
return res
.status(400)
.json({msg: "invalid credentials"});

const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
res.json({
    token, 
    user: {
        id: user._id, 
        displayName: user.displayName,
        email: user.email,
    }
})
} catch (err) {
    res.status(500).json({ error: err.message })
}
});

router.delete("/delete", auth, async(req, res) => {

    try{
        const deletedUser = await User.findByIdAndDelete(req.user);
        res.json(deletedUser)
        console.log(verified);
    } catch (err) {
        res.status(500).json({ error: err.message })
        
    }
});

module.exports = router;
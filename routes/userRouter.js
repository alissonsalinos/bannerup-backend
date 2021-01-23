const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const User = require("../models/userModel");


router.post("/register", async (req, res) => {
    try {
        let { email, password, passwordCheck, displayName } = req.body;
    
        //validate
        if (!email || !password || !passwordCheck)
            return res.status(400).json({msg: "Nem todos os campos foram preenchidos."});
        if (password.length < 5)
            return res.status(400).json({msg: "A senha precisa ter pelo menos 5 caracteres"}); 
        if (password !== passwordCheck)
            return res.status(400).json({msg: "Preencha a mesma senha 2 vezes para verificação."});
        
        const existingUser = await User.findOne({email: email})  
        if (existingUser)
            return res.status(400).json({msg: "Já existe uma conta com este email."});

        if (!displayName) displayName = email; 
        
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            password: passwordHash,
            displayName
        });
        const saveUser = await newUser.save();
        res.json(saveUser);
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    

        
});

router.post("/login", async (req, res) => {
    try {
        const { email, password} = req.body;

        //validate
        if (!email || !password) 
            return res.status(400).json({msg: "Nem todos os campos foram preenchidos."});
        
        const user = await User.findOne({ email: email });
        if (!user)
            return res.status(400).json({msg: "Não existe nenhuma conta com este email."}); 

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch)
            return res.status(400).json({msg: "Senha inválida."});    

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);    
        res.json({
            token,
            user: {
                id: user._id,
                displayName: user.displayName,
            }
        })
        console.log(token);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.delete("/delete", auth, async (req, res) => {
    try {
        const deleteUser = await User.findByIdAndDelete(req.user);
        res.json(deleteUser) 
    } catch (err) {
        res.status(500).json({ error: err.message }); 
    }
})

router.post("/tokenIsValid", async (req, res) => {
    try {
        const token = req.header("x-auth-token"); 
        if (!token) return res.json(false);
        
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) return res.json(false);
        
        const user = await User.findById(verified.id);
        if (!user) return res.json(false);

        return res.json(true);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.get("/", auth, async (req,res) => {
    const user = await User.findById(req.user);
    res.json({
        displayName: user.displayName,
        id: user._id,
    })
})


module.exports = router;
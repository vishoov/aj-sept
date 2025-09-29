const User = require('../model/user.model');
const { createToken } = require('../middlewares/auth.mw');
// Signup
const Signup = async (req, res)=>{
    try{
        const userInfo = req.body;

        const user = await User.create(userInfo);

        if(!user){
            return res.status(400).json({message: "Error while creating user"});
        }

        const token = await createToken({
            id: user._id,
            role: user.role
        })

        res.status(201).json({
            message: "User created successfully",
            user: user,
            token: token
        })
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}
// Login
const login = async (req, res)=>{
    try{
        const { email, password } = req.body;

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({
                message:" User not found"
            })
        }



        if(user.password !==password){
            return res.status(400).json({
                message: "Invalid credentials"
            })
        }

        const token = await createToken({
            id: user._id,
            role: user.role
        })

        res.status(200).json({
            message: "Login successful",
            user: user,
            token: token
        })
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}
// Logout
const logout = async (req, res)=>{
    try{
        //user-> last login time 
        //token-> blacklisting this is done on frontend
        res.status(200).json({message: "Logout successful"});

    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}
// Update Password
const updatePassword = async (req, res)=>{
    try{
        const { email, oldPassword, newPassword } = req.body;

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({
                message:" User not found"
            })
        }

        if(user.password !==oldPassword){
            return res.status(400).json({
                message: "Invalid credentials"
            })
        }

        user.password = newPassword;
        //user object -> update with the new password ONLY ON SERVER

        await user.save();
        //this will update the user in the database

        res.status(200).json({
            message: "Password updated successfully",
            user: user
        })

    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}

// Profile Page through ID
const profilePage = async (req, res)=>{
    try{
        const { id } = req.params;

        const user = await User.findById(id);

        //search -> users list -> find the user with the id

        if(!user){
            return res.status(400).json({
                message:" User not found"
            })
        }

        res.status(200).json({
            message: "User profile fetched successfully",
            user: user
        })
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}

module.exports = {
    Signup,
    login,
    logout,
    updatePassword,
    profilePage
}

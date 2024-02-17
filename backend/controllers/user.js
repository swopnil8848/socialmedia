const mongoose = require('mongoose')
const Post = require('../models/Post');
const User = require('../models/User')
const {sendEmail} = require('../middlewares/sendEmail')
const crypto = require('crypto')
const cloudinary = require('cloudinary')


exports.register = async(req,res)=>{
    try{
        const {name,email,password,avatar} = req.body;

        let user = await User.findOne({email})

        if(user) return res.status(400).json({success:false,message:"User alreday exists"})

        const myCloud = await cloudinary.v2.uploader.upload(avatar,{
            folder:'avatar'
        })

        user = await User.create({name,email,password,avatar:{public_id:myCloud.public_id,url:myCloud.secure_url}})

        const token = await user.generateToken();
        
        const options = {
            expires:new Date(Date.now()+90*24*60*60*1000),
            httpOnly:true
        }

        res.status(200).cookie('token',token,options).json({
            success:true,
            user,
            token
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.login = async (req,res)=>{
    try{
        const {email,password} = req.body;
        
        const user = await User.findOne({email}).select("+password").populate("posts followers following")

        if(!user){
            return res.status(400).json({
                success:false,
                message:"user does nto exists"
            });
        }

        const isMatch = await user.matchPassword(password);

        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:'incorrect password'
            })
        }

        const token = await user.generateToken();
        
        // const options =  {
        //     httpOnly: false,
        //     path: "/",
        //     maxAge: 60 * 60 * 3 * 100000,
        //     secure: true,
        //     sameSite: 'none',
        // }

        options = { httpOnly: true, secure: true, sameSite: 'None' }

        //   res.cookie('yourTokenCookie', yourToken, { httpOnly: true, secure: true, sameSite: 'None' });

        res.status(200).cookie('token',token,options).json({
            success:true,
            user,
            token
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.logout = async (req, res) => {
    try {
        res.status(200)
           .cookie("token", null, {
                expires: new Date(0), // Set to a past date to expire the cookie
                httpOnly: true,
           })
           .json({
                success: true,
                message: "logged out successfully",
           });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.follwoUser = async(req,res)=>{
    try{
        const userToFollow = await User.findById(req.params.id);
        const loggedInUser = await User.findById(req.user._id);

        if(!userToFollow){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }

        if(userToFollow === req.params._id){
            return res.status(400).json({
                success:false,
                message:"you cannot follow yourself"
            })
        }

        if(loggedInUser.following.includes(userToFollow._id)){

            const indexfollowing = loggedInUser.following.indexOf(userToFollow._id)
            loggedInUser.following.splice(indexfollowing,1)
            
            const indexfollowers = userToFollow.followers.indexOf(loggedInUser._id)
            userToFollow.followers.splice(indexfollowers,1)

            await loggedInUser.save()
            await userToFollow.save()

            res.status(200).json({
                success:true,
                message:"user Unfollowed"
            })

        }else{
            loggedInUser.following.push(userToFollow._id);
            userToFollow.followers.push(loggedInUser._id);
    
            await loggedInUser.save();
            await userToFollow.save();
    
            res.status(200).json({
                success:true,
                message:"user followed"
            })
        }

    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.updatePassword = async(req,res)=>{
    try{
        const user = await User.findById(req.user._id).select("+password");

        const {oldPassword,newPassword} = req.body;

        if(!oldPassword||!newPassword){
            return res.status(400).json({
                success:false,
                message:"please provide old password and new password"
            })
        }

        const isMatch = await user.matchPassword(oldPassword);

        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:"incorrect old password"
            })
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success:true,
            message:"password updated"
        })

    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.updateProfile = async(req,res)=>{
    try{
        const user = await User.findById(req.user._id);

        const {name,email,avatar} = req.body;

        if(name){
            user.name = name;
        }
        if(email){
            user.email = email
        }

        if(avatar){
            await cloudinary.v2.uploader.destroy(user.avatar.public_id)

            const myCloud = await cloudinary.v2.uploader.upload(avatar,{
                folder:'avatars',
            })
            user.avatar.public_id = myCloud.public_id
            user.avatar.url = myCloud.secure_url
        }

        await user.save();

        res.status(200).json({
            success:true,
            message:"profile updated"
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.deleteMyProfile = async(req,res)=>{
    try{
        const userId = req.user._id
        const user = await User.findById(userId);
        const followers = user.followers;
        const following = user.following;

        // removing avatar from cloudinary
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);

        await User.deleteOne({ _id: user })

        res.cookie("token", null, {
            expires: new Date(0), // Set to a past date to expire the cookie
            httpOnly: true,
        })

        //removing user from followers' following
        for (let i = 0; i < followers.length; i++) {
            const follower = await User.findById(followers[i])

            const index = follower.following.indexOf(userId);
            follower.following.splice(index, 1)

            await follower.save()
        }

        // removing user from following's followers
        for (let i = 0; i < following.length; i++) {
            const follows = await User.findById(following[i])

            const index = follows.followers.indexOf(userId);
            follows.followers.splice(index, 1)

            await follows.save()
        }

        // await Post.deleteMany({ owner: userId });
        //delete all posts of user
        for (let i = 0; i < user.posts.length; i++) {
            const post = await Post.findById(user.posts[i]);
            await cloudinary.v2.uploader.destroy(post.image.public_id);
            await post.remove();
        }

        // removing all comments of user from all posts
        const allposts = await Post.find();

        for (let i = 0;allposts.length;i++){
            const post = await Post.findById(allposts[i]._id)
            for(let j = 0; j < post.comments.length;j++){
                if(post.comments[j].user===userId){
                    post.comments.splice(j,i);
                }
            }
        }

        // removing all likes of user form al posts
        for (let i = 0;allposts.length;i++){
            const post = await Post.findById(allposts[i]._id)
            for(let j = 0; j < post.likes.length;j++){
                if(post.likes[j]===userId){
                    post.likes.splice(j,i);
                }
            }
        }


        res.status(200).json({
            success: true,
            message: "Profile deleted, along with associated posts",
        });

    } catch(error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.myProfile = async(req,res) =>{
    try{
        const user = await User.findById(req.user._id).populate("posts followers following");

        res.status(200).json({
            success:true,
            user
        })
    }catch(error){
        console.log("error in my profile",error)
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.getUserProfile = async (req,res)=>{
    try{
        const user = await User.findById(req.params.id).populate("posts followers following");

        if(!user){
            return res.status(404).json({
                success:false,
                message:"user not found"
            })
        }

        res.status(200).json({
            success:true,
            user
        })

    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.getAllUser = async (req,res)=>{
    try{
        const users = await User.find({name:{$regex:req.query.name,$options:'i'}})

        res.status(200).json({
            success:true,
            users,
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.forgotPassword = async(req,res)=>{
    try{
        const user = await User.findOne({email:req.body.email});

        if(!user){
            return res.status(404).json({
                success:false,
                message:"user not found"
            })
        }

        const resetPasswordToken = user.getResetPasswordToken();

        await user.save();

        const resetURl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetPasswordToken}`;

        const message = `Reset Your password by clicking on the link below ${resetURl}`

        try{
            await sendEmail({email:user.email,subject:"Reset Password",message})

            res.status(200).json({
                success:true,
                message:`Email sent to ${user.email}`
            })
        }catch(error){
            user.resetPasswordExpire = undefined
            user.resetPasswordToken = undefined
            res.status(500).json({
                success:false,
                message:error.message
            })
        }
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.resetPassword = async(req,res)=>{
    try{
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user = await User.findOne({resetPasswordToken,resetPasswordExpire:{$gt:Date.now()}})

        if(!user){
            return res.status(401).json({
                success:false,
                message:"token is invalid or expired"
            })
        }

        user.password = req.body.password;

        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save();

        res.status(200).json({
            success:true,
            message:"password updated"
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.getMyPosts = async (req,res)=>{
    try{
        const user = await User.findById(req.user._id)

        const posts = [];

        if (user?.posts.length > 0) {
            for(let i = 0;i<user.posts.length;i++){
                const post = await Post.findById(user.posts[i]).populate(
                    "likes comments.user owner"
                );
                posts.push(post)
            }
        }

        res.status(200).json({
            success:true,
            posts,
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.getUserPosts = async (req,res)=>{
    try{
        const user = await User.findById(req.params.id)

        const posts = [];

        if (user?.posts.length > 0) {
            for(let i = 0;i<user.posts.length;i++){
                const post = await Post.findById(user.posts[i]).populate(
                    "likes comments.user owner"
                );
                posts.push(post)
            }
        }

        res.status(200).json({
            success:true,
            posts,
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
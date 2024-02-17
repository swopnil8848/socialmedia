const Post = require('../models/Post')
const User = require('../models/User')
const cloudinary = require('cloudinary');
const {sendEmail} = require('../middlewares/sendEmail')

exports.createPost = async(req,res)=>{ 
    try{

        const myCloud = await cloudinary.v2.uploader.upload(req.body.image,{
            folder:"posts"
        });

        const newPostData = {
            caption:req.body.caption,
            image:{
                public_id:myCloud.public_id,
                url:myCloud.secure_url
            },
            owner:req.user._id
        }

        const post = await Post.create(newPostData)

        const user = await User.findById(req.user._id);

        user.posts.unshift(post._id);

        await user.save()

        res.status(201).json({
            sucess:true,
            message:'post created'
        })

    }catch(error){
        res.status(500).json({
            sucess:false,
            posts,
            message:error.message
        })
    }

}

exports.deletePost = async(req,res)=>{
    try{
        console.log("delete post being called")
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({
                success:false,
                message:"post not found"
            })
        }

        if(post.owner.toString()!==req.user._id.toString()){
            return res.status(401).json({
                success:false,
                message:"unauthorized"
            })
        }

        await cloudinary.v2.uploader.destroy(post.image.public_id);

        await Post.deleteOne({ _id: post._id });

        const user = await User.findById(req.user._id)

        const index = user.posts.indexOf(req.params.id);
        user.posts.splice(index,1);
        await user.save();

        res.status(200).json({
            success:true,
            message:"post deleted"
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.likeAndUnlikedPost = async (req,res) =>{
    try{
        const post = await Post.findById(req.params.id)

        if(!post){
            return res.status(404).json({
                success:false,
                message:"post not found"
            })
        }
        
        if(post.likes.includes(req.user._id)){
            const index = post.likes.indexOf(req.user._id);

            post.likes.splice(index,1);

            await post.save();
            
            return res.status(200).json({
                success:true,
                message:"post unliked"
            })
        }
        else{
            post.likes.push(req.user._id)
    
            await post.save();

            return res.status(200).json({
                success:true,
                message:"post liked"
            })
        }
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.getPostOfFollowing = async(req,res) =>{
    try{
        const user = await User.findById(req.user._id)

        const posts = await Post.find({
            owner:{
                $in:user.following
            }
        }).populate("owner likes comments.user")

        res.status(200).json({
            success:true,
            posts:posts.reverse(),
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.updateCaption = async (req,res) =>{
    try{    
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({
                success:false,
                message:"post not found"
            })
        }

        if(post.owner.toString()!==req.user._id.toString()){
            return res.status(401).json({
                success:false,
                message:"Unauthorized"
            })
        }

        post.caption = req.body.caption;
        await post.save();

        res.status(200).json({
            success:true,
            message:"caption updated"
        })
        
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.commentOnPost = async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({
                success:false,
                message:"post not found"
            })
        }

        let commentIndex = -1;

        // checking if the comment aleady exists
        post.comments.forEach((item, index)=>{
            if(item.user.toString()===req.user._id.toString()){
                commentIndex = index;
            }
        })

        if(commentIndex!==-1){
            post.comments[1].comment = req.body.comment;

            await post.save();

            return res.status(200).json({
                success:true,
                message:"comment updated"
            })
        }
        else{
            post.comments.push({
                user:req.user._id,
                comment:req.body.comment
            })

            await post.save();
            return res.status(200).json({
                success:true,
                message:"Comment added"
            })
        }


    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.deleteComment = async(req,res)=>{
    try{

        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({
                success:false,
                message:"post not found"
            })
        };

        
        //checking if the owner want to delete
        if(post.owner.toString()===req.user._id.toString()){

            if(req.body.commentId == undefined){
                return res.status(400).json({
                    success:false,
                    message:"comment Id is required"
                })
            }

            console.log("this block is running")
            post.comments.forEach((item, index)=>{
                if(item._id.toString()===req.body.commentId.toString()){
                    return post.comments.splice(index,1)
                }
            });


            await post.save();
            
            return res.status(200).json({
                success:true,
                message:"Selected Comment deleted"
            })

        }else{

            console.log("second block is running")
            post.comments.forEach((item, index)=>{
                if(item.user.toString()===req.user._id.toString()){
                    return post.comments.splice(index,1)
                }
            });

            await post.save();


            res.status(200).json({
                success:true,
                message:"your comment has deleted"
            })

        }
        
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


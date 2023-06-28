const {Post, User, Hashtag} = require('../models')

exports.lobby=async(req,res,next)=>{
    try {
        const posts=await Post.findAll({
            include:{
                model:User,
                attributes:['id','nick']
            },
            order:[['createdAt','DESC']]
        })
        if (req.user) {
            return res.redirect('/main')
        }
        res.render('lobby',{
            title:'NodeBird',
            twits:posts
        })
    } catch(error) {
        console.error(error)
        next(error)
    }
}

exports.main=async(req,res,next)=>{
    try {
        const posts=await Post.findAll({
            include:{
                model:User,
                attributes:['id','nick']
            },
            order:[['createdAt','DESC']]
        })
        res.render('main',{
            title:'NodeBird',
            twits:posts
        })
    } catch (error) {
        console.error(error)
        next(error)
    }
}

exports.hashtag=async(req,res,next)=>{
    const query=req.query.hashtag
    if (!query) {
        return res.redirect('/main')
    }
    try {
        const hashtag=await Hashtag.findOne({where:{title:query}})
        let posts=[]
        if (hashtag) {
            posts=await hashtag.getPosts({include:[{model:User}]})
        }
        return res.render('main',{
            title:`${query} | NodeBrid`,
            twits:posts
        })
    } catch (error) {
        console.error(error)
        return next(error)
    }
}
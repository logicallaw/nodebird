const multer=require('multer')
const path=require('path')
const fs=require('fs')
const {Post, Hashtag} = require('../models')

exports.addFolder=()=>{
    try{
        fs.readdirSync('uploads')
    } catch (error) {
        console.log('uploads 폴더가 없어 uploads 폴더를 생성합니다.')
        fs.mkdirSync('uploads')
    }
}

exports.img=(req,res)=>{
    console.log(req.file)
    res.json({url:`img/${req.file.filename}`})
}

exports.recommend=async(req,res,next)=>{
    try {
        async function addFunc() {
            let exNum=await Post.findOne({where:{id:req.params.id}, attributes:['recommend']})
            exNum=Number(exNum.dataValues.recommend)+1
            // console.log(exCount)
            await Post.update({
                recommend:exNum
            },{where:{id:req.params.id}})
        }
        addFunc()
        res.redirect('/main')
    } catch (err) {
        console.error(err)
        next(err)
    }
}

exports.updated=async(req,res,next)=>{
    try {
        await Post.update({
            content:req.params.text
        },{where:{id:req.params.id}})
        res.redirect('/main')
    } catch(err) {
        console.error(err)
        next(err)
    }
}

exports.deleted=async(req,res,next)=>{
    try {
        await Post.destroy({where:{id:req.params.id}})
        res.redirect('/main')
    } catch(err) {
        console.error(err)
        next(err)
    }
}

exports.twit=async(req,res,next)=>{
    try {
        const post=await Post.create({
            content:req.body.content,
            img:req.body.url,
            UserId:req.user.id,
            recommend:0
        })
        const hashtags=req.body.content.match(/#[^\s#]+/g)
        if (hashtags) {
            const result = await Promise.all(
                hashtags.map(tag=>{
                    return Hashtag.findOrCreate({
                        where:{title:tag.slice(1).toLowerCase()},
                    })
                })
            )
            await post.addHashtags(result.map(r=>r[0]))
        }
        res.redirect('/main')
    } catch(error){
        console.error(error)
        next(error)
    }
}
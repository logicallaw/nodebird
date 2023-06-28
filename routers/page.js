const express=require('express')
const {isLoggedIn,isNotLoggedIn}=require('./middlewares')
const {Post,User,Hashtag}=require('../models')
const {lobby, main, hashtag}=require('../controllers/page')

const router=express.Router()

router.use((req,res,next)=>{
    res.locals.user=req.user
    res.locals.followerCount=req.user ? req.user.Followers.length : 0
    res.locals.followingCount=req.user ? req.user.Followings.length : 0
    res.locals.followerIdList=req.user ? req.user.Followings.map(f=>f.id) : []
    next()
})

router.get('/profile',isLoggedIn,(req,res)=>{
    res.render('profile',{title:'내정보 - NodeBird'})
})

router.get('/join',isNotLoggedIn,(req,res)=>{
    res.render('join',{title:'회원가입 - NodeBird'})
})

router.get('/',lobby)
router.get('/main',isLoggedIn,main)
router.get('/hashtag',isLoggedIn,hashtag)

module.exports=router
const express=require('express')
const passport=require('passport')
const bcrypt=require('bcrypt')
const {isLoggedIn,isNotLoggedIn}=require('./middlewares')
const User=require('../models/user')
const router=express.Router()
const {join,login,logout}=require('../controllers/auth')

router.post('/join',isNotLoggedIn,join)
router.post('/login',isNotLoggedIn,login)
router.get('/logout',isLoggedIn,logout)

router.get('/kakao',passport.authenticate('kakao'))

router.get('/kakao/callback',passport.authenticate('kakao',{
    failureRedirect:'/'
}),(req,res)=>{
    res.redirect('/main')
})

router.get('/google',passport.authenticate('google',{
        scope:['profile','email','https://www.googleapis.com/auth/spreadsheets'],
    }))

router.get('/google/callback',passport.authenticate('google',{
    successRedirect:'/main',
    failureRedirect:'/google'
}),(req,res)=>{
    res.redirect('/main')
})

router.get('/facebook',passport.authenticate('facebook',{
    scope:['public_profile','email']
}))

router.get('/facebook/callback',passport.authenticate('facebook',{
    failureRedirect:'/'
}),(req,res)=>{
    res.redirect('/main')
})

router.get('/naver',passport.authenticate('naver',{ authType: 'reprompt' }))

router.get('/naver/callback',passport.authenticate('naver',{
    failureRedirect:'/'
}),(req,res)=>{
    res.redirect('/main')
})

module.exports=router
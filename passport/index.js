const passport=require('passport')
const local=require('./localStrategy')
const kakao=require('./kakaoStrategy')
const google=require('./googleStrategy')
const facebook=require('./facebookStrategy')
const naver=require('./naverStrategy')
const User=require('../models/user')

module.exports=()=>{
    passport.serializeUser((user,done)=>{
        done(null,user.id)
    })
    passport.deserializeUser((id,done)=>{
        User.findOne({
            where:{id},
            include:[{
                model:User,
                attributes:['id','nick'],
                as:'Followers'
            },{
                model:User,
                attributes:['id','nick'],
                as:'Followings'
            }]
        })
        .then(user=>done(null,user))
        .catch(err=>done(err))
    })
    local()
    kakao()
    google()
    facebook()
    naver()
}
const passport=require('passport')
const NaverStrategy=require('passport-naver').Strategy

const User=require('../models/user')

module.exports=()=>{
    passport.use(new NaverStrategy({
        clientID:process.env.NAVER_ID,
        clientSecret:process.env.NAVER_SECRET,
        callbackURL:'/auth/naver/callback'
    },async(accessToken,refreshToke,profile,done)=>{
        console.log('Naver - profile',profile)
        try {
            const exId=profile.id.length >30 ? profile.id.slice(0,30) :profile.id 
            const exUser=await User.findOne({
                where:{snsId:exId,provider:'naver'}})
            if (exUser) {
                done(null,exUser)
            } else {
                const newUser=await User.create({
                    email:profile.emails[0].value,
                    nick:profile.displayName,
                    snsId:exId,
                    provider:'naver'
                })
                done(null,newUser)
            }
        } catch (error){
            console.error(error)
            done(null,error)
        }
    }))
}
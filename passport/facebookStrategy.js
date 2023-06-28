const passport=require('passport')
const FacebookStrategy=require('passport-facebook').Strategy

const User=require('../models/user')

module.exports=()=>{
    passport.use(new FacebookStrategy({
        clientID:process.env.FACEBOOK_ID,
        clientSecret:process.env.FACEBOOK_SECRET,
        callbackURL:'/auth/facebook/callback',
        passReqToCallback: true,
    },async(req,accessToken,refreshToken,profile,done)=>{
        try {console.log('Facebook - profile',profile)
            const exUser=await User.findOne({
                where:{snsId:profile.id,provider:'facebook'}
            })
            if (exUser) {
                done(null,exUser)
            } else {
                const newId=profile.id.length >30 ? profile.id.slice(0,30) :profile.id 
                const newUser=await User.create({
                    email:profile._json.email,
                    nick:profile.displayName,
                    snsId:newId,
                    provider:'facebook'
                })
                done(null,newUser)
            }} catch (error) {
                console.error(error)
                done(null,error)
            }
    }))
}
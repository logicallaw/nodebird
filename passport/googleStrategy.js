const passport=require('passport')
const GoogleStrategy=require('passport-google-oauth').OAuth2Strategy

const User=require('../models/user')

module.exports=()=>{
    passport.use(new GoogleStrategy({
        clientID:process.env.GOOGLE_ID,
        clientSecret:process.env.GOOGLE_SECRET,
        callbackURL:'/auth/google/callback',
        passReqToCallback:true
    },async(req,accessToken,refreshToken,profile,done)=>{
        console.log('Google - profile',profile)
        try{
            const exUser=await User.findOne({
                where:{snsId:profile.id,provider:'google'}})
                if (exUser) {
                    done(null,exUser)
                } else {
                    const newId=profile.id.length >30 ? profile.id.slice(0,30) :profile.id 
                    const newUser=await User.create({
                        email:profile.emails[0].value,
                        nick:profile.displayName,
                        snsId:newId,
                        provider:'google'
                    })
                    done(null,newUser)
                } 
            } catch (error) {
                console.error(error)
                done(null,error)
            }
        }
    ))
}
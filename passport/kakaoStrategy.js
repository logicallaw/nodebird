const passport=require('passport')
const KakaoStrategy=require('passport-kakao').Strategy

const User=require('../models/user')

module.exports=()=>{
    passport.use(new KakaoStrategy({
        clientID:process.env.KAKAO_ID,
        callbackURL:'/auth/kakao/callback'
    },async(accessToken,refreshToken,profile,done)=>{
        console.log('Kakao - profile',profile)
        try{
            const exUser=await User.findOne({
                where:{snsId:profile.id,provider:'kakao'}
            })
            if (exUser){
                done(null,exUser)
            } else {
                const newId=profile.id.length >30 ? profile.id.slice(0,30) :profile.id 
                const newUser=await User.create({
                    email:profile._json && profile._json.kakao_account.email,
                    nick:profile.displayName,
                    snsId:newId,
                    provider:'kakao'
                })
                done(null,newUser)
            }
        } catch (error) {
            console.error(error)
            done(error)
        }
    }))
}
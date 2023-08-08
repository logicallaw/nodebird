const User= require('../models/user')

exports.follow=async(req,res,next)=>{
    try {
    // user:현재 로그인 중인 my-id
    const user=await User.findOne({where:{id:req.user.id}})
    if (user) {
        // req.params.id:POST 된 팔로워 id
        await user.addFollowing(parseInt(req.params.id,10))
        res.redirect('/main')
    } else {
        res.status(404).send('no user')
    }
    } catch (error) {
        console.error(error)
        next(error)
    }
}
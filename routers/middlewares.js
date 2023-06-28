exports.isLoggedIn=(req,res,next)=>{
    if(req.isAuthenticated()){
        next()
    } else {
        res.redirect('/')
    }
}   

exports.isNotLoggedIn=(req,res,next)=>{
    //req.isAuthenticated()=false: 로그인 되지 않았을 떄
    if(!req.isAuthenticated()){
        next()
    } else {
        const message=encodeURIComponent('로그인한 상태입니다.')
        res.redirect(`/?error=${message}`)
    }
}
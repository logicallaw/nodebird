const {User, Domain} = require('../models')
const {v4:uuidv4}=require('uuid')

exports.renderDomain = async (req,res,next) => {
    try {
        if (req.user) {
            const user=await User.findOne({
                where:{id:req.user?.id || null},
                include:{model:Domain}
            })
            return res.render('domain',{    
                title:'도메인 - Nodebird',
                domains:user?.Domains,
            })
        }
        return res.render('error',{title:'error - Nodebird'})
    } catch (error) {
        console.error(error)
        next(error)
    }
}

exports.createDomain = async (req,res,next)=>{
    try {
        await Domain.create({
            UserId:req.user.id,
            host:req.body.host,
            type:req.body.type,
            clientSecret:uuidv4()
        })
        res.redirect('/domain')
    } catch (error) {
        console.error(error)
        next(error)
    }
}
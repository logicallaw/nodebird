const express=require('express')
const cookieParser=require('cookie-parser')
const morgan=require('morgan')
const path=require('path')
const session=require('express-session')
const nunjucks=require('nunjucks')
const dotenv=require('dotenv')
const passport=require('passport')
const fs=require('fs')

dotenv.config()
const pageRouter=require('./routers/page')
const authRouter=require('./routers/auth')
const postRouter=require('./routers/post')
const userRouter=require('./routers/user')
const domainRouter=require('./routers/domain')
const {sequelize}=require('./models')
const passportConfig=require('./passport')

const app=express()
const https=require('https')

passportConfig() //패스포트 설정
app.set('port',process.env.PORT || 8001)
//HTTPS로 서버 구현
const sslOptions={
    key:fs.readFileSync('./sslOptions/server.key'),
    cert:fs.readFileSync('./sslOptions/server.crt'),
    csr:fs.readFileSync('./sslOptions/server.csr'),
    passphrase:'0000'
}
// const server=https.createServer(sslOptions,app,(req,res)=>{
//                 console.log('Https로 서버 구동하기')
//             })

app.set('view engine','html')
nunjucks.configure('views',{
    express:app,
    watch:true
})
sequelize.sync({force:false})
    .then(()=>{
        console.log('데이터베이스 연결 성공')
    })
    .catch((err)=>{
        console.error(err)
    })

app.use(morgan('dev'))
app.use(express.static(path.join(__dirname,'public')))
app.use('/img',express.static(path.join(__dirname,'uploads')))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(session({
    resave:false,
    saveUninitialized:false,
    secret:process.env.COOKIE_SECRET,
    cookie:{
        httpOnly:true,
        secure:false
    }
}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/',pageRouter)
app.use('/auth',authRouter)
app.use('/post',postRouter)
app.use('/user',userRouter)
app.use('/domain',domainRouter)

app.use((req,res,next)=>{
    const error=new Error(`${req.method} ${req.url} 라우터가 없습니다.`)
    error.status=404
    next(error)
})

app.use((err,req,res,next)=>{
    res.locals.message=err.message
    res.locals.error=process.env.NODE_ENV !== 'production' ? err : {}
    res.status(err.status || 500)
    res.render('error')
})

module.exports=app

// app.listen(app.get('port'),()=>{
//     console.log(app.get('port'),'번 포트에서 대기중')
// })
// server.listen(8001,()=>{
//     console.log('Https로 8001포트에서 서버 대기 중')
// })
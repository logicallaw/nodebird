const express=require('express')
const multer=require('multer')
const path=require('path')
const fs=require('fs')

const {Post,Hashtag}=require('../models')
const {isLoggedIn}=require('./middlewares')
const {addFolder,img,recommend,updated,deleted,twit}=require('../controllers/post')

const router=express.Router()
const app=express()
const upload2=multer()

app.use(addFolder)

const upload=multer({
    storage:multer.diskStorage({
        destination(req,file,done){
            done(null,'uploads/')
        },
        filename(req,file,done){
            const ext=path.extname(file.originalname)
            done(null,path.basename(file.originalname,ext)+Date.now()+ext)
        }
    }),
    limits:{fileSize:5*1024*1024}
})
router.post('/img',isLoggedIn,upload.single('img'),img)
router.post('/:id/recommend',isLoggedIn,recommend)
router.post('/:id/:text/update',isLoggedIn,updated)
router.post('/:id/delete',isLoggedIn,deleted)
router.post('/',isLoggedIn,upload2.none(),twit)

module.exports=router
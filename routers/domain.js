const express=require('express')
const { renderDomain, createDomain } = require('../controllers/domain')

const router=express.Router()

router.get('/',renderDomain)
router.post('/',createDomain)

module.exports=router
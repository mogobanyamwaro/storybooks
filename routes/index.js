const express = require('express')
const router = express.Router()
const {ensureGuest,ensureAuth} = require('../middleware/auth')
const Story = require('../models/story')

//  @desc Login /Landing page
// @route   GET /
router.get('/',ensureGuest,(req,res)=>{
  
    res.render('login',{
        layout: 'login'
    })
})


//  @desc Dashoard
// @route   GET /
router.get('/dashboard',ensureAuth,async(req,res)=>{
      try {
        const stories = await Story.find({user:req.user.id})
        res.render('dashboard',{
            name:req.user.firstName,
        })
    } catch (error) {
        console.error(err)
        res.render('error/500')
    }
    
})

module.exports = router
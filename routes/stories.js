const express = require('express')
const router = express.Router()
const {ensureAuth} = require('../middleware/auth')
const Story = require('../models/story')

//  @desc show add page
// @route   GET /stories/add
router.get('/add',ensureAuth,(req,res)=>{
  
    res.render('stories/add',)
       
    
})

//  @desc process add form
// @route   POST/stories
router.post('/',ensureAuth,async(req,res)=>{
  
    try {
        req.body.user = req.user.id
        await Story.create(req.body)
        
        res.redirect('/dashboard')
    } catch (error) {
        console.log(error)
        res.render('error/500')
    }
       
    
})

//  @desc show all stories
// @route   GET /stories
router.get('/',ensureAuth,async(req,res)=>{
  
    try {
        const stories = await Story.find({status:'public'})
        .populate('user')
        .sort({createdAt:'desc'})
        .lean()
        res.render('stories/index',{
            stories
        })
    } catch (error) {
        console.log(error)
        res.render('error/500')
    }
       
    
})

//  @desc show single story
// @route   GET /stories/add
router.get('/:id',ensureAuth,async(req,res)=>{
  
    try {
        let story = await Story.findById(req.params.id)
        .populate('user')
        .lean()
        if(!story){
            return res.render('error/404')
        }
        res.render('stories/show',{
            story
        })
    } catch (error) {
        console.log(error)
        res.render('error/404')
    }
       
    
})



//  @desc show edit page
// @route   GET /stories/eit/:id
router.get('/edit/:id',ensureAuth,async(req,res)=>{
    const story = await Story.findOne({
        _id: req.params.id
    }).lean()
  
       if(!story){
           return res.render('error/404')
       }
       if(story.user != req.user.id){
           res.redirect('./stories')
       }else{
           res.render('stories/edit',{
               story
           })
       }
    
})
//  @desc update story
// @route   put /stories/:id
router.put('/:add',ensureAuth,async(req,res)=>{
  try {
      let story = await Story.findById(req.params.id).lean()
    if(!story){
        return res.render('error/404')
    }
     if(story.user != req.user.id){
           res.redirect('./stories')
       }else{
           stroy = await Story.findOneAndUpdate({_id:req.params.id},req.body,{
               new: true,
               runValidators:true
           })
           res.redirect('/dashboard')
       }
       
  } catch (error) {
       console.log(error)
        res.render('errro/500')
  }
    
    
})
//  @desc delete story
// @route   DELETE /stories/:id
router.delete('/:id',ensureAuth,async(req,res)=>{
  
    try {
        await Story.remove({_id:req.params.id})
        res.redirect('/dashboard')
    } catch (error) {
        console.log(error)
        res.render('errro/500')
    }
       
    
})
//  @desc User stories
// @route   GET /stories/user/:userId
router.get('/user/:userId',ensureAuth,async(req,res)=>{
  
    try {
        const stories = await Story.find({
            user : req.params.userId,
            status:'public'

        })
        .populate('user')
        .lean()
        res.render('stories/index',{
            stories
        })
    } catch (error) {
        console.log(error)
        res.render('error/500')
    }
       
    
})


module.exports = router
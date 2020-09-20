const express = require('express')
const router = express.Router()
const {ensureAuth} = require('../middleware/auth')
const Memory = require('../models/Memory')

// @desc    Show add page
// @route   GET /memories/add

router.get('/add', ensureAuth, (req, res) => {
    res.render('memories/add')
})




// @desc    Process add form
// @route   POST /memories

router.post('/', ensureAuth, async (req, res) => {
   try {
       req.body.user = req.user.id

       await Memory.create(req.body)
       res.redirect('/dashboard')
   } catch (error) {
       console.log(error);
       res.render('error/500')
   }
    
})


// @desc    Show all memories
// @route   GET /memories

router.get('/', ensureAuth, async(req, res) => {
    try {
        const memories = await Memory.find({status: 'public'})
                .populate('user')
                .sort({createdAt: 'desc'})
                .lean()
    
            res.render('memories/index',{
            memories})
    } catch (error) {
        console.log(error);
        res.render('error/500')
    }
})



// @desc    Show edit page
// @route   GET /memories/edit/:id 

router.get('/edit/:id', ensureAuth, async (req, res) => {
    const  memory = await Memory.findOne({
        _id: req.params.id
    }).lean()
    console.log(memory.user);
    console.log(req.user.id);



    if(!memory){
        return res.render('error/404')
    }

    if(memory.user != req.user.id){
         res.redirect('/memories')
    } else {
        res.render('memories/edit', {
            memory
        })
    }
})



// @desc    Update Memory
// @route   PUT /memories/add

router.get('/:id', ensureAuth, async (req, res) => {
    let memory = await Memory.findById(req.params.id).lean()

    if(!memory){
        return res.render
    }
})







module.exports = router;
const express = require('express')
const router = express.Router()
const {ensureAuth, ensureGuest} = require('../middleware/auth')
const Memory = require('../models/Memory')

// @desc    Login/Landing Page
// @route   GET

router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login'})
})




// @desc    Dashboard
// @route   GET /dashboard

router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        const memories = await Memory.find({user : req.user.id}).lean()
        res.render('dashboard', {
            name:req.user.firstName,
            memories
        })
    } catch (error) {
        console.log(error);
        res.render('error/500')
    }
    
    
})





module.exports = router
const express = require('express');
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config.js')

const router = express.Router();
const sauceCtrl = require('../controllers/sauce.js')

router.get('/', auth, sauceCtrl.getSauces)
router.get('/:id', auth, sauceCtrl.getOneSauce)
router.post('/', auth, multer, sauceCtrl.createSauce)
router.put('/:id', auth, multer, sauceCtrl.updateSauce)
router.delete('/:id', auth, sauceCtrl.deleteSauce)
router.post('/:id/like', auth, sauceCtrl.likeSauce)

module.exports = router; 

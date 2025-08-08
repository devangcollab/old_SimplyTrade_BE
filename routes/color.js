const express =require('express')
const {  findAllColor, updateColor, findOneColor, createColor, softDeleteColor, selectColorByDevice, searchColor, selectColor} = require('../controllers/color')
 
const { AuthUser } = require('../middleware/user')
const { validateGetOneColorData, validateCreateColorData, validateUpdateColorData, validateDeleteColorData } = require('../middleware/Color')
 
const colorRoute=express.Router()

colorRoute.get('/findAllColor',AuthUser,findAllColor)
colorRoute.get('/searchColor',searchColor)
colorRoute.get('/findOneColor/:id',validateGetOneColorData,findOneColor)
colorRoute.get('/selectColorByDevice/:id',selectColor)
colorRoute.post('/createColor',AuthUser,validateCreateColorData,createColor)
colorRoute.put('/updateColor/:id',AuthUser,validateUpdateColorData,updateColor)
colorRoute.put('/deleteColor/:id',AuthUser,validateDeleteColorData,softDeleteColor)

module.exports = colorRoute

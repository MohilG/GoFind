import express from 'express'
import { addPhotoByLink, addPlace, getPlace, logOut, login, myPlace, photosMiddleware, signUp, updatePlace, uploadPhoto } from '../Controller/userController.js'
import protectRoutes from '../utils/protectRoutes.js'

const router=express.Router()
router.post('/login',login)
router.post('/signup',signUp)
router.post('/logout',logOut)
router.post('/uploadLink',addPhotoByLink)
router.post('/upload',photosMiddleware.array('photos',10),uploadPhoto)
router.post('/add',protectRoutes,addPlace)
router.post('/myPlaces',protectRoutes,myPlace)
router.post('/place',getPlace)
router.put('/update',updatePlace)





export default router
import express from 'express'
import { addPhotoByLink, logOut, login, photosMiddleware, signUp, uploadPhoto } from '../Controller/userController.js'

const router=express.Router()
router.post('/login',login)
router.post('/signup',signUp)
router.post('/logout',logOut)
router.post('/uploadLink',addPhotoByLink)
router.post('/upload',photosMiddleware.array('photos',10),uploadPhoto)

export default router
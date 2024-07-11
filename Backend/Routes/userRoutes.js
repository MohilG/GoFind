import express from 'express'

import { addPhotoByLink,bookPlace, addPlace, deletePlace, getAll, getPlace, logOut, login, myPlace, photosMiddleware, signUp, updatePlace, uploadPhoto, myBooking, myBookingId} from '../Controller/userController.js'
import protectRoutes from '../utils/protectRoutes.js'

const router=express.Router()
router.post('/login',login)
router.post('/signup',signUp)
router.post('/logout',logOut)
router.post('/uploadLink',addPhotoByLink)
router.post('/upload',photosMiddleware.array('photos',10),uploadPhoto)
router.post('/add',addPlace)
router.post('/myPlaces',myPlace)
router.post('/place',getPlace)
router.post('/book',bookPlace)
router.post('/mybooking',myBooking)
router.post('/mybooking/:id',myBookingId)


router.get('/all',getAll)

router.put('/update',updatePlace)
router.delete('/delete/:id',deletePlace)





export default router
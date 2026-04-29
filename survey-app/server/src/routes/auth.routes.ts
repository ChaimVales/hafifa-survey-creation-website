import { Router } from 'express'
import * as authController from '../controllers/auth.controller'
import { requireAuth } from '../middleware/auth.middleware'
import { validateRegister, validateLogin } from '../validators/auth.validators'

const router = Router()

router.post('/register', validateRegister, authController.register)
router.post('/login', validateLogin, authController.login)
router.get('/me', requireAuth, authController.getMe)

export default router
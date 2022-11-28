import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

import { registerValidation, loginValidation } from './validations.js'
import { checkAuth, handleValidationErrors } from './utils/index.js'
import * as UserController from './controllers/UserController.js'

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('DB ok')
  })
  .catch((err) => {
    console.log('DB error', err)
  })

const app = express()
app.use(express.json())
app.use(cors())

app.get('/auth/me', checkAuth, UserController.getMe)
app.get('/auth/all', checkAuth, UserController.getAllUsers)

app.post(
  '/auth/register',
  registerValidation,
  handleValidationErrors,
  UserController.register
)
app.post(
  '/auth/login',
  loginValidation,
  handleValidationErrors,
  UserController.login
)

app.delete('/auth/:id', checkAuth, UserController.remove)

app.patch(
  '/auth/block/:id',
  checkAuth,
  handleValidationErrors,
  UserController.block
)
app.patch(
  '/auth/unblock/:id',
  checkAuth,
  handleValidationErrors,
  UserController.unblock
)

app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.error(err)
  }
  console.log('Server OK')
})

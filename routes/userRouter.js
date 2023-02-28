const userRouter = require('express').Router()
const user = require('../controllers/user')
userRouter.post('/saveuser', user.saveuser)
userRouter.get('/getuser', user.getuser)
userRouter.patch('/updateuser/:id', user.updateuser)
userRouter.delete('/deleteuser/:id', user.deleteuser)
userRouter.get('/getallusers', user.getallusers)
userRouter.post('/otpverify', user.otpverify)
userRouter.post('/mail', user.mail)


module.exports = userRouter;
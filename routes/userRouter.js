const userRouter = require('express').Router()
const user = require('../controllers/user')
const auth = require("../middleware/auth");

userRouter.post('/saveuser',auth, user.saveuser)
userRouter.get('/getuser',auth, user.getuser)
userRouter.patch('/updateuser/:id',auth, user.updateuser)
userRouter.delete('/deleteuser/:id',auth, user.deleteuser)
userRouter.get('/getallusers',auth, user.getallusers)
userRouter.post('/otpverify',auth, user.otpverify)
userRouter.post('/mail',auth, user.mail)
userRouter.post("/register", user.register);
userRouter.post("/login", user.login);

module.exports = userRouter;
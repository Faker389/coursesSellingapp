const express = require("express")
const cors = require("cors")
const { paymentHandler } = require("./payments/payment")
const { registrer, addCourse,login, logout, sendLink, updateUserData,googleLogin,usedEmails,findUser,getCourses,getCourseByID,addMessage,retrieveChats,getLastMessages } = require("./controllers/firebase")
const app = express()
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(cors())
app.listen(8000)

app.post("/api/register",registrer)

app.post('/api/login',login);

app.post("/api/logout",logout)

app.post("/api/resetPassword",sendLink)

app.post("/api/updateUserData" ,updateUserData)

app.post("/api/addCourse",addCourse)

app.get("/api/usedEmails",usedEmails)

app.post("/api/findUser",findUser)

app.post("/api/getCourse",getCourses)

app.post("/api/google",googleLogin)

app.post("/api/payment",paymentHandler)

app.post("/api/getItem",getCourseByID)

app.post("/api/storeMessage",addMessage)

app.post("/api/retrieveChat",retrieveChats)

app.post("/api/getLastMessages",getLastMessages)

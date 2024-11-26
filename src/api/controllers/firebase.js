const axios = require("axios")
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');
const serviceAccount = require('../FirebaseData.json');
const multer = require('multer');
const { initializeApp } = require("firebase/app");
const { getAuth,createUserWithEmailAndPassword , signInWithEmailAndPassword, GoogleAuthProvider, getIdToken } = require("firebase/auth");
const { getDatabase, ref, push, set, get, child, update } = require("firebase/database");
const storage = multer.memoryStorage();


const firebaseConfig = {
  apiKey: "AIzaSyAkVnYLSgE4d4lk70DkyEnOM20IqdwhMyY",
  authDomain: "zdajmyto-3ea9b.firebaseapp.com",
  databaseURL: "https://zdajmyto-3ea9b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "zdajmyto-3ea9b",
  storageBucket: "zdajmyto-3ea9b.firebasestorage.app",
  messagingSenderId: "541744157821",
  appId: "1:541744157821:web:a401bcc155eafbf9d04d14",
  measurementId: "G-DF8J6VSV1K"
};
const app=initializeApp(firebaseConfig);
const database = getDatabase(app);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'zdajmyto-3ea9b.firebasestorage.app'
});
const auth = getAuth();
const firestoreDB = admin.firestore()

async function verifyFirebaseToken(idToken) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
      console.error("Error verifying Firebase token:", error);
      throw error;
  }
}

exports.registrer = async(req,res)=>{
    const { email, password,name } = req.body.user;
    
    try {
      // Step 1: Register the user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      var userData = {
        ID:user.uid,
        name:user.displayName,
        email:user.email,
        image:"",
        phoneNumber:""
      }
      await firestoreDB.collection("users").doc(user.uid).set(userData);
      console.log(userData.ID)
      res.status(201).json(userData);
  } catch (error) {
      console.error("Error registering user:", error);
      res.status(400).json({
          error: error.message,
      });
  }
}  
exports.login = async (req, res) => {
  const { email, password } = req.body.user;
    try {
        // Login with Firebase Email/Password
        const firebaseUser = await signInWithEmailAndPassword(auth, email, password);

      console.log(firebaseUser.user.uid)
        res.json(firebaseUser.user);
    } catch (error) {
      console.log(error)
        res.status(400).json({ error: error.message });
    }
}
exports.googleLogin = async(req,res)=>{
  const { idToken } = req.body;
    try {
        // Verify the ID token and retrieve user info
        const decodedToken = await verifyFirebaseToken(idToken);
        const {uid,email } = decodedToken;
        const userData = {
          ID:uid,
          name:email,
          email:email,
          image:"",
          phoneNumber:""
        }
        await firestoreDB.collection("users").doc(uid).set(userData);
        console.log(userData)
        res.json(userData);
    } catch (error) {
      console.log(error)
        res.status(400).json({ error: "Failed to log in with Google." });
    }
}





exports.logout = async (req,res)=>{
    const uid=req.body.userID
    try {
        await admin.auth().revokeRefreshTokens(uid);
       res.sendStatus(200).end()
      } catch (error) {
        res.json({message:"Error, try again later"})
    }
}
function senEmail(email,link){
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "hihub69@gmail.com",
      pass: "gsdw wnma jghg lyky",
    },
  });

  const mailParams = {
    from:"Zdajmy to",
    to:email,
    subject:"Password reset link",
    text:`Here is your password reset link: ${link}`,
  };
  transporter.sendMail(mailParams, (error, info) => {
    if (error) {
      console.log('Error przy wysyłaniu' , error);
      return false;
    }
    console.log('Email pomyślnie wysłano maila')
    return true
  });
}
exports.sendLink = async(req,res)=>{
  const {email}=req.body
admin.auth()
  .generatePasswordResetLink(email)
  .then((link) => {
    const customLink = `http://localhost:3000/resetPassword?oobCode=${new URL(link).searchParams.get("oobCode")}`;
    res.json({message:senEmail(email,customLink)})
  })
  .catch((error) => {
    console.log(error)
    res.sendStatus(501).end()
  });
}
exports.updateUserData = async(req,res)=>{
  var user = req.body.user
  const {ID} = user
  
  await firestoreDB.collection("users").doc(ID).set(user);
    res.json({user})
}

exports.addCourse = async (req, res) => {
  
  var data = req.body.data
  data.image="./icons/template.png"
  try {
      const randomId = Math.random().toString(36).substring(2) + Date.now().toString(36);
      firestoreDB.collection("courses").doc(randomId).set(data)
      res.json({message:"Course added successfully"})
      
    }catch(error){
      console.log(error)
      res.sendStatus(501).end()
    }
  }

exports.usedEmails = async(req,res)=>{
  
  const userSnapshot = await firestoreDB.collection("users").get()
  
  const users = []
  userSnapshot.forEach((doc) => {
      users.push(doc.data().email.toLowerCase())
  })
  res.json(users)
}

exports.findUser = async(req,res)=>{
  const { term,userId } = req.body
  if(!term ||term.trim()=="") return res.json([])
  try {
    const snapshot = await firestoreDB.collection("users").get();
    const users = []
    snapshot.forEach((doc) => {
      users.push(doc.data())
    })
    const filteredUsers = users.filter((user)=>{
      return (user.name.toLowerCase().includes(term.toLowerCase())||user.ID.toString().includes(term)||user.email.toLowerCase().includes(term.toLowerCase()))&&user.ID!==userId
    })
    res.json(filteredUsers)
  } catch (error) {
    console.error('Error finding users:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}


exports.getCourses = async(req,res)=>{
  const {userId} = req.body
  const coursesSnapshot = await firestoreDB.collection("courses").get()
  const usersSnapshot = await firestoreDB.collection("users").get()
  const courses = []
  const users = []
  usersSnapshot.forEach((doc) => {
    users.push(doc.data())
  })
  coursesSnapshot.forEach((doc) => {
    courses.push(doc.data())
  })
  const filteredCourses = courses.filter((course)=>{
    if(course.userId===userId||userId===null){
      return course
    }
  })
  for(let i=0;i<filteredCourses.length;i++){
    filteredCourses[i].user = users.find((user)=>user.ID===filteredCourses[i].userId)
  }
  res.json(filteredCourses)
}

exports.getCourseByID = async(req,res)=>{
  const {courseID} = req.body
  if(!courseID) return res.sendStatus(400).end()
  const coursesSnapshot = await firestoreDB.collection("courses").doc(courseID).get()
  var data= coursesSnapshot.data()
  var object ={
    courseID:data.courseID,
    title:data.title,
    price:data.price,
    image:data.image,
    description:data.description
  }
  res.json([object])
}





exports.addMessage = async(req,res)=>{
  try {
    const { chatId, sender, text, users } = req.body;

    if (!chatId || !sender || !text || !Array.isArray(users) || users.length < 2) {
      return res.status(400).send({ error: "Missing or invalid required fields" });
    }

    const db = getDatabase();
    const chatRef = ref(db, `chats/${chatId}`);
    
    // Check if the chat exists
    const chatSnapshot = await get(chatRef);

    if (chatSnapshot.exists()) {
      // Chat exists, add the new message
      const messagesRef = child(chatRef, "messages");
      const newMessageRef = push(messagesRef);
      await set(newMessageRef, {
        sender,
        text,
        timestamp: Date.now(),
      });

      console.log("Message added to existing chat");
      return res.status(200).send({ message: "Message added to existing chat" });
    } else {
      // Chat does not exist, create it
      var id= 1;
      const newChat = {
        users: users.reduce((acc, user) => {
          acc["user"+id] = user;
          id++;
          return acc;
        }, {}),
        messages: {},
      };

      // Add the first message
      const newMessageRef = push(child(chatRef, "messages"));
      newChat.messages[newMessageRef.key] = {
        sender,
        text,
        timestamp: Date.now(),
      };

      // Set the new chat
      await set(chatRef, newChat);

      console.log("New chat created and message added");
      return res.status(201).send({ message: "New chat created and message added" });
    }
  } catch (error) {
    console.error("Error handling chat or message:", error);
    res.status(500).send({ error: "Failed to handle chat or message" });
  }
}
exports.retrieveChats = async(req,res)=>{
  console.log(true)
  try {
    const { chatId } = req.body;
    if (!chatId) {
      return res.status(400).send({ error: "Chat ID is required" });
    }

    const db = getDatabase();
    const chatRef = ref(db, `chats/${chatId}`);

    // Get the chat data
    const chatSnapshot = await get(chatRef);

    if (chatSnapshot.exists()) {
      const chatData = chatSnapshot.val();
      console.log("Chat data retrieved successfully");
      return res.status(200).send({ chatId, ...chatData });
    } else {
      return res.status(404).send({ error: "Chat not found" });
    }
  } catch (error) {
    console.error("Error retrieving chat data:", error);
    return res.status(500).send({ error: "Failed to retrieve chat data" });
  }
}
async function getUserByID(ID){
  console.log(ID)
  const userSnapshot = await firestoreDB.collection("users").doc(ID).get()
  console.log(userSnapshot.data())
  return userSnapshot.data().name
}

exports.getLastMessages = async(req,res)=>{
  try {
    const db = getDatabase();
    const { userId } = req.body; // User ID is passed as a parameter

    if (!userId) {
      return res.status(400).send({ error: "User ID is required" });
    }

    const chatsRef = ref(db, "chats");
    const chatsSnapshot = await get(chatsRef);

    if (!chatsSnapshot.exists()) {
      return res.status(404).send({ error: "No chats found" });
    }

    const chatsData = chatsSnapshot.val();
    const userChats = [];

    // Iterate over all chats
    for (const chatId in chatsData) {
      const chat = chatsData[chatId];

      // Check if the user is part of this chat
      const userIds = chat.users ? Object.values(chat.users) : [];
      if (!userIds.includes(userId)) continue;

      // Find the other user in the chat
      const otherUsers = userIds.filter((id) => id !== userId);

      // Retrieve the last message
      if (chat.messages) {
        const messages = Object.entries(chat.messages);
        const lastMessageEntry = messages[messages.length - 1];
        const [lastMessageId, lastMessage] = lastMessageEntry;

        userChats.push({
          userID:otherUsers[0],
          chatId,
          avatar:"",
          personRecieving: await getUserByID(otherUsers[0]), // Array of user IDs the given user has chatted with
          messageId: lastMessageId,
          text: lastMessage.text,
          sender: lastMessage.sender,
          timestamp: lastMessage.timestamp,
        });
      } else {
        // No messages in the chat
        userChats.push({
          userID:otherUsers[0],
          chatId,
          otherUsers,
          lastMessage: null,
        });
      }
    }

    // Sort by last message timestamp (optional)
    userChats.sort((a, b) => {
      const aTimestamp = a.lastMessage?.timestamp || 0;
      const bTimestamp = b.lastMessage?.timestamp || 0;
      return bTimestamp - aTimestamp;
    });

    res.status(200).send(userChats);
  } catch (error) {
    console.error("Error retrieving user chats:", error);
    res.status(500).send({ error: "Failed to retrieve user chats" });
  }
}



async function addMessageFkc(chatId, sender, text, users){
  try {

    if (!chatId || !sender || !text || !Array.isArray(users) || users.length < 2) {
      console.log("Missing or invalid required fields")
      return false;
    }

    const db = getDatabase();
    const chatRef = ref(db, `chats/${chatId}`);
    
    // Check if the chat exists
    const chatSnapshot = await get(chatRef);

    if (chatSnapshot.exists()) {
      // Chat exists, add the new message
      const messagesRef = child(chatRef, "messages");
      const newMessageRef = push(messagesRef);
      await set(newMessageRef, {
        sender,
        text,
        timestamp: Date.now(),
      });

      console.log("Message added to existing chat");
      return true;
    } else {
      // Chat does not exist, create it
      var id= 1;
      const newChat = {
        users: users.reduce((acc, user) => {
          acc["user"+id] = user;
          id++;
          return acc;
        }, {}),
        messages: {},
      };

      // Add the first message
      const newMessageRef = push(child(chatRef, "messages"));
      newChat.messages[newMessageRef.key] = {
        sender,
        text,
        timestamp: Date.now(),
      };

      // Set the new chat
      await set(chatRef, newChat);

      console.log("New chat created and message added");
      return true;
    }
  } catch (error) {
    console.error("Error handling chat or message:", error);
    return false;
  }
}
async function retrieveChatsFkc(chatId){
  try {
    if (!chatId) {
      console.log("Chat ID is required")
      return false;
    }

    const db = getDatabase();
    const chatRef = ref(db, `chats/${chatId}`);

    // Get the chat data
    const chatSnapshot = await get(chatRef);

    if (chatSnapshot.exists()) {
      const chatData = chatSnapshot.val();
      console.log({ chatId, ...chatData })
      return true;
    } else {
      console.log("Chat not found")
      return false;
    }
  } catch (error) {
    console.error("Error retrieving chat data:", error);
    return false;
  }
}

async function getUserChats() {
  try {
    const db = getDatabase();
    const userId = "xjPgtNG6t5PixtjHtmEMWQujasN2"

    if (!userId) {
      console.log("User ID is required")
      return false;
    }

    const chatsRef = ref(db, "chats");
    const chatsSnapshot = await get(chatsRef);

    if (!chatsSnapshot.exists()) {
      console.log("No chats found")
      return false;
    }

    const chatsData = chatsSnapshot.val();
    const userChats = [];

    // Iterate over all chats
    for (const chatId in chatsData) {
      const chat = chatsData[chatId];

      // Check if the user is part of this chat
      const userIds = chat.users ? Object.values(chat.users) : [];
      if (!userIds.includes(userId)) continue;

      // Find the other user in the chat
      const otherUsers = userIds.filter((id) => id !== userId);

      // Retrieve the last message
      if (chat.messages) {
        const messages = Object.entries(chat.messages);
        const lastMessageEntry = messages[messages.length - 1];
        const [lastMessageId, lastMessage] = lastMessageEntry;

        userChats.push({
          chatId,
          personRecieving: otherUsers[0], // Array of user IDs the given user has chatted with
          messageId: lastMessageId,
          text: lastMessage.text,
          sender: lastMessage.sender,
          timestamp: lastMessage.timestamp,
        });
      } else {
        // No messages in the chat
        userChats.push({
          chatId,
          otherUsers,
          lastMessage: null,
        });
      }
    }

    // Sort by last message timestamp (optional)
    userChats.sort((a, b) => {
      const aTimestamp = a.lastMessage?.timestamp || 0;
      const bTimestamp = b.lastMessage?.timestamp || 0;
      return bTimestamp - aTimestamp;
    });
    console.log(userChats)
    return userChats;
  } catch (error) {
    console.error("Error retrieving user chats:", error);
    return false;
  }
}
// getUserChats()
// addMessageFkc("8fTuiapAsovUgQvQZ","I3iBaHO55ybBIIIbrPWfjBllS2x1","Testowa waidomość2",["xjPgtNG6t5PixtjHtmEMWQujasN2","I3iBaHO55ybBIIIbrPWfjBllS2x1"])
// retrieveChatsFkc("8fTuiapAsovUgQvQZ")

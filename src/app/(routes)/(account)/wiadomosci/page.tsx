"use client"

import { useState, useEffect, useRef } from 'react'
import { Search, Phone, Settings, Send, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from 'lucide-react'
import { useIsLoading } from '@/app/globalStates/states'
import RenderImage from '@/app/componentsPage/renderImage'
import { getCookies } from '@/app/(cookies)/cookies'
interface Message{
  id:number,
  sender:string,
  text:string,
  isUser:boolean
}
interface User{
  name:string,
  email:string,
  ID:string,
  avatar:string
}
interface Chat{
  userID:string;
  chatId:string,
  text:string,
  personRecieving:string,
  sender:string,
  timestamp:number,
  avatar:string
}

export default function MessagesPage() {

  const [chats, setChats] = useState<Chat[]>([])
  const [selectedChat, setSelectedChat] = useState<Chat>()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const {isLoading,setIsLoading} = useIsLoading()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<Chat| null>(null)
  const currentChatId = useRef('')
  const user = getCookies()
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsLoading(false)
    handleGetLastMessages()
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchResults([])
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  const handleGetLastMessages = async () => {
    const request = await fetch("http://localhost:8000/api/getLastMessages",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({userId:user.ID})
    })
    const data = await request.json()
    setChats(data)
  }
  const generateRandomCode = () => {
    // Generate a 16-character random code
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const codeLength = 16;
    let randomCode = "";
    for (let i = 0; i < codeLength; i++) {
      randomCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomCode;
  };
  const handleSearch =async (term: string) => {
    setSearchTerm(term)
    try{
      const request = await fetch("http://localhost:8000/api/findUser",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({term:term,userId:user.ID})
      })
      const data = await request.json()
      console.log(data)
      setSearchResults(data)
    }catch(error){
      console.log(error)
    }
   
  }

  const handleAddChat = (user: User) => {
    const existingChat = chats.find((chat) => chat.userID === user.ID);
    if (existingChat) {
      setSelectedChat(existingChat);
      currentChatId.current = existingChat.chatId;
      handleRetrieveChat(existingChat.chatId,existingChat)
      setSearchResults([]);
      setSearchTerm("");
      return;
    }

    const newChat: Chat = {
      userID: user.ID,
      chatId: generateRandomCode(),
      text: "",
      personRecieving: user.name,
      sender: user.ID,
      timestamp: Date.now(),
      avatar: user.avatar,
    };

    setChats([newChat, ...chats]);
    setSelectedChat(newChat);
    currentChatId.current = newChat.chatId;
    setSearchResults([]);
    setSearchTerm("");
  };

  const handleDeleteChat = (id:string) => {
    if(!chats) return
    setChats(chats.filter(chat => chat.chatId !== id))
  }
  const handleRetrieveChat = async (chatID:string,chat:Chat) => {
    setSelectedChat(chat)
    currentChatId.current = chatID
    const request = await fetch(`http://localhost:8000/api/retrieveChat`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({chatId:chatID})
    })
    const data = await request.json()
    const messagesData  =Object.values(data.messages) as Message[]
    const arr:Message[] = []
    for(let i = 0; i < messagesData.length; i++){
      
      arr.push({ id: i + 1, sender: messagesData[i].sender==user.ID?"You":messagesData[i].sender, text: messagesData[i].text, isUser: messagesData[i].sender==user.ID?true:false })
    }
    setMessages(arr)
  }
  const handleSendMessage = async () => {
    setIsLoading(true)
    try{
    await fetch("http://localhost:8000/api/storeMessage",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({chatId:"9tPg6pAsovUgQvQZ",sender:"user1",text:newMessage,users:["xjPgtNG6t5PixtjHtmEMWQujasN2","KKwMoiwgKTe4idkecPKMSeNp25C3"]})
    })
        setMessages([...messages, { id: messages.length + 1, sender: 'You', text: newMessage.trim(), isUser: true }])
        setNewMessage('')
        setIsLoading(false)
    }catch(err){
      console.log(err)
    }
  }

  const toggleAccountView = (user: Chat| null) => {
    setSelectedUser(user)
  }

  return (
    <div className="flex h-full bg-gray-900 text-white p-0 m-0">
      {/* Left panel - Chat list */}
      <div className="w-1/4  border-r border-gray-700 flex flex-col">
        <div className="p-4" ref={searchRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name or ID"
              className="pl-10 bg-gray-800 border-gray-700 text-white"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          {searchResults.length > 0 && (
            <div  className="absolute z-10 mt-1  w-[calc(19.7%)] bg-gray-800 border border-gray-700 rounded-md shadow-lg">
              {searchResults.map((user) => (
                <div
                  key={user.ID}
                  className="flex items-center p-2 cursor-pointer hover:bg-gray-700"
                  onClick={() => handleAddChat(user)}
                >
                  <RenderImage src={user.avatar}  width="32px" height="32px" />
                  <span className="ml-2">{user.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <ScrollArea key={chats?.length} className="flex-grow">
          {chats&&chats.map((chat) => (
            <div
              key={chat.chatId}
              className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-800 ${selectedChat&&selectedChat.chatId === chat.chatId ? 'bg-gray-800' : ''}`}
              >
              <div className='flex items-center'
              onClick={() => {handleRetrieveChat(chat.chatId,chat)}}
              >
                  <RenderImage src={chat.avatar}  width="40px" height="40px" />
              <div className="ml-3">
                <h3 className="font-semibold">{chat.personRecieving}</h3>
                <p className="text-sm text-gray-400">{chat.sender==user.ID?"You":chat.personRecieving}: {chat.text}</p>
              </div>
              </div>

              <X size={16} onClick={()=>handleDeleteChat(chat.chatId)} className='text-gray-400 hover:text-gray-200' />
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Right panel - Conversation */}
      <div className="flex-1 flex flex-col">
        {/* Conversation header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center">
            <RenderImage src={selectedChat?.avatar}  width="40px" height="40px" />
              {/* onClick={() => toggleAccountView(selectedChat)} */}
            <h2 className="ml-3 font-semibold">{selectedChat?.personRecieving}</h2>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" className='hover:bg-transparent hover:text-gray-400' size="icon">
              <Phone className="h-5 w-5 " />
            </Button>
            <Button variant="ghost" className='hover:bg-transparent hover:text-gray-400' size="icon">
              <Settings className="h-5 w-5 " />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-grow p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 ${message.isUser ? 'text-right' : 'text-left'}`}
            >
              <div
                className={`inline-block p-3 rounded-lg ${
                  message.isUser ? 'bg-purple-600' : 'bg-gray-800'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </ScrollArea>

        {/* Message input */}
        <div className="p-4 border-t border-gray-700 flex items-end">
          <Textarea
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow bg-gray-800 border-gray-700 text-white resize-none"
            rows={1}
          />
          <Button className="ml-2 bg-purple-600 hover:bg-purple-700" onClick={handleSendMessage}>
            {isLoading?<Loader2 className='h-5 w-5 animate-spin'/>:<Send className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      {selectedUser && (
        <div>
          <div>
            <h2>Account View for {selectedUser.sender}</h2>
            <button onClick={() => toggleAccountView(null)}>Close</button>
            <button onClick={() => {console.log(`Opening chat with user ${selectedUser.chatId}`); toggleAccountView(null)}}>Message</button>
          </div>
        </div>
      )}
    </div>
  )
}
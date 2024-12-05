"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { X, User, Settings, LogOut, Loader2 } from 'lucide-react'
import { useNavPosition } from "@/app/globalStates/states" 
import { useRouter } from 'next/navigation'
import { getCookies } from '../(cookies)/cookies'
import { useState } from 'react'
import { useCookiesSet } from '@/app/globalStates/states';
import RenderImage from '../componentsPage/renderImage';
function RightBar(){
  const router = useRouter()
  const [isLoading,setIsLoading]=useState(false)
  const user = getCookies()
  const menuItems = [
    { text: 'Konto', icon: User, href: '/konto' },
    { text: 'Ustawienia konta', icon: Settings, href: '/settings' },
  ]
  async function logOut(){
    setIsLoading(true)
    try{
      const uid = user.ID;
      await fetch("http://localhost:8000/api/logout",{
        method:"Post",
        headers:{
          "Content-type":"application/json"
        },
        body:JSON.stringify({userID:uid})
      })
      setIsLoading(false)
      router.push("/login")
    }catch(error){
      console.log(error)
      setIsLoading(false)
    }
  }
  return <>
   <div className="flex justify-center mb-8 z-50 mt-12">
    {user&&<RenderImage src={user.image} width="100px" height="100px"/>}
        </div>

        <nav className="flex-grow">
          <ul className="space-y-4">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link href={item.href} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700 transition-colors">
                  <item.icon size={20} className="text-purple-400" />
                  <span>{item.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto">
          <button disabled={isLoading} className="flex items-center justify-center w-full space-x-2 p-2 rounded-lg bg-red-500 hover:bg-red-600 transition-colors">
          {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                <>
                  <LogOut size={20} />
                  <span onClick={()=>logOut()}>Log out</span>
                 </>
              )}
            
           
          </button>
        </div>
        </>
}
export default function AnimatedSidebar() {
  // prawy panel z widokiem konta
  const {state, setState} = useNavPosition()
  const {cookiesCrated} = useCookiesSet()
  
  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '100%' },
  }


  return (
    <motion.div
      initial="open"
      animate={state ? 'open' : 'closed'}
      variants={sidebarVariants}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed top-0 right-0 h-screen w-64 bg-gray-800 text-white p-4 shadow-lg"
    >
      <button
        onClick={() => setState(false)}
        className="absolute top-2 left-2 text-gray-300 hover:text-white transition-colors"
      >
        <X size={24} />
      </button>

      <div className="flex flex-col h-full">
        {cookiesCrated ? <RightBar/> : <>
          <nav className="flex-grow mt-5">
          <ul className="space-y-4">
            <li>
              <h3 className='text-center font-bold mb-3'>Zaloguj sie aby mieć dostęp do konta</h3>
              <Link href="/login" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700 transition-colors">
                <User size={20} />
                <span>Login</span>
              </Link>
            </li>
          </ul>
        </nav>
        </>}
      </div>
    </motion.div>
  )
}
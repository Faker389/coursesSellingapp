"use client"
import Image from "next/image"
import { useEffect } from "react"
import Link from 'next/link'
import { usePathname,useRouter } from 'next/navigation'
import Logo from "../../../../public/icons/logo.png"
import { User, BookOpen, PlusCircle, MessageCircle } from 'lucide-react'
import { getCookies } from "@/app/(cookies)/cookies"
import { Loader2, LogOut } from 'lucide-react'
import { useIsLoading } from '@/app/globalStates/states'

const sidebarItems = [
  { name: 'Konto', href: '/konto', icon: User },
  { name: 'Posiadane kursy', href: '/posiadane-kursy', icon: BookOpen },
  { name: 'Twoje kursy', href: '/twoje-kursy', icon: PlusCircle },
  { name: 'Wiadomości', href: '/wiadomosci', icon: MessageCircle },
]

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const user = getCookies()
  const {isLoading,setIsLoading} = useIsLoading()
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
  useEffect(()=>{
    setIsLoading(false)
    if (user === null) {
      router.push("/login")
  }
},[])

  return (
    <div className="flex min-h-screen bg-gray-900">
      <aside className="w-64 bg-gray-800 p-4 flex flex-col" >
        <nav className="space-y-2">
          <div className="w-full flex justify-center mb-5">
            <Image 
              src={Logo}
              width={140}
              height={140}
              alt="Logo"
              onClick={()=>router.push("/home")}
              className="cursor-pointer"
              /> 
            </div>
          {sidebarItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                pathname === item.href
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}
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
      </aside>
      <main className="flex-1 p-3">{children}</main>

    </div>
  )
}
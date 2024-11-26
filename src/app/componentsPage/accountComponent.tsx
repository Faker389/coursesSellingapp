"use client"
import { useIsThisWindow } from '@/app/globalStates/states'
import { useState, useEffect } from 'react'
import RenderImage from '@/app/componentsPage/renderImage'
import { X, MessageSquare } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

interface User {
 ID:string,
  name: string,
  email: string,
  image: string,
  phoneNumber: string
}

interface AccountViewProps {
  user: User;
  onMessage: (userId: string) => void;
}


export default function Component({ user, onMessage }: AccountViewProps) {
  const [isVisible, setIsVisible] = useState(false)
  const {setIsThisWindow} = useIsThisWindow()

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 50)
  }, [])

  return (
      <Card className={`w-fit bg-gray-800 text-white transform transition-all duration-300 ease-in-out ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-gray-400 hover:text-white hover:bg-transparent"
            onClick={()=>{setIsThisWindow("other window")}}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
            <RenderImage src={user.image} width="80px" height="80px"/>
          <h2 className="mt-4 text-xl font-bold overflow-clip">Name: {user.name}</h2>
          <h4 className="text-gray-400">Email: {user.email}</h4>
          <h4 className="text-gray-400">ID: {user.ID}</h4>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => onMessage(user.ID)}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Message
          </Button>
        </CardFooter>
      </Card>
  )
}
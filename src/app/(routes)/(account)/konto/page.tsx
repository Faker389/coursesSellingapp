"use client"
import { useState } from 'react'
import RenderImage from '@/app/componentsPage/renderImage'
import {motion} from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle,Loader2 } from 'lucide-react'
import { saveCookies,getCookies } from '@/app/(cookies)/cookies'
import { Alert,AlertDescription,AlertTitle } from '@/components/ui/alert'
interface user{
    name:string;
    email:string;
    phoneNumber:string;
    image:string;
    ID:string;
}
export default function KontoPage() {
    const [isSubmitted,setIsSubmitted]=useState(false)
    const [error,setError]=useState(false)
    const [isLoading,setIsLoading]=useState(false)
    const userCoookie = getCookies() as user
    const [user, setUser] = useState<user>(userCoookie)
  //  zmiana zdjecia avatara
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          setUser({ ...user, image: e.target.result })
        }
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }
  // update danych w baize
  async function updateUserData(){
    setIsLoading(true)
    setError(false)
    setIsSubmitted(false)
    try{

        const request = await fetch("http://localhost:8000/api/updateUserData",{
            method:"Post",
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify({user})
        })
        const response = await request.json()
        setIsSubmitted(true)
        setIsLoading(false)
        saveCookies(response)
        setTimeout(()=>{
            setIsSubmitted(false)
        },1500)
    }catch(err){
        setIsLoading(false)
        setError(true)
        console.log(err)
    }
  }
  return (
    <Card className="w-full max-w-2xl mx-auto bg-gray-800 text-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Twoje Konto</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <RenderImage src={user.image} width="100px" height="100px"/>
            
            <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-1 cursor-pointer">
              <PlusCircle className="h-5 w-5" />
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-400">{user.ID}</p>
            <p className="text-gray-400">{user.email}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user.email||""} disabled className="bg-gray-700 text-gray-400" />
          </div>
        <div>
            <Label htmlFor="email">Name</Label>
            <Input id="email" placeholder='Enter name' value={user.name||""}  onChange={(e)=>setUser({...user,name:e.target.value})} className="bg-gray-700 text-gray-200" />
          </div>
          <div>
            <Label htmlFor="phone">Numer telefonu</Label>
            <Input
              id="phone"
              placeholder='Enter phone number'
              value={user.phoneNumber||""}
              onChange={(e)=>setUser({...user,phoneNumber:e.target.value})}
              className="bg-gray-700 text-gray-200"
            />
          </div>
        </div>
        <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={updateUserData}>
        {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Prosze czekać
              </>
            ) : (
              'Zapisz zmiany'
            )}
        </Button>
        {/* Pomyslny update danych */}
      {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Alert className="w-full mt-4 bg-green-800 border-green-700 text-white">
              <AlertDescription>
                Data updated succesfully.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
        {/* Błedy */}
      {error&&(
             <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.2 }}
           >
             <Alert className="w-full mt-4 bg-red-600 border-red-900 text-white">
               <AlertTitle>Error occured</AlertTitle>
               <AlertDescription>
                   Something wrong with updating data, try again later.
               </AlertDescription>
             </Alert>
           </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
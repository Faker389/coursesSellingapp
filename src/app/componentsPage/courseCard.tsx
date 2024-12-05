import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useState,useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import RenderImage from '@/app/componentsPage/renderImage'
import { Button } from "@/components/ui/button"
import AccountComponent from "./accountComponent"
import { ShoppingCart } from 'lucide-react'
import { useIsThisWindow,useCartItemsCount } from "@/app/globalStates/states"
import { addToCart,getCart } from "../(cookies)/cookies"
interface user{
  ID:string,
  name: string,
  email: string,
  image: string,
  phoneNumber: string
}


export default function CourseCard({ title, description, price, imageUrl,status,user,courseID }: {
    title: string
    description: string
    price: string
    imageUrl: string
    courseID: string
    status: string
    user?:user
  }) {
    // Component kursu
    const [isExpanded, setIsExpanded] = useState(false)
    const router = useRouter()
    const {setCartItemsCount} = useCartItemsCount();
    const [onMessage,setOnMessage] = useState<string>("")
    const {isThisWindow,setIsThisWindow} = useIsThisWindow()
    const toggleDescription = () => setIsExpanded(!isExpanded)
  useEffect(()=>{

  },[onMessage])
  useEffect(()=>{
    const cart = getCart(user!.ID)
    setCartItemsCount(cart.length)
  },[])
    return (
      <Card className="bg-gray-800 relative text-white border-gray-700">
        <Image src={imageUrl} alt={title} width={600} height={300} className="w-full h-48 object-cover" />
        <CardHeader>
          <div className="flex items-center gap-4" onClick={()=>{setIsThisWindow(courseID)}} >
            {user&&<RenderImage src={user.image} width="50px" height="50px"/>}
            {user&&<CardTitle className="text-xl font-bold">{user.name}</CardTitle>}
          </div>
          {user&&
            <div className="absolute bottom-6 left-20">
                {isThisWindow==courseID?<AccountComponent user={user} onMessage={setOnMessage}/>:""}
            </div>}
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`text-gray-300 ${isExpanded ? '' : 'line-clamp-2'}`}>
            {description.length>80&&!isExpanded?description.slice(0,80)+"...":description}
          </p>
          {description.length > 80 && (
            <button onClick={toggleDescription} className="text-purple-400 hover:text-purple-300 mt-2">
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
          <p className="text-2xl font-bold text-purple-400 mt-4">{price}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" className="bg-gray-700  hover:bg-gray-600 text-white" onClick={()=>router.push(`/product/page?productId=${courseID}`)}>Więcej informacji</Button>
           <div className="flex items-center gap-4 cursor-pointer" >
            {status=='open' ?<Button className="bg-transparent hover:bg-transparent" onClick={()=>{addToCart(user!.ID,{id:courseID,title:title,price:parseFloat(price),image:imageUrl},setCartItemsCount)}}><ShoppingCart size={35}/></Button>:""}
            {status=='open' ? <Button className="bg-purple-600 text-white hover:bg-purple-700" onClick={()=>{router.push(`/cart/payment?productId=${courseID}`)}}>Kup kurs</Button>:""}
          </div>
        </CardFooter>
      </Card>
    )
  }
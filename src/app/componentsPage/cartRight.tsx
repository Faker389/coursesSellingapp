"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { X, User, Trash2 } from 'lucide-react'
import { removeItemFromCart } from '@/app/(cookies)/cookies';
import { useCookiesSet, useCartItemsCount, useCartPosition } from '@/app/globalStates/states';
import { getCart, getCookies } from '@/app/(cookies)/cookies';
import Image from 'next/image';
interface Cart{
    id:string,
    title:string,
    price:number,
    image:string
}
function RightBar(){
  const user = getCookies()
    const cartItems = Object.values(getCart(user.ID));
    const {setCartItemsCount} = useCartItemsCount()
  return <>
   <div className="flex justify-center mb-8 mt-12">
        <h1 className="text-2xl font-bold"></h1>
        </div>
        <nav className="flex-grow">
          <ul className="space-y-4">
            {cartItems.map((item:Cart, index:number) => (
           
              <li key={index} className="cursor-pointer">
               <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-700">
               <Link href={`/cart/payment?productId=cart`} key={index}>
                <div className="flex items-center">
                <Image src={item.image} alt={item.title} width={80} height={40} className="rounded mr-4" />
                  <span>{item.title}</span>
                </div>
                </Link>
                <div className="flex items-center w-fit">
                  <span className="ml-4 w-20 text-right ">${item.price}</span> 
                  <Trash2 size={20} className='ml-4 text-gray-400 hover:text-white transition-colors' onClick={()=>{removeItemFromCart(user.ID,item.id,setCartItemsCount)}} />
                </div>
              </div>
              </li>
            ))}
          </ul>
        </nav>
        </>
}
export default function CartRight() {
  // Komponent tworzący i animujący koszyk
  const {cart, setCart} = useCartPosition()
  const {cookiesCrated} = useCookiesSet()
  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '100%' },
  }


  return (
    <motion.div
      initial="open"
      animate={cart ? 'open' : 'closed'}
      variants={sidebarVariants}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed top-0 right-0 h-screen w-fit bg-gray-800 text-white p-4 shadow-lg"
    >
      <button
        onClick={() => setCart(false)}
        className="absolute top-2 left-2 text-gray-300 hover:text-white transition-colors"
      >
        <X size={24} />
      </button>

      <div className="flex flex-col  h-full">
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
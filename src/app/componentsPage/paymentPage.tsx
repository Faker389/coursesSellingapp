"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { InfoIcon, CheckIcon, XIcon, ShoppingCart,ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getCart, getCookies } from '@/app/(cookies)/cookies'
interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
}


const STATUS_CONTENT_MAP = {
  succeeded: {
    text: "Payment succeeded",
    iconColor: "#30B130",
    icon: CheckIcon,
  },
  processing: {
    text: "Your payment is processing.",
    iconColor: "#6D6E78",
    icon: InfoIcon,
  },
  requires_payment_method: {
    text: "Your payment was not successful, please try again.",
    iconColor: "#DF1B41",
    icon: XIcon,
  },
  default: {
    text: "Something went wrong, please try again.",
    iconColor: "#DF1B41",
    icon: XIcon,
  },
  canceled: {
    text: "Your payment was canceled.",
    iconColor: "#DF1B41",
    icon: XIcon,
  },
}

export default function PaymentPageComponent({ dpmCheckerLink, courseID  }: { dpmCheckerLink?: string, courseID?: string }) {
  // Strona obsługujaca płatności
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const user = getCookies()
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<keyof typeof STATUS_CONTENT_MAP>("default")
  const [intentId, setIntentId] = useState<string | null>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  // pobieranie przedmiotu do płatności
  useEffect(()=>{
    async function fetchPaymentIntent(){
        const request = await fetch("http://localhost:8000/api/getItem", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({courseID: courseID}),
        })
        const data = await request.json()
        setCartItems(data)
    }
    if(courseID==="cart"){
      setCartItems(Object.values(getCart(user!.ID)))
    }else fetchPaymentIntent()
  },[])
  // tworzenie okna i wszystkich prametrów płatności
  useEffect(() => {
    if (!stripe) return

    const clientSecret = new URLSearchParams(window.location.search).get("payment_intent_client_secret")

    if (!clientSecret) return

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (!paymentIntent) return

      const validStatuses = Object.keys(STATUS_CONTENT_MAP) as Array<keyof typeof STATUS_CONTENT_MAP>
      const newStatus = validStatuses.includes(paymentIntent.status as keyof typeof STATUS_CONTENT_MAP)
        ? (paymentIntent.status as keyof typeof STATUS_CONTENT_MAP)
        : "default"

      setStatus(newStatus)
      setIntentId(paymentIntent.id)
    })
  }, [stripe])
// funkcja obslugujaca płatność
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!stripe || !elements) return

    setIsLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `http://localhost:3000/product/${courseID}/payment`,
      },
    })

    if (error?.type === "card_error" || error?.type === "validation_error") {
      setMessage(error.message!)
    } else {
      setMessage("An unexpected error occurred.")
    }

    setIsLoading(false)
  }

  const paymentElementOptions = {
    layout: "accordion" as const,
  }


  const totalPrice = parseFloat(cartItems.reduce((sum, item) => sum + item.price, 0).toString())

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center  justify-center p-4">
      <Card className="relative w-full max-w-3xl bg-gray-800 text-white">
          <ArrowLeft size={25} className='ml-4 mt-4 cursor-pointer text-gray-400 hover:text-white transition-colors absolute top-0 left-0' onClick={()=>{router.push("/home")}} />
        <CardHeader className='mt-4'>
          <CardTitle className="text-2xl font-bold flex items-center relative">
            <ShoppingCart className="mr-2" /> Your Cart
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-fit max-h-64 overflow-y-auto mb-4">
            {cartItems.map((item,index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-700">
                <div className="flex items-center">

                  <Image src={item.image} alt={item.title} width={80} height={40} className="rounded mr-4" />
                  <span>{item.title}</span>
                </div>
                <div className="flex items-center w-fit">
                  <span className="ml-4 w-20 text-right">${item.price}</span> 
                </div>
              </div>
            ))}
          </ScrollArea>
          <div className="text-right mb-4">
            <span className="text-lg font-semibold">Total: ${totalPrice}</span>
          </div>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Payment</h3>
            <form id="payment-form" className="" onSubmit={handleSubmit}>
              <div className="p-4 rounded-lg ">
                <PaymentElement id="payment-element" options={paymentElementOptions} />
              </div>
              <Button 
                disabled={isLoading || !stripe || !elements} 
                className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? "Processing..." : "Pay now"}
              </Button>
              {message && <div className="mt-4 text-red-500">{message}</div>}
            </form>
          </div>
          <div className="text-sm text-gray-400 bg">
            <p>
              Payment methods are dynamically displayed based on customer location, order amount, and currency.&nbsp;
              <a href={dpmCheckerLink} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">
                Preview payment methods by transaction
              </a>
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          {intentId && (
            <div className="w-full text-center">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full" style={{ backgroundColor: STATUS_CONTENT_MAP[status].iconColor }}>
                  {React.createElement(STATUS_CONTENT_MAP[status].icon, { size: 24 })}
                </div>
                <h2 className="text-xl font-semibold mt-2">{STATUS_CONTENT_MAP[status].text}</h2>
              </div>
              <div className="mb-4">
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="text-left text-gray-400">ID:</td>
                      <td className="text-right">{intentId}</td>
                    </tr>
                    <tr>
                      <td className="text-left text-gray-400">Status:</td>
                      <td className="text-right">{status}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <Link href={`https://dashboard.stripe.com/payments/${intentId}`} target="_blank" className="text-purple-400 hover:text-purple-300">
                View details
              </Link>
            </div>
          )}
          <Link href="/" className="mt-4 text-purple-400 hover:text-purple-300">
            Test another payment
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
"use client"

import {Suspense} from 'react'
import Link from 'next/link'
import { useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'

interface Course{
    courseID:string
    title:string
    price:string
    image:string
    description:string
}
function CoursePage(){
  const searchParams = useSearchParams();
  const productID = searchParams.get("productId") as string;
  const [product,setProduct]=useState<Course>()
  // pobieranie danego produktu dla podstrony
  useEffect(()=>{
      async function fetchPaymentIntent(){
          const request = await fetch("http://localhost:8000/api/getItem", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ courseID: productID }),
          })
          const data = await request.json()
          setProduct(data[0])
      }           
      fetchPaymentIntent()
  },[])
  return(
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl bg-gray-800 text-white p-1">
       <Image
          src="/icons/template.png"
          alt="template"
          className="w-full h-64 object-cover rounded-t-lg"
          width={800}
          height={400}
        />
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{product?.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-6">{product?.description}</p>
          <h3 className="text-xl font-semibold mb-2">Course files:</h3>
          <ScrollArea className="h-40 w-full rounded border border-gray-700 p-4">
            {/* Wczytywanie plikow pdf */}
            {/* {files.map((file, index) => (
              <div key={index} className="flex items-center mb-2">
                <FileIcon className="mr-2 h-5 w-5 text-gray-400" />
                <span>{file.name}</span>
                <span className="ml-2 text-sm text-gray-500">{file.type}</span>
              </div>
            ))} */}
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/home">
            <Button variant="outline" className="bg-gray-700 hover:bg-gray-600">
              <ArrowLeft className="mr-2 h-4 w-4" /> Powrót
            </Button>
          </Link>
          <Link href={`/cart/payment?productId=${product?.courseID}`}>
            <Button className="bg-purple-600 hover:bg-purple-700">
              Kup teraz
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
export default function CourseShowcase() {
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CoursePage/>
    </Suspense>
  )
}
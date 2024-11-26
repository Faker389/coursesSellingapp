"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react";
import { getCookies } from "./(cookies)/cookies";

export default function Home() {
  const router = useRouter();
  useEffect(()=>{
    checkUser()
  },[])
  async function checkUser(){
    const user = await getCookies()
    if(user==null){
      router.push("/login")
    }else{
      router.push("/home")
    }
  }
  return<>
    
  </>
}

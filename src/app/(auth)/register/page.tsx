"use client"

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Loader2,EyeOff,Eye } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {  useFormik } from 'formik';
import * as Yup from 'yup';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from 'next/link'
import { useState,useRef,useEffect } from 'react';
import { saveCookies } from '@/app/(cookies)/cookies'
import { useRouter } from 'next/navigation'
import { initializeApp } from "firebase/app";
import { getAuth,signInWithPopup,GoogleAuthProvider } from "firebase/auth";
import { useCookiesSet } from '@/app/globalStates/states';
import { useIsLoading,useError,useErrorMessage,clearStates } from '@/app/globalStates/states';
// Objekt walidujący dane z formularza
const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Email is required"),
  name:Yup.string().min(5,"Name must be at least 5 characters"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must contain upper and lowercase letters, a number, and a special character")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], "Passwords must match")
    .required("Confirm Password is required"),
});

export default function Component() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const usedEmails = useRef<string[]>([])
  // globalne stany dotyczace bledow
  const {error,setError} = useError()
  const {errorMessage,setErrorMessage} = useErrorMessage()
  const {isLoading,setIsLoading} = useIsLoading()

  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const {setCookiesCrated} = useCookiesSet()
  const firebaseConfig = {
    apiKey: "AIzaSyAkVnYLSgE4d4lk70DkyEnOM20IqdwhMyY",
    authDomain: "zdajmyto-3ea9b.firebaseapp.com",
    projectId: "zdajmyto-3ea9b",
  
  };
  // inicjalizacja Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const eyeStyles = "h-5 w-5 text-gray-400 cursor-pointer hover:text-white hover:transition-all"
  const formik = useFormik({
    initialValues: { email: '', password: '', confirmPassword: '' ,name:" "},
    validationSchema: validationSchema,
    onSubmit: () => {}});
    useEffect(()=>{
      // funkcja pobierajaca maile aby nie mozna bylo twożyć 2 razy konta na tego samego maila
      clearStates()
    async function fetchUsedEmails(){
      const request = await fetch("http://localhost:8000/api/usedEmails",{
        method:"Get",
        headers:{
          "Content-type":"application/json"
        }
      })
      const data = await request.json()
      usedEmails.current = data
  }
  fetchUsedEmails()
  },[])
  // Rejestracja przy użyciu google 
  async function googleSignIn(){
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken(); 
      console.log(idToken)
      const response = await fetch("http://localhost:8000/api/google", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken }),
      });

      const data = await response.json();

      if (response.ok) {
          saveCookies(data)
          setCookiesCrated(true)
          router.push("/home")
      } else {
        setErrorMessage("Login failed: ")
        setError(true)
      }
  } catch (error) {
    console.log(error)
    setErrorMessage("Google login failed: ")
    setError(true)
  }
  }
  // walidacja i zarejestrowanie użytkownika
  async function fetchData(){
    if(usedEmails.current.includes(formik.values.email.toLowerCase())){
      setErrorMessage("Email already in use")
      setError(true)
      setIsLoading(false)
      return
    }
    const values = {
      email:formik.values.email ,
      password:formik.values.password ,
      confirmPassword:formik.values.confirmPassword  ,
      name:formik.values.name
    }
    setIsLoading(true)
    setError(false);
    try{
      const request = await fetch("http://localhost:8000/api/register",{
        method:"Post",
        headers:{
          "Content-type":"application/json"
        },
        body:JSON.stringify({user:values})
      })
      const response = await request.json()
      saveCookies(response)
      setCookiesCrated(true)
      router.push("/home")
    }catch(error){
      console.log(error)
      setError(true);
      setErrorMessage("Invalid information, try again later.")
    }finally{
      setIsLoading(false)
    }
  }
  // wyświetlanie i chowanie hasła
  const togglePasswordVisibility = (field:string) => {
    if (field === 'password') {
      setShowPassword(!showPassword)
    } else {
      setShowConfirmPassword(!showConfirmPassword)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2">
          <svg width="800" height="800" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="40" fill="url(#gradient)" />
          </svg>
        </div>
        <div className="absolute right-0 bottom-0 translate-x-1/2 translate-y-1/2">
          <svg width="600" height="600" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="40" fill="url(#gradient2)" />
          </svg>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-[350px] bg-gray-800 bg-opacity-50 backdrop-blur-lg border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">Sign in</CardTitle>
            <CardDescription className="text-gray-400">Create your account to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={formik.handleSubmit} ref={formRef}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name" className="text-gray-200">Name</Label>
                  <Input 
                  name="name" 
                  autoFocus
                  placeholder='Enter name'
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                  onChange={formik.handleChange} 
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400" />
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-red-500 text-sm">{formik.errors.name}</p>
                  )}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email" className="text-gray-200">Email</Label>
                  <Input 
                  name="email" 
                  placeholder="Enter email" 
                  type="email" 
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400" />
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-red-500 text-sm">{formik.errors.email}</p>
                  )}
                </div>
                  <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="password" className="text-gray-200">Password</Label>
                      <div className='relative'>
                        <Input 
                        id="password"
                        name="password"
                        placeholder='Enter password'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        type={showPassword?"text":"password"}
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400" />
                        <Button
                          type='button'
                          size="icon"
                          variant="ghost"
                          className='absolute top-0 right-0 hover:bg-transparent '
                          onClick={()=>togglePasswordVisibility("password")}
                        >
                          {showPassword?<Eye className={eyeStyles}/>:<EyeOff className={eyeStyles}/>}
                        </Button>
                      </div>
                      {formik.touched.password && formik.errors.password && (
                        <p className="text-red-500 text-sm">{formik.errors.password}</p>
                      )}
                  </div>
              
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-gray-200">Confirm password</Label>
                  <div className='relative'>
                   <Input
                      id="password"
                      name="confirmPassword"
                      placeholder='Confirm password'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      type={showConfirmPassword?"text":"password"}

                      value={formik.values.confirmPassword}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400" />
                      <Button
                          type='button'
                          size="icon"
                          variant="ghost"
                          className='absolute top-0 right-0 hover:bg-transparent '
                          onClick={()=>togglePasswordVisibility("confirmPassword")}
                        >
                          {showConfirmPassword?<Eye className={eyeStyles}/>:<EyeOff className={eyeStyles}/>}
                        </Button>
                    </div>
                      {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                        <p className="text-red-500 text-sm">{formik.errors.confirmPassword}</p>
                      )}
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className='block'>
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white" type="submit"  onClick={()=>fetchData()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          <CardDescription className="text-gray-400 text-center mt-5">Have an account? <Link href="/login" className='text-purple-500 hover:text-blue-300 transition-all'>Log in</Link> </CardDescription>
          <div className="relative flex items-center justify-center my-8">
          <div className="flex-grow border-t border-gray-500"></div>
            <CardTitle className=" px-3 font-bold relative z-10 text-gray-500">Or</CardTitle>
            <div className="flex-grow border-t border-gray-500"></div>
          </div>
          <button className='z-10 bg-white text-black w-full h-full pt-2 pb-2 flex items-center justify-center gap-3' onClick={()=>{googleSignIn()}}>
              <Image src="/icons/googleLogo.png" alt="google" width={30} height={30} />
              Sign in with Google</button>
          </CardFooter>
        </Card>
      {error&&(
             <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.2 }}
           >
             <Alert className="mt-4 bg-red-600 border-red-900 text-white">
               <AlertTitle>Error occured</AlertTitle>
               <AlertDescription>
                    {errorMessage}
               </AlertDescription>
             </Alert>
           </motion.div>
        )}
      </motion.div>
    </div>
  )
}
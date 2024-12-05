"use client"

import { Dispatch, SetStateAction, useState } from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { motion } from 'framer-motion'
import { Loader2,X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
interface emailInterface{
    email:string
}
type ChildComponentProps = {
  closeWindow: Dispatch<SetStateAction<boolean>>;
};
const PasswordResetSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email address").required("Email is required"),
})
const PasswordResetPage:React.FC<ChildComponentProps> =({closeWindow})=> {
  // component z strona do zmiany hasła
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState(false)
  // funkcja updatujaca hasło w bazie
  const handleSubmit = async (values:emailInterface) => {
    const email = values.email
    setIsSubmitted(false)
    setError(false)
    try{
      
      await fetch("http://localhost:8000/api/resetPassword",{
        method:"Post",
        headers:{
          "Content-type":"application/json"
        },
        body:JSON.stringify({email})
      })
      setIsSubmitted(true)
      setTimeout(()=>{
        closeWindow(false)
        values.email=""
        setIsSubmitted(false)
      },2000)
    }catch(err){
      console.log(err)
      setError(true)
    }
  }

  return (
    <div className="w-full max-w-md">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
          <Card className="bg-gray-800 text-white border-gray-700">
            <CardHeader className="space-y-1 relative">
              <X size={28} className='absolute top-1 right-1 cursor-pointer' onClick={()=>closeWindow(false)} />
              <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
              <CardDescription className="text-center text-gray-400">
                Enter your email address and we&apos;ll send you a link to reset your password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Formik
                initialValues={{ email: '' }}
                validationSchema={PasswordResetSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Field
                          as={Input}
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Enter email"
                          className={`bg-gray-700 border-gray-600 text-white placeholder-gray-400 ${
                            errors.email && touched.email ? 'border-red-500' : ''
                          }`}
                        />
                        {errors.email && touched.email && (
                          <p className="text-sm text-red-500">{errors.email}</p>
                        )}
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          'Reset Password'
                        )}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </CardContent>
            <CardFooter>
              <p className="text-center text-sm text-gray-400 w-full">
                Remember your password? <a onClick={()=>closeWindow(false)} className="text-purple-400 hover:underline">Log in</a>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Alert className="mt-4 bg-green-800 border-green-700 text-white">
              <AlertTitle>Check your email</AlertTitle>
              <AlertDescription>
                We&apos;ve sent a password reset link to your email address.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
        {error&&(
             <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.2 }}
           >
             <Alert className="mt-4 bg-red-600 border-red-900 text-white">
               <AlertTitle>Error occured</AlertTitle>
               <AlertDescription>
                    Email doesn&apos;t exist in database, try again later;
               </AlertDescription>
             </Alert>
           </motion.div>
        )}
      </div>
  )
}
export default PasswordResetPage;
"use client"

import { useState ,useEffect,Suspense } from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getAuth, verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
import { motion } from 'framer-motion'
import { initializeApp, getApps } from 'firebase/app';
import { Loader2,Eye, EyeOff } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter,useSearchParams } from 'next/navigation';
import { Label } from "@/components/ui/label"
import firebaseConfig from "../../FirebaseData.json"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import { useIsLoading,useError,useIsSubmitted,clearStates } from '@/app/globalStates/states';
import RenderImage from '@/app/componentsPage/renderImage'
interface passwordsSchema{
    password:string;
    confirmPassword:string;
}
// Objekt walidujący dane z formularza
const PasswordSchema = Yup.object().shape({
    password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must contain upper and lowercase letters, a number, and a special character")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], "Passwords must match")
    .required("Confirm Password is required"),
})

function SuspensePasswordReset() {
    const router = useRouter()
    const searchParams = useSearchParams();
    // globalne stany dotyczace bledow
    const {isLoading,setIsLoading} = useIsLoading()
    const {error,setError} = useError()
    const {isSubmitted,setIsSubmitted} = useIsSubmitted()

    const [showPassword, setShowPassword] = useState(false)
    const [oobCode,setOobCode]=useState<string>("")
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isCodeValid, setIsCodeValid] = useState(false);
    useEffect(()=>{
      clearStates()
    },[])
    // sprawdzanie czy w url kod oob jest prawidłowy
    useEffect(() => {
      const code = searchParams.get('oobCode');
      if (code) {
      setOobCode(code)
      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
      const auth = getAuth(app);
        verifyPasswordResetCode(auth, code)
          .then(() => setIsCodeValid(true))
          .catch(() => setError(true));
      }else{
        router.push("/login")
      }
    }, [searchParams]);
  
    // sprawdzenie czy hasło zostało poprawnie zmienione
    const handleSubmit = async (values:passwordsSchema) => {
      setError(false)
      setIsLoading(true)
      setIsSubmitted(false)
      const auth = getAuth();
    try {
      await confirmPasswordReset(auth, oobCode, values.password);
      setIsLoading(false)
      setIsSubmitted(true)
      setTimeout(()=>{
        router.push("/login")
      })
    } catch (err) {
      console.log(err)
      setIsLoading(false)
      setError(true);
    }

  }
  //zmiana widoczności hasła
  const togglePasswordVisibility = (field:string) => {
    if (field === 'password') {
      setShowPassword(!showPassword)
    } else {
      setShowConfirmPassword(!showConfirmPassword)
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-[350px] bg-gray-800 bg-opacity-50 backdrop-blur-lg border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">Reset Password</CardTitle>
          <CardDescription className="text-gray-400">Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mb-6">
            <RenderImage src="/placeholder.svg" width="80px" height="80px"/>
          </div>
          <Formik
            initialValues={{ password: '', confirmPassword: '' }}
            validationSchema={PasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="space-y-4">
                <div>
                  <Label htmlFor="password" className="text-gray-200">New Password</Label>
                  <div className="relative">
                    <Field
                      as={Input}
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className="bg-gray-700 border-gray-600 text-white pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:bg-transparent hover:text-white"
                      onClick={() => togglePasswordVisibility('password')}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.password && touched.password ? (
                    <div className="text-red-500 text-sm mt-1">{errors.password}</div>
                  ) : null}
                </div>
                <div>
                  <Label htmlFor="confirmPassword" className="text-gray-200">Confirm New Password</Label>
                  <div className="relative">
                    <Field
                      as={Input}
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className="bg-gray-700 border-gray-600 text-white pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:bg-transparent hover:text-white"
                      onClick={() => togglePasswordVisibility('confirmPassword')}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.confirmPassword && touched.confirmPassword ? (
                    <div className="text-red-500 text-sm mt-1">{errors.confirmPassword}</div>
                  ) : null}
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={isLoading||!isCodeValid}
                  
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Changing Password...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </Button>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
      {/* Pomyślne zmienienie hasło */}
      {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Alert className="mt-4 bg-green-800 border-green-700 text-white">
              <AlertDescription>
                Password succesfully changed.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      {/* Wyswietlanie błędów */}
      {error&&(
             <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.2 }}
           >
             <Alert className="mt-4 bg-red-600 border-red-900 text-white">
               <AlertTitle>Error occured</AlertTitle>
               <AlertDescription>
                    Invalid oobCode,<Link href="/login" className='underline'>Go back</Link> and try sending another email.
               </AlertDescription>
             </Alert>
           </motion.div>
        )}
    </motion.div>

  </div>
  )
}
export default function  PasswordResetPage(){
  return <Suspense fallback={<div>Loading...</div>}><SuspensePasswordReset/></Suspense>
}

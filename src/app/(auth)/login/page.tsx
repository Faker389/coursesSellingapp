"use client"

// Import komponentów i bibliotek
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useFormik } from 'formik';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import * as Yup from 'yup';
import Link from 'next/link'
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useRef, useState, useEffect } from 'react';
import { removeCookie } from '../../(cookies)/cookies';
import { saveCookies } from '@/app/(cookies)/cookies'
import { useRouter } from 'next/navigation'
import PasswordResetSchema from "../../componentsPage/passwordReset"
import { useCookiesSet } from '@/app/globalStates/states';
import { useIsLoading, useError, useErrorMessage, clearStates } from '@/app/globalStates/states';

// Schemat walidacji dla formularza logowania
const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Email is required"), // Walidacja adresu email
  password: Yup.string()
    .min(8, "Password must be at least 8 characters") // Minimalna długość hasła
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must contain upper and lowercase letters, a number, and a special character") // Wymagania dla hasła
    .required("Password is required"), // Hasło jest wymagane
});

export default function LoginForm() {
  // Konfiguracja Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyAkVnYLSgE4d4lk70DkyEnOM20IqdwhMyY",
    authDomain: "zdajmyto-3ea9b.firebaseapp.com",
    projectId: "zdajmyto-3ea9b",
  };

  // Inicjalizacja Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const router = useRouter(); // Hook do obsługi nawigacji w Next.js
  const [showPassword, setShowPassword] = useState(false); // Stan widoczności hasła
  const formRef = useRef<HTMLFormElement>(null); // Referencja do formularza

  // Globalne stany aplikacji
  const { isLoading, setIsLoading } = useIsLoading();
  const { error, setError } = useError();
  const { errorMessage, setErrorMessage } = useErrorMessage();
  const { setCookiesCrated } = useCookiesSet();

  const [emailWindow, setEmailWindow] = useState(false); // Stan dla okna resetowania hasła
  const eyeStyles = "h-5 w-5 text-gray-400 cursor-pointer hover:text-white hover:transition-all"; // Styl ikony oka

  // Konfiguracja Formika dla obsługi formularza
  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: validationSchema,
    onSubmit: () => {}, // Akcja po wysłaniu formularza (pusta, bo używane są inne metody)
  });

  // Funkcja logowania przez Google
  async function googleSignIn() {
    setErrorMessage("");
    setError(false);
    try {
      const result = await signInWithPopup(auth, provider); // Logowanie przez Google
      const idToken = await result.user.getIdToken(); // Pobranie tokenu ID
      const response = await fetch("http://localhost:8000/api/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }), // Przesłanie tokenu do API
      });

      const data = await response.json();

      if (response.ok) {
        saveCookies(data); // Zapisanie ciasteczek
        setCookiesCrated(true);
        router.push("/home"); // Przekierowanie na stronę główną
      } else {
        console.error("Login failed:", data.error);
        setErrorMessage("Login failed, try again later."); // Ustawienie błędu
        setError(true);
      }
    } catch (error) {
      console.log("Google login error:", error);
      setError(true);
      setErrorMessage("Failed to log in with Google. Please try again.");
    }
  }

  useEffect(() => {
    // Czyszczenie stanów i plików cookie przy wejściu na stronę logowania
    clearStates();
    removeCookie();
  }, []);

  // Funkcja logowania przez email i hasło
  async function fetchData() {
    setIsLoading(true);
    setError(false);
    setErrorMessage("");
    try {
      const values = {
        email: formik.values.email, // Pobranie wartości email z formularza
        password: formik.values.password, // Pobranie wartości hasła z formularza
      };
      console.log(values);
      const request = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ user: values }), // Przesłanie danych logowania do API
      });
      const response = await request.json();
      if (response.ok) {
        saveCookies(response); // Zapisanie ciasteczek
        setCookiesCrated(true);
        router.push("/home"); // Przekierowanie na stronę główną
      }
    } catch (error) {
      setErrorMessage("Invalid information, try again later."); // Obsługa błędów logowania
      setError(true);
      console.log(error);
    } finally {
      setIsLoading(false); // Zakończenie ładowania
    }
  }

  // Render komponentu logowania
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800">
      {/* Tło gradientowe z elementami SVG */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Górny element dekoracyjny */}
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
        {/* Dolny element dekoracyjny */}
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
      {/* Animowany kontener formularza */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} // Początkowe wartości animacji
        animate={{ opacity: 1, y: 0 }} // Końcowe wartości animacji
        transition={{ duration: 0.5 }} // Czas trwania animacji
      >
        <Card className="w-[350px] bg-gray-800 bg-opacity-50 backdrop-blur-lg border-gray-700">
          {/* Nagłówek formularza */}
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">Log in</CardTitle>
            <CardDescription className="text-gray-400">Log in to get Started</CardDescription>
          </CardHeader>
          {/* Zawartość formularza */}
          <CardContent>
            <form ref={formRef} onSubmit={formik.handleSubmit}>
              <div className="grid w-full items-center gap-4">
                {/* Pole email */}
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email" className="text-gray-200">Email</Label>
                  <Input 
                    name="email" 
                    placeholder="Enter email" 
                    type="email" 
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                  />
                  {/* Błąd walidacji dla email */}
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-red-500 text-sm">{formik.errors.email}</p>
                  )}
                </div>
                {/* Pole hasło */}
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password" className="text-gray-200">Password</Label>
                  <div className='relative'>
                    <Input 
                      placeholder='Enter password'
                      name="password" 
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                      type={showPassword ? "text" : "password"} // Przełącznik widoczności hasła
                      className="bg-gray-700 border-gray-600 text-white" 
                    />
                    <Button
                      type='button'
                      size="icon"
                      variant="ghost"
                      className='absolute top-0 right-0 hover:bg-transparent '
                      onClick={() => setShowPassword(!showPassword)} // Przełączanie widoczności hasła
                    >
                      {showPassword ? <Eye className={eyeStyles}/> : <EyeOff className={eyeStyles}/>}
                    </Button>
                  </div>
                </div>
                {/* Błąd walidacji dla hasła */}
                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-500 text-sm">{formik.errors.password}</p>
                )}
              </div>
            </form>
          </CardContent>
          {/* Stopka formularza */}
          <CardFooter className='block'>
            {/* Przycisk logowania */}
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white" disabled={isLoading} onClick={() => fetchData()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            {/* Link do resetowania hasła */}
            <CardDescription className="mt-5">
              <p onClick={() => setEmailWindow(true)} className='text-purple-500 cursor-pointer text-right hover:text-blue-300 transition-all'>
                Forgot password?
              </p>
            </CardDescription>
            {/* Link do rejestracji */}
            <CardDescription className="text-gray-400 text-center mt-5">
              Don&apos;t have an account? <Link href="/register" className='text-purple-500 hover:text-blue-300 transition-all'>Sign in</Link>
            </CardDescription>
            {/* Separator */}
            <div className="relative flex items-center justify-center my-8">
              <div className="flex-grow border-t border-gray-500"></div>
              <CardTitle className="px-3 font-bold relative z-10 text-gray-500">Or</CardTitle>
              <div className="flex-grow border-t border-gray-500"></div>
            </div>
            {/* Przycisk logowania przez Google */}
            <button className='z-10 bg-white text-black w-full h-full pt-2 pb-2 flex items-center justify-center gap-3' onClick={() => { googleSignIn() }}>
              <Image src="/icons/googleLogo.png" alt="google" width={30} height={30} />
              Sign in with Google
            </button>
          </CardFooter>
        </Card>
        {/* Wyświetlenie komunikatu o błędzie */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Alert className="mt-4 bg-red-600 border-red-900 text-white">
              <AlertTitle>Error occurred</AlertTitle>
              <AlertDescription>
                {errorMessage}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </motion.div>
      {/* Okno resetowania hasła */}
      <div className={`${emailWindow ? "flex" : "hidden"} absolute top-0 right-0 bg-black bg-opacity-50 w-full h-screen overflow-hidden justify-center items-center`}>
        <PasswordResetSchema closeWindow={setEmailWindow} />
      </div>
    </div>
  );
}

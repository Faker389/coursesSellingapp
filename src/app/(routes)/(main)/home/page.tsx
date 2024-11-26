"use client"
import { useCookiesSet } from '@/app/globalStates/states';

import CourseCard from "@/app/componentsPage/courseCard"
import { useEffect,useState,useRef } from "react";
import CourseCardSkeleton from "@/app/componentsPage/courseCardSkeleton";
import { getCookies } from "../../../(cookies)/cookies";
import { useIsLoading,clearStates } from '@/app/globalStates/states';

import { useMainRender,usePriceFrom,usePriceTo,useSearchTerm } from '@/app/globalStates/states';
interface user{
  ID:string,
  name: string,
  email: string,
  image: string,
  phoneNumber: string
}
interface course{
  title:string;
  description:string;
  price:string;
  image:string;
  category:string;
  user:user;
  courseID:string;
}
export default function Home() {
  const allCourses = useRef<course[]>([])
  const [courses, setCourses] = useState<course[]>([])
  const {isLoading,setIsLoading} = useIsLoading()
  const {setCookiesCrated} = useCookiesSet()
  const user = getCookies()

  if(!user) setCookiesCrated(false)
  const usedEmails = useRef<string[]>([])
  const {keyWord} = useMainRender()
  const {searchTerm} = useSearchTerm()
  const {priceFrom} = usePriceFrom()
  const {priceTo} = usePriceTo()
  
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
  useEffect(() => {
    clearStates()
    fetchUsedEmails()
    const fetchCourses = async () => {
      setIsLoading(true)
      try{
        const request = await fetch("http://localhost:8000/api/getCourse",{
          method:"Post",
          headers:{
            "Content-type":"application/json"
          },
          body:JSON.stringify({userId:null})
        })
        const data = await request.json()
        allCourses.current = data
        setCourses(data)
        setIsLoading(false)

      }catch(e){
        setIsLoading(false)
        console.log(e)
      }
    }
    fetchCourses()
   
  }, [])

  useEffect(() => {
    const filtered = allCourses.current.filter((course) => {
      if(keyWord=="Pokaż wszystkie") return course;
      const matchesCategory = keyWord ? course.category === keyWord : true;
      const matchesPriceFrom = priceFrom !== 0 ? parseFloat(course.price) >= priceFrom : true;
      const matchesPriceTo = priceTo !== 0 ? parseFloat(course.price) <= priceTo : true;
      const matchesSearchTerm = searchTerm ? course.title.toLowerCase().includes(searchTerm.toLowerCase()) : true;
      return matchesCategory && matchesPriceFrom && matchesPriceTo && matchesSearchTerm;
    });

    setCourses(filtered);
  }, [keyWord, priceFrom, priceTo,searchTerm]); 

  return<div className="min-h-screen bg-gray-900 text-white">
   
     <main className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {isLoading
            ? Array(4).fill(0).map((_, index) => <CourseCardSkeleton key={index} />)
            : courses.map((course, index) => (
                <CourseCard
                  courseID={course.courseID}
                  user={course.user}
                  status='open'
                  key={index}
                  title={course.title}
                  description={course.description}
                  price={course.price}
                  imageUrl={course.image}
                />
              ))
          }
        </div>
      </main>
  </div>
}

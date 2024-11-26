"use client"

import { useState,useEffect } from 'react'
import CourseCard from '@/app/componentsPage/courseCard'
import CourseCardSkeleton from '@/app/componentsPage/courseCardSkeleton'
import {useIsLoading} from '../../../globalStates/states'
import { getCookies } from '@/app/(cookies)/cookies'
interface course{
  title:string;
  description:string;
  price:string;
  image:string;
  category:string;
  user:string;
  courseID:string;
}

export default function PosiadaneKursyPage() {
  const user = getCookies()
  const [courses,setCourses] = useState<course[]>([])
  const {isLoading,setIsLoading} = useIsLoading()
  useEffect(()=>{
    console.log(user.ID)
    async function getCourses(){
    try{
        setIsLoading(true)
        const request = await fetch("http://localhost:8000/api/getCourse",{
          method:"Post",
          headers:{
            "Content-type":"application/json"
          },
          body:JSON.stringify({userId:user.ID})
        })
        const data = await request.json()
        delete data.user
        setCourses(data)
      }catch(error){
        console.log(error)
      }finally{
        setIsLoading(false)
      }
    }
  getCourses()
  },[])
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Posiadane kursy</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {isLoading
            ? Array(4).fill(0).map((_, index) => <CourseCardSkeleton key={index} />)
            : courses.map((course, index) => (
                <CourseCard
                  courseID={course.courseID}
                  status='closed'
                  key={index}
                  title={course.title}
                  description={course.description}
                  price={course.price}
                  imageUrl={course.image}
                />
              ))
          }
      </div>
    </div>
  )
}
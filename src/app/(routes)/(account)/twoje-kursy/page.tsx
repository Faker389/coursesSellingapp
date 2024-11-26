"use client"
import { useState, useEffect } from 'react'
import { PlusCircle, } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useRouter } from 'next/navigation'
import { getCookies } from '@/app/(cookies)/cookies'
import CourseCard from '@/app/componentsPage/courseCard'
interface CourseData {
  title: string;
  price: string;
  description: string;
  image: string;
  files: File[];
  userId: string;
  category: string;
  courseID:string;
}

const AddCourseCard = () => {
  const user = getCookies()
  const router = useRouter()
  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  const [isOpen, setIsOpen] = useState(false)
  const [courses, setCourses] = useState<CourseData[]>([])
  const [courseData, setCourseData] = useState<CourseData>({
    title: '',
    price: "",
    description: '',
    image: "",
    files: [],
    userId: user.ID||"",
    category: "",
    courseID:""
  })
  useEffect(()=>{
    async function fetchCourses(){
      const response = await fetch("http://localhost:8000/api/getCourse",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({userId:user.ID||""})
      })
      const data = await response.json()
      setCourses(data)
    }
    fetchCourses()
  },[])
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCourseData(prev => ({ ...prev, [name]: value }))
  }
  const handleSelectChange = (value:string) => {
    setCourseData(prev => ({ ...prev, category: value }))
  }
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    setIsOpen(false)
    try {
      const response = await fetch('http://localhost:8000/api/addCourse', {
        method: 'POST',
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({data:courseData}),
      });
      
      const data = await response.json();
      if (data.success) {
        setIsOpen(false);
      }
    } catch(error) {
      console.error(error);
    }
  }
  const categoriesArray = ["Informatyka",
    "Język Angielski",
    "Inny język obcy",
    "Język Polski",
    "Wos",
    "Matematyka",
    "Biologia",
    "Chemia",
    "Fizyka",
    "Geografia",
    "Historia"
  ]
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 flex items-center justify-center cursor-pointer hover:border-purple-500 transition-colors">
            <PlusCircle className="h-16 w-16 text-gray-400" />
          </div>
        </DialogTrigger>
        {courses.map((course, index) => (
                <CourseCard
                  courseID={course.courseID}
                  status='closed'
                  key={index}
                  title={course.title}
                  description={course.description}
                  price={course.price}
                  imageUrl={course.image}
                />
              ))}
        <DialogContent className="bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Dodaj nowy kurs</DialogTitle>
            <DialogDescription>Wypełnij poniższe pola, aby utworzyć nowy kurs.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Tytuł kursu</Label>
              <Input required id="title" name="title" value={courseData.title} onChange={handleInputChange} className="bg-gray-700 text-white" />
            </div>
            <div>
              <Label htmlFor="price">Cena</Label>
              <Input required type="number" id="price" min="0" name="price" value={courseData.price} onChange={handleInputChange} className="bg-gray-700 text-white" />
            </div>
            <div>
              <label htmlFor="Category">Kategoria</label>
              <Select onValueChange={handleSelectChange} required>
                <SelectTrigger className="bg-gray-700 text-white">
                  <SelectValue placeholder="Wybierz kategorię" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 text-white">
                  {categoriesArray.map((category,index)=>(
                    <SelectItem  key={index} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Opis</Label>
              <Textarea required id="description" name="description" value={courseData.description} onChange={handleInputChange} className="bg-gray-700 text-white" />
            </div>
            <div>
              <Label htmlFor="image">Zdjęcie kursu</Label>
              <Input id="image" type="file" accept="image/*"  className="bg-gray-700 text-white" />
            </div>
            <div>
              <Label htmlFor="files">Pliki kursu (PDF)</Label>
              <Input id="files" type="file" accept=".pdf" multiple  className="bg-gray-700 text-white" />
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">Dodaj kurs</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default function TwojeKursyPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Twoje kursy</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AddCourseCard />
      </div>
    </div>
  )
}
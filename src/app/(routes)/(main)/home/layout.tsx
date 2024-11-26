"use client"
import { useNavPosition ,useCartPosition} from "@/app/globalStates/states" 
import Image from 'next/image'
import { Search, ShoppingCart } from 'lucide-react'
import CartRight from "../../../componentsPage/cartRight"
import { Input } from "@/components/ui/input"
import { useMainRender, usePriceFrom, usePriceTo,useSearchTerm,useCartItemsCount } from "@/app/globalStates/states"
import AnimatedSidebar from "../../../componentsPage/navBarRight"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
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
    const {cartItemsCount} = useCartItemsCount();
    const {setCart} = useCartPosition();
    const {setState} = useNavPosition();
    const {setKeyWord} = useMainRender()
    const {setPriceFrom} = usePriceFrom()
    const {setPriceTo} = usePriceTo()
    const {setSearchTerm} = useSearchTerm()
    const handlePrices = (e:React.ChangeEvent<HTMLInputElement>,which:string)=>{
      if(e.target.value=="") {
        if(which=="from") setPriceFrom(0)
        else setPriceTo(0)
        return
      }
      if(which=="from") setPriceFrom(parseFloat(e.target.value))
      else setPriceTo(parseFloat(e.target.value))
    }
    const handleValueChange = (value: string) => {
      setKeyWord(value)
    };
  return<>
      <header className="bg-gray-800 p-4  z-10 flex items-center justify-between">
        <Image src="/icons/logo.png" alt="Logo" width={120} height={40} />
        <div className="flex w-fit items-center space-x-4">
          <Select onValueChange={handleValueChange} required >
                <SelectTrigger  className="bg-gray-700 text-white">
                  <SelectValue placeholder="Wybierz kategorię" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 w-fit border-gray-600 text-white placeholder-gray-400 focus:border-purple-500">
                  <SelectItem value="Pokaż wszystkie">Pokaż wszystkie</SelectItem>
                  {categoriesArray.map((category:string,index)=>(
                    <SelectItem key={index} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
          <div className="items-center space-x-4 w-fit flex">
            <span className="text-white ">Cena:</span>
            <Input type="number" className=" bg-gray-700 w-fit border-gray-600 text-white placeholder-gray-400 focus:border-purple-500" min={1} onChange={(e)=>handlePrices(e,"from")} placeholder="Cena od" />
            <Input type="number" className=" bg-gray-700 w-fit border-gray-600 text-white placeholder-gray-400 focus:border-purple-500" min={1} onChange={(e)=>handlePrices(e,"to")} placeholder="Cena do" />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-10 bg-gray-700 w-fit border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
              onChange={(e)=>setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <ShoppingCart  size={40} className="cursor-pointer text-gray-400" onClick={()=>{setState(false);setCart(true)}} />
            <span className="text-white absolute -top-2 -right-2">{cartItemsCount==0?"":cartItemsCount}</span>
          </div>
          <Image
            onClick={()=>{setState(true);setCart(false)}}
            src="/icons/bars-solid.png"
            alt="User Profile"
            width={40}
            height={40}
            className="cursor-pointer"
            />
        </div>
      </header>
    {children}
    <CartRight />
    <AnimatedSidebar />
  </>
  }
  
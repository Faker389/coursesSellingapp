import { useState } from "react"
import { User } from "lucide-react"
import Image from "next/image"
interface ImageWithFallbackProps {
    src: string|undefined; 
    width:string;
    height:string;
  }
  
const RenderImage: React.FC<ImageWithFallbackProps> = ({src,width,height})=>{
    const defaultFallbackStyle: React.CSSProperties = {
        width: width,
        height: height,
        borderRadius:"50%",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        border: "1px solid #ccc",
      };
    const [hasError,setHasError] = useState(false)
    if(src==""||src==undefined){
      return   <div style={defaultFallbackStyle}>
      <User size={parseInt(height)-parseInt(height)/2}/>
    </div>
    }
    return <>
     {!hasError ? (
         <Image
         src={src}
         alt="User pfp"
         width={200}
         height={200}
         onError={() => setHasError(true)} 
          style={{ width: "200px", height: "200px", objectFit: "cover" }}
          />
        ) : (
            <div style={defaultFallbackStyle}>
                <User size={parseInt(height)-parseInt(height)/2}/>
        </div>
      )}
      </>
}
export default RenderImage
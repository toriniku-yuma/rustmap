import { GetServerSideProps } from "next"
import Image from "next/image"
import Hedder from "../../components/Hedder"
import prisma from "../../utils/prisma"
import { useEffect, useState } from "react"

type Props = {
  body:{
    id:number
    name:string
    address:string
    description:string
    image:string
    autherName:string
    position:number[]
    like:string[]
    UUID:string
  }[],
  imageURL:string
}

export const getServerSideProps:GetServerSideProps = async() =>{
    const monument = await prisma.post.findMany({
      orderBy:{
        id:"desc"
      },
      select:{
        id:true,
        name:true,
        position:true
      }
    })
    return {
      props:{
        body:monument
    }
  }
}

export default function Map(props:Props) {
    const [element,setElement] = useState<HTMLElement>();
    const [rendering,setRendering] = useState<number>();
    useEffect(()=>{
      console.log(props.body)
      const mapElement = document.getElementById("map");
      if(mapElement){
        setElement(mapElement);
      }
      window.addEventListener("resize",()=>{
        setRendering(Math.random())
      })
    },[])
    return (
      <div>
        <Hedder/>
        <div className=" flex flex-col text-center items-center">
          <div className="text-2xl my-4">Rustスラム街サーバーMAP</div>
          <div className=" relative">
            <Image src="/map.png" alt="" width={1200} height={1200} id="map"/>
            {props.body.map((value,key)=>{
              if(element){
                const positionXY = [value.position[0] * element.clientWidth,value.position[1] * element.clientHeight]
                return(
                  <div key={key}>
                    <a href={"/2305/" + value.id}>
                      <Image src={"/pin_red.png"} alt="" width={30} height={30} className=" absolute" 
                      style={{top:positionXY[1]-25+"px",left:positionXY[0]-14+"px"}}/>
                    </a>
                    <div className=" absolute text-gray-400" style={{top:positionXY[1]-40+"px",left:positionXY[0]-20+"px"}}>{value.name}</div>
                  </div>
                )
              }else{
                return
              }
            })}
          </div>
        </div>
      </div>
    )
  }
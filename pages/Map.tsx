import { GetServerSideProps } from "next"
import Image from "next/image"
import { Props } from "../components/PropsType"
import Hedder from "../components/Hedder"

export const getServerSideProps:GetServerSideProps = async() =>{
  return{
    props:{
      id:[0,1,2],
      image:["ロゴ.jpg","map.png","next.svg"],
      name:["かんこう1","かんこう2","かんこう3"],
      like:[12,30,25]
    }
  }
}

export default function Map(props:Props) {
    return (
      <div>
        <Hedder/>
        <div className=" flex flex-col text-center items-center">
          <div className="">Rustスラム街サーバーMAP</div>
          <Image src="/map.png" alt="" width={1200} height={1200}/>
        </div>
      </div>
    )
  }
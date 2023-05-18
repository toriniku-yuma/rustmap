import { GetServerSideProps } from "next";
import { createClient } from "@supabase/supabase-js";
import { env } from "process";
import prisma from "../utils/prisma";
import Hedder from "../components/Hedder";

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
    const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL,env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    const monument = await prisma.post.findMany({
      orderBy:{
        id:"desc"
      },
      select:{
        id:true,
        name:true,
        image:true,
        autherName:true,
        like:true,
      }
    })
    return {
      props:{
        body:monument
    }
  }
}

export default function Ranking(props:Props) {
    const monumentArray = props.body.sort((a,b)=>{
        return a.like.length > b.like.length ? -1 : 1;
    })
    return (
        <div>
            <Hedder/>
            <div className=" flex flex-col text-center items-center text-lg">
                <div className=" font-bold text-2xl my-4">観光名所ランキング</div>
                <div className=" flex flex-col">
                    {monumentArray.map((value,key)=>{
                        return(
                            <div key={key} className=" flex text-left items-start bg-primary mt-5">
                                <div className=" m-auto px-[2vw] font-bold">{key+1}位</div>
                                <a href={"/"+value.id} className=" sm:w-64 sm:h-[9rem] w-[8rem] h-[4.5rem] relative">
                                    <img src={"https://bwyhjohrujadlhmubmwd.supabase.co/storage/v1/object/public/image/"+value.image} className=' w-full h-full object-contain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'/>
                                </a>
                                <div className=" w-[40vw] m-auto">
                                    <div className=" mb-2 text-xl">{value.name}</div>
                                    <div><span className=" font-bold">作者</span> : {value.autherName}</div>
                                    <div><span className=" font-bold">いいね</span> : {value.like.length.toString()}</div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
import { GetServerSideProps } from "next";
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

export default function Catalog(props:Props) {
    return (
        <div>
            <Hedder/>
            <div className='container mx-auto w-3/5 text-lg'>
              <div className=" text-2xl font-bold my-4 text-center">カタログ</div>
                <div className="grid grid-cols-3 gap-3">
                    {props.body.map((value,index)=>{
                            return(
                                <a href={"/"+value.id} key={index} className="col-span-1 bg-slate-400 bg-opacity-30 h-fit shadow sm:rounded-lg flex flex-col">
                                    {value.image &&(
                                      <div className="w-64 h-32 relative mt-4 mx-auto">
                                        <img className="w-full h-full object-contain" src={"https://bwyhjohrujadlhmubmwd.supabase.co/storage/v1/object/public/image/"+value.image}/>
                                      </div>
                                    )}
                                    <div className=" text-center mt-4 truncate">{value.name}</div>
                                    <div className=" text-center">いいね {value.like.length.toString()}</div>
                                </a>
                            )
                    })}
                </div>
            </div>
        </div>
    )
}
import { createClient } from "@supabase/supabase-js";
import Hedder2 from "../../../components/Hedder2";
import { GetServerSideProps } from "next";
import { env } from "process";
import prisma from "../../../utils/prisma";

export const getServerSideProps:GetServerSideProps = async() =>{
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL,env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const monument = await prisma.townMap2308.findMany({
    orderBy:{
      userName:"desc"
    },
    select:{
      id:true,
      userName:true,
      playerName:true,
      group:true,
      address:true
    }
  })
  return {
    props:{
      body:monument
    }
  }
}

export type Props = {
  body:{
    id:number,
    userName:string,
    playerName:string,
    steamName:string,
    group:string,
    address:string,
    phoneNumber:string,
    description:string,
    SNS:string,
    image:string,
    position:number[],
    UUID:string
  }[],
  imageURL:string
}

export default function Ranking(props:Props) {
  const monumentArray = props.body;
  return (
      <div>
          <Hedder2/>
          <div className=" flex flex-col text-center items-center text-lg">
              <div className=" font-bold text-2xl my-4">タウンページ</div>
              <div className=" flex flex-col">
                  {monumentArray.map((value,key)=>{
                    return(
                      <div key={key} className=" flex text-left items-start mt-5">
                        <a href={"/2308/Townpage/"+value.id} className="mr-4">{value.userName}</a>
                        <div className="mr-4">{value.playerName}</div>
                        <div className="mr-4">{value.group}</div>
                        <div className="mr-4">{value.address}</div>
                      </div>
                    )
                  })}
              </div>
          </div>
      </div>
  )
}
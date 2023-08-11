import { createClient } from "@supabase/supabase-js";
import Hedder2 from "../../../components/Hedder2";
import { GetServerSideProps } from "next";
import { env } from "process";
import prisma from "../../../utils/prisma";
import Link from "next/link";
import { useRouter } from "next/router";

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
  const router = useRouter();
  return (
      <div>
          <Hedder2/>
          <div className=" flex flex-col text-center items-center text-lg">
              <div className=" font-bold text-2xl my-4">タウンページ</div>
              <div className="overflow-x-auto md:w-auto w-11/12">
                <table className="table">
                  <thead>
                    <tr>
                      <th>名前</th>
                      <th>ゲーム内名</th>
                      <th>所属グループ</th>
                      <th>住所</th>
                    </tr>
                  </thead>
                  <tbody>
                  {monumentArray.map((value,key)=>{
                    return(
                      <tr key={key} className="hover" onClick={()=>router.push("./Townpage/"+value.id)}>
                        <th>{value.userName}</th>
                        <td>{value.playerName}</td>
                        <td>{value.group}</td>
                        <td>{value.address}</td>
                      </tr>
                    )
                  })}
                  </tbody>
                </table>
              </div>
          </div>
      </div>
  )
}
import { GetServerSideProps } from "next"
import Hedder from "../../components/Hedder"
import prisma from "../../utils/prisma"
import { useEffect, useState } from "react"

type MemorialArray ={
  id:number
  image:string
  uuid:string|null
}[]

type Props ={
  body:{
    id:number
    image:string
    uuid:string|null
  }[]
}

export const getServerSideProps:GetServerSideProps = async() =>{
    const memorial = await prisma.memorial.findMany({
      orderBy:{
        id:"desc"
      }
    })

    const memorialArray:MemorialArray = [];
    memorial.map((value)=>{
      return value.image.map((v,i)=>{
        if(value.image.length - 1 === i){
          memorialArray.push({
            id:value.id,
            image:v,
            uuid:value.UUID
          })
        }else{
          memorialArray.push({
            id:value.id,
            image:v,
            uuid:null
          })
        }
      })
    })
    return {
      props:{
        body:memorialArray
    }
  }
}

export default function Memorial(props:Props) {
  const [getUUID,setGetUUID] = useState<string>();
  const [deleteId,setDeleteId] = useState<number>();
  useEffect(()=>{
    const currentUUID = localStorage.getItem("UUID")
    if(currentUUID){
      setGetUUID(currentUUID);
    }
  },[])
  async function deleteAction(){
    const res = await fetch("/api/deleteMemorial",{
      method:"POST",
      body:JSON.stringify({
        id:deleteId,
        uuid:localStorage.getItem("UUID")
      })
    })
    const resText = await res.text(); 
    if(resText === "success"){
      location.href = "/Memorial";
    }else{
      console.log(resText)
    }
  }
  return (
    <div>
      <Hedder/>
      <div className=" flex flex-col text-lg text-center items-center">
        <div className=" text-2xl my-4">思い出写真館</div>
        <div className=" flex flex-col justify-center">{props.body.map((value,key)=>{
          let leftOrRight;
          console.log(value)
          if(key % 2 === 0){
            leftOrRight = "text-left"
          }else{
            leftOrRight = "text-right"
          }
          if(value.uuid === getUUID){
            return(
              <div key={key}>
                <img src={value.image} className={` w-[70vw] mb-4 mr-4 inline-block ${leftOrRight}`}/>
                <label className="btn btn-error" htmlFor="my-modal" onClick={()=>setDeleteId(value.id)}>投稿を削除</label>
              </div>
            )
          }else{
            return(
              <div key={key}>
                <img src={value.image} className={` w-[70vw] mb-4 inline-block ${leftOrRight}`}/>
              </div>
            )
          }
        })}</div>
      </div>
      <a href="/MemorialPost" className="btn btn-info lg:btn-lg md:btn-md btn-sm fixed md:top-20 top-10 right-[5vw]">投稿はこちら</a>
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">本当にこの記事を削除しますか？</h3>
          <p className="py-4">この選択は取り消すことが出来ません。</p>
          <div className="modal-action">
            <button className='btn btn-error' onClick={deleteAction}>削除する</button>
            <label htmlFor="my-modal" className="btn">削除しない</label>
          </div>
        </div>
      </div>
    </div>
  )
}
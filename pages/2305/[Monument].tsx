import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import prisma from '../../utils/prisma';
import { Props } from '../../components/PropsType';
import { createClient } from '@supabase/supabase-js';
import { env } from 'process';
import reactStringReplace from 'react-string-replace';
import Hedder from '../../components/Hedder';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL,env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    if (!ctx.params){
        return {
          props: {
            body:undefined
          }
        }
    }
    const monument = await prisma.post.findFirst({
      where:{
        id:Number(ctx.params.Monument)
      },
      select:{
        id:true,
        name:true,
        address:true,
        description:true,
        image:true,
        autherName:true,
        position:true,
        like:true,
        UUID:true
      }
    })
    if(!monument?.image){
      return {
        props:{
          body:monument,
          imageURL:undefined
        }
      }
    }
    return {
      props:{
        body:monument,
        imageURL:supabase.storage.from("image").getPublicUrl(monument?.image).data.publicUrl
    }
  }
}

const Monument = (props:Props) => {
  const {id,name,address,description,image,autherName,position,like,UUID} = props.body
  const [notFound,setNotFound] = useState<string>();
  const [likeLength,setLikeLength] = useState<number>(like.length)
  const [likeBool,setLikeBool] = useState<boolean>(false)
  const [positionXY,setPositionXY] = useState<number[]>([])
  const [deleteBool,setDeleteBool] = useState<boolean>(false)
  const descriptionURL = ()=>{return(<div>{reactStringReplace(description,/(https?:\/\/\S+)/g,(match,i)=>(<img key={i} src={match} className=' max-w-[50%] inline-block mt-2'></img>))}</div>)}
  useEffect(()=>{
    const getUUID = localStorage.getItem("UUID");
    uuidCheck();
    async function uuidCheck(){
      if(!getUUID){
        const uuid = await fetch("/api/UUID",{
          method:"POST",
          body:""
        })
        const resUUID = await uuid.text(); 
        localStorage.setItem("UUID",resUUID);
      }else{
        if(like.includes(getUUID)){
          setLikeBool(true)
        }
        if(UUID === getUUID){
          setDeleteBool(true)
        }
      }
    }
    if(props.body){
      setNotFound("hidden")
    }
    setPositionXY(()=>{
      const element = document.getElementById("map")
      if(element){
        console.log(element.clientWidth,element.clientHeight)
        const x = position[0] * element.clientWidth;
        const y = position[1] * element.clientHeight;
        return [x,y]
      }else{
        return [0,0]
      }
    })
    window.addEventListener("resize",()=>{
      setPositionXY(()=>{
        const element = document.getElementById("map")
        if(element){
          console.log(element.clientWidth,element.clientHeight)
          const x = position[0] * element.clientWidth;
          const y = position[1] * element.clientHeight;
          return [x,y]
        }else{
          return [0,0]
        }
      })
    })
  },[])
  async function likeButton(){
    const result = await fetch("./api/like",{
      method:"POST",
      body:JSON.stringify({
        id:id,
        uuid:localStorage.getItem("UUID")
      })
    })
    const resultText = await result.text();
    if(resultText === "success"){
      setLikeLength(likeLength + 1);
      setLikeBool(true);
    }else if(resultText === "error"){
      console.log("error")
    }else{
      console.log("undefined")
    }
  }
  async function deleteAction(){
    const res = await fetch("/api/delete",{
      method:"POST",
      body:JSON.stringify({
        id:id,
        uuid:localStorage.getItem("UUID")
      })
    })
    const resText = await res.text(); 
    if(resText === "success"){
      location.href = "/";
    }else{
      console.log(resText)
    }
  }
  return(
    <div>
      <Hedder/>
      <div className={`${notFound} fixed bg-base-100 w-full h-full text-lg`}>
        <div>404 notFound</div>
      </div>
      <div className=' flex flex-col text-center items-center'>
        <div className=' text-xl m-4 font-bold'>{name}</div>
        <div className=' flex lg:flex-row flex-col'>
          <div className=' 2xl:w-[64rem] 2xl:h-[36rem] w-[70vw] h-[39vw] bg-base-200 relative'>
            <img src={props.imageURL} className=' w-full h-full object-contain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'/>
          </div>
          <div>
            <div className=' 2xl:w-[24rem] 2xl:h-[24rem] lg:w-[18rem] lg:h-[18rem] w-[35vw] h-[35vw] bg-secondary relative mx-auto'>
              <Image src={"/pin_red.png"} alt="" width={30} height={30} className=" absolute z-10" 
              style={{top:positionXY[1]-25+"px",left:positionXY[0]-14+"px"}}/>
              <Image src="/map.png" alt="" width={384} height={384} id='map'/>
            </div>
            <div className=' mb-2'><span className=' font-bold'>制作者</span>:{autherName}</div>
            <div className=' mb-2'><span className=' font-bold'>住所</span>:{address}</div>
            <div className=' flex justify-center'>
              {likeBool
                ?<button className='btn btn-success no-animation'>いいね済み {likeLength.toString()}</button>
                :<button className='btn btn-secondary' onClick={likeButton}>いいね {likeLength.toString()}</button>}
              {deleteBool&&<label htmlFor="my-modal" className='btn btn-error ml-3'>!記事を消去!</label>}
            </div>
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
        </div>
        <div className=' mt-4 font-bold text-xl'>説明</div>
        <div className='whitespace-pre-wrap break-words mt-2'>{descriptionURL()}</div>
        <div className=' h-28'></div>
      </div>
    </div>
  )
};

export default Monument;
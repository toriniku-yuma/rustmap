import Image from "next/image"
import { useRouter } from "next/router";
import { useEffect,useRef,useState } from "react"
import { gsap } from "gsap";
import Hedder2 from "../../../components/Hedder2";
import { GetServerSideProps } from "next";
import { createClient } from "@supabase/supabase-js";
import { env } from "process";
import prisma from "../../../utils/prisma";
import { Props } from "../../../components/PropsType_Townpage2308";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL,env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    if (ctx.query.mode !== "edit"||!ctx.query.id){
      return {
        props: {
          body:null
        }
      }
    }
    const monument = await prisma.townMap2308.findFirst({
      where:{
        id:Number(ctx.query.id)
      },
      select:{
        id:true,
        userName:true,
        playerName:true,
        steamName:true,
        group:true,
        address:true,
        phoneNumber:true,
        description:true,
        SNS:true,
        image:true,
        position:true,
        UUID:true
      }
    })
    if(monument?.image === ""){
      return {
        props:{
          body:monument,
          imageURL:null
        }
      }
    }
    return {
      props:{
        body:monument,
        imageURL:supabase.storage.from("image").getPublicUrl("/TownMap2308/"+monument?.image).data.publicUrl
    }
  }
}

export default function Post(props:Props) {
    const postData = props.body
    const [position,setPosition] = useState<number[]|undefined>(undefined);
    const [userName,setUserName] = useState<string>("");
    const [steamName,setSteamName] = useState<string>("");
    const [address,setAddress] = useState<string>("");
    const [phoneNumber,setPhoneNumber] = useState<string>("");
    const [playerName,setPlayerName] = useState<string>("");
    const [group,setGroup] = useState<string>("");
    const [monumentPhoto,setMonumentPhoto] = useState<File>();
    const [description,setDescription] = useState<string>("");
    const [SNS,setSNS] = useState<string>("");
    const refUserName = useRef<HTMLInputElement>(null);
    const refSteamName = useRef<HTMLInputElement>(null);
    const refAddress = useRef<HTMLInputElement>(null);
    const refPhoneNumber = useRef<HTMLInputElement>(null);
    const refPlayerName = useRef<HTMLInputElement>(null);
    const refGroup = useRef<HTMLInputElement>(null);
    const refDescription = useRef<HTMLTextAreaElement>(null);
    const refSNS = useRef<HTMLTextAreaElement>(null);
    const [errorMessage,setErrorMessage] = useState<string>();
    const [height,setHeight] = useState<number>();
    const [rendering,setRendering] = useState<number>();
    const [editBool,setEditBool] = useState<boolean>(false);
    const [imageBool,setImageBool] = useState<boolean>(false);
    const deleteCheck = useRef<HTMLInputElement>(null);
    let positionSetX = 0;
    let positionSetY = 0;
    let [subPosition,setSubPosition] = useState<number[]>([]);
    useEffect(()=>{
      console.log(props)
      const element = document.getElementById("map");
      setHeight(window.innerHeight);
      if(element){
        element.addEventListener('mousemove', (e)=>{
          setSubPosition([(e.offsetX),(e.offsetY)]);
        })
      }
      window.addEventListener("resize",()=>{
        setRendering(Math.random())
      })
      if(props.body&&localStorage.getItem('UUID') === props.body.UUID){
        console.log("test")
        setUserName(postData.userName);
        setPlayerName(postData.playerName);
        setSteamName(postData.steamName);
        setGroup(postData.group)
        setAddress(postData.address);
        setPhoneNumber(postData.phoneNumber);
        setDescription(postData.description);
        setSNS(postData.SNS);
        setEditBool(true);
        if(postData.image){
          setImageBool(true);
        }
        if(element){
          console.log("test2")
          setPosition([postData.position[0],postData.position[1]]);
          console.log(postData.position)
          console.log([postData.position[0] * element.clientWidth,postData.position[1] * element.clientHeight]);
        } 
      }
    },[])
    useEffect(()=>{
      if(errorMessage){
        let tl = gsap.timeline();
        tl.to("#error",{top:window.innerHeight-(window.innerHeight/5),duration:1,ease:"power4.out"});
        tl.to("#error",{duration:3});
        tl.to("#error",{top:window.innerHeight,duration:1,ease:"power4.out",onComplete:()=>setErrorMessage(undefined)});
      }
    },[errorMessage])
    useEffect(()=>{
      if(editBool){
        if(refUserName.current&&refSNS.current&&refDescription.current){
          refUserName.current.setAttribute("value",postData.userName);
          refPlayerName.current?.setAttribute("value",postData.playerName);
          refSteamName.current?.setAttribute("value",postData.steamName);
          refAddress.current?.setAttribute("value",postData.address);
          refPhoneNumber.current?.setAttribute("value",postData.phoneNumber);
          refSNS.current.value = postData.SNS;
          refDescription.current.value = postData.description;
        }
      }
    },[refUserName.current])
    if(position){
      const element = document.getElementById("map");
      if(element){
        positionSetX = position[0] * element.clientWidth;
        positionSetY = position[1] * element.clientHeight;
      }
    }
    
    function handleClick(e:React.MouseEvent){
        const element = e.target as HTMLDivElement;
        setPosition([subPosition[0] / element.clientWidth,subPosition[1] / element.clientHeight]);
        console.log([subPosition[0] / element.clientWidth,subPosition[1] / element.clientHeight])
    }

    async function postClick(){
      const fd = new FormData;
      if(editBool){
        fd.append("update",postData.id.toString());
      }
      fd.append("userName",userName);
      if(userName === ""){
        setErrorMessage("名前が入っていません")
        console.log("not monumentName")
        return
      }
      fd.append("playerName",playerName);
      if(playerName === ""){
        setErrorMessage("ゲーム内での名前が入っていません")
        return
      }
      fd.append("steamName",steamName);
      if(steamName === ""){
        setErrorMessage("Steam64IDが入っていません")
        return
      }
      if(group === ""){
        fd.append("group","")
      }else{
        fd.append("group",group);
      }
      if(address === ""){
        fd.append("address","")
      }else{
        fd.append("address",address);
      }
      if(phoneNumber === ""){
        fd.append("phoneNumber","")
      }else{
        fd.append("phoneNumber",phoneNumber);
      }
      if(imageBool){
        fd.append("image",postData.image)
      }else{
        if(monumentPhoto){
          if(monumentPhoto.type.match("image.*")){
            fd.append("image",monumentPhoto)
          }else{
            setErrorMessage("ファイル形式が画像ではありません")
            return
          }
        }else{
          fd.append("image","")
        }
      }
      fd.append("description",description);
      if(description === ""){
        setErrorMessage("説明文が入っていません")
        return
      }
      if(SNS === ""){
        fd.append("SNS","")
      }else{
        fd.append("SNS",SNS);
      }
      fd.append("position",JSON.stringify(position));
      if(!position){
        setErrorMessage("座標が設定されていません")
        return
      }
      const uuid = localStorage.getItem("UUID");
      fd.append("UUID",JSON.stringify({value:uuid}));
      const res = await fetch("../../api/2308/postTwonpage",{
        method:"POST",
        body:fd
      })
      const resId = JSON.parse(await res.text())
      if(resId.type === "success"){
        if(!localStorage.getItem('UUID')){
          localStorage.setItem('UUID', resId.UUID);
        }
        location.href = "/2308/Townpage/"+ resId.body;
      }else if(resId.type === "error"){
        setErrorMessage(resId.body)
        console.log(resId.type,resId.body)
      }
    }

    async function deleteAction(){
      const res = await fetch("../../api/2308/delete",{
        method:"POST",
        body:JSON.stringify({
          deleteType:1,
          id:postData.id,
          uuid:localStorage.getItem("UUID")
        })
      })
      const resText = await res.text(); 
      if(resText === "success"){
        setImageBool(false);
        if(deleteCheck.current){
          deleteCheck.current.checked = false;
        }
      }else{
        console.log(resText)
      }
    }
    return (
      <div>
        <Hedder2/>
        <div className=" flex flex-col text-center items-center text-lg">
            <div className="text-2xl my-4">タウンページ登録フォーム{editBool&&"（Editモード）"}</div>
            <div className="form-control w-full max-w-md">
              <label className="label">
                <span className="label-text text-lg">名前 ※</span>
              </label>
                <input type="text" ref={refUserName} placeholder="" className="input input-bordered w-full max-w-md" 
                onChange={(e)=>setUserName(e.target.value)}/>
            </div>
            <div className="form-control w-full max-w-md">
              <label className="label">
                <span className="label-text text-lg">ゲーム内での名前（Steamアカウント名）※</span>
              </label>
                <input type="text" ref={refPlayerName} placeholder="" className="input input-bordered w-full max-w-md" 
                onChange={(e)=>setPlayerName(e.target.value)}/>
            </div>
            <div className="form-control w-full max-w-md">
              <label className="label">
                <span className="label-text text-lg">ID（Steam64ID）※</span>
              </label>
              <label className="label">
                <span className="label-text underline"><a href="https://volx.jp/steam-id-steamid64-check" target="_blank" rel="noopener">詳しくはこちら</a></span>
              </label>
                <input type="text" ref={refSteamName} placeholder="" className="input input-bordered w-full max-w-md" 
                onChange={(e)=>setSteamName(e.target.value)}/>
            </div>
            <div className="form-control w-full max-w-md">
              <label className="label">
                <span className="label-text text-lg">所属グループ</span>
              </label>
                <input type="text" ref={refAddress} placeholder="" className="input input-bordered w-full max-w-md" 
                onChange={(e)=>setGroup(e.target.value)}/>
            </div>
            <div className="form-control w-full max-w-md">
              <label className="label">
                <span className="label-text text-lg">住所</span>
              </label>
                <input type="text" ref={refAddress} placeholder="" className="input input-bordered w-full max-w-md" 
                onChange={(e)=>setAddress(e.target.value)}/>
            </div>
            <div className="form-control w-full max-w-md">
              <label className="label">
                <span className="label-text text-lg">電話番号</span>
              </label>
                <input type="text" ref={refPhoneNumber} placeholder="" className="input input-bordered w-full max-w-md" 
                onChange={(e)=>setPhoneNumber(e.target.value)}/>
            </div>
            <div className="form-control w-full max-w-md">
              <label className="label">
                <span className="label-text text-lg">自宅紹介写真（2MBまで）</span>
              </label>
              {imageBool
                ?<div>画像がアップロードされています<label htmlFor="my-modal" className='btn btn-error ml-3'>!記事を消去!</label></div>
                :<input type="file" className="file-input file-input-bordered w-full max-w-md" accept="image/*"
                onChange={(e)=>
                {
                  if(e.target.files){
                    setMonumentPhoto(e.target.files[0])
                  }
                }}/>
              }
            </div>
            <div className="form-control w-full max-w-2xl">
              <label className="label">
                <span className="label-text text-lg">SNSアカウント（DiscordやX（旧Twitter）、配信場所など）</span>
              </label>
                <textarea placeholder="" ref={refSNS} className="textarea textarea-bordered h-36 w-full max-w-2xl" 
                onChange={(e)=>setSNS(e.target.value)}/>
            </div>
            <div className="form-control w-full max-w-2xl">
              <label className="label">
                <span className="label-text text-lg">自己紹介（外部にアップロードした画像URLを入れると画像が表示できます） ※</span>
              </label>
                <textarea placeholder="" ref={refDescription} className="textarea textarea-bordered h-36 w-full max-w-2xl" 
                onChange={(e)=>setDescription(e.target.value)}/>
            </div>
            <div className=" text-xl my-4">マップ座標 ※</div>
            <div className="relative">
                {position&&<Image src={"/pin_yellow.png"} alt="" width={30} height={30} className=" absolute" 
                style={{top:positionSetY-25+"px",left:positionSetX-14+"px"}}/>}
                <Image src="/2308/map.png" alt="" width={1200} height={1200}
                onClick={handleClick} id="map"/>
            </div>
            <div id="error" className="fixed alert alert-error shadow-lg w-1/3 left-1/2 -translate-x-1/2" style={{
              top:height + "px"
            }}>
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className=" font-bold text-xl">エラー {errorMessage}</span>
              </div>
            </div>
        </div>
        <button className="btn btn-accent btn-lg fixed bottom-10 right-24" onClick={postClick}>投稿する！</button>
        <input type="checkbox" ref={deleteCheck} id="my-modal" className="modal-toggle" />
          <div className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">本当にこの画像を削除しますか？</h3>
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
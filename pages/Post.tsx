import { GetServerSideProps } from "next"
import Image from "next/image"
import { Props } from "../components/PropsType"
import { useEffect, useRef, useState } from "react"
import Hedder from "../components/Hedder";
import { gsap } from "gsap";

export default function Post() {
    const [position,setPosition] = useState<number[]|undefined>(undefined);
    const [monumentName,setMonumentName] = useState<string>("");
    const [address,setAddress] = useState<string>("");
    const [authorName,setAutherName] = useState<string>("");
    const [monumentPhoto,setMonumentPhoto] = useState<File>();
    const [monumentDescription,setMonumentDescription] = useState<string>("");
    const [errorMessage,setErrorMessage] = useState<string>();
    const [height,setHeight] = useState<number>();
    const [rendering,setRendering] = useState<number>();
    let positionSetX = 0;
    let positionSetY = 0;
    let [subPosition,setSubPosition] = useState<number[]>([]);
    useEffect(()=>{
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
    },[])
    useEffect(()=>{
      if(errorMessage){
        let tl = gsap.timeline();
        tl.to("#error",{top:window.innerHeight-(window.innerHeight/5),duration:1,ease:"power4.out"});
        tl.to("#error",{duration:3});
        tl.to("#error",{top:window.innerHeight,duration:1,ease:"power4.out",onComplete:()=>setErrorMessage(undefined)});
      }
    },[errorMessage])
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
      fd.append("name",monumentName);
      if(monumentName === ""){
        setErrorMessage("観光地名が入っていません")
        console.log("not monumentName")
        return
      }
      fd.append("autherName",authorName);
      if(authorName === ""){
        setErrorMessage("作者名が入っていません")
        return
      }
      fd.append("address",address);
      if(address === ""){
        setErrorMessage("住所が入っていません")
        return
      }
      if(monumentPhoto){
        if(monumentPhoto.type.match("image.*")){
          fd.append("image",monumentPhoto)
        }else{
          setErrorMessage("ファイル形式が画像ではありません")
          return
        }
      }else{
        setErrorMessage("画像が入っていません")
        return
      }
      fd.append("description",monumentDescription);
      if(monumentDescription === ""){
        setErrorMessage("説明文が入っていません")
        return
      }
      fd.append("position",JSON.stringify(position));
      if(!position){
        setErrorMessage("座標が設定されていません")
        return
      }
      const uuid = localStorage.getItem("UUID");
      fd.append("UUID",JSON.stringify({value:uuid}));
      const res = await fetch("./api/post",{
        method:"POST",
        body:fd
      })
      const resId = JSON.parse(await res.text())
      if(resId.type === "success"){
        if(!localStorage.getItem('UUID')){
          localStorage.setItem('UUID', resId.UUID);
        }
        location.href = "/"+ resId.body;
      }else if(resId.type === "error"){
        setErrorMessage(resId.body)
        console.log(resId.type,resId.body)
      }
    }
    return (
      <div>
        <Hedder/>
        <div className=" flex flex-col text-center items-center text-lg">
            <div className="text-2xl my-4">Rust観光地投稿フォーム</div>
            <div className="form-control w-full max-w-md">
              <label className="label">
                <span className="label-text text-lg">観光地名</span>
              </label>
                <input type="text" placeholder="" className="input input-bordered w-full max-w-md" 
                onChange={(e)=>setMonumentName(e.target.value)}/>
            </div>
            <div className="form-control w-full max-w-md">
              <label className="label">
                <span className="label-text text-lg">制作者名</span>
              </label>
                <input type="text" placeholder="" className="input input-bordered w-full max-w-md" 
                onChange={(e)=>setAutherName(e.target.value)}/>
            </div>
            <div className="form-control w-full max-w-md">
              <label className="label">
                <span className="label-text text-lg">住所</span>
              </label>
                <input type="text" placeholder="" className="input input-bordered w-full max-w-md" 
                onChange={(e)=>setAddress(e.target.value)}/>
            </div>
            <div className="form-control w-full max-w-md">
              <label className="label">
                <span className="label-text text-lg">観光地紹介写真（2MBまで）</span>
              </label>
                <input type="file" className="file-input file-input-bordered w-full max-w-md" accept="image/*"
                onChange={(e)=>
                {
                  if(e.target.files){
                    setMonumentPhoto(e.target.files[0])
                  }
                }}/>
            </div>
            <div className="form-control w-full max-w-2xl">
              <label className="label">
                <span className="label-text text-lg">観光地説明（外部にアップロードした画像URLを入れると画像が表示できます）</span>
              </label>
                <textarea placeholder="" className="textarea textarea-bordered h-36 w-full max-w-2xl" 
                onChange={(e)=>setMonumentDescription(e.target.value)}/>
            </div>
            <div className=" text-xl my-4">マップ座標</div>
            <div className="relative">
                {position&&<Image src={"/pin_yellow.png"} alt="" width={30} height={30} className=" absolute" 
                style={{top:positionSetY-25+"px",left:positionSetX-14+"px"}}/>}
                <Image src="/map.png" alt="" width={1200} height={1200}
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
      </div>
    )
  }
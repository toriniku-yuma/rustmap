import { useEffect, useRef, useState } from "react"
import Hedder from "../components/Hedder";
import { gsap } from "gsap";

export default function Post() {
    const [memorialURL,setMemorialURL] = useState<string>("");
    const [errorMessage,setErrorMessage] = useState<string>();
    const [height,setHeight] = useState<number>();
    useEffect(()=>{
      setHeight(window.innerHeight);
    },[])
    useEffect(()=>{
      if(errorMessage){
        let tl = gsap.timeline();
        tl.to("#error",{top:window.innerHeight-(window.innerHeight/5),duration:1,ease:"power4.out"});
        tl.to("#error",{duration:3});
        tl.to("#error",{top:window.innerHeight,duration:1,ease:"power4.out",onComplete:()=>setErrorMessage(undefined)});
      }
    },[errorMessage])

    async function postClick(){
      const fd = {};
      const memorialURLFind = memorialURL.match(/(https?:\/\/\S+)/g);
      if(!memorialURLFind){
        setErrorMessage("画像URLがありません")
        return
      }
      const uuid = localStorage.getItem("UUID");
      const res = await fetch("./api/memorialPost",{
        method:"POST",
        body:JSON.stringify({
          image:memorialURLFind,
          uuid:uuid
        })
      })
      const resId = JSON.parse(await res.text())
      if(resId.type === "success"){
        if(!localStorage.getItem('UUID')){
          localStorage.setItem('UUID', resId.UUID);
        }
        location.href = "/Memorial";
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
            <div className="form-control w-full max-w-2xl">
              <label className="label">
                <span className="label-text text-lg">観光地説明（外部にアップロードした画像URLを入れると画像が表示できます）</span>
              </label>
                <textarea placeholder="" className="textarea textarea-bordered h-36 w-full max-w-2xl" 
                onChange={(e)=>setMemorialURL(e.target.value)}/>
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
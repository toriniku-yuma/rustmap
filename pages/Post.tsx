import { GetServerSideProps } from "next"
import Image from "next/image"
import { Props } from "../components/PropsType"
import { useEffect, useRef, useState } from "react"
import Hedder from "../components/Hedder";

export default function Post() {
    const [position,setPosition] = useState<number[]|undefined>(undefined);
    const [monumentName,setMonumentName] = useState<string>("");
    const [address,setAddress] = useState<string>("");
    const [authorName,setAutherName] = useState<string>("");
    const [monumentPhoto,setMonumentPhoto] = useState<File>();
    const [monumentDescription,setMonumentDescription] = useState<string>("");
    let positionSetX = 0;
    let positionSetY = 0;
    let [subPosition,setSubPosition] = useState<number[]>([]);
    useEffect(()=>{
      const element = document.getElementById("map");
      if(element){
        element.addEventListener('mousemove', (e)=>{
          setSubPosition([(e.offsetX),(e.offsetY)]);
        })
      }
    },[])
    useEffect(()=>{

    },[position])
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
      fd.append("address",address);
      fd.append("autherName",authorName);
      fd.append("description",monumentDescription);
      fd.append("position",JSON.stringify(position));
      if(monumentPhoto){
        fd.append("image",monumentPhoto)
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
        console.log(resId.type,resId.body)
      }
    }
    return (
      <div>
        <Hedder/>
        <div className=" flex flex-col text-center items-center">
            <div className="">Rust観光地投稿フォーム</div>
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
                <input type="file" placeholder="" className="file-input file-input-bordered w-full max-w-md" 
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
            <div className=" text-lg">マップ座標</div>
            <div className="relative">
                {position&&<Image src={"/pin_yellow.png"} alt="" width={30} height={30} className=" absolute z-10" 
                style={{top:positionSetY-25+"px",left:positionSetX-14+"px"}}/>}
                <Image src="/map.png" alt="" width={1200} height={1200}
                onClick={handleClick} id="map"/>
            </div>
        </div>
        <button className="btn btn-accent btn-lg fixed bottom-10 right-24" onClick={postClick}>投稿する！</button>
      </div>
    )
  }
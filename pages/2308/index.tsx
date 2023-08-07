import Image from "next/image"
import Hedder2 from "../../components/Hedder2"

export default function Home() {
  return (
    <div>
      <Hedder2/>
      <div className=" flex flex-col text-center items-center text-lg">
        <div className=" text-3xl my-4">Rustスラム街サーバー 2308</div>
        <img src="/ロゴ.jpg" className=" w-[30rem]"/>
        <div className=" flex md:flex-row flex-col mt-4">
          <a href="/2308/Map" className=" mr-4">マップ</a>
          <a href="/2308/Ranking" className=" mr-4">人気ランキング</a>
          <a href="/2308/Catalog" className=" mr-4">カタログ</a>
          <a href="/2308/Post" className=" mr-4">投稿フォーム</a>
        </div>
      </div>
    </div>
  )
}
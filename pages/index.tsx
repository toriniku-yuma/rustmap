import Image from "next/image"
import Hedder from "../components/Hedder"

export default function Home() {
  return (
    <div>
      <Hedder/>
      <div className=" flex flex-col text-center items-center text-lg">
        <div className=" text-3xl my-4">Rustスラム街サーバー観光マップるるぶ</div>
        <img src="/ロゴ.jpg" className=" w-[30rem]"/>
        <div className=" flex mt-4">
          <a href="/Map" className=" mr-4">マップ</a>
          <a href="/Ranking" className=" mr-4">人気ランキング</a>
          <a href="/Catalog" className=" mr-4">カタログ</a>
          <a href="/Post" className=" mr-4">投稿フォーム</a>
        </div>
      </div>
    </div>
  )
}
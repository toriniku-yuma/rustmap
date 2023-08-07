import Image from "next/image"
import Hedder from "../../components/Hedder"

export default function Home() {
  return (
    <div>
      <Hedder/>
      <div className=" flex flex-col text-center items-center text-lg">
        <div className=" text-3xl my-4">Rustスラム街サーバー観光マップるるぶ</div>
        <img src="/ロゴ.jpg" className=" w-[30rem]"/>
        <div className=" flex md:flex-row flex-col mt-4">
          <a href="/2305/Map" className=" mr-4">マップ</a>
          <a href="/2305/Ranking" className=" mr-4">人気ランキング</a>
          <a href="/2305/Catalog" className=" mr-4">カタログ</a>
          <a href="/2305/Memorial" className=" mr-4">思い出写真館</a>
          <a href="/2305/Post" className=" mr-4">投稿フォーム</a>
        </div>
      </div>
    </div>
  )
}
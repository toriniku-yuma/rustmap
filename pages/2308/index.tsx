import Image from "next/image"
import Hedder2 from "../../components/Hedder2"
import Link from "next/link"

export default function Home() {
  return (
    <div>
      <Hedder2/>
      <div className=" flex flex-col text-center items-center text-lg">
        <div className=" text-3xl my-4">Rustスラム街サーバー 2308</div>
        <img src="/ロゴ.jpg" className=" w-[30rem]"/>
        <div className=" flex flex-col mt-4">
          <div>
            <div className=" underline text-2xl"><a href="https://github.com/toriniku-yuma/rustmap/wiki/%E3%82%B9%E3%83%A9%E3%83%A0Rust%E3%82%B5%E3%83%BC%E3%83%90%E3%83%BC2308%E3%83%AB%E3%83%BC%E3%83%AB%E3%83%96%E3%83%83%E3%82%AF" target="_blank" rel="noopener">ルールブック</a></div>
            <div className=" mb-4">少なくとも、クイックスタートまでは必ず読んでください</div>
          </div>
          <div>タウンページ</div>
            <div>
              <Link href="/2308/Townpage" legacyBehavior>
                <a className=" mr-4 underline">一覧</a>
              </Link>
              <Link href="/2308/Townpage/Post" legacyBehavior>
                <a className=" underline">登録フォーム</a>
              </Link>
            </div>
            <div className=" h-24"></div>
        </div>
      </div>
    </div>
  )
}
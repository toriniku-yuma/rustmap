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
          <div>タウンページ</div>
            <div>
              <Link href="/2308/Townpage" legacyBehavior>
                <a className=" mr-4 underline">一覧</a>
              </Link>
              <Link href="/2308/Townpage/Post" legacyBehavior>
                <a className=" underline">登録フォーム</a>
              </Link>
            </div>
        </div>
      </div>
    </div>
  )
}
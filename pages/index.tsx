export default function Home() {
  return (
    <div>
      <div className=" flex flex-col text-center items-center text-lg">
        <div className=" text-3xl my-4">Rustスラム街サーバー</div>
        <img src="/ロゴ.jpg" className=" w-[30rem]"/>
        <div className=" flex md:flex-row flex-col mt-4">
          <a href="/2308" className=" mr-4 text-4xl">現在開催中のサーバー</a>
          <a href="/2305" className=" mr-4">23年5月開催のアーカイブ</a>
        </div>
      </div>
    </div>
  )
}
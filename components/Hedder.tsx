import { useEffect } from "react";

export default function Hedder() {
    return (
        <div>
            <div className=" bg-base-300 flex md:justify-between justify-end md:text-base text-xs" id="hedder">
                <div className="md:block hidden">Rustスラム街サーバー観光マップるるぶ</div>
                <div>
                    <a href="/" className=" mr-4">トップページ</a>
                    <a href="/Map" className=" mr-4">マップ</a>
                    <a href="/Ranking" className=" mr-4">人気ランキング</a>
                    <a href="/Catalog" className=" mr-4">カタログ</a>
                    <a href="/Post" className=" mr-4">投稿フォーム</a>
                </div>
            </div>
        </div>
    )
}
export default function Hedder2() {
    return (
        <div>
            <div className=" bg-base-300 flex md:justify-between justify-end md:text-base text-xs" id="hedder">
                <div className="md:block hidden">Rustスラム街サーバー観光マップるるぶ</div>
                <div>
                    <a href="/2305" className=" mr-4 md:before:content-['トップページ'] before:content-['トップ']"></a>
                    <a href="/2305/Map" className=" mr-4 md:before:content-['マップ'] before:content-['マップ']"></a>
                    <a href="/2305/Ranking" className=" mr-4 md:before:content-['人気ランキング'] before:content-['ランキング']"></a>
                    <a href="/2305/Catalog" className=" mr-4 md:before:content-['カタログ'] before:content-['カタログ']"></a>
                    <a href="/2305/Memorial" className=" mr-4 md:before:content-['思い出写真館'] before:content-['思い出写真館']"></a>
                    <a href="/2305/Post" className=" mr-4 md:before:content-['投稿フォーム'] before:content-['投稿']"></a>
                </div>
            </div>
        </div>
    )
}
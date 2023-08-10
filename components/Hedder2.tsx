import Link from "next/link";

export default function Hedder2() {
    return (
        <div>
            <div className="navbar bg-base-300 rounded-box">
                <div className="flex-1 px-2 lg:flex-none">
                    <a className="text-lg font-bold">SLUM RUST</a>
                </div>
                <div className="flex justify-end flex-1 px-2">
                    <div className="flex items-stretch">
                        <Link href="/2308" legacyBehavior>
                            <a className="btn btn-ghost rounded-btn">Top</a>
                        </Link>
                        <details className="dropdown dropdown-end">
                            <summary className="btn btn-circle swap swap-rotate">
                                <input type="checkbox" />
                                {/* hamburger icon */}
                                <svg className="swap-off fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" /></svg>
                                {/* close icon */}
                                <svg className="swap-on fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49"/></svg>
                            </summary>
                            <ul className="menu dropdown-content z-[1] p-2 shadow bg-base-300 rounded-box w-52 mt-4">
                                <li>
                                    <Link href="/2308" legacyBehavior>
                                        <a>トップページ</a>
                                    </Link>
                                </li>
                                <li className=" pl-4 py-2 text-neutral-500">タウンページ</li>
                                <li className=" pl-9">
                                    <Link href="/2308/Townpage" legacyBehavior>
                                        <a>一覧</a>
                                    </Link>
                                </li>
                                <li className=" pl-9">
                                    <Link href="/2308/Townpage/Post" legacyBehavior>
                                        <a>登録フォーム</a>
                                    </Link>
                                </li>
                            </ul>
                        </details>
                    </div>
                </div>
            </div>
        </div>
    )
}
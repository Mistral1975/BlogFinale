"use client";

import Link from "next/link";
import PostDate from "./PostDate";

export const ListItem = ({ item, id }) => {
    
    return (
        <>
            {/* <!-- SINGOLO ARTICOLO --> */}
            <li className="py-12">
                <article>
                    <div className="space-y-2 xl:grid xl:grid-cols-5 items-start xl:space-y-0">
                        <div className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                            <time datetime={new Date(item.createdAt).toLocaleDateString()}><PostDate date={item.createdAt} format="short" /></time>
                        </div>
                        {item.imageUrl &&
                            <img src={item.imageUrl} alt={item.title} className="w-full h-auto -mx-6" />
                        }
                        {!item.imageUrl &&
                            <div></div>
                        }
                        <div className="space-y-5 xl:col-span-3">
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold leading-8 tracking-tight">
                                        <Link href={`/posts/${item._id}`} className="text-gray-900 dark:text-gray-100">{item.title}</Link>
                                    </h2>
                                    <div className="flex flex-wrap">
                                        {item.tags.map(tag => (
                                            <Link key={tag} href={`/tags/${tag}`} className="mr-3 text-sm font-medium uppercase text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">{tag}</Link>
                                        )).reduce((prev, curr) => [prev, ' ', curr])}
                                    </div>
                                </div>
                                <div className="prose max-w-none text-gray-500 dark:text-gray-400">{item.description.substring(0, 100)}...</div>
                            </div>
                            <div className="text-base font-medium leading-6">
                                <Link href={`/posts/${item._id}`} className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">Read more →</Link>
                            </div>
                        </div>
                    </div>
                </article>
            </li>
            {/* <!-- FINE SINGOLO ARTICOLO --> */}
        </>
    );
};
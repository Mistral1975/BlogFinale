// app/layouts/ListLayoutWithTags.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux"
import Link from 'next/link';
import { setList } from '../store/postsSlice';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TagsOverview from '../components/TagsOverview';
import { useParams } from "next/navigation";
import PostDate from '../components/PostDate';
import { usePathname } from 'next/navigation';


const ListLayoutWithTags = () => {

  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const postsList = useSelector(state => state.postblog.postsList);
  const params = useParams();
  const currentTag = params.tag;
  const pathname = usePathname(); // Ottieni il percorso corrente

  let displayPosts = [];

  useEffect(() => {
    fetch(`http://localhost:8000/list`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `bearer ${user.accessToken}`
      },
    }).then(async res => {
      const jsonRes = await res.json();
      dispatch(setList(jsonRes));
    }).catch(error => {
      console.error('Errore nel recuperare i post per tag:', error);
    })
  }, [currentTag, dispatch]);

  if (pathname === "/blog") {
    //console.log('Percorso /blog soddisfatto');
    displayPosts = postsList.length ?
      postsList.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Ordina per data di creazione (discendente)
      : [];
  } else {
    //console.log('Condizione tag !== "/blog" soddisfatta', currentTag);

    displayPosts = postsList.length ?
      postsList.filter((post) => post.tags.includes(currentTag))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Ordina per data di creazione (discendente)
      : [];
  }

  console.log("displayPosts -------->>>>>>>>>>> ", displayPosts)

  return (
    <>
      <Header />

      <main>
        <div>
          <div className="pb-6 pt-6">
            <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:hidden sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
              {currentTag}</h1>
          </div>
          <div className="flex sm:space-x-24">
            <div className="hidden h-full max-h-screen min-w-[280px] max-w-[280px] flex-wrap overflow-auto rounded bg-gray-50 pt-5 shadow-md dark:bg-gray-900/70 dark:shadow-gray-800/40 sm:flex">
              <div className="px-6 py-4">
                {pathname === '/blog' ? (
                  <h3 className="font-bold uppercase text-primary-500">All Posts</h3>
                ) : (
                  <Link className="font-bold uppercase text-gray-700 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500"
                    href="/blog">All Posts</Link>
                )}
                <TagsOverview />
              </div>
            </div>
            <div>
              <ul className='divide-y divide-gray-200 dark:divide-gray-700'>
                {/* <!-- SINGOLO ARTICOLO --> */}
                {displayPosts.map(post => (
                  <li key={post._id} className="py-5">
                    <article className="flex flex-col space-y-2 xl:space-y-0 ">
                      <div className="space-y-3 xl:grid xl:grid-cols-4 items-start xl:space-y-0">
                      {post.imageUrl &&
                            <img src={post.imageUrl} alt={post.title} className="w-full h-auto my-1 " />
                          }
                          {!post.imageUrl &&
                            <div></div>
                        }
                        <div className="xl:col-span-3 ml-3">
                          <h2 className="text-2xl font-bold leading-8 tracking-tight">
                            <Link href={`/posts/${post._id}`} className="text-gray-900 dark:text-gray-100">{post.title}</Link>
                          </h2>
                          <div className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">                          
                            <time datetime={new Date(post.createdAt).toLocaleDateString()}>
                            di {post.userId.displayName} — <PostDate date={post.createdAt} format="short" />
                            </time>
                          </div>
                          <div className="prose max-w-none text-gray-500 dark:text-gray-400">{post.description.substring(0, 250)}...</div>
                          <div className="flex flex-wrap">
                            {post.tags.map(tag => (
                              <Link key={tag} href={`/tags/${tag}`} className="mr-3 text-sm font-medium uppercase text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">{tag}</Link>
                            )).reduce((prev, curr) => [prev, ' ', curr])}
                          </div>
                        </div>
                      </div>
                    </article>
                  </li>
                ))}
                {/* <!-- FINE SINGOLO ARTICOLO --> */}
              </ul>


              {/*  {pagination && pagination.totalPages > 1 && (
                <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
              )} */}



            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default ListLayoutWithTags;
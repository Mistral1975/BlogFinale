// app/layouts/SinglePostLayout.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Link from 'next/link';
import { setList, deletePost } from '../store/postsSlice';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useRouter, useParams } from "next/navigation";
import PostDate from '../components/PostDate';
//import Image from '../components/Image';
import Avatar from '../components/Avatar';
import TagsOverviewSinglePost from '../components/TagsOverviewSinglePost';
import Comments from '../components/Comments';
import EditPostForm from '../components/EditPostForm';

const SinglePostLayout = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const router = useRouter(); // Usa il router di Next.js
  const user = useSelector(state => state.user);
  const loading = useSelector((state) => state.postblog.loading);
  const error = useSelector((state) => state.postblog.error);
  const postsList = useSelector(state => state.postblog.postsList);
  const singlePost = postsList.find(post => post._id === id);
  const currentIndex = postsList.findIndex(post => post._id === id);
  const prevPost = currentIndex > 0 ? postsList[currentIndex - 1] : null;
  const nextPost = currentIndex < postsList.length - 1 ? postsList[currentIndex + 1] : null;
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
    });
  }, [id, dispatch, user.accessToken]);


  const [openModal, setOpenModal] = useState(false);    
  const handleOpenModal = () => setOpenModal(true);
  const openForm = () => setShowForm(true);
  const closeForm = () => setShowForm(false);
  const openDeleteConfirm = () => setShowDeleteConfirm(true);
  const closeDeleteConfirm = () => setShowDeleteConfirm(false);

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8000/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `bearer ${user.accessToken}`
        },
      });

      if (response.ok) {
        dispatch(deletePost(id)); // Dispatch dell'azione Redux per eliminare il post
        closeDeleteConfirm(); // Chiudi la finestra di conferma dopo l'eliminazione del post
        router.push('/blog'); // Reindirizza alla homepage
      } else {
        console.error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };
  
  if (loading) {
    return <div>Caricamento...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!singlePost) {
    return <div>Post non trovato</div>;
  }


  return (
    <>
      <Header />
      <main>
        <article>
          <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
            <header className="pt-6 xl:pb-6">
              <div className="space-y-1 text-center">
                <div className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                  <time datetime={singlePost.createdAt}>
                    <PostDate date={singlePost.createdAt} format="long" />
                  </time>
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14">
                    {singlePost.title}
                  </h1>
                </div>
              </div>
            </header>
            <div className="grid-rows-[auto_1fr] divide-y divide-gray-200 pb-8 dark:divide-gray-700 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0">
              <dl className="pb-10 pt-6 xl:border-b xl:border-gray-200 xl:pt-11 xl:dark:border-gray-700">
                <dt className="sr-only">Authors</dt>
                <dd>
                  <ul className="flex flex-wrap justify-center gap-4 sm:space-x-12 xl:block xl:space-x-0 xl:space-y-8">
                    <li className="flex items-center space-x-2" key={singlePost.userId._id}>
                      {/* <Image
                        src="/static/images/4043254_avatar_elderly_grandma_nanny_icon.png"
                        width={38}
                        height={38}
                        alt="avatar"
                        className="h-10 w-10 rounded-full"
                      /> */}
                      <Avatar user={user} />
                      <dl className="whitespace-nowrap text-sm font-medium leading-5">
                        <dt className="sr-only">Name</dt>
                        <dd className="text-gray-900 dark:text-gray-100">{singlePost.userId.displayName}</dd>
                      </dl>
                    </li>
                  </ul>
                </dd>
              </dl>
              <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-3 xl:row-span-2 xl:pb-0">
                <div className="prose max-w-none pb-8 pt-10 dark:prose-invert">
                  {singlePost.imageUrl &&
                    <img src={singlePost.imageUrl} alt={singlePost.title} className="w-full h-auto mb-8" />
                  }
                  {!singlePost.imageUrl &&
                    <div></div>
                  }
                  {singlePost.description}</div>
                {user.email && user._id === singlePost.userId._id && !showForm &&
                  <div className="pb-6 pt-6 text-sm text-gray-700 dark:text-gray-300">
                    <button onClick={openForm} className="text-blue-500 hover:underline">
                      Modifica Post
                    </button>
                    {` • `}
                    <button onClick={openDeleteConfirm} className="text-red-500 hover:underline">Elimina Post</button>
                  </div>
                }
                {/********* MODIFICA POST ********/}
                {showForm && (
                  <EditPostForm singlePost={singlePost} user={user} closeForm={closeForm} />
                )}
                {/******* COMMENTI DEL POST ******/}
                <Comments postId={singlePost._id} />
              </div>
              <footer>
                <div className="divide-gray-200 text-sm font-medium leading-5 dark:divide-gray-700 xl:col-start-1 xl:row-start-2 xl:divide-y">
                  <div className="py-4 xl:py-8">
                    <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Tags
                    </h2>
                    <div className="flex flex-wrap">
                      <TagsOverviewSinglePost postId={singlePost._id} />
                    </div>
                  </div>
                  {(nextPost || prevPost) && (
                    <div className="flex justify-between py-4 xl:block xl:space-y-8 xl:py-8">
                      {prevPost && (
                        <div>
                          <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                            Previous Article
                          </h2>
                          <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                            <Link href={`/posts/${prevPost._id}`}>{prevPost.title}</Link>
                          </div>
                        </div>
                      )}
                      {nextPost && (
                        <div>
                          <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                            Next Article
                          </h2>
                          <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                            <Link href={`/posts/${nextPost._id}`}>{nextPost.title}</Link>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="pt-4 xl:pt-8">
                  <Link
                    href={`/blog`}
                    className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                    aria-label="Back to the blog"
                  >
                    &larr; Back to the blog
                  </Link>
                </div>
              </footer>
            </div>
          </div>
        </article>
      </main >
      <Footer />


      {/********************************/}
      {/** FINESTRA DI CONFERMA ELIMINAZIONE **/}
      {/********************************/}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg dark:bg-gray-700">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Conferma Eliminazione</h2>
            <p className="mb-4 dark:text-gray-300">Sei sicuro di voler eliminare il post: <strong>{singlePost.title}</strong>?</p>
            <div className="flex justify-end">
              <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded mr-2">Elimina</button>
              <button onClick={closeDeleteConfirm} className="bg-gray-300 text-gray-700 px-4 py-2 rounded">Annulla</button>
            </div>
          </div>
        </div>
      )}
      {/********************************/}
      {/************* FINE *************/}
      {/********************************/}


    </>
  )
}

export default SinglePostLayout;
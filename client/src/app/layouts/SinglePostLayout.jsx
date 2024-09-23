// app/layouts/SinglePostLayout.jsx

import { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { setList } from '../store/postsSlice';
import Header from '../components/Header';
import PostDate from '../components/PostDate';
import Comments from '../components/Comments';

const SinglePostLayout = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const loading = useSelector((state) => state.postblog.loading);
  const error = useSelector((state) => state.postblog.error);
  const postsList = useSelector(state => state.postblog.postsList);
  const singlePost = postsList.find(post => post._id === id);

  console.log("singlePost: ", singlePost)

  useEffect(() => {
    fetch(`http://localhost:8000/list`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.accessToken}`
      },
    }).then(async res => {
      const jsonRes = await res.json();
      dispatch(setList(jsonRes));
    }).catch(error => {
      console.error('Errore nel recuperare i post per tag:', error);
    });
  }, [id, dispatch, user.accessToken]);

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


      <div>ID del post:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {singlePost._id}</div>
      <div>TITLE del post:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {singlePost.title}</div>
      <div>DESCRIPTION del post:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {singlePost.description}</div>
      <div>IMAGEURL del post:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {singlePost.imageUrl}</div>
      <div>USERID._ID del post:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {singlePost.userId._id}</div>
      <div>USERID.DISPLAYNAME del post:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {singlePost.userId.displayName}</div>
      <div>USERID.EMAIL del post:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {singlePost.userId.email}</div>
      <div>LIKES del post:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {singlePost.likes}</div>
      <div>TAGS del post:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {singlePost.tags}</div>
      <div>CREATEDAT del post:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {singlePost.createdAt}</div>
      <div>UPDATEDAT del post:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {singlePost.updatedAt}</div>
      <div>__V del post:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {singlePost.__v}</div>


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
              <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-3 xl:row-span-2 xl:pb-0">
                <div className="prose max-w-none pb-8 pt-10 dark:prose-invert">
                  {singlePost.imageUrl &&
                    <img src={singlePost.imageUrl} alt={singlePost.title} className="w-full h-auto mb-8" />
                  }
                  {!singlePost.imageUrl &&
                    <div></div>
                  }
                  {singlePost.description}</div>
                {/******* COMMENTI DEL POST ******/}
                <Comments postId={singlePost._id} />
              </div>
              <footer>

              </footer>
            </div>
          </div>
        </article>
      </main >
    </>
  )
}

export default SinglePostLayout;
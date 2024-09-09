// app/components/Comments.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Link from 'next/link';
import Image from './Image';
import { setComments, setCommentsCount } from '../store/postsSlice';
import PostDate from './PostDate';

const Comments = ({ postId }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const comments = useSelector(state => state.postblog.comments[postId] || []);
  const commentsCount = useSelector(state => state.postblog.commentsCount[postId] || 0);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    // Force re-render when commentsCount changes
    console.log("commentsCount changed:", commentsCount);
  }, [commentsCount]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:8000/posts/${postId}/comments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `bearer ${user.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const commentsData = await response.json();
      dispatch(setComments({ postId, comments: commentsData }));
      dispatch(setCommentsCount({ postId, commentsCount: commentsData.length }));
      setShowComments(true);
    } catch (error) {
      console.error('Errore nel recuperare i commenti:', error);
    }
  };

  return (
    <>
      <div
        className="pb-6 pt-6 text-center text-gray-700 dark:text-gray-300"
        id="comment"
      >
        <button onClick={fetchComments} className="text-blue-500 hover:underline">
          Commenti ({commentsCount})
        </button>
      </div>

      {showComments && (
        <div className="pb-6 pt-6 text-gray-700 dark:text-gray-300">
          <h3 className="text-xl font-bold">Commenti ({commentsCount})</h3>
          {comments.length > 0 ? (
            comments.map(comment => (
              <div key={comment._id} className="pb-10 pt-6 px-4">
                <div className="py-2 px-3 text-sm rounded-md border xl:border-b xl:border-gray-200 xl:pt-11 xl:dark:border-gray-700">
                  <div className="gsc-comment-header">
                    <div className="gsc-comment-author">
                      <Link rel="nofollow noopener noreferrer" target="_blank" href="https://github.com/Pippo87" className="gsc-comment-author-avatar">
                        <Image
                          src="/static/images/4043254_avatar_elderly_grandma_nanny_icon.png"
                          width={30}
                          height={30}
                          alt={`@${comment.userId}`}
                          loading="lazy"
                          className="mr-2 rounded-full"
                        />
                        <span className="link-primary overflow-hidden text-ellipsis font-semibold">{comment.userId}</span>
                      </Link>
                      <Link rel="nofollow noopener noreferrer" target="_blank" href="https://github.com/timlrx/tailwind-nextjs-starter-blog/discussions/669#discussioncomment-9853277" className="link-secondary overflow-hidden text-ellipsis">
                        <time title={comment.createdAt} datetime="2024-06-23T18:07:25Z" className="whitespace-nowrap"><PostDate date={comment.createdAt} format="shortNumeric" /></time>
                      </Link>
                    </div>
                  </div>
                  <div dir="auto" className="markdown gsc-comment-content">
                    <p dir="auto">{comment.description}</p>
                  </div>
                  <div className="gsc-comment-footer"></div>
                  <div className="color-bg-tertiary gsc-reply-box flex flex-row">
                    <button type="button" className="text-blue-500 hover:underline form-control color-text-secondary color-border-primary w-full cursor-text rounded border px-2 py-1 text-left focus:border-transparent">Modifica</button>
                    <button type="button" className="text-red-500 hover:underline form-control color-text-secondary color-border-primary w-full cursor-text rounded border px-2 py-1 text-left focus:border-transparent">Elimina</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Nessun commento disponibile</p>
          )}
        </div>
      )}
    </>
  );
}

export default Comments;

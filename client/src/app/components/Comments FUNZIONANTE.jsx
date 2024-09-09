// app/components/Comments.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Link from 'next/link';
import Image from './Image';
import { setComments, setCommentsCount } from '../store/postsSlice';
import PostDate from './PostDate';
import "../comments.css";

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


          <section class="comment-module">
            <ul>
{/*console.log("COMMENTI: ", commentsData)*/}
              {comments.length > 0 ? (
                comments.map(comment => (
                  <>
                    <li key={comment._id}>
                      <div class="comment">
                        <div class="comment-img">
                        <Link rel="nofollow noopener noreferrer" target="_blank" href="https://github.com/Pippo87" className="gsc-comment-author-avatar">
                              <Image
                                src="/static/images/4043254_avatar_elderly_grandma_nanny_icon.png"
                                width={40}
                                height={40}
                                alt={`@${comment.userId}`}
                                loading="lazy"
                                className="mr-2 rounded-full"
                              />                              
                            </Link>
                        </div>
                        <div class="comment-content">
                          <div class="comment-details">
                            <h4 class="comment-name">{comment.userId.displayName}</h4>
                            <span class="comment-log"><PostDate date={comment.createdAt} format="shortNumeric" /></span>
                          </div>
                          <div class="comment-desc">
                            <p>{comment.description}</p>
                          </div>
                          <div class="comment-data">
                            <div class="comment-likes">
                              <div class="comment-likes-up">
                                <Image src="https://rvs-comment-module.vercel.app/Assets/Up.svg" width={13} height={8} alt="" />
                                  <span>2</span>
                              </div>
                              <div class="comment-likes-down">
                                <Image src="https://rvs-comment-module.vercel.app/Assets/Down.svg" width={13} height={8} alt="" />
                                  <span></span>
                              </div>
                            </div>
                            <div class="comment-reply">
                              <button type="button" className="text-blue-500 cursor-text">Modifica</button>
                            </div>
                            <div class="comment-report">
                              <button type="button" className="text-red-500 cursor-text">Elimina</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  </>
                ))
              ) : (
                <p>Nessun commento disponibile</p>
              )}

            </ul>
          </section>
        </div>
      )}
    </>
  );
}

export default Comments;

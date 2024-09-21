// components/Comments.jsx

import Link from 'next/link';
import Avatar from './Avatar';
import PostDate from './PostDate';
import Like from './Like';
import CommentFormModal from './CommentFormModal';
import styles from "../css/comments.css";

const Comments = ({ postId }) => {

  return (
    <>
      <div className="pb-6 pt-6 flex justify-between text-gray-700 dark:text-gray-300" id="comment">
        <Like postId={postId} />
        <button
          className="text-blue-500 hover:underline"
        >
          Aggiungi commento
        </button>
        <CommentFormModal postId={postId} />
        <button
          className="text-blue-500 hover:underline"
        >
          Commenti (?????)
        </button>
      </div>
      <section className="comment-module">
        <p className="text-gray-500 text-center">Nessun commento disponibile</p>
        <>
          <ul>
            <li key="???????">
              <div className="comment">
                <div className="comment-img">
                  <Link href="" className="gsc-comment-author-avatar">
                    <Avatar />
                  </Link>
                </div>
                <div className="comment-content">
                  <div className="comment-details">
                    <h4 className="comment-name">????????</h4>
                    <span className="comment-log"><PostDate date="???????????" format="shortNumeric" /></span>
                  </div>
                  <div className="flex w-544 comment-desc">
                    <p>????????????</p>
                  </div>
                  <div className="flex justify-end">
                    <div className="comment-reply mr-8">
                      <button className="text-blue-500">Modifica</button>
                    </div>
                    <div className="comment-report mr-2">
                      <button className="text-red-500">Elimina</button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <div className="text-center mt-4">
            <button onClick="??????????" className="text-blue-500 hover:underline">
              Carica altri commenti
            </button>
          </div>
        </>
      </section>
    </>
  )
};

export default Comments;
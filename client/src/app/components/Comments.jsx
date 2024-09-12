import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setComments, setCommentsCount, addComment, updateComment } from '../store/commentsSlice';

import Link from 'next/link';
import Image from './Image';
import PostDate from './PostDate';
import "../css/comments.css";

// Importa il componente modale
import CommentFormModal from './CommentFormModal';

const Comments = ({ postId }) => {

  const dispatch = useDispatch();
  const [showComments, setShowComments] = useState(false); // Stato per gestire la visibilità dei commenti
  const [openModal, setOpenModal] = useState(false);
  const [editComment, setEditComment] = useState(null); // Stato per il commento da modificare
  const user = useSelector(state => state.user); // Per verificare se l'utente è loggato
  const comments = useSelector(state => state.comments.comments[postId] || []);
  const commentsCount = useSelector(state => state.comments.commentsCount[postId] || 0);

  const handleOpenModal = (comment = null) => {
    setEditComment(comment);
    setOpenModal(true);
  };

  const handleUpdateComments = (newComment) => {
    if (editComment) {
      // Aggiorna un commento esistente
      dispatch(updateComment({ postId, updatedComment: newComment }));
    } else {
      // Aggiungi un nuovo commento
      dispatch(setComments({
        postId,
        comments: [newComment, ...comments]
      }));
      dispatch(setCommentsCount({ postId, commentsCount: commentsCount + 1 }));
    }
    setOpenModal(false);
  };

  const handleEdit = (commentId, description) => {
    // Trova il commento che deve essere modificato e apri la modale con quei dati
    const commentToEdit = comments.find(comment => comment._id === commentId);
    handleOpenModal(commentToEdit);
  };

  const handleDelete = async (commentId) => {
    // Implementa la logica di eliminazione qui
    try {
      const res = await fetch(`http://localhost:8000/posts/${postId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${user.accessToken}`
        }
      });

      if (res.ok) {
        // Rimuove il commento dalla lista dei commenti
        dispatch(setComments({
          postId,
          comments: comments.filter(comment => comment._id !== commentId)
        }));
        dispatch(setCommentsCount({ postId, commentsCount: commentsCount - 1 }));
      } else {
        console.error('Errore nella cancellazione del commento');
      }
    } catch (error) {
      console.error('Errore nella richiesta di eliminazione commento:', error);
    }
  };


  // Utilizziamo useEffect per inviare una richiesta al backend per ottenere i commenti associati al post quando il componente viene montato o quando cambia il postId.
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:8000/posts/${postId}/comments`);
        if (response.ok) {
          const commentsData = await response.json();
          dispatch(setComments({ postId, comments: commentsData }));
          dispatch(setCommentsCount({ postId, commentsCount: commentsData.length }));
        } else {
          console.error('Errore nel recuperare i commenti');
        }
      } catch (error) {
        console.error('Errore nella richiesta dei commenti:', error);
      }
    };

    fetchComments();
  }, [postId, dispatch]);

  const toggleComments = () => setShowComments(!showComments);

  return (
    <>
      <div className="pb-6 pt-6 flex justify-between text-gray-700 dark:text-gray-300" id="comment">
        <div className="text-blue-500 hover:underline">LIKES (70)</div>
        {user.email && ( // Mostra il bottone solo se l'utente è loggato
          <button
            onClick={() => handleOpenModal()}
            className="text-blue-500 hover:underline"
          >
            Aggiungi commento
          </button>
        )}
        {console.log("EDITCOMMENT VALE: ",editComment)}
        {openModal && <CommentFormModal
          postId={postId}
          closeModal={() => setOpenModal(false)}
          onUpdateComments={handleUpdateComments}
          initialComment={editComment} // Passa il commento da modificare
          mode={editComment ? 'edit' : 'add'} // Imposta la modalità
        />}
        <button
          onClick={toggleComments}
          className="text-blue-500 hover:underline"
        >
          Commenti ({commentsCount})
        </button>
      </div>

      {showComments && (
        <section className="comment-module">
          {commentsCount === 0 ? (
            <p className="text-gray-500 text-center">Nessun commento disponibile</p>
          ) : (
            <ul>
              {comments.map(comment => (
                <li key={comment._id}>
                  <div className="comment">
                    <div className="comment-img">
                      <Link rel="nofollow noopener noreferrer" target="_blank" href={`../user/profile/${comment.userId._id}`} className="gsc-comment-author-avatar">
                        <Image
                          src="/static/images/4043254_avatar_elderly_grandma_nanny_icon.png"
                          width={40}
                          height={40}
                          alt='userId'
                          loading="lazy"
                          className="mr-2 rounded-full"
                        />
                      </Link>
                    </div>
                    <div className="comment-content">
                      <div className="comment-details">
                        <h4 className="comment-name">{comment.userId.displayName}</h4>
                        <span className="comment-log"><PostDate date={comment.createdAt} format="shortNumeric" /></span>
                      </div>
                      <div className="flex w-544 comment-desc">
                        <p>{comment.description}</p>
                      </div>
                      <div className="flex justify-end">
                        {/* <div className="comment-likes">
                          <div className="comment-likes-up">
                            <Image src="https://rvs-comment-module.vercel.app/Assets/Up.svg" width={13} height={8} alt="" />
                            <span>2</span>
                          </div>
                          <div className="comment-likes-down">
                            <Image src="https://rvs-comment-module.vercel.app/Assets/Down.svg" width={13} height={8} alt="" />
                            <span></span>
                          </div>
                        </div> */}
                        <div className="comment-reply mr-8">
                          <button onClick={() => handleEdit(comment._id, comment.description)} className="text-blue-500 cursor-text">Modifica</button>
                        </div>
                        <div className="comment-report mr-2">
                          <button onClick={() => handleDelete(comment._id)} className="text-red-500 cursor-text">Elimina</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </>
  )
};

export default Comments;

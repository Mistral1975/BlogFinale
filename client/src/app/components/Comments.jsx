// components/Comments.jsx

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setComments, setCommentsCount } from '../store/commentsSlice';
import Link from 'next/link';
//import Image from './Image';
import Avatar from './Avatar';
import PostDate from './PostDate';
import "../css/comments.css";
import Like from './Like';
// Importa il componente modale
import CommentFormModal from './CommentFormModal';

const Comments = ({ postId }) => {

  const dispatch = useDispatch();
  const [showComments, setShowComments] = useState(false); // Stato per gestire la visibilità dei commenti
  const [commentsToShow, setCommentsToShow] = useState([]); // Stato per gestire i commenti visualizzati progressivamente
  const [commentsLoaded, setCommentsLoaded] = useState(3);  // Stato per gestire quanti commenti sono caricati inizialmente
  const [openModal, setOpenModal] = useState(false);
  const [editComment, setEditComment] = useState(null); // Stato per il commento da modificare
  const user = useSelector(state => state.user); // Per verificare se l'utente è loggato
  const [deleteComment, setDeleteComment] = useState(null);  // Stato per gestire l'eliminazione del commento
  const [modalMode, setModalMode] = useState('add'); // Modalità del modale (add, edit, delete)
  const comments = useSelector(state => state.comments.comments[postId] || []);
  const commentsCount = useSelector(state => state.comments.commentsCount[postId] || 0);

  // Apre il modal per aggiungere/modificare un commento
  const handleOpenModal = (comment = null, mode = 'add') => {
    setEditComment(comment);
    setModalMode(mode);
    setOpenModal(true);
  };

  // Utilizziamo useEffect per inviare una richiesta al backend per ottenere i commenti associati al post quando il componente viene montato o quando cambia il postId.
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:8000/posts/${postId}/comments`);
        if (response.ok) {
          const commentsData = await response.json();
          // Ordina i commenti per data decrescente
          const sortedComments = commentsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          dispatch(setComments({ postId, comments: sortedComments }));
          dispatch(setCommentsCount({ postId, commentsCount: sortedComments.length }));
          setCommentsToShow(sortedComments.slice(0, 3));
        } else {
          console.error('Errore nel recuperare i commenti');
        }
      } catch (error) {
        console.error('Errore nella richiesta dei commenti:', error);
      }
    };

    fetchComments();
  }, [postId, dispatch]);

  /**
    * Mostra o nascondere i commenti cambiando il valore booleano di showComments da true a false e viceversa.
    */
  const toggleComments = () => {
    setShowComments(!showComments);
  }

  /**
   * Carica altri 10 commenti a partire dall'attuale stato di caricamento
   */
  const loadMoreComments = () => {
    const newLoaded = commentsLoaded + 10;
    setCommentsToShow(comments.slice(0, newLoaded));
    setCommentsLoaded(newLoaded);
  }

  return (
    <>
      <div className="pb-6 pt-6 flex justify-between text-gray-700 dark:text-gray-300" id="comment">
        <Like postId={postId} />
        {user.email && ( // Mostra il bottone solo se l'utente è loggato
          <button
            onClick={() => handleOpenModal()}
            className="text-blue-500 hover:underline"
            style={{ userSelect: 'none' }}
          >
            Aggiungi commento
          </button>
        )}
        {/* {console.log("EDITCOMMENT VALE: ", editComment)} */}
        {openModal && <CommentFormModal
          postId={postId}
          closeModal={() => setOpenModal(false)}
          //onUpdateComments={handleUpdateComments}
          //onDeleteComment={handleConfirmDelete} // Passa la funzione per la conferma dell'eliminazione
          //initialComment={editComment || deleteComment}
          initialComment={editComment}
          mode={modalMode} // Imposta la modalità del modale
        />}
        <button
          onClick={toggleComments}
          className="text-blue-500 hover:underline"
          style={{ userSelect: 'none' }}
        >
          Commenti ({commentsCount})
        </button>
      </div>

      {showComments && (
        <section className="comment-module">
          {commentsCount === 0 ? (
            <p className="text-gray-500 text-center">Nessun commento disponibile</p>
          ) : (
            <>
              <ul>
                {commentsToShow.map(comment => (
                  <li key={comment._id}>
                    <div className="comment">
                      <div className="comment-img">
                        <Link href={`../user/profile/${comment.userId._id}`} className="gsc-comment-author-avatar">
                          <Avatar user={comment.userId} />
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
                        {/* Mostra i pulsanti solo se l'utente è l'autore del commento */}
                        {comment.userId._id === user._id && (
                          <div className="flex justify-end">
                            <div className="comment-reply mr-8">
                              <button onClick={() => handleOpenModal(comment, 'edit')} className="text-blue-500">Modifica</button>
                            </div>
                            <div className="comment-report mr-2">
                              <button onClick={() => handleOpenModal(comment, 'delete')} className="text-red-500">Elimina</button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              {commentsLoaded < commentsCount && (
                <div className="text-center mt-4">
                  <button onClick={loadMoreComments} className="text-blue-500 hover:underline">
                    Carica altri commenti
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      )}
    </>
  )
};

export default Comments;
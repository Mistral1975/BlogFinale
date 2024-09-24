// components/Comments.jsx

import Link from 'next/link';
import Avatar from './Avatar';
import PostDate from './PostDate';
import Like from './Like';
import CommentForm from './CommentForm';
import "../css/comments.css";

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { setListComments, setCommentsCount } from '../store/commentsSlice';

const Comments = ({ postId }) => {

  const dispatch = useDispatch();
  const user = useSelector(state => state.user); // Per verificare se l'utente è loggato
  const listComments = useSelector(state => state.comments.listComments[postId] || []);
  const commentsCount = useSelector(state => state.comments.commentsCount[postId] || 0);
  const [showComments, setShowComments] = useState(false); // Stato per gestire la visibilità dei commenti
  const [commentsLoaded, setCommentsLoaded] = useState(3);  // Stato per gestire quanti commenti sono caricati inizialmente
  const [commentsToShow, setCommentsToShow] = useState([]); // Stato per gestire i commenti visualizzati progressivamente
  const [openModal, setOpenModal] = useState(false); // Modale aperto o chiuso
  const [modalMode, setModalMode] = useState('add'); // Modalità del modale (add, edit)
  const [editComment, setEditComment] = useState(null); // Commento da modificare

  // Recupera il valore di forceReload dallo stato Redux per monitorare le modifiche ai commenti.
  // Ogni volta che forceReload cambia, useEffect viene riattivato per aggiornare i commenti.
  const forceReload = useSelector((state) => state.comments.forceReload);

  // useEffect invia una richiesta al backend per ottenere i commenti associati al post quando il componente viene montato o quando cambia il postId.
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`http://localhost:8000/posts/${postId}/comments`);
        if (res.ok) {
          const commentsData = await res.json();
          // Ordina i commenti per data decrescente
          const sortedComments = commentsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

          console.log("sortedComments: ", sortedComments)
          dispatch(setListComments({ postId, listComments: sortedComments }));
          dispatch(setCommentsCount({ postId, commentsCount: sortedComments.length }));
          console.log("PRIMI 3 COMMENTI: ", sortedComments.slice(0, 3))
          setCommentsToShow(sortedComments.slice(0, 3));
        } else {
          console.error('Errore nel recuperare i commenti');
        }
      } catch (error) {
        console.error('Errore nella richiesta dei commenti:', error);
      }
    }

    fetchComments();
    /* }, [postId, dispatch, commentsCount, listComments]); */
    /* }, [postId, dispatch, commentsCount]); */
  }, [postId, dispatch, forceReload]);

  // Funzione per aprire il modale con la modalità specifica
  const handleOpenModal = (comment = null, mode = 'add') => {
    setEditComment(comment); // Imposta il commento da modificare (se presente)
    setModalMode(mode); // Imposta la modalità del modale (aggiungi o modifica)
    setOpenModal(true); // Apri il modale
  };

  // Mostra o nasconde i commenti cambiando il valore booleano di showComments da true a false e viceversa.
  const toggleComments = () => {
    setShowComments(!showComments);
  }

  // Carica altri 10 commenti a partire dall'attuale stato di caricamento
  const loadMoreComments = () => {
    const newLoaded = commentsLoaded + 3;
    setCommentsToShow(listComments.slice(0, newLoaded));
    setCommentsLoaded(newLoaded);
  }

  return (
    <>
      <div className="pb-6 pt-6 flex justify-between text-gray-700 dark:text-gray-300" id="comment">
        <Like postId={postId} />
        {user.email && ( // Mostra il bottone solo se l'utente è loggato
          <button onClick={() => handleOpenModal()} className="text-blue-500 hover:underline" style={{ userSelect: 'none' }}>
            Aggiungi commento
          </button>
        )}
        {/* Modale per aggiungere/modificare commenti */}
        {openModal && (<CommentForm postId={postId} closeModal={() => setOpenModal(false)} initialComment={editComment} mode={modalMode} />
        )}
        {/* <CommentForm /> */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="text-blue-500 hover:underline"
          style={{ userSelect: 'none' }}
        >
          Commenti ({commentsCount})
        </button>
      </div>

      {showComments && (
        <section className="comment-module">
          <>
            {commentsCount === 0 ? (
              <p>Nessun commento disponibile.</p>
            ) : (
              <ul>
                {commentsToShow.map((comment) => (
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
                              <button onClick={() => handleOpenModal(comment, 'edit')} className="text-blue-500 cursor-text">Modifica</button>
                            </div>
                            <div className="comment-report mr-2">
                              <button onClick={() => handleOpenModal(comment, 'delete')} className="text-red-500 cursor-text">Elimina</button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {/* Caricamento progressivo dei commenti */}
            {commentsLoaded < commentsCount && (
              <div className="text-center mt-4">
                <button onClick={loadMoreComments} className="text-blue-500 hover:underline">
                  Carica altri commenti
                </button>
              </div>
            )}
          </>
        </section>
      )}
    </>
  );
}

export default Comments;
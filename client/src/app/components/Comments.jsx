import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setComments, setCommentsCount, addComment, updateComment } from '../store/commentsSlice';

import Link from 'next/link';
import Image from './Image';
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
  const comments = useSelector(state => state.comments.comments[postId] || []);
  const commentsCount = useSelector(state => state.comments.commentsCount[postId] || 0);

  const handleOpenModal = (comment = null) => {
    setEditComment(comment);
    setOpenModal(true);
  };
 
  const handleUpdateComments = async (newComment) => {
    if (editComment) {
      // Se stiamo modificando un commento esistente
      const updatedComments = comments.map(comment =>
        comment._id === editComment._id
          ? { ...comment, description: newComment.description }
          : comment
      );
  
      // Aggiorna immediatamente l'interfaccia utente con la modifica
      setCommentsToShow(updatedComments.slice(0, commentsLoaded));
      dispatch(setComments({ postId, comments: updatedComments }));

      try {
        // Invia la modifica al server
        const response = await fetch(`http://localhost:8000/posts/${postId}/comments/${editComment._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`
          },
          body: JSON.stringify(newComment)
        });
  
        if (response.ok) {
          const updatedCommentFromServer = await response.json();
  
          // Aggiorna il commento nello store con la versione confermata dal server
          const updatedCommentsAfterSave = updatedComments.map(comment =>
            comment._id === updatedCommentFromServer._id
              ? updatedCommentFromServer
              : comment
          );
  
          // Aggiorna lo stato locale e Redux con il commento modificato
          const sortedComments = updatedCommentsAfterSave.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setCommentsToShow(sortedComments.slice(0, commentsLoaded));
          dispatch(setComments({ postId, comments: sortedComments }));
        } else {
          console.error('Errore nella modifica del commento');
          // Eventuale gestione dell'errore: ripristina il commento precedente o mostra un messaggio
        }
      } catch (error) {
        console.error('Errore durante la modifica del commento:', error);
        // Eventuale gestione dell'errore: ripristina il commento precedente o mostra un messaggio
      }     
    } else {
      // Crea un ID temporaneo per il nuovo commento fino a quando non riceviamo una risposta dal server (Inserimento di un nuovo commento gestito come ottimistico)
      const tempId = `temp-${new Date().getTime()}`;
      const tempComment = {
        _id: tempId,
        ...newComment,
        userId: {
          _id: user._id, // Assegna subito l'ID utente
          displayName: user.email // O usa un altro campo appropriato per il nome visualizzato
        },
        createdAt: new Date().toISOString() // Assegna la data corrente
      };
  
      // Aggiungi subito il commento temporaneo allo stato locale
      const updatedComments = [tempComment, ...comments];
      setCommentsToShow(updatedComments.slice(0, commentsLoaded));
      dispatch(setComments({ postId, comments: updatedComments }));
      dispatch(setCommentsCount({ postId, commentsCount: commentsCount + 1 }));
  
      try {
        // Invia il nuovo commento al server
        const response = await fetch(`http://localhost:8000/posts/${postId}/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`
          },
          body: JSON.stringify(newComment)
        });
  
        if (response.ok) {
          const savedComment = await response.json();
  
          // Sostituisci il commento temporaneo con il commento salvato
          const updatedCommentsAfterSave = updatedComments.map(comment =>
            comment._id === tempId ? savedComment : comment
          );
  
          // Aggiorna lo stato locale e Redux con il commento corretto
          const sortedComments = updatedCommentsAfterSave.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setCommentsToShow(sortedComments.slice(0, commentsLoaded));
          dispatch(setComments({ postId, comments: sortedComments }));
        } else {
          console.error('Errore nel salvataggio del commento');
        }
      } catch (error) {
        console.error('Errore durante l\'invio del commento:', error);
      }
    }
    setOpenModal(false);
  };  

  const handleEdit = (commentId, description) => {
    // Trova il commento che deve essere modificato e apre la modale con quei dati
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
        const updatedComments = comments.filter(comment => comment._id !== commentId);
        const sortedComments = updatedComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        // Rimuove il commento dalla lista dei commenti
        dispatch(setComments({ postId, comments: sortedComments }));
        dispatch(setCommentsCount({ postId, commentsCount: commentsCount - 1 }));
        setCommentsToShow(sortedComments.slice(0, commentsLoaded));
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
        <Like />
        {user.email && ( // Mostra il bottone solo se l'utente è loggato
          <button
            onClick={() => handleOpenModal()}
            className="text-blue-500 hover:underline"
          >
            Aggiungi commento
          </button>
        )}
        {console.log("EDITCOMMENT VALE: ", editComment)}
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
            <>
            <ul>
              {commentsToShow.map(comment => (
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
                      {/* Mostra i pulsanti solo se l'utente è l'autore del commento */}
                      {comment.userId._id === user._id && (
                        <div className="flex justify-end">
                          <div className="comment-reply mr-8">
                            <button onClick={() => handleEdit(comment._id, comment.description)} className="text-blue-500 cursor-text">Modifica</button>
                          </div>
                          <div className="comment-report mr-2">
                            <button onClick={() => handleDelete(comment._id)} className="text-red-500 cursor-text">Elimina</button>
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

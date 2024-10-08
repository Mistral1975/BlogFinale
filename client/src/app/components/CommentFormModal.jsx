// components/CommentFormModal.jsx

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "../css/commentform.module.css";

const CommentFormModal = ({ postId, closeModal, onUpdateComments, onDeleteComment, initialComment = null, mode = 'add' }) => {

    console.log("initialComment: ", initialComment)

    const user = useSelector(state => state.user);
    const [newComment, setNewComment] = useState({
        description: '',
    });
    const [message, setMessage] = useState(null);
    const [validationErrors, setValidationErrors] = useState({
        description: '',
    });

    useEffect(() => {
        if (initialComment) {
            setNewComment({ description: initialComment.description });
        }
    }, [initialComment]);


    const handleChange = (e) => {
        const { name, value } = e.target;

        // Gestione facoltativa degli errori di convalida
        setValidationErrors(
            prevValue => {
                return {
                    ...prevValue,
                    [name]: ''
                }
            }
        )

        // Aggiornamento dello stato dell'input
        setNewComment(
            prevState => {
                return {
                    ...prevState,
                    [name]: value
                }
            })
    }

    const handleSubmit = async () => {
        let formIsValid = true;

        if (newComment.description === '') {
            setValidationErrors(prevValue => ({
                ...prevValue,
                description: 'Il commento non può essere vuoto'
            }));
            formIsValid = false;
        }

        if (formIsValid) {

            setMessage({ text: mode === 'edit' ? 'Aggiornamento del commento...' : 'Inserimento nuovo commento...', type: 'info' });

            try {
                const url = mode === 'edit'
                    ? `http://localhost:8000/posts/${postId}/comments/${initialComment._id}`
                    : `http://localhost:8000/posts/${postId}/comments`;

                const method = mode === 'edit' ? 'PATCH' : 'POST';

                // Crea il payload per la richiesta
                const payload = {
                    description: newComment.description
                    // Non includere campi non previsti come userId, _id, createdAt, updatedAt, __v
                };

                const res = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${user.accessToken}`
                    },
                    body: JSON.stringify(payload),
                });

                if (res.ok) {
                    const commentData = await res.json();
                    onUpdateComments(commentData); // Aggiorna i commenti nel componente padre
                    setNewComment({ description: '' });
                    setMessage({ text: mode === 'edit' ? 'Commento aggiornato con successo!' : 'Commento inserito con successo!', type: 'info' });
                    closeModal();
                } else {
                    setMessage({ text: 'Errore nell\'invio del commento', type: 'error' });
                }
            } catch (e) {
                setMessage({ text: "Errore nella richiesta di aggiunta commento:", type: 'error' });
            }
        }
    }

    // Modal per confermare l'eliminazione
    if (mode === 'delete') {
        return (
            <div className="modalBackground">
                <div className="containerLogin">
                    <div className="titleCloseBtn">
                        <button onClick={() => closeModal(false)}> X </button>
                    </div>
                    <div className="headerLogin">
                        <div className="text">Conferma Eliminazione</div>
                        <div className="underline"></div>
                    </div>
                    <div className="inputs">
                        <p>Sei sicuro di voler eliminare questo commento?</p>
                        <p className="italic">"{initialComment?.description}"</p>
                    </div>
                    {message &&
                        <div className={message.type === "info" ? "message" : "error-message"}>{message.text}</div>
                    }
                    <div className="submit-container">
                        <div className="submit gray" onClick={() => closeModal()}>Annulla</div>
                        <div className="submit danger" onClick={onDeleteComment}>Conferma</div>
                    </div>
                </div>
            </div>
        );
    }

    // Modal per aggiungere o modificare un commento
    return (
        <div className="modalBackground">
            <div className="containerLogin">
                <div className="titleCloseBtn">
                    <button onClick={() => closeModal(false)}> X </button>
                </div>
                <div className="headerLogin">
                    <div className="text">{mode === 'edit' ? 'Modifica Commento' : 'Aggiungi un Commento'}</div>
                    <div className="underline"></div>
                </div>
                <div className="inputs">
                    <textarea
                        id="description"
                        name="description"
                        onChange={handleChange}
                        value={newComment.description}
                        rows="4"
                        className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                        placeholder="Scrivi il tuo commento..."
                        required
                    />
                    {validationErrors.description && <div className="error-message">{validationErrors.description}</div>}
                </div>

                {message &&
                    <div className={message.type === "info" ? "message" : "error-message"}>{message.text}</div>
                }

                <div className="submit-container">
                    <div className="submit gray" onClick={() => closeModal()}>Annulla</div>
                    <div className="submit" onClick={handleSubmit}>Invia</div>
                </div>
            </div>
        </div>
    );
};

export default CommentFormModal;

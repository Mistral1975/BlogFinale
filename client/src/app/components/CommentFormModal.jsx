import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "../css/commentform.module.css";

const CommentFormModal = ({ postId, closeModal, onUpdateComments, initialComment = null, mode = 'add' }) => {

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
        //console.log(`Sto scrivendo ${value} su ${name}`)

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
            setValidationErrors(prevValue => {
                return {
                    ...prevValue,
                    description: 'Il commento non può essere vuoto'
                }
            })
            formIsValid = false;
        }

        if (formIsValid) {

            setMessage({ text: mode === 'edit' ? 'Aggiornamento del commento...' : 'Inserimento nuovo commento...', type: 'info' });

            try {
                const url = mode === 'edit'
                    ? `http://localhost:8000/posts/${postId}/comments/${initialComment._id}`
                    : `http://localhost:8000/posts/${postId}/comments`;

                const method = mode === 'edit' ? 'PATCH' : 'POST';

                const res = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `bearer ${user.accessToken}`
                    },
                    //body: JSON.stringify({ description: comment }),
                    body: JSON.stringify(newComment),
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

    console.log("newComment : ", newComment)
    console.log("validationErrors : ", validationErrors)

    // Controlla se l'utente loggato è l'autore del commento
    const isAuthor = initialComment && initialComment.userId._id === user._id;
    console.log("initialComment: ", initialComment)
    console.log("user: ", user)

    return (
        <>
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
                        <div className="inputs">
                            <textarea
                                id="description"
                                name="description"
                                //onChange={(e) => handleChange(e)}
                                onChange={handleChange}
                                value={newComment.description}
                                rows="4"
                                className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                                placeholder="Scrivi il tuo commento..."
                                required
                            />
                            {validationErrors.description && <div className="error-message">{validationErrors.description}</div>}
                        </div>
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


        </>
    );
};

export default CommentFormModal;

// components/CommentForm.jsx

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setListComments, setCommentsCount, addComment } from '../store/commentsSlice';

const CommentForm = ({ postId, closeModal, initialComment = null, mode = 'add', onUpdateComments }) => {

    const dispatch = useDispatch(); // Hook Redux per inviare azioni
    const user = useSelector(state => state.user); // Dati dell'utente loggato
    const comments = useSelector(state => state.comments.comments[postId] || []); // Commenti esistenti
    const commentsCount = useSelector(state => state.comments.commentsCount[postId] || 0); // Numero dei commenti

    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [newComment, setNewComment] = useState({ description: '' });
    const [message, setMessage] = useState(null);
    const [validationErrors, setValidationErrors] = useState({ description: '' });


    console.log("comments: ", comments)
    console.log("commentsCount: ", commentsCount)

    const handleChange = (e) => {
        const { name, value, required, rows, placeholder } = e.target;
        console.log("e: ", e)
        console.log("e.target: ", e.target)
        console.log("name: ", name)
        console.log("value: ", value)
        console.log("required: ", required)
        console.log("rows: ", rows)
        console.log("placeholder: ", placeholder)
        //setValidationErrors(prev => ({ ...prev, [name]: '' }));
        setNewComment(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {

        if (newComment.description === '') {
            setValidationErrors({ description: 'Il commento non può essere vuoto' });
            return;
        }

        // Imposta un commento temporaneo con un ID fittizio fino a quando non otteniamo risposta dal server
        /* const tempId = `temp-${new Date().getTime()}`;
        const tempComment = {
            _id: tempId,
            ...newComment,
            userId: {
                _id: user._id,
                displayName: user.displayName || user.name || user.email // Usa il nome o email se non esiste displayName
            },
            createdAt: new Date().toISOString()
        }; */

        // Aggiorna lo store Redux e visualizza immediatamente il commento
        //const updatedComments = [tempComment, ...comments];
        //dispatch(setListComments({ postId, comments: updatedComments }));
        //dispatch(setCommentsCount({ postId, commentsCount: commentsCount + 1 }));

        setMessage({ text: 'Inserimento nuovo commento...', type: 'info' });

        try {
            const res = await fetch(`http://localhost:8000/posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${user.accessToken}`
                },
                body: JSON.stringify({ description: newComment.description })
            });

            if (res.ok) {
                const savedComment = await res.json();

                // Aggiorna lo store Redux con il commento salvato
                dispatch(addComment({ postId, comment: savedComment }));

                setMessage({ text: 'Commento inserito con successo!', type: 'info' });
                setNewComment({ description: '' });
                closeModal(); // Chiudi il modale dopo l'aggiunta del commento
            } else {
                setMessage({ text: 'Errore nell\'invio del commento', type: 'error' });
            }
        } catch (e) {
            setMessage({ text: "Errore nella richiesta di aggiunta commento:", type: 'error' });
        }
    }

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
                    {/* <div className="submit" onClick={handleSubmit}>Invia</div> */}
                    <div className="submit" onClick={handleSubmit} disabled={loading}>
                        {loading ? "Invio in corso..." : "Invia"}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentForm;

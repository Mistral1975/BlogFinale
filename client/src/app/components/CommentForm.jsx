// components/CommentForm.jsx

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setComments, setCommentsCount, addComment } from '../store/commentsSlice';

const CommentForm = ({ postId, closeModal, initialComment = null, mode = 'add' }) => {

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

    // Se il commento è in modifica, precompila il form con il testo del commento esistente
    useEffect(() => {
        if (initialComment) {
            setNewComment({ description: initialComment.description });
        }
    }, [initialComment]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValidationErrors(prev => ({ ...prev, [name]: '' }));
        setNewComment(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {

        if (newComment.description === '') {
            setValidationErrors({ description: 'Il commento non può essere vuoto' });
            return;
        }

        // Imposta un commento temporaneo con un ID fittizio fino a quando non otteniamo risposta dal server
        const tempId = `temp-${new Date().getTime()}`;
        const tempComment = {
            _id: tempId,
            ...newComment,
            userId: {
                _id: user._id,
                displayName: user.displayName || user.name || user.email // Usa il nome o email se non esiste displayName
            },
            createdAt: new Date().toISOString()
        };

        // Aggiorna lo store Redux e visualizza immediatamente il commento
        const updatedComments = [tempComment, ...comments];
        dispatch(setComments({ postId, comments: updatedComments }));
        dispatch(setCommentsCount({ postId, commentsCount: commentsCount + 1 }));

        setMessage({ text: mode === 'edit' ? 'Aggiornamento del commento...' : 'Inserimento nuovo commento...', type: 'info' });

        const url = mode === 'edit'
            ? `http://localhost:8000/posts/${postId}/comments/${initialComment._id}`
            : `http://localhost:8000/posts/${postId}/comments`;

        const method = mode === 'edit' ? 'PATCH' : 'POST';

        try {
            const res = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${user.accessToken}`
                },
                body: JSON.stringify({ description: newComment.description })
            });

            if (res.ok) {
                const savedComment = await res.json();

                // Sostituisci il commento temporaneo con il commento effettivo dal server
                const updatedCommentsAfterSave = updatedComments.map(comment =>
                    comment._id === tempId ? savedComment : comment
                );

                // Aggiorna nuovamente lo store Redux con il commento salvato
                dispatch(setComments({ postId, comments: updatedCommentsAfterSave }));

                setMessage({ text: mode === 'edit' ? 'Commento aggiornato con successo!' : 'Commento inserito con successo!', type: 'info' });
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

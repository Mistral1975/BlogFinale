import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
//import { addComment } from '../store/commentsSlice';
//import "../comments.css";
import "../commentform.module.css"

const CommentFormModal = ({ postId, closeModal, onUpdateComments }) => {

    const user = useSelector(state => state.user);
    const [newComment, setNewComment] = useState({
        description: '',
    });
    const [message, setMessage] = useState(null);
    const [validationErrors, setValidationErrors] = useState({
        description: '',
    });
    const [action, setAction] = useState("Aggiungi un commento");
    const [isValid, setIsValid] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target; // utilizza l'assegnazione per destructuring per estrarre due proprietà dall'oggetto e.target: name (l'attributo name del campo di input) e value (il valore corrente inserito dall'utente).
        console.log(`Sto scrivendo ${value} su ${name}`)

        // Gestione facoltativa degli errori di convalida
        setValidationErrors(  // blocco responsabile dell'aggiornamento dello stato degli errori di convalida, riceve lo stato precedente (prevValue) e restituisce un nuovo oggetto di stato.
            newPost => {
                return {  // Questa blocco crea un nuovo oggetto basato sullo stato precedente "validationErrors"
                    ...newPost, // Utilizza l'operatore spread (...) per copiare le proprietà esistenti
                    [name]: ''  // imposta dinamicamente il valore per la proprietà corrispondente al nome del campo di input (name) su una stringa vuota ('').
                }             // Questo cancella effettivamente qualsiasi messaggio di errore di convalida esistente per il campo di input specifico con cui l'utente sta interagendo
            }
        )

        // Aggiornamento dello stato dell'input
        setNewComment(newPost => { // blocco responsabile dell'aggiornamento dello stato dell'input 
            return {        // Utilizza l'operatore spread (...) per copiare le proprietà esistenti e quindi utilizza la notazione a parentesi quadre ([name])
                ...newPost, // per impostare dinamicamente il valore per la proprietà corrispondente al nome del campo di input (name) al nuovo valore inserito dall'utente (value).
                [name]: value // Questo aggiorna effettivamente lo stato con l'ultimo valore immesso nel campo di input
            }
        })
    }

    //const dispatch = useDispatch();

    const handleSubmit = async () => {

        let formIsValid = true;

        if (newComment.description === '') {
            setValidationErrors(prevValue => {
                return {
                    ...prevValue,
                    description: 'comment cannot be empty'
                }
            })
            formIsValid = false;
        }

        //setIsValid(formIsValid);

        if (formIsValid) {
            //console.log(`Sto inviando i dati ${newComment.description}`);
            setMessage({ text: 'Inserimento nuovo commento...', type: 'info' });

            try {
                const res = await fetch(`http://localhost:8000/posts/${postId}/comments`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `bearer ${user.accessToken}`
                    },
                    //body: JSON.stringify({ description: comment }),
                    body: JSON.stringify(newComment),
                });

                if (res.ok) {
                    //dispatch(addComment(await res.json()));
                    const commentData = await res.json();
                    onUpdateComments(commentData); // Aggiorna i commenti nel componente padre
                    setNewComment({
                        description: '',
                    });
                    setMessage({ text: 'Commento inserito con successo!', type: 'info' });
                    closeModal(false);
                } else {
                    setMessage({ text: 'Errore nell\'invio del commento', type: 'error' });
                }
            } catch (e) {
                setMessage({ text: "Errore nella richiesta di aggiunta commento:", type: 'error' });
            }
        } //else {
        //setMessage(null);
        //}
    }

    console.log("newComment : ", newComment)
    console.log("validationErrors : ", validationErrors)

    return (
        <>
            <div className="modalBackground">
                <div className="containerLogin">
                    <div className="titleCloseBtn">
                        <button onClick={() => closeModal(false)}> X </button>
                    </div>
                    <div className="headerLogin">
                        <div className="text">{action}</div>
                        <div className="underline"></div>
                    </div>
                    <div className="inputs">
                        <div className="inputs">
                            <textarea
                                id="description"
                                name="description"
                                onChange={(e) => handleChange(e)}
                                //onChange={handleChange}
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
                        <div className="submit gray" onClick={() => { closeModal(false) }}>Annulla</div>
                        <div className="submit" onClick={() => {
                            setAction("Aggiungi un commento")
                            handleSubmit()
                        }}>Invia</div>
                        {/* <div className="submit" onClick={handleSubmit}>Invia</div> */}
                    </div>
                </div>
            </div>


        </>
    );
};

export default CommentFormModal;

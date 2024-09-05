//"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addComment } from "../store/commentsSlice";
import "../commentform.module.css";

const CommentForm = ({ closeModal }) => {
    const user = useSelector(state => state.user);
    const [action, setAction] = useState("Aggiungi commento");

    const [newComment, setNewComment] = useState({
        comment: '',
    });

    const [message, setMessage] = useState(null);
    const [isValid, setIsValid] = useState(null);

    const [validationErrors, setValidationErrors] = useState({
        comment: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target; // utilizza l'assegnazione per destructuring per estrarre due proprietà dall'oggetto e.target: name (l'attributo name del campo di input) e value (il valore corrente inserito dall'utente).
        console.log(`Sto scrivendo ${value} su ${name}`)

        // Gestione facoltativa degli errori di convalida
        setValidationErrors(  // blocco responsabile dell'aggiornamento dello stato degli errori di convalida, riceve lo stato precedente (prevValue) e restituisce un nuovo oggetto di stato.
            newComment => {
                return {  // Questa blocco crea un nuovo oggetto basato sullo stato precedente "validationErrors"
                    ...newComment, // Utilizza l'operatore spread (...) per copiare le proprietà esistenti
                    [name]: ''  // imposta dinamicamente il valore per la proprietà corrispondente al nome del campo di input (name) su una stringa vuota ('').
                }             // Questo cancella effettivamente qualsiasi messaggio di errore di convalida esistente per il campo di input specifico con cui l'utente sta interagendo
            }
        )

        // Aggiornamento dello stato dell'input
        setNewComment(newComment => { // blocco responsabile dell'aggiornamento dello stato dell'input 
            return {        // Utilizza l'operatore spread (...) per copiare le proprietà esistenti e quindi utilizza la notazione a parentesi quadre ([name])
                ...newComment, // per impostare dinamicamente il valore per la proprietà corrispondente al nome del campo di input (name) al nuovo valore inserito dall'utente (value).
                [name]: value // Questo aggiorna effettivamente lo stato con l'ultimo valore immesso nel campo di input
            }
        })
    }

    const dispatch = useDispatch();

    const handleSubmit = async () => {

        let formIsValid = true;

        if (newComment.comment === '') {
            setValidationErrors(prevValue => {
                return {
                    ...prevValue,
                    comment: 'Il commento non può essere vuoto'
                }
            })
            formIsValid = false;
        }

        setIsValid(formIsValid);

        if (formIsValid) {
            console.log(`Sto inviando i dati ${newComment.comment}`);
            setMessage({ text: 'Inserimento nuovo commento...', type: 'info' });




            try {
                const res = await fetch('http://localhost:8000/posts/${postId}/comments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "authorization": `bearer ${user.accessToken}`
                    },
                    body: JSON.stringify(newComment),
                });

                if (res.ok) {
                    dispatch(addComment(await res.json()));

                    setNewComment({
                        comment: '',
                    });
                    setMessage({ text: 'Commento inserito con successo!', type: 'info' });
                    closeModal(false);
                } else {
                    setMessage({ text: 'Errore nell\'invio del commento', type: 'error' });
                }
            } catch (e) {
                setMessage({ text: "Errore nella richiesta di aggiunta commento:", type: 'error' });
            }
        } else {
            setMessage(null);
        }
    };

    console.log("newComment : ", newComment)
    console.log("validationErrors : ", validationErrors)

    return (
        <div className="modalBackground">
            <div className="containerLogin">
                <div className="titleCloseBtn">
                    <button onClick={() => closeModal(false)}> X </button>
                </div>
                <div className="headerLogin">
                    <div className="text">{action}</div>
                    <div className="underline"></div>
                </div>
                {/* <div className="inputs">
                    <textarea
                        id="comment"
                        name="comment"
                        rows="4"
                        placeholder="Scrivi il tuo commento..."
                        value={newComment}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                    />
                    {validationErrors && <div className="error-message">{validationErrors}</div>}
                </div> */}
                <div className="inputs">
                    <div className="input">
                        <input type="text" id="comment" name="comment" placeholder="Scrivi il tuo commento..." onChange={(e) => handleChange(e)} />
                    </div>
                    {validationErrors.comment && <div className="error-message">{validationErrors.comment}</div>}
                </div>

                {message &&
                    <div className={message.type === "info" ? "message" : "error-message"}>{message.text}</div>
                }

                <div className="submit-container">
                    <div className={action === "Add New Post" ? "submit gray" : "submit"}
                        onClick={() => {
                            closeModal(false)
                        }}
                    >Annulla</div>
                    <div className={action === "Annulla" ? "submit gray" : "submit"}
                        onClick={() => {
                            setAction("Add New Post")
                            handleSubmit()
                        }}
                    >Add New Post</div>
                </div>
            </div>
        </div>
    )
};

export default CommentForm;

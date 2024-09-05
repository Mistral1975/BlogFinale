//"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "../store/postsSlice";
import "../postform.module.css";

const PostForm = ({ closeModal }) => {
    const user = useSelector(state => state.user);
    const [action, setAction] = useState("Add New Post");

    const [newPost, setNewPost] = useState({
        title: '',
        description: '',
        imageUrl: '',
        tags: '',
    });

    const [message, setMessage] = useState(null);
    const [isValid, setIsValid] = useState(null);

    const [validationErrors, setValidationErrors] = useState({
        title: '',
        description: '',
        imageUrl: '',
        tags: ''
    });

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
        setNewPost(newPost => { // blocco responsabile dell'aggiornamento dello stato dell'input 
            return {        // Utilizza l'operatore spread (...) per copiare le proprietà esistenti e quindi utilizza la notazione a parentesi quadre ([name])
                ...newPost, // per impostare dinamicamente il valore per la proprietà corrispondente al nome del campo di input (name) al nuovo valore inserito dall'utente (value).
                [name]: value // Questo aggiorna effettivamente lo stato con l'ultimo valore immesso nel campo di input
            }
        })
    }

    const dispatch = useDispatch();

    const handleSubmit = async () => {

        let formIsValid = true;

        if (newPost.title === '') {
            setValidationErrors(prevValue => {
                return {
                    ...prevValue,
                    title: 'title cannot be empty'
                }
            })
            formIsValid = false;
        }

        if (newPost.description === '') {
            setValidationErrors(prevValue => {
                return {
                    ...prevValue,
                    description: 'description cannot be empty'
                }
            })
            formIsValid = false;
        }

        if (newPost.imageUrl === '') {
            setValidationErrors(prevValue => {
                return {
                    ...prevValue,
                    imageUrl: 'imageUrl cannot be empty'
                }
            })
            formIsValid = false;
        }

        if (newPost.tags === '') {
            setValidationErrors(prevValue => {
                return {
                    ...prevValue,
                    tags: 'tags cannot be empty'
                }
            })
            formIsValid = false;
        }

        setIsValid(formIsValid);


        if (formIsValid) {
            console.log(`Sto inviando i dati ${newPost.title}, ${newPost.description}, ${newPost.imageUrl}, ${newPost.tags}`);
            setMessage({ text: 'Inserimento nuovo post...', type: 'info' });

            try {
                const res = await fetch('http://localhost:8000/posts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "authorization": `bearer ${user.accessToken}`
                    },
                    body: JSON.stringify(newPost),
                });

                if (res.ok) {
                    dispatch(addPost(await res.json()));

                    setNewPost({
                        title: '',
                        description: '',
                        imageUrl: '',
                        tags: '',
                    });
                    setMessage({ text: 'Post added successfully!', type: 'info' });
                    closeModal(false);
                } else {
                    setMessage({ text: 'Failed to add post.', type: 'error' });
                }
            } catch (e) {
                setMessage({ text: "Errore! Impossibile aggiungere il post", type: 'error' });
                console.error('Error adding post:', error);
            }
        } else {
            setMessage(null);
        }
    };

    console.log("newPost : ", newPost)
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
                <div className="inputs">
                    <div className="input">
                        <input type="text" id="title" name="title" placeholder="Titolo" onChange={(e) => handleChange(e)} />
                    </div>
                    {validationErrors.title && <div className="error-message">{validationErrors.title}</div>}
                    <div className="input">
                        <input type="text" id="description" name="description" placeholder="Descrizione" onChange={(e) => handleChange(e)} />
                    </div>
                    {validationErrors.description && <div className="error-message">{validationErrors.description}</div>}
                    <div className="input">
                        <input type="text" id="tags" name="tags" placeholder="Tags" onChange={(e) => handleChange(e)} />
                    </div>
                    {validationErrors.tags && <div className="error-message">{validationErrors.tags}</div>}
                    <div className="input">
                        <input type="text" id="imageUrl" name="imageUrl" placeholder="Image" onChange={(e) => handleChange(e)} />
                    </div>
                    {validationErrors.imageUrl && <div className="error-message">{validationErrors.imageUrl}</div>}
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

export default PostForm;

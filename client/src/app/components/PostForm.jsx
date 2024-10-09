//"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "../store/postsSlice";

const PostForm = ({ closeModal, initialPost = null, mode = 'add' }) => {
    const dispatch = useDispatch(); // Hook Redux per inviare azioni
    const user = useSelector(state => state.user); // Dati dell'utente loggato
    const [action, setAction] = useState("Aggiungi un Post");
    const [newPost, setNewPost] = useState({
        title: '',
        description: '',
        imageUrl: '',
        tags: '',
    });
    const [message, setMessage] = useState(null);
    const [validationErrors, setValidationErrors] = useState({
        title: '',
        description: '',
        imageUrl: '',
        tags: ''
    });

    // Precompila il form se si sta modificando un post
    useEffect(() => {
        if (initialPost) {
            setNewPost({
                title: initialPost.title,
                description: initialPost.description,
                imageUrl: initialPost.imageUrl,
                tags: initialPost.tags
            });
        }
    }, [initialPost]);

    /* useEffect(() => {
        // Se siamo in modalità "edit", inizializza il campo description con il commento esistente
        if (mode === 'edit' && initialComment) {
            setNewComment({ description: initialComment.description });
        }
    }, [mode, initialComment]); */

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValidationErrors(prevValue => ({...prevValue, [name]: '' }));
        setNewPost(prevState => ({ ...prevState, [name]: value }));
    };




    const handleSubmit = async () => {
        let formIsValid = true;

        // Validazione
        if (newPost.title === '') {
            setValidationErrors(prevValue => ({
                ...prevValue,
                title: 'Il titolo non può essere vuoto'
            }));
            formIsValid = false;
        }
        if (newPost.description === '') {
            setValidationErrors(prevValue => ({
                ...prevValue,
                description: 'La descrizione non può essere vuota'
            }));
            formIsValid = false;
        }
        if (newPost.imageUrl === '') {
            setValidationErrors(prevValue => ({
                ...prevValue,
                imageUrl: 'L\'URL dell\'immagine non può essere vuoto'
            }));
            formIsValid = false;
        }
        if (newPost.tags === '') {
            setValidationErrors(prevValue => ({
                ...prevValue,
                tags: 'I tag non possono essere vuoti'
            }));
            formIsValid = false;
        }

        if (!formIsValid) return;

        setMessage({ text: mode === 'edit' ? 'Aggiornamento del post...' : 'Inserimento nuovo post...', type: 'info' });
        //setMessage({ text: mode === 'edit' ? 'Aggiornamento del commento...' : mode === 'delete' ? 'Eliminazione del commento...' : 'Inserimento nuovo commento...', type: 'info' });

        const url = mode === 'edit'
            ? `http://localhost:8000/posts/${initialPost._id}` // Utilizza il postId se si modifica
            : 'http://localhost:8000/posts'; // Nuovo post

        const method = mode === 'edit' ? 'PATCH' : 'POST'; // Cambia metodo in base alla modalità

        try {
            const res = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${user.accessToken}`
                },
                body: JSON.stringify(newPost),
            });            

            if (res.ok) {
                const savedPost = await res.json();

                console.log("SAVEDPOST ", savedPost)
                
                if (mode === 'edit') {
                    dispatch(updatePost(savedPost)); // Aggiorna il post nello store Redux
                } else {
                    dispatch(addPost(savedPost)); // Aggiungi il nuovo post allo store Redux
                }

                setMessage({ text: mode === 'edit' ? 'Post aggiornato con successo!' : 'Post aggiunto con successo!', type: 'info' });
                closeModal(false);
            } else {
                setMessage({ text: 'Errore durante l\'invio del post.', type: 'error' });
                //setMessage({ text: `Errore nell'operazione: ${mode}`, type: 'error' });
            }
        } catch (error) {
            setMessage({ text: 'Errore nella richiesta.', type: 'error' });
            //setMessage({ text: `Errore durante l'operazione: ${mode}`, type: 'error' });
        }
    };






    /* const handleSubmit = async () => {

        let formIsValid = true;

        if (newPost.title === '') {
            setValidationErrors(prevValue => {
                return {
                    ...prevValue,
                    title: 'Il titolo non può essere vuoto'
                }
            })
            formIsValid = false;
        }

        if (newPost.description === '') {
            setValidationErrors(prevValue => {
                return {
                    ...prevValue,
                    description: 'La descrizione non può essere vuota'
                }
            })
            formIsValid = false;
        }

        if (newPost.imageUrl === '') {
            setValidationErrors(prevValue => {
                return {
                    ...prevValue,
                    imageUrl: 'L\'URL dell\'immagine non può essere vuoto'
                }
            })
            formIsValid = false;
        }

        if (newPost.tags === '') {
            setValidationErrors(prevValue => {
                return {
                    ...prevValue,
                    tags: 'I tag non possono essere vuoti'
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
                        "Authorization": `Bearer ${user.accessToken}`
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
    }; */

    //console.log("newPost : ", newPost)
    //console.log("validationErrors : ", validationErrors)

    return (
        <div className="modalBackground">
            <div className="containerLogin">
                <div className="titleCloseBtn">
                    <button onClick={() => closeModal(false)}> X </button>
                </div>
                <div className="headerLogin">
                    <div className="text">{action}</div>
                    {/* <div className="text">{mode === 'edit' ? 'Modifica Commento' : mode === 'delete' ? 'Conferma Eliminazione' : 'Aggiungi un Commento'}</div> */}
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
                    <div className={action === "Aggiungi un Post" ? "submit gray" : "submit"}
                        onClick={() => {
                            closeModal(false)
                        }}
                    >Annulla</div>
                    <div className={action === "Annulla" ? "submit gray" : "submit"}
                        onClick={() => {
                            setAction("Aggiungi un Post")
                            handleSubmit()
                        }}
                    >Invia</div>
                </div>
            </div>
        </div>
    )
};

export default PostForm;

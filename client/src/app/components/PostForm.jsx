//"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation"; // Importa il router di Next.js
import { addPost, updatePost, deletePost } from "../store/postsSlice";

const PostForm = ({ closeModal, initialPost = null, mode = 'add' }) => {
    const dispatch = useDispatch(); // Hook Redux per inviare azioni
    const router = useRouter(); // Hook per navigare programmaticamente
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
        // Se siamo in modalità "edit", inizializza i campo del form con il post esistente
        if (mode === 'edit' && initialPost) {
            console.log("INITIALPOST ", initialPost)
            setNewPost({
                title: initialPost.title,
                description: initialPost.description,
                imageUrl: initialPost.imageUrl,
                tags: initialPost.tags
            });
        }
    }, [mode, initialPost]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValidationErrors(prevValue => ({ ...prevValue, [name]: '' }));
        setNewPost(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async () => {
        let formIsValid = true;

        if (mode !== 'delete') { // La validazione si applica solo se non siamo in modalità delete
            let formIsValid = true;

            if (newPost.title === '') {
                setValidationErrors(prevValue => ({
                    ...prevValue,
                    title: 'Il titolo non può essere vuoto'
                }));
                //return;
                formIsValid = false;
            }
            if (newPost.description === '') {
                setValidationErrors(prevValue => ({
                    ...prevValue,
                    description: 'La descrizione non può essere vuota'
                }));
                //return;
                formIsValid = false;
            }
            if (newPost.imageUrl === '') {
                setValidationErrors(prevValue => ({
                    ...prevValue,
                    imageUrl: 'L\'URL dell\'immagine non può essere vuoto'
                }));
                //return;
                formIsValid = false;
            }
            if (newPost.tags === '') {
                setValidationErrors(prevValue => ({
                    ...prevValue,
                    tags: 'I tag non possono essere vuoti'
                }));
                //return;
                formIsValid = false;
            }

            if (!formIsValid) {
                return;
            }
        }



        setMessage({ text: mode === 'edit' ? 'Aggiornamento del post...' : mode === 'delete' ? 'Eliminazione del post...' : 'Inserimento nuovo post...', type: 'info' });

        const url = mode === 'edit'
            ? `http://localhost:8000/posts/${initialPost._id}` // Utilizza il postId se si modifica
            : mode === 'delete'
                ? `http://localhost:8000/posts/${initialPost._id}`
                : 'http://localhost:8000/posts'; // Nuovo post

        const method = mode === 'edit' ? 'PATCH' : mode === 'delete' ? 'DELETE' : 'POST'; // Cambia metodo in base alla modalità

        try {

            // Costruisce il payload in base alla modalità
            const payload = {
                title: newPost.title,
                description: newPost.description,
                imageUrl: newPost.imageUrl,
                tags: newPost.tags,
            };

            // Aggiunge solo i campi `userId` e `updatedAt` in modalità `edit`
            if (mode === 'edit') {
                payload.userId = user._id;   // Include userId solo se stai modificando
                payload.updatedAt = Date.now(); // Aggiorna la data solo in `edit`
            }

            const res = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${user.accessToken}`
                },
                body: JSON.stringify(payload), // Usa il payload condizionale
            });

            // Aggiungi solo i campi `userId` e `updatedAt` in modalità `edit`
            if (mode === 'edit') {
                payload.userId = user._id;   // Include userId solo se stai modificando
                payload.updatedAt = Date.now(); // Aggiorna la data solo in `edit`
            }

            //const responseBody = await res.json();
            //console.log('Server response:', responseBody); // Aggiungi questo log


            // Controllo del codice di stato HTTP
            if (!res.ok) {
                console.error(`Errore dal server: ${res.status} - ${res.statusText}`);
                const errorResponse = await res.text(); // Leggi la risposta testuale dell'errore
                console.error('Dettaglio errore:', errorResponse);
                setMessage({ text: `Errore durante l'invio del post: ${res.status} - ${res.statusText}`, type: 'error' });
                return;
            }



            if (res.ok) {
                if (mode === 'delete') {
                    // Dispatch dell'azione per rimuovere il post
                    dispatch(deletePost({ postId: initialPost._id }));
                    setMessage({ text: 'Post eliminato con successo!', type: 'info' });
                    // Reindirizza l'utente alla pagina blog dopo l'eliminazione del post
                    router.push('/blog');
                } else {
                    const savedPost = await res.json();

                    if (mode === 'edit') {
                        dispatch(updatePost(savedPost)); // Aggiorna il post nello store Redux
                    } else {
                        dispatch(addPost(savedPost)); // Aggiungi il nuovo post allo store Redux
                    }

                    setMessage({ text: mode === 'edit' ? 'Post aggiornato con successo!' : 'Post aggiunto con successo!', type: 'info' });
                    setNewPost({
                        title: '',
                        description: '',
                        imageUrl: '',
                        tags: ''
                    });
                }
                closeModal(); // Chiude il modale dopo aver completato l'operazione
            } else {
                setMessage({ text: 'Errore durante l\'invio del post.', type: 'error' });
                //setMessage({ text: `Errore nell'operazione: ${mode}`, type: 'error' });
            }
        } catch (error) {
            setMessage({ text: 'Errore nella richiesta.', type: 'error' });
        }
    };




    /* const handleSubmit = async () => {
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
    }; */



    return (
        <div className="modalBackground">
            <div className="containerLogin">
                <div className="titleCloseBtn">
                    <button onClick={() => closeModal(false)}> X </button>
                </div>
                <div className="headerLogin">
                    <div className="text">{mode === 'edit' ? 'Modifica Commento' : mode === 'delete' ? 'Conferma Eliminazione' : 'Aggiungi un Commento'}</div>
                    <div className="underline"></div>
                </div>
                <div className="inputs">
                    {mode === 'delete' ? (
                        <>
                            <p>Sei sicuro di voler eliminare questo post?</p>
                            <p className="italic">"{initialPost?.title}"</p>
                        </>
                    ) : (



                        <>
                            <div className="input">
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={newPost.title} // Collega il valore dello stato
                                    placeholder="Titolo"
                                    onChange={handleChange}
                                />
                            </div>
                            {validationErrors.title && <div className="error-message">{validationErrors.title}</div>}
                            <div className="input">
                                <input
                                    type="text"
                                    id="description"
                                    name="description"
                                    value={newPost.description} // Collega il valore dello stato
                                    placeholder="Descrizione"
                                    onChange={handleChange}
                                />
                            </div>
                            {validationErrors.description && <div className="error-message">{validationErrors.description}</div>}
                            <div className="input">
                                <input
                                    type="text"
                                    id="tags"
                                    name="tags"
                                    value={newPost.tags} // Collega il valore dello stato
                                    placeholder="Tags"
                                    onChange={handleChange}
                                />
                            </div>
                            {validationErrors.tags && <div className="error-message">{validationErrors.tags}</div>}
                            <div className="input">
                                <input
                                    type="text"
                                    id="imageUrl"
                                    name="imageUrl"
                                    value={newPost.imageUrl} // Collega il valore dello stato
                                    placeholder="Image"
                                    onChange={handleChange}
                                />
                            </div>
                            {validationErrors.imageUrl && <div className="error-message">{validationErrors.imageUrl}</div>}
                        </>
                    )}
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

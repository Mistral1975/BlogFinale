// app/components/TagsTitle.jsx
import { useSelector, useDispatch } from "react-redux";
import React, { useState } from 'react';
import { addPost } from "../store/postsSlice";

const TagsTitle = () => {
    const user = useSelector(state => state.user);
    const posts = useSelector(state => state.postblog.postsList);
    const dispatch = useDispatch();

    //const [showForm, setShowForm] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [newPost, setNewPost] = useState({
        title: '',
        description: '',
        imageUrl: '',
        tags: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPost({ ...newPost, [name]: value });

    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost:8000/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": `bearer ${user.accessToken}`
                },
                body: JSON.stringify(newPost),
            });

            if (response.ok) {
                const addedPost = await response.json();
                //console.log('Added Post:', addedPost); // Per debug
                dispatch(addPost(addedPost)); // Dispatch dell'azione Redux per aggiungere il post

                console.log('Post added successfully');

                setNewPost({
                    title: '',
                    description: '',
                    imageUrl: '',
                    tags: '',
                });
                //closeForm(); // Chiudi il form dopo l'aggiunta del post
                handleCloseModal();
            } else {
                console.error('Failed to add post');
            }
        } catch (error) {
            console.error('Error adding post:', error);
        }
    };

    //const openForm = () => setShowForm(true);
    //const closeForm = () => setShowForm(false);
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    return (
        <>
            <div className="space-y-2 pb-8 pt-6 md:space-y-5">
                <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">Ultimi post</h1>
                <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">Gli ultimi 5 post pubblicati sul blog</p>
            </div>
            {user.email && (
                <>
                    <div className="flex justify-end">
                        <button onClick={handleOpenModal}>Aggiungi nuovo post</button>
                    </div>
                    {openModal && (

                        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSubmit();
                                    handleCloseModal();
                                }}>
                                    <div>
                                        <label htmlFor="title">Titolo:</label>
                                        <input className="dark:bg-gray-700" type="text" id="title" name="title" value={newPost.title} onChange={handleInputChange} required />
                                    </div>
                                    <div>
                                        <label htmlFor="description">Descrizione:</label>
                                        <textarea className="dark:bg-gray-700" id="description" name="description" value={newPost.description} onChange={handleInputChange} required />
                                    </div>
                                    <div>
                                        <label htmlFor="tags">Tags (separati da virgola):</label>
                                        <input className="dark:bg-gray-700" type="text" id="tags" name="tags" value={newPost.tags} onChange={handleInputChange} required />
                                    </div>
                                    <div>
                                        <label htmlFor="imageUrl">Image (Url dell'immagine):</label>
                                        <input className="dark:bg-gray-700" type="text" id="imageUrl" name="imageUrl" value={newPost.imageUrl} onChange={handleInputChange} />
                                    </div>
                                    <div className="flex justify-end space-x-4 mt-4">
                                        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Aggiungi</button>
                                        <button type="button" className="bg-red-500 text-white py-2 px-4 rounded" onClick={handleCloseModal}>Annulla</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </>
            )}            
        </>
    )
}

export default TagsTitle;
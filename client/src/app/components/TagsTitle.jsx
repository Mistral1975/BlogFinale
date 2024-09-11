// app/components/TagsTitle.jsx
import React, { useState } from 'react';
import { useSelector } from "react-redux";
import PostForm from './PostForm';

const TagsTitle = () => {
    const user = useSelector(state => state.user);
    const posts = useSelector(state => state.postblog.postsList);    
    const [openModal, setOpenModal] = useState(false);    
    const handleOpenModal = () => setOpenModal(true);

    return (
        <>
            <div className="space-y-2 pb-8 pt-6 md:space-y-5">
                <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">Ultimi post</h1>
                <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">Gli ultimi 5 post pubblicati sul blog</p>
            </div>
            {user.email && (
                <>
                    <div className="flex justify-end">
                        <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={handleOpenModal}>
                            Aggiungi nuovo post
                        </button>
                    </div>
                    {openModal && <PostForm closeModal={setOpenModal} />}          
                </>
            )}            
        </>
    )
}

export default TagsTitle;
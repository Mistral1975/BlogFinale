// components/Like.jsx
"use client"

//import React, { useState } from 'react'
//import { AiFillLike } from 'react-icons/ai'

/* function Like() {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    const handleClick = () => {
        if (liked) {
            setLiked(false);
            setLikeCount(likeCount - 1);
        } else {
            setLiked(true);
            setLikeCount(likeCount + 1);
        }
    };

    return (
        <div onClick={handleClick} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <AiFillLike color={liked ? "aqua" : "gray"} size="25" />
            <span style={{ marginLeft: '10px', fontSize: '24px' }}>{likeCount}</span>
        </div>
    )
} */

import React from 'react';
import { AiFillLike } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { toggleLike } from '../store/postsSlice'; // Azione Redux per gestire il like

function Like({ postId }) {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user); // Ottiene i dati dell'utente loggato
    const post = useSelector(state => state.postblog.postsList.find(post => post._id === postId)); // Recupera il post dal Redux store
    //const liked = post?.likedBy.includes(user._id); // Verifica se l'utente ha già messo like
    //const likeCount = post?.likes || 0; // Otteniamo il numero di like dal post


    if (!post) {
        console.error('Post non trovato nel Redux store per postId:', postId); // Log di errore se il post non è trovato
        return null;
    }

    // Aggiungi un controllo per verificare se `likedBy` esiste prima di chiamare `.includes()`
    const liked = post.likedBy ? post.likedBy.includes(user._id) : false; // Se likedBy non esiste, imposta liked su false
    const likeCount = post.likes ? post.likes.length : 0; // Se likes non esiste, imposta likeCount su 0

    // Gestione del click sul like
    const handleClick = () => {
        dispatch(toggleLike({ postId, userId: user._id, liked }));
    };

    return (
        <div onClick={handleClick} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <AiFillLike color={liked ? "aqua" : "gray"} size="25" />
            <span style={{ marginLeft: '10px', fontSize: '24px' }}>{likeCount}</span>
        </div>
    );
}

export default Like;

// components/Like.jsx
"use client"

import React from 'react';
import { AiFillLike } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { toggleLike } from '../store/postsSlice'; // Azione Redux per gestire il like

function Like({ postId }) {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user); // Ottiene i dati dell'utente loggato
    const post = useSelector(state => state.postblog.postsList.find(post => post._id === postId)); // Recupera il post dal Redux store

    if (!post) {
        console.error('Post non trovato nel Redux store per postId:', postId); // Log di errore se il post non è trovato
        return null;
    }
/*
    // Controlla se l'utente è loggato
    if (!user || !user._id) {
        console.log('Utente non loggato, non può mettere like'); // Log per utente non loggato
        return null; // Se l'utente non è loggato, non mostriamo il pulsante like
    }

    // Controlla se l'utente è il proprietario del post
    if (post.userId._id === user._id) {
        console.log('Proprietario del post, non può mettere like'); // Log per il proprietario del post
        return null; // Se l'utente è il proprietario del post, non mostriamo il pulsante like
    }*/

    // Aggiungi un controllo per verificare se `likedBy` esiste prima di chiamare `.includes()`
    const liked = post.likes ? post.likes.includes(user._id) : false; // Se likedBy non esiste, imposta liked su false
    const likeCount = post.likes ? post.likes.length : 0; // Se likes non esiste, imposta likeCount su 0
/*
    // Gestione del click sul like
    const handleClick = () => {
        dispatch(toggleLike({ postId, userId: user._id }));
    };*/

    // Funzione per gestire il click sul like
    const handleClick = () => {
        // Solo se l'utente è loggato e non è il proprietario del post
        if (user && user._id !== post.userId._id) {
            dispatch(toggleLike({ postId, userId: user._id }));
        }
    };

    // Verifica se il pulsante dovrebbe essere disabilitato
    const isDisabled = !user || !user._id || user._id === post.userId._id; // Aggiunge controllo per !user._id

    return (
        <>
        {/* <div onClick={handleClick} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <AiFillLike color={liked ? "aqua" : "gray"} size="25" />
            <span style={{ marginLeft: '10px', fontSize: '24px', userSelect: 'none' }}>{likeCount}</span>
        </div> */}
        <div 
        onClick={!isDisabled ? handleClick : null}  // Rendi cliccabile solo se non è disabilitato
        style={{ 
            cursor: isDisabled ? 'not-allowed' : 'pointer',  // Cambia il cursore se è disabilitato
            display: 'flex', 
            alignItems: 'center', 
            opacity: isDisabled ? 0.6 : 1  // Riduci opacità se disabilitato
        }}
    >
        <AiFillLike color={liked ? "aqua" : "gray"} size="25" />
        <span style={{ marginLeft: '10px', fontSize: '24px', userSelect: 'none' }}>{likeCount}</span>
    </div>
    </>
    );
}

export default Like;

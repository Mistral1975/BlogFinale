// store/postsSlice.jsx
//import { createSlice } from "@reduxjs/toolkit";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Funzione asincrona (thunk) per gestire il toggle del like
export const toggleLike = createAsyncThunk(
    'postblog/toggleLike',
    async ({ postId, userId, liked }, { rejectWithValue, getState }) => {
        const state = getState(); // Ottiene lo stato globale per accedere ai dati dell'utente
        const token = state.user.accessToken; // Ottiene il token di autenticazione dall'utente loggato
        try {
            const response = await fetch(`http://localhost:8000/posts/${postId}/like`, {
                method: liked ? 'DELETE' : 'POST', // Se l'utente ha già messo like, lo rimuoviamo
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Passiamo il token di autenticazione
                },
                body: JSON.stringify({ userId })
            });
            if (!response.ok) throw new Error('Errore nell\'aggiornamento del like');
            return await response.json(); // Restituiamo il post aggiornato con il nuovo conteggio dei like
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    postsList: [],
    comments: {},
    commentsCount: {},
    tagsPostList: [],
    latestPosts: [],
    singlePost: null, // campo per il singolo post selezionato
    loading: false,
    error: null,
    prevPost: null,
    nextPost: null,
}

const postsSlice = createSlice({
    name: "postblog",
    initialState,
    reducers: {
        setList: (state, action) => {
            console.log(`Sto caricando la postlist su REDUX`);
            state.postsList = action.payload;
        },
        setTagsPostsList: (state, action) => {
            state.tagsPostList = action.payload;
        },
        setSinglePost: (state, action) => {
            state.singlePost = action.payload.singlePost;
            state.prevPost = action.payload.prevPost;
            state.prevPost = action.payload.nextPost;
            console.log("state.singlePost ----> ", state.singlePost)
            console.log("state.prevPost ----> ", state.prevPost)
            console.log("state.nextPost ----> ", state.nextPost)
        },
        addPost: (state, action) => {
            state.postsList.push(action.payload);
        },
        updatePost: (state, action) => {
            const updatedPost = action.payload;
            const index = state.postsList.findIndex(post => post._id === updatedPost._id);
            if (index !== -1) {
                state.postsList[index] = {
                    ...state.postsList[index], // Mantieni i dettagli esistenti
                    ...updatedPost,
                    userId: state.postsList[index].userId // Mantieni i dettagli dell'utente
                };
            }
        },
        deletePost: (state, action) => {
            state.postsList = state.postsList.filter(item => item._id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(toggleLike.fulfilled, (state, action) => {
                const updatedPost = action.payload; // Riceviamo il post aggiornato dal backend
                const index = state.postsList.findIndex(post => post._id === updatedPost._id);
                if (index !== -1) {
                    state.postsList[index] = updatedPost; // Aggiorniamo il post nel Redux store
                }
            })
            .addCase(toggleLike.rejected, (state, action) => {
                state.error = action.payload; // Gestiamo l'errore in caso di fallimento della richiesta
            });
    },
});

export const { setList, setTagsPostsList, setSinglePost, addPost, updatePost, deletePost } = postsSlice.actions;
export default postsSlice.reducer;
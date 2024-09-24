import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    listComments: {}, // Oggetto per memorizzare i commenti per postId
    commentsCount: {}, // Oggetto per memorizzare il conteggio dei commenti per postId
};

const commentsSlice = createSlice({
    name: "comments",
    initialState,
    reducers: {
        addComment: (state, action) => {          
            const { postId, listComments } = action.payload;

            if (!state.listComments[postId]) {
                state.listComments[postId] = [];
            }
            state.listComments[postId].push(listComments);

            // Aggiorna il conteggio dei commenti
            if (!state.commentsCount[postId]) {
                state.commentsCount[postId] = 0;
            }
            state.commentsCount[postId] += 1;
            state.forceReload = !state.forceReload; // Inverte il valore di forceReload per forzare l'esecuzione di useEffect dopo l'aggiunta di un commento
        },

        deleteComment: (state, action) => {
            const { postId, commentId } = action.payload;

            if (state.listComments[postId]) {
                state.listComments[postId] = state.listComments[postId].filter(
                    comment => comment.id !== commentId
                );

                // Aggiorna il conteggio dei commenti
                if (state.commentsCount[postId]) {
                    state.commentsCount[postId] -= 1;
                    state.forceReload = !state.forceReload; // Inverte il valore di forceReload per forzare l'esecuzione di useEffect dopo l'eliminazione di un commento
                }
            }
        },

        editComment: (state, action) => {
            const { postId, commentId, listComments } = action.payload;          

            if (state.listComments[postId]) {
                const commentIndex = state.listComments[postId].findIndex(
                    comment => comment.id === commentId
                );

                if (commentIndex !== -1) {
                    state.listComments[postId][commentIndex] = {
                        ...state.listComments[postId][commentIndex],
                        ...listComments
                    };
                    state.forceReload = !state.forceReload; // Inverte il valore di forceReload per forzare l'esecuzione di useEffect dopo la modifica di un commento
                }
            }
        },

        setListComments: (state, action) => {            
            const { postId, listComments } = action.payload;
            state.listComments[postId] = listComments;
        },

        setCommentsCount: (state, action) => {            
            const { postId, commentsCount } = action.payload;
            state.commentsCount[postId] = commentsCount;
        },
    },
});

export const { addComment, deleteComment, editComment, setListComments, setCommentsCount } = commentsSlice.actions;
export default commentsSlice.reducer;
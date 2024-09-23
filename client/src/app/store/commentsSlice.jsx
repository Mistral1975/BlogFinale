import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    comments: {}, // Oggetto per memorizzare i commenti per postId
    commentsCount: {}, // Oggetto per memorizzare il conteggio dei commenti per postId
};

const commentsSlice = createSlice({
    name: "comments",
    initialState,
    reducers: {
        addComment: (state, action) => {
            const { postId, comment } = action.payload;

            if (!state.comments[postId]) {
                state.comments[postId] = [];
            }
            state.comments[postId].push(comment);

            // Aggiorna il conteggio dei commenti
            if (!state.commentsCount[postId]) {
                state.commentsCount[postId] = 0;
            }
            state.commentsCount[postId] += 1;
        },

        deleteComment: (state, action) => {
            const { postId, commentId } = action.payload;

            if (state.comments[postId]) {
                state.comments[postId] = state.comments[postId].filter(
                    comment => comment.id !== commentId
                );

                // Aggiorna il conteggio dei commenti
                if (state.commentsCount[postId]) {
                    state.commentsCount[postId] -= 1;
                }
            }
        },

        editComment: (state, action) => {
            const { postId, commentId, updatedComment } = action.payload;

            if (state.comments[postId]) {
                const commentIndex = state.comments[postId].findIndex(
                    comment => comment.id === commentId
                );

                if (commentIndex !== -1) {
                    state.comments[postId][commentIndex] = {
                        ...state.comments[postId][commentIndex],
                        ...updatedComment
                    };
                }
            }
        },

        setComments: (state, action) => {
            const { postId, comments } = action.payload;

            state.comments[postId] = comments;
            state.commentsCount[postId] = comments.length;
        }
    },
});

export const { addComment, deleteComment, editComment, setComments } = commentsSlice.actions;
export default commentsSlice.reducer;
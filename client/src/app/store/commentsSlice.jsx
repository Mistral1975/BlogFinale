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
            console.log("state in addComment: ", state)
            console.log("action in addComment: ", action)
            
            const { postId, comment } = action.payload;

            console.log("action.payload in addComment: ", action.payload)
            console.log("postId in addComment: ", postId)
            console.log("comment in addComment: ", comment)

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
            console.log("state in deleteComment: ", state)
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
            console.log("state in editComment: ", state)
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

        setListComments: (state, action) => {            
            const { postId, comments } = action.payload;
            state.comments[postId] = comments;
            state.commentsCount[postId] = comments.length;
            console.log("state in setListComments: ", state)
            console.log("action in setListComments: ", action)
            console.log("action.payload in setListComments: ", action.payload)
            console.log("state.comments in setListComments: ", comments)
            console.log("state.commentsCount in setListComments: ", comments.length)
        }
    },
});

export const { addComment, deleteComment, editComment, setListComments } = commentsSlice.actions;
export default commentsSlice.reducer;
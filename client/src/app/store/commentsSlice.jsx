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
            console.log("state in addComment: ", state)
            console.log("action in addComment: ", action)
            
            const { postId, listComments } = action.payload;

            console.log("action.payload in addComment: ", action.payload)
            console.log("postId in addComment: ", postId)
            console.log("comment in addComment: ", listComments)
            console.log("state.listComments[postId] ", state.listComments[postId])

            if (!state.listComments[postId]) {
                state.listComments[postId] = [];
            }
            state.listComments[postId].push(listComments);

            // Aggiorna il conteggio dei commenti
            if (!state.commentsCount[postId]) {
                state.commentsCount[postId] = 0;
            }
            state.commentsCount[postId] += 1;
        },

        deleteComment: (state, action) => {
            console.log("state in deleteComment: ", state)
            const { postId, commentId } = action.payload;

            if (state.listComments[postId]) {
                state.listComments[postId] = state.listComments[postId].filter(
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

            if (state.listComments[postId]) {
                const commentIndex = state.listComments[postId].findIndex(
                    comment => comment.id === commentId
                );

                if (commentIndex !== -1) {
                    state.listComments[postId][commentIndex] = {
                        ...state.listComments[postId][commentIndex],
                        ...updatedComment
                    };
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
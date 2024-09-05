import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    commentsList: [],
    comments: {}, // Oggetto per memorizzare i commenti per postId
    commentsCount: {}, // Oggetto per memorizzare il conteggio dei commenti per postId
};

const commentsSlice = createSlice({
    name: "comments",
    initialState,
    reducers: {
        setComments: (state, action) => {
            const { postId, comments } = action.payload;
            state.comments[postId] = comments;
        },
        setCommentsCount: (state, action) => {
            const { postId, commentsCount } = action.payload;
            state.commentsCount[postId] = commentsCount;
        },
        addComment: (state, action) => {
            //console.log(`Sto aggiungento un COMMENTO alla commentsList su REDUX`);
            state.commentsList.push(action.payload);
        },
        updateComment: (state, action) => {
            const updateComment = action.payload;
            const index = state.commentsList.findIndex(comment => comment._id === updateComment._id);
            if (index !== -1) {
                state.commentsList[index] = {
                    ...state.commentsList[index], // Mantieni i dettagli esistenti
                    ...updateComment,
                    userId: state.commentsList[index].userId // Mantieni i dettagli dell'utente
                };
            }
        },
        deleteComment: (state, action) => {
            //console.log(`Sto eliminando un COMMENTO dalla commentsList su REDUX`);
            state.commentsList = state.commentsList.filter(item => item._id !== action.payload);
        },
    },
});

export const { setComments, setCommentsCount, addComment, updateComment, deleteComment } = commentsSlice.actions;
export default commentsSlice.reducer;

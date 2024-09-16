import { createSlice } from "@reduxjs/toolkit";

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
    }
})

export const { setList, setTagsPostsList, setSinglePost, addPost, updatePost, deletePost } = postsSlice.actions;
export default postsSlice.reducer 
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
        /* setComments(state, action) {
            const { postId, comments } = action.payload;
            state.comments[postId] = comments;
        },
        setCommentsCount(state, action) {
            const { postId, commentsCount } = action.payload;
            state.commentsCount[postId] = commentsCount;
        }, */
        setTagsPostsList: (state, action) => {
            //console.log(`Sto caricando la postsList su REDUX`);
            state.tagsPostList = action.payload;
        },
        setSinglePost: (state, action) => {
            /* state.singlePost = action.payload;
            console.log(state.singlePost)
            state.loading = false;
            state.error = null; */

            state.singlePost = action.payload.singlePost;
            state.prevPost = action.payload.prevPost;
            state.prevPost = action.payload.nextPost;
            console.log("state.singlePost ----> ", state.singlePost)
            console.log("state.prevPost ----> ", state.prevPost)
            console.log("state.nextPost ----> ", state.nextPost)
        },



        addPost: (state, action) => {
            //console.log(`Sto aggiungento un POST alla postsList su REDUX`);
            state.postsList.push(action.payload);
        },
        /*updatePost: (state, action) => {
            //console.log(`Sto modificando un POST alla postsList su REDUX`);
            //console.log("action.payload      ", action.payload)
            const index = state.postsList.findIndex(post => post._id === action.payload._id);
            if (index !== -1) {
                state.postsList[index] = action.payload;
            }
            return state;

            //const { _id, ...updatedPost } = action.payload;
            //const index = state.postsList.findIndex(post => post._id === _id);
            //if (index !== -1) {
            //state.postsList[index] = { ...state.postsList[index], ...updatedPost };
            //}
        },*/

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





        /* updatePost: (state, action) => {
            const updatedPosts = state.postsList.map(post => post._id === action.payload._id ? action.payload : post);
            state.postsList[index].updatedAt = action.payload.updatedAt;
            return { ...state, postsList: updatedPosts };
        }, */

        deletePost: (state, action) => {
            //console.log(`Sto eliminando un POST alla postsList su REDUX`);
            state.postsList = state.postsList.filter(item => item._id !== action.payload);
        },
    }
})

export const { setList, /* setComments, setCommentsCount, */ setTagsPostsList, setSinglePost, addPost, updatePost, deletePost } = postsSlice.actions;
export default postsSlice.reducer 
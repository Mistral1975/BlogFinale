import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    tagsList: [],
}
const tagsSlice = createSlice({
    name: "tagsblog",
    initialState,
    reducers: {
        setTagsList: (state, action) => {
            state.tagsList = action.payload;
        },
    }
})

export const { setTagsList } = tagsSlice.actions;
export default tagsSlice.reducer 
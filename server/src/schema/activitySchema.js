// src/schema/activitySchema.js

import { Schema, model } from "mongoose";

const activitySchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, default: null },
    //userId: { type: Schema.Types.ObjectId, default: null },
    userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    categoryId: { type: String },
    likes: { type: [Schema.Types.ObjectId], default: [] }, // Array di ID utente che hanno messo like
    //likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array di ID utente
    tags: [{ type: String, default: null }],
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        writeConcern: { w: 1, wtimeout: 1000 },
    }
})
activitySchema.index({ title: 1 });

export default model('activity', activitySchema);
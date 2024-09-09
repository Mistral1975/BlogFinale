import { Schema, model } from "mongoose";

const commentSchema = new Schema({
    description: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'user' }, // Riferimento al modello User
    postId: { type: Schema.Types.ObjectId, ref: 'activity' }, // Riferimento al modello Activity (schema post)
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        writeConcern: { w: 1, wtimeout: 1000 },
    }
})
commentSchema.index({ title: 1 });

export default model('Comment', commentSchema);
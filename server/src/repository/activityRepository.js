import activitySchema from "../schema/activitySchema.js";
import commentSchema from "../schema/commentSchema.js";
import { normalizeTags } from '../utils/utils.js';

const addPost = async (content) => {
    return await new activitySchema(content).save();
}

const updatePost = async (id, content) => {
    if (content.updatedAt) {
        content.updatedAt = new Date(content.updatedAt * 1000);
    }
    return await activitySchema.findOneAndUpdate({ _id: id, userId: content.userId }, content, { new: true });
}

const removePost = async (id, userId) => {
    return await activitySchema.findOneAndDelete({ _id: id, userId: userId }).catch((error) => {
        error.status = 500;
        throw error;
    });
}

/*const getList = async () => {
    return await activitySchema.find({}).populate('comments');
}*/

const getList = async () => {
    //return await activitySchema.find({});
    return await activitySchema.find({}).populate('userId', 'displayName email');
}

const getListByTags = async (tags) => {
    return await activitySchema.find({
        tags: { $in: tags } // Cerca post con il tag nell'array 'tags'
    });
}

/* const getTagsList = async () => {
    return await activitySchema.find({}).populate('tags');
} */
// Eseguo una query di "aggregazione" per ottenere la lista dei tag senza duplicati e con il loro conteggio esatto
const getTagsList = async () => {
    return await activitySchema.aggregate([
        { $unwind: "$tags" }, // Decompone l'array dei tag
        { $group: { _id: "$tags", count: { $sum: 1 } } }, // Raggruppa per tag e conta le occorrenze
        { $project: { _id: 0, tag: "$_id", count: 1 } }, // Proietta il risultato nel formato desiderato
        { $sort: { tag: 1 } } // Ordina alfabeticamente i tag
    ]);
}

/* const getPost = async (id) => {
    return await activitySchema.findOne({ _id: id });
} */

const getPost = async (postId) => {
    const post = await Activity.findById(postId).populate('comments');

    if (!post) {
        throw new Error('Post non trovato');
    }

    // Conta i commenti associati al post
    const commentsCount = await Comment.countDocuments({ _id: { $in: post.comments } });

    // Aggiungi il conteggio dei commenti al risultato
    const responseData = {
        ...post.toJSON(),
        commentsCount: commentsCount,
    };

    return responseData;
};

const addComment = async (id, content) => {
    const comment = new commentSchema({
        description: content.description,
        postId: id,
        userId: content.userId,
        createdAt: Date.now(),
        updatedAt: Date.now()
    });

    return await comment.save(); // Salva il documento commento


    //return comment; // Restituisci il commento creato (facoltativo)

    //return await new commentSchema(content).save();

}

const updateComments = async (commentId, content) => {
    if (content.dueDate) {
        content.dueDate = new Date(content.dueDate * 1000);
    }
    return await commentSchema.findOneAndUpdate({ _id: commentId, userId: content.userId }, content, { new: true });
}

const removeComments = async (id, commentId, userId) => {

    // Trova e verifica l'esistenza del commento
    const comment = await commentSchema.findOne({ _id: commentId });

    if (!comment) {
        throw new Error('Commento non trovato');
    }

    const commentUserId = comment.userId.toString();

    // Verifica l'autorizzazione all'eliminazione del commento
    if (userId !== commentUserId) {
        throw new Error('Non sei autorizzato a eliminare questo commento');
    }

    // Elimina il commento dal database
    const commentDeleted = await commentSchema.findOneAndDelete({ _id: commentId });

    if (!commentDeleted) {
        throw new Error('Commento non trovato');
    }

    return { message: 'Commento eliminato con successo' }; // Restituisce un messaggio di successo*/
}

/*const getCommentsByPostId = async (id) => {
    //return await activitySchema.findById({id}).populate('comments');

    const post = await activitySchema.findOne({ _id: id }).populate('comments'); // Popola i commenti per il post specificato

    if (!post) {
        throw new Error('Post non trovato');
    }

    return post.comments; // Restituisce la lista di commenti per il post specificato
}*/

/* const getCommentsByPostId = async (postId, page, limit) => {
    const skip = (page - 1) * limit;
    const comments = await commentSchema.find({ postId: postId })
        .populate('userId', 'displayName')
        .skip(skip)
        .limit(limit)
        .exec();
    return comments;
} */

const getCommentsByPostId = async (postId) => {
    const comments = await commentSchema.find({ postId: postId })
        .populate('userId', 'displayName')
        .exec();
    return comments;
}

const normalizeAllTags = async () => {
    const posts = await activitySchema.find({});    // Step 1: Recupera tutti i post dal database    

    const normalizedPosts = posts.map(post => {     // Step 2: Normalizza i tag di ogni post 
        return {
            ...post._doc,
            tags: normalizeTags(post.tags.join(',')) // Unisci i tag per passarli come stringa alla funzione di normalizzazione
        };
    });
    //console.log(normalizedPosts)

    for (const post of normalizedPosts) {           // Step 3: Aggiorna i post nel database con i tag normalizzati
        await activitySchema.findOneAndUpdate({ _id: post._id }, { tags: post.tags }, { new: true });
        //console.log(post._id, post.tags)
    }
}

const modificaCommenti = async () => {
    const posts = await activitySchema.find({});    // Step 1: Recupera tutti i post dal database    

    for (const post of posts) {
        // Step 3: Itera sui commenti di ogni post
        for (const commentId of post.comments) {
            // Step 4: Aggiorna il campo postId di ogni commento con il valore corretto
            await commentSchema.findOneAndUpdate(
                { _id: commentId },
                { postId: post._id },
                { new: true }
            );
        }
    }
}

const likePost = async (id, userId) => {
    const post = await activitySchema.findOne({ _id: id });  // Recupera il documento post

    if (!post) {
        throw new Error('Post non trovato'); // Gestisco l'errore nel caso il post non fosse presente nell'database
    }

    if (!post.likes.includes(userId)) { // Se lo userId non è presente nell'array, lo aggiunge
        post.likes.push(userId); // aggiunge l'id dello user nell'array
    }

    return await post.save(); // salva il documento nel database. Se il documento è nuovo, viene inserito. Se il documento esiste già, viene aggiornato con le modifiche effettuate. 
}

const unlikePost = async (id, userId) => {
    const post = await activitySchema.findOne({ _id: id });  // Recupera il documento post

    if (!post) {
        throw new Error('Post non trovato'); // Gestisco l'errore nel caso il post non fosse presente nell'database
    }

    if (post.likes.includes(userId)) { // Se lo userId è presente nell'array, lo elimina
        post.likes = post.likes.filter(id => id.toString() !== userId); // Confronta l'ID dell'utente presente nell'array con lo userId. Se sono uguali, viene rimosso dall'array. Se diversi, l'Id viene mantenuto nell'array.
    }

    return await post.save(); // salva il documento nel database. Se il documento è nuovo, viene inserito. Se il documento esiste già, viene aggiornato con le modifiche effettuate.
}

const toggleLike = async (id, userId) => {
    const post = await activitySchema.findOne({ _id: id });

    if (!post) {
        throw new Error('Post non trovato');
    }

    if (post.userId.toString() === userId) {
        throw new Error('Il proprietario del post non può mettere like al proprio post');
    }

    const likeIndex = post.likes.indexOf(userId);

    //console.log(likeIndex)

    if (likeIndex === -1) {
        // L'utente non ha ancora messo like, quindi aggiungiamo il suo ID
        post.likes.push(userId);
    } else {
        // L'utente ha già messo like, quindi rimuoviamo il suo ID
        post.likes.splice(likeIndex, 1);
    }
    //console.log(post.likes)

    return await post.save();
}

export default {
    addPost,
    updatePost,
    removePost,
    getList,
    getListByTags,
    getTagsList,
    getPost,
    addComment,
    updateComments,
    removeComments,
    getCommentsByPostId,


    normalizeAllTags,
    modificaCommenti,


    //likePost,
    //unlikePost,


    toggleLike,
}
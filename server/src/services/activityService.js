import activityRepo from '../repository/activityRepository.js'; //importiamo tutto il modulo
import { normalizeTags } from '../utils/utils.js';

const addPost = async (content) => {
    content['tags'] = normalizeTags(content.tags);
    content['createdAt'] = new Date().getTime();
    content['updatedAt'] = content.createdAt;
    //console.log("in contenuto di CONTENT che verrà inserito nel DB: ", content)
    return await activityRepo.addPost(content);
}

const updatePost = async (id, content) => {
    content['tags'] = normalizeTags(content.tags);
    //content['updatedAt'] = new Date().getTime();
    const activity = await activityRepo.updatePost(id, content);
    return checkActivity(activity);
}

const removePost = async (id, userId) => {
    await activityRepo.removePost(id, userId);
    return true;
}

/* const getList = async () => {
    return await activityRepo.getList();
} */

const getList = async (page, limit) => {
    const activities = await activityRepo.getList();
    //console.log(activities)
    for (const activity of activities) {
        const comments = await activityRepo.getCommentsByPostId(activity._id, page, limit);
        //console.log(comments)
        activity.comments = comments;
    }
    return activities;
}

const getListByTags = async (tags) => {
    return await activityRepo.getListByTags(tags);
}

const getTagsList = async () => {
    return await activityRepo.getTagsList();
}

const getPost = async (id) => {
    const activity = await activityRepo.getPost(id);
    return checkActivity(activity);
}

const addComment = async (id, content) => {
    content['createdAt'] = new Date().getTime();
    content['updatedAt'] = content.createdAt;
    return await activityRepo.addComment(id, content);
}

const updateComments = async (commentId, content) => {
    const activity = await activityRepo.updateComments(commentId, content);
    return checkActivity(activity);
}

const removeComments = async (id, commentId, userId) => {
    await activityRepo.removeComments(id, commentId, userId);
    return true;
}

/*const getCommentsByPostId = async (id) => {
    return await activityRepo.getCommentsByPostId(id);
}*/

const getCommentsByPostId = async (id, page, limit) => {
    //console.log("id ----> ", id)
    return await activityRepo.getCommentsByPostId(id, page, limit);
}

const checkActivity = (activity) => {
    if (activity === null) {
        const error = new Error('Activity not found');
        error.status = 404;
        throw error;
    }
    return activity.toJSON({ versionKey: false });
}

/* const likePost = async (id, userId) => {
    return await activityRepo.likePost(id, userId);
}

const unlikePost = async (id, userId) => {
    return await activityRepo.unlikePost(id, userId);
} */

const normalizeAllTags = async () => {
    return await activityRepo.normalizeAllTags();
}



const modificaCommenti = async () => {
    return await activityRepo.modificaCommenti();
}

const toggleLike = async (id, userId) => {
    return await activityRepo.toggleLike(id, userId);
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
    //likePost,
    //unlikePost,
    normalizeAllTags,



    modificaCommenti,
    toggleLike,
}
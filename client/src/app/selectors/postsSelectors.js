import { useSelector } from 'react-redux';

// Selettore per recuperare tutti i post
const getAllPosts = state => state.postblog.postsList;

// Selettore per filtrare i post per tag
const filteredPostsSelector = (state, tag) => {
  const tagsPostList = state.postblog.tagsPostList || [];
  return tagsPostList.filter(post => post.tags.includes(tag));
};

// Selettore per ottenere un singolo post per ID
const getPostById = (state, id) => {
  return state.postblog.singlePost || null;
};

// selectors/postsSelectors.js
const getTagsForSinglePost = (state, postId) => {
  const post = state.postblog.postsList.find(post => post._id === postId);
  return post ? post.tags : [];
};

// Selettore per ottenere tutti i tag unici e il loro conteggio
const getAllTagsWithCounts = state => {
  const allPosts = state.postblog.postsList;
  const tagsWithCounts = {};

  allPosts.forEach(post => {
    post.tags.forEach(tag => {
      const normalizedTag = tag.toLowerCase(); // Normalizza il tag in minuscolo
      if (tagsWithCounts[normalizedTag]) {
        tagsWithCounts[normalizedTag]++;
      } else {
        tagsWithCounts[normalizedTag] = 1;
      }
    });
  });

  //return tagsWithCounts;

  // Converte l'oggetto tagCounts in un array di coppie [tag, count]
  const tagCountsArray = Object.entries(tagsWithCounts);

  // Ordina l'array in ordine decrescente di conteggio
  tagCountsArray.sort((a, b) => b[1] - a[1]);

  console.log("tagCountsArray SU POSTSELECTORS ----> ", tagCountsArray)

  return tagCountsArray;
};

// Selettore per ottenere i primi 5 post
const firstFivePostsSelector = state => state.postblog.postsList.slice(0, 5);

export { getAllPosts, filteredPostsSelector, getPostById, getTagsForSinglePost, getAllTagsWithCounts, firstFivePostsSelector };

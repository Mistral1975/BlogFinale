// app/components/EditPostForm.jsx
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updatePost } from '../store/postsSlice';

const EditPostForm = ({ singlePost, user, closeForm }) => {
  const dispatch = useDispatch();

  const [newPost, setNewPost] = useState({
    title: singlePost.title || '',
    description: singlePost.description || '',
    imageUrl: singlePost.imageUrl || '',
    tags: (singlePost.tags || []).join(', '),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/posts/${singlePost._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `bearer ${user.accessToken}`
        },
        body: JSON.stringify({
          title: newPost.title,
          description: newPost.description,
          imageUrl: newPost.imageUrl,
          tags: newPost.tags,
          userId: user._id,
          updatedAt: Date.now(),
        }),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        dispatch(updatePost(updatedPost));
        closeForm();
      } else {
        console.error('Failed to update post');
      }
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  return (
    <div className="mt-4">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Titolo:</label>
          <input className="dark:bg-gray-700" type="text" id="title" name="title" value={newPost.title} onChange={handleInputChange} required />
        </div>
        <div>
          <label htmlFor="description">Descrizione:</label>
          <textarea className="dark:bg-gray-700" id="description" name="description" value={newPost.description} onChange={handleInputChange} required />
        </div>
        <div>
          <label htmlFor="tags">Tags (separati da virgola):</label>
          <input className="dark:bg-gray-700" type="text" id="tags" name="tags" value={newPost.tags} onChange={handleInputChange} required />
        </div>
        <div>
          <label htmlFor="imageUrl">Image (url dell'immagine):</label>
          <input className="dark:bg-gray-700" type="text" id="imageUrl" name="imageUrl" value={newPost.imageUrl} onChange={handleInputChange} />
        </div>
        <div className="pb-6 pt-6 text-sm text-gray-700 dark:text-gray-300">
          <button type="submit" className="text-blue-500 hover:underline">Modifica</button>
          {` • `}
          <button type="button" onClick={closeForm} className="text-red-500 hover:underline">Annulla</button>
        </div>
      </form>
    </div>
  );
};

export default EditPostForm;

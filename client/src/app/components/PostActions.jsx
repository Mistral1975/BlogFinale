const PostActions = ({ onEdit, onDelete }) => (
    <div className="pb-6 pt-6 text-sm text-gray-700 dark:text-gray-300">
        <button onClick={onEdit} className="text-blue-500 hover:underline">
            Modifica Post
        </button>
        {" • "}
        <button onClick={onDelete} className="text-red-500 hover:underline">
            Elimina Post
        </button>
    </div>
);

export default PostActions;
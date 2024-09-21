const DeleteConfirmModal = ({ postTitle, onDelete, onCancel }) => (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-lg shadow-lg dark:bg-gray-700">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">Conferma Eliminazione</h2>
      <p className="mb-4 dark:text-gray-300">Sei sicuro di voler eliminare il post: <strong>{postTitle}</strong>?</p>
      <div className="flex justify-end">
        <button onClick={onDelete} className="bg-red-500 text-white px-4 py-2 rounded mr-2">Elimina</button>
        <button onClick={onCancel} className="bg-gray-300 text-gray-700 px-4 py-2 rounded">Annulla</button>
      </div>
    </div>
  </div>
);

export default DeleteConfirmModal;

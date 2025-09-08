import { useState } from 'react';

const AddVisionItemModal = ({ isOpen, onClose, onAddItem }) => {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !imageUrl) {
      alert('Please fill in both fields.');
      return;
    }
    onAddItem({ title, imageUrl });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-500 hover:text-slate-800 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-slate-800 mb-6">Add a New Dream</h2>
        <form onSubmit={handleSubmit}>
          {/* Title Input */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-slate-700 font-medium mb-2">
              Title / Note
            </label>
            <textarea
              id="title"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 caret-sky-500 text-slate-900" // <-- ADDED text-slate-900
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Write down your dream, a goal, or an inspiring quote..."
              rows="4"
            />
          </div>

          {/* Image URL Input */}
          <div className="mb-6">
            <label htmlFor="imageUrl" className="block text-slate-700 font-medium mb-2">
              Image URL
            </label>
            <input
              type="url"
              id="imageUrl"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 caret-sky-500 text-slate-900" // <-- ADDED text-slate-900
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg text-slate-600 font-semibold hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 transition cursor-pointer"
            >
              Add to Board
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVisionItemModal;

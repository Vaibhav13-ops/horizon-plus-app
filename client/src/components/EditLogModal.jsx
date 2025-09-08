import { useState } from 'react';

const EditLogModal = ({ entry, onSave, onClose }) => {
    const [content, setContent] = useState(entry.content);

    const handleSave = () => {
        onSave(entry._id, content);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-xl shadow-2xl p-8 w-full max-w-2xl border border-slate-700">
                <h2 className="text-2xl font-bold text-white mb-6">Edit Your Log Entry</h2>
                <textarea
                    className="w-full p-4 bg-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 caret-sky-500"
                    rows="6"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={onClose} className="px-6 py-2 rounded-lg text-slate-300 font-semibold hover:bg-slate-700 transition">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 transition">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditLogModal;

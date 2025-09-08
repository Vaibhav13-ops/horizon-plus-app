import { useState } from 'react';

const EditProfileModal = ({ profile, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    bio: profile.bio,
    expertise: profile.expertise.join(', '), 
    ratePerSession: profile.ratePerSession,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedProfile = {
      ...formData,
      expertise: formData.expertise.split(',').map(skill => skill.trim()),
    };
    onSave(updatedProfile);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      {/* Modal Content */}
      <div className="bg-slate-800 rounded-xl shadow-2xl p-8 w-full max-w-2xl border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-6">Edit Your Profile</h2>
        <form onSubmit={handleSubmit}>
          {/* Bio Textarea */}
          <div className="mb-4">
            <label htmlFor="bio" className="block text-slate-300 font-medium mb-2">Bio</label>
            <textarea
              id="bio"
              name="bio"
              rows="4"
              className="w-full p-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={formData.bio}
              onChange={handleChange}
            />
          </div>
          {/* Expertise Input */}
          <div className="mb-4">
            <label htmlFor="expertise" className="block text-slate-300 font-medium mb-2">Areas of Expertise (comma separated)</label>
            <input
              type="text"
              id="expertise"
              name="expertise"
              className="w-full p-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={formData.expertise}
              onChange={handleChange}
            />
          </div>
          {/* Rate Input */}
          <div className="mb-6">
            <label htmlFor="ratePerSession" className="block text-slate-300 font-medium mb-2">Rate per Session (₹)</label>
            <input
              type="number"
              id="ratePerSession"
              name="ratePerSession"
              className="w-full p-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={formData.ratePerSession}
              onChange={handleChange}
            />
          </div>
          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg text-slate-300 font-semibold hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;

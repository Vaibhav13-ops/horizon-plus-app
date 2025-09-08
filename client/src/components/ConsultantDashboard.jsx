// import { useState, useEffect } from 'react';
// import { useAuth } from '../hooks/useAuth';

// const ConsultantDashboard = () => {
//   const { user } = useAuth();
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState({
//     title: '',
//     bio: '',
//     expertise: '',
//     experience: '',
//     rate: '',
//     phoneNumber: '',
//     website: '',
//     linkedinUrl: ''
//   });

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch('http://localhost:5000/api/consultant-profile', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (response.status === 404) {
//         setProfile(null);
//         setShowForm(true);
//       } else if (response.ok) {
//         const data = await response.json();
//         setProfile(data);
//         setFormData({
//           title: data.title || '',
//           bio: data.bio || '',
//           expertise: data.expertise?.join(', ') || '',
//           experience: data.experience || '',
//           rate: data.rate || '',
//           phoneNumber: data.phoneNumber || '',
//           website: data.website || '',
//           linkedinUrl: data.linkedinUrl || ''
//         });
//       } else {
//         const errorData = await response.json();
//         setError(errorData.message);
//       }
//     } catch (error) {
//       setError('Failed to fetch profile',error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const token = localStorage.getItem('token');
      
//       // Convert expertise string to array
//       const expertiseArray = formData.expertise
//         .split(',')
//         .map(item => item.trim())
//         .filter(item => item.length > 0);

//       const submitData = {
//         ...formData,
//         expertise: expertiseArray,
//         experience: Number(formData.experience),
//         rate: Number(formData.rate)
//       };

//       const url = 'http://localhost:5000/api/consultant-profile';
//       const method = profile ? 'PUT' : 'POST';

//       const response = await fetch(url, {
//         method: method,
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(submitData)
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setProfile(data.profile);
//         setShowForm(false);
//         alert(data.message);
//       } else {
//         setError(data.message);
//       }
//     } catch (error) {
//       setError('Failed to save profile',error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     if (profile) {
//       setFormData({
//         title: profile.title || '',
//         bio: profile.bio || '',
//         expertise: profile.expertise?.join(', ') || '',
//         experience: profile.experience || '',
//         rate: profile.rate || '',
//         phoneNumber: profile.phoneNumber || '',
//         website: profile.website || '',
//         linkedinUrl: profile.linkedinUrl || ''
//       });
//     }
//     setShowForm(false);
//     setError('');
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-slate-900 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-900 text-white p-6">
//       <div className="max-w-4xl mx-auto">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold mb-2">Consultant Dashboard</h1>
//           <p className="text-slate-400">Welcome, {user?.username}!</p>
//         </div>

//         {error && (
//           <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-400 px-4 py-3 rounded mb-6">
//             {error}
//           </div>
//         )}

//         {/* Profile Display */}
//         {profile && !showForm && (
//           <div className="bg-slate-800 rounded-lg p-6 mb-6">
//             <div className="flex justify-between items-start mb-6">
//               <h2 className="text-2xl font-bold">Your Profile</h2>
//               <button
//                 onClick={() => setShowForm(true)}
//                 className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
//               >
//                 Edit Profile
//               </button>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <h3 className="text-xl font-semibold mb-2">{profile.title}</h3>
//                 <p className="text-slate-300 mb-4">{profile.bio}</p>
//                 <div className="mb-4">
//                   <h4 className="font-medium mb-2">Expertise:</h4>
//                   <div className="flex flex-wrap gap-2">
//                     {profile.expertise?.map((skill, index) => (
//                       <span key={index} className="bg-blue-600 px-3 py-1 rounded-full text-sm">
//                         {skill}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               </div>
              
//               <div>
//                 <div className="space-y-3">
//                   <div>
//                     <span className="font-medium">Experience:</span>
//                     <span className="ml-2">{profile.experience} years</span>
//                   </div>
//                   <div>
//                     <span className="font-medium">Rate:</span>
//                     <span className="ml-2">₹{profile.rate}/hour</span>
//                   </div>
//                   {profile.phoneNumber && (
//                     <div>
//                       <span className="font-medium">Phone:</span>
//                       <span className="ml-2">{profile.phoneNumber}</span>
//                     </div>
//                   )}
//                   {profile.website && (
//                     <div>
//                       <span className="font-medium">Website:</span>
//                       <a 
//                         href={profile.website} 
//                         className="ml-2 text-blue-400 hover:underline" 
//                         target="_blank" 
//                         rel="noopener noreferrer"
//                       >
//                         {profile.website}
//                       </a>
//                     </div>
//                   )}
//                   {profile.linkedinUrl && (
//                     <div>
//                       <span className="font-medium">LinkedIn:</span>
//                       <a 
//                         href={profile.linkedinUrl} 
//                         className="ml-2 text-blue-400 hover:underline" 
//                         target="_blank" 
//                         rel="noopener noreferrer"
//                       >
//                         View Profile
//                       </a>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Profile Form */}
//         {showForm && (
//           <div className="bg-slate-800 rounded-lg p-6">
//             <h2 className="text-2xl font-bold mb-6">
//               {profile ? 'Edit Profile' : 'Create Your Profile'}
//             </h2>
            
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium mb-2">
//                     Professional Title *
//                   </label>
//                   <input
//                     type="text"
//                     name="title"
//                     required
//                     value={formData.title}
//                     onChange={handleInputChange}
//                     placeholder="e.g., Life Coach & Wellness Expert"
//                     className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium mb-2">
//                     Years of Experience *
//                   </label>
//                   <input
//                     type="number"
//                     name="experience"
//                     required
//                     min="0"
//                     value={formData.experience}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-2">
//                   Bio / About You *
//                 </label>
//                 <textarea
//                   name="bio"
//                   required
//                   rows="4"
//                   value={formData.bio}
//                   onChange={handleInputChange}
//                   placeholder="Tell clients about your background, approach, and how you can help them..."
//                   className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium mb-2">
//                     Areas of Expertise *
//                   </label>
//                   <input
//                     type="text"
//                     name="expertise"
//                     required
//                     value={formData.expertise}
//                     onChange={handleInputChange}
//                     placeholder="Life Coaching, Career Guidance, Mindfulness"
//                     className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   <p className="text-sm text-slate-400 mt-1">Separate multiple areas with commas</p>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium mb-2">
//                     Hourly Rate (₹) *
//                   </label>
//                   <input
//                     type="number"
//                     name="rate"
//                     required
//                     min="0"
//                     value={formData.rate}
//                     onChange={handleInputChange}
//                     placeholder="2000"
//                     className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium mb-2">
//                     Phone Number
//                   </label>
//                   <input
//                     type="tel"
//                     name="phoneNumber"
//                     value={formData.phoneNumber}
//                     onChange={handleInputChange}
//                     placeholder="+91-9876543210"
//                     className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium mb-2">
//                     Website
//                   </label>
//                   <input
//                     type="url"
//                     name="website"
//                     value={formData.website}
//                     onChange={handleInputChange}
//                     placeholder="https://yourwebsite.com"
//                     className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-2">
//                   LinkedIn URL
//                 </label>
//                 <input
//                   type="url"
//                   name="linkedinUrl"
//                   value={formData.linkedinUrl}
//                   onChange={handleInputChange}
//                   placeholder="https://linkedin.com/in/your-profile"
//                   className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div className="flex justify-end space-x-4 pt-6">
//                 {profile && (
//                   <button
//                     type="button"
//                     onClick={handleCancel}
//                     className="px-6 py-2 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                 )}
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 px-6 py-2 rounded-lg transition-colors"
//                 >
//                   {loading ? 'Saving...' : (profile ? 'Update Profile' : 'Create Profile')}
//                 </button>
//               </div>
//             </form>
//           </div>
//         )}

//         {/* Empty state for new consultants */}
//         {!profile && !showForm && (
//           <div className="bg-slate-800 rounded-lg p-8 text-center">
//             <h2 className="text-2xl font-bold mb-4">Welcome to Your Dashboard!</h2>
//             <p className="text-slate-400 mb-6">
//               Get started by creating your consultant profile to attract clients.
//             </p>
//             <button
//               onClick={() => setShowForm(true)}
//               className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-lg transition-colors"
//             >
//               Create Your Profile
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ConsultantDashboard;


import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../api.js';

const ConsultantDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    bio: '',
    expertise: '',
    experience: '',
    rate: '',
    phoneNumber: '',
    website: '',
    linkedinUrl: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/consultant-profile');
      const data = response.data;
      
      setProfile(data);
      setFormData({
        title: data.title || '',
        bio: data.bio || '',
        expertise: data.expertise?.join(', ') || '',
        experience: data.experience || '',
        rate: data.rate || '',
        phoneNumber: data.phoneNumber || '',
        website: data.website || '',
        linkedinUrl: data.linkedinUrl || ''
      });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setProfile(null);
        setShowForm(true);
      } else {
        setError(error.response?.data?.message || 'Failed to fetch profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Convert expertise string to array
      const expertiseArray = formData.expertise
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);

      const submitData = {
        ...formData,
        expertise: expertiseArray,
        experience: Number(formData.experience),
        rate: Number(formData.rate)
      };

      const response = profile 
        ? await api.put('/consultant-profile', submitData)
        : await api.post('/consultant-profile', submitData);

      const data = response.data;
      setProfile(data.profile);
      setShowForm(false);
      alert(data.message);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        title: profile.title || '',
        bio: profile.bio || '',
        expertise: profile.expertise?.join(', ') || '',
        experience: profile.experience || '',
        rate: profile.rate || '',
        phoneNumber: profile.phoneNumber || '',
        website: profile.website || '',
        linkedinUrl: profile.linkedinUrl || ''
      });
    }
    setShowForm(false);
    setError('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Consultant Dashboard</h1>
          <p className="text-slate-400">Welcome, {user?.username}!</p>
        </div>

        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-400 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Profile Display */}
        {profile && !showForm && (
          <div className="bg-slate-800 rounded-lg p-6 mb-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold">Your Profile</h2>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
              >
                Edit Profile
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">{profile.title}</h3>
                <p className="text-slate-300 mb-4">{profile.bio}</p>
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Expertise:</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.expertise?.map((skill, index) => (
                      <span key={index} className="bg-blue-600 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium">Experience:</span>
                    <span className="ml-2">{profile.experience} years</span>
                  </div>
                  <div>
                    <span className="font-medium">Rate:</span>
                    <span className="ml-2">₹{profile.rate}/hour</span>
                  </div>
                  {profile.phoneNumber && (
                    <div>
                      <span className="font-medium">Phone:</span>
                      <span className="ml-2">{profile.phoneNumber}</span>
                    </div>
                  )}
                  {profile.website && (
                    <div>
                      <span className="font-medium">Website:</span>
                      <a 
                        href={profile.website} 
                        className="ml-2 text-blue-400 hover:underline" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {profile.website}
                      </a>
                    </div>
                  )}
                  {profile.linkedinUrl && (
                    <div>
                      <span className="font-medium">LinkedIn:</span>
                      <a 
                        href={profile.linkedinUrl} 
                        className="ml-2 text-blue-400 hover:underline" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        View Profile
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Form */}
        {showForm && (
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">
              {profile ? 'Edit Profile' : 'Create Your Profile'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Professional Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Life Coach & Wellness Expert"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Years of Experience *
                  </label>
                  <input
                    type="number"
                    name="experience"
                    required
                    min="0"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Bio / About You *
                </label>
                <textarea
                  name="bio"
                  required
                  rows="4"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell clients about your background, approach, and how you can help them..."
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Areas of Expertise *
                  </label>
                  <input
                    type="text"
                    name="expertise"
                    required
                    value={formData.expertise}
                    onChange={handleInputChange}
                    placeholder="Life Coaching, Career Guidance, Mindfulness"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-slate-400 mt-1">Separate multiple areas with commas</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Hourly Rate (₹) *
                  </label>
                  <input
                    type="number"
                    name="rate"
                    required
                    min="0"
                    value={formData.rate}
                    onChange={handleInputChange}
                    placeholder="2000"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+91-9876543210"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://yourwebsite.com"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/your-profile"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                {profile && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 px-6 py-2 rounded-lg transition-colors"
                >
                  {loading ? 'Saving...' : (profile ? 'Update Profile' : 'Create Profile')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Empty state for new consultants */}
        {!profile && !showForm && (
          <div className="bg-slate-800 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Welcome to Your Dashboard!</h2>
            <p className="text-slate-400 mb-6">
              Get started by creating your consultant profile to attract clients.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-lg transition-colors"
            >
              Create Your Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultantDashboard;

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import axios from 'axios';
import VisionItemCard from './VisionItemCard.jsx';
import AddVisionItemModal from './AddVisionItemModal.jsx';

const ActionBoard = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get('http://localhost:5000/api/visionboard', config);
        setItems(data);
      } catch (error) {
        console.error('Failed to fetch vision board items', error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [user]);

  // NEW: Polling function for AI suggestions
  const pollForAISuggestions = async (itemId, maxAttempts = 15) => {
    let attempts = 0;
    
    const poll = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data: updatedItem } = await axios.get(`http://localhost:5000/api/visionboard/${itemId}`, config);
        
        if (!updatedItem.suggestionsLoading) {
          setItems(prev => 
            prev.map(item => 
              item._id === itemId ? updatedItem : item
            )
          );
          
          if (updatedItem.aiSuggestions) {
            console.log('AI suggestions are ready! 🎉');
          }
          return;
        }
        
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 2000);
        } else {
          console.log('Polling timeout for AI suggestions');
        }
        
      } catch (error) {
        console.error('Error polling for AI suggestions:', error);
      }
    };
    
    setTimeout(poll, 2000);
  };

  const handleAddItem = async (newItemData) => {
    if (!user) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data: createdItem } = await axios.post('http://localhost:5000/api/visionboard', newItemData, config);
      setItems([createdItem, ...items]);
      setIsModalOpen(false);

      // NEW: Start polling for AI suggestions
      console.log('Vision item added! AI suggestions are being generated...');
      pollForAISuggestions(createdItem._id);

    } catch (error) {
      console.error('Failed to add item', error);
      alert('Failed to add your dream. Please try again.');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this dream?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        await axios.delete(`http://localhost:5000/api/visionboard/${itemId}`, config);
        setItems(items.filter((item) => item._id !== itemId));
      } catch (error) {
        console.error('Failed to delete item', error);
      }
    }
  };


  const handleRegenerateAI = async (itemId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.post(`http://localhost:5000/api/visionboard/${itemId}/regenerate`, {}, config);
      
      setItems(prev => 
        prev.map(item => 
          item._id === itemId 
            ? { ...item, suggestionsLoading: true }
            : item
        )
      );
      
      console.log('Regenerating AI suggestions...');
      pollForAISuggestions(itemId);
    } catch (error) {
      console.error('Error regenerating suggestions:', error);
    }
  };

  if (!user) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl">Please log in to see your dashboard.</h1>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-white">Your Action Board</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-sky-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-sky-600 transition shadow-lg flex items-center gap-2 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
          Add New Dream
        </button>
      </div>

      {loading ? (
        <p className="text-white">Loading your dreams...</p>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-slate-700 rounded-lg">
          <p className="text-xl text-slate-400">Your Action Board is empty.</p>
          <p className="mt-2">Click "Add New Dream" to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <VisionItemCard 
              key={item._id} 
              item={item} 
              onDelete={handleDeleteItem}
              onRegenerateAI={handleRegenerateAI}
            />
          ))}
        </div>
      )}
      
      <AddVisionItemModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAddItem={handleAddItem}
      />
    </div>
  );
};

export default ActionBoard;



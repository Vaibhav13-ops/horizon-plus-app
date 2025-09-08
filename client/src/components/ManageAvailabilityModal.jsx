import { useState } from 'react';

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

const ManageAvailabilityModal = ({ currentAvailability, onClose, onSave }) => {
  const [schedule, setSchedule] = useState(() => {
    const initialSchedule = {};
    weekDays.forEach(day => {
      const dayData = currentAvailability.find(d => d.day === day);
      initialSchedule[day] = dayData ? new Set(dayData.slots) : new Set();
    });
    return initialSchedule;
  });

  
  const handleSlotChange = (day, slot) => {
    setSchedule(prevSchedule => {
      const newDaySlots = new Set(prevSchedule[day]);
      if (newDaySlots.has(slot)) {
        newDaySlots.delete(slot);
      } else {
        newDaySlots.add(slot);
      }
      return { ...prevSchedule, [day]: newDaySlots };
    });
  };

  const handleSave = () => {
    const availabilityData = weekDays
      .map(day => ({
        day,
        slots: Array.from(schedule[day]),
      }))
      .filter(day => day.slots.length > 0); 
    
    onSave(availabilityData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl p-8 w-full max-w-4xl border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-6">Manage Your Weekly Availability</h2>
        <div className="space-y-6">
          {weekDays.map(day => (
            <div key={day}>
              <h3 className="text-lg font-semibold text-sky-400 mb-3">{day}</h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {timeSlots.map(slot => (
                  <label
                    key={slot}
                    className={`block text-center p-2 rounded-lg cursor-pointer transition ${
                      schedule[day].has(slot)
                        ? 'bg-green-500 text-white font-bold'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={schedule[day].has(slot)}
                      onChange={() => handleSlotChange(day, slot)}
                    />
                    {slot}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-lg text-slate-300 font-semibold hover:bg-slate-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 transition"
          >
            Save Availability
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageAvailabilityModal;

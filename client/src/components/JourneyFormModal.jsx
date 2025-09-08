import { useState } from 'react';
import { FiPlusCircle, FiTrash2, FiArrowUp, FiArrowDown } from 'react-icons/fi';

const JourneyFormModal = ({ existingJourney, onSave, onClose }) => {
    const [journey, setJourney] = useState(
        existingJourney || {
            title: '',
            description: '',
            price: '',
            durationWeeks: '',
            steps: [],
            isPublished: false,
        }
    );

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setJourney(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleStepChange = (index, e) => {
        const { name, value } = e.target;
        const newSteps = [...journey.steps];
        newSteps[index][name] = value;
        setJourney(prev => ({ ...prev, steps: newSteps }));
    };

    const addStep = () => {
        setJourney(prev => ({
            ...prev,
            steps: [
                ...prev.steps,
                { week: 1, title: '', description: '', actionType: 'RESOURCE', actionLink: '' },
            ],
        }));
    };

    const removeStep = (index) => {
        const newSteps = journey.steps.filter((_, i) => i !== index);
        setJourney(prev => ({ ...prev, steps: newSteps }));
    };
    
    const moveStep = (index, direction) => {
        const newSteps = [...journey.steps];
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= newSteps.length) return; // Boundary check
        [newSteps[index], newSteps[newIndex]] = [newSteps[newIndex], newSteps[index]]; // Swap
        setJourney(prev => ({ ...prev, steps: newSteps }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(journey);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-xl shadow-2xl p-8 w-full max-w-4xl border border-slate-700 max-h-[90vh] flex flex-col">
                <h2 className="text-2xl font-bold text-white mb-6 flex-shrink-0">
                    {existingJourney ? 'Edit Journey' : 'Create a New Journey'}
                </h2>
                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto pr-4 space-y-6">
                    {/* Main Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-slate-300 font-medium mb-2">Journey Title</label>
                            <input type="text" name="title" value={journey.title} onChange={handleChange} className="w-full p-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" required />
                        </div>
                         <div>
                            <label className="block text-slate-300 font-medium mb-2">Duration (in weeks)</label>
                            <input type="number" name="durationWeeks" value={journey.durationWeeks} onChange={handleChange} className="w-full p-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" required />
                        </div>
                    </div>
                     <div>
                        <label className="block text-slate-300 font-medium mb-2">Description</label>
                        <textarea name="description" rows="3" value={journey.description} onChange={handleChange} className="w-full p-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" required />
                    </div>
                     <div>
                        <label className="block text-slate-300 font-medium mb-2">Price (₹)</label>
                        <input type="number" name="price" value={journey.price} onChange={handleChange} className="w-full p-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" required />
                    </div>

                    {/* Steps Builder */}
                    <div className="pt-6 border-t border-slate-700">
                        <h3 className="text-xl font-semibold text-white mb-4">Journey Steps</h3>
                        <div className="space-y-4">
                            {journey.steps.map((step, index) => (
                                <div key={index} className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                                    <div className="flex justify-between items-center mb-4">
                                        <p className="font-bold text-sky-400">Step {index + 1}</p>
                                        <div className="flex items-center gap-2">
                                             <button type="button" onClick={() => moveStep(index, -1)} disabled={index === 0} className="text-slate-400 hover:text-white disabled:opacity-50"><FiArrowUp/></button>
                                             <button type="button" onClick={() => moveStep(index, 1)} disabled={index === journey.steps.length - 1} className="text-slate-400 hover:text-white disabled:opacity-50"><FiArrowDown/></button>
                                             <button type="button" onClick={() => removeStep(index)} className="text-red-500 hover:text-red-400"><FiTrash2/></button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input type="number" name="week" placeholder="Week" value={step.week} onChange={(e) => handleStepChange(index, e)} className="p-2 bg-slate-600 rounded-md" />
                                        <input type="text" name="title" placeholder="Step Title" value={step.title} onChange={(e) => handleStepChange(index, e)} className="p-2 bg-slate-600 rounded-md" />
                                    </div>
                                    <textarea name="description" rows="2" placeholder="Step Description" value={step.description} onChange={(e) => handleStepChange(index, e)} className="w-full mt-3 p-2 bg-slate-600 rounded-md" />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                        <select name="actionType" value={step.actionType} onChange={(e) => handleStepChange(index, e)} className="p-2 bg-slate-600 rounded-md">
                                            <option value="RESOURCE">Resource</option>
                                            <option value="WEBINAR">Webinar</option>
                                            <option value="SESSION">1-on-1 Session</option>
                                            <option value="AI_TASK">AI Task</option>
                                        </select>
                                        <input type="text" name="actionLink" placeholder="Action Link (Optional)" value={step.actionLink} onChange={(e) => handleStepChange(index, e)} className="p-2 bg-slate-600 rounded-md" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={addStep} className="mt-4 flex items-center gap-2 text-sky-400 font-semibold hover:text-sky-300">
                            <FiPlusCircle /> Add New Step
                        </button>
                    </div>
                    
                    {/* Publish Toggle */}
                    <div className="pt-6 border-t border-slate-700">
                         <label className="flex items-center cursor-pointer">
                            <input type="checkbox" name="isPublished" checked={journey.isPublished} onChange={handleChange} className="h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
                            <span className="ml-3 text-slate-300">Publish this Journey (make it visible to users)</span>
                        </label>
                    </div>
                </form>
                {/* Action Buttons */}
                <div className="flex justify-end gap-4 mt-8 flex-shrink-0">
                    <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg text-slate-300 font-semibold hover:bg-slate-700 transition">Cancel</button>
                    <button type="submit" onClick={handleSubmit} className="px-6 py-2 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 transition">Save Journey</button>
                </div>
            </div>
        </div>
    );
};

export default JourneyFormModal;

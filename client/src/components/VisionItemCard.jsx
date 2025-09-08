import { useState } from 'react';
import { FiYoutube, FiTarget, FiZap, FiCheckCircle, FiRefreshCw, FiUsers, FiTool, FiBookOpen, FiAward, FiMessageSquare, FiTrendingUp, FiGift, FiFlag, FiLayers } from 'react-icons/fi';

const VisionItemCard = ({ item, onDelete, onRegenerateAI }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  return (
    <>
      <div className="group relative aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-slate-700 shadow-lg">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://placehold.co/600x600/1e293b/94a3b8?text=Image+Not+Found`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="text-lg font-bold text-white">{item.title}</h3>
          
          {item.quickTip && (
            <p className="text-sm text-blue-200 mt-2 italic">💡 {item.quickTip}</p>
          )}
        </div>

        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setShowSuggestions(true)}
            className="rounded-full bg-blue-600/70 p-2 text-white hover:bg-blue-500"
            title="AI Suggestions"
          >
            🤖
          </button>
          
          <button
            onClick={() => onDelete(item._id)}
            className="rounded-full bg-red-600/70 p-2 text-white hover:bg-red-500"
            title="Delete item"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {item.suggestionsLoading && (
          <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
            AI Loading...
          </div>
        )}
      </div>

      {showSuggestions && (
        <AISuggestionsModal 
          item={item} 
          onClose={() => setShowSuggestions(false)}
          onRegenerateAI={onRegenerateAI}
        />
      )}
    </>
  );
};

const AISuggestionsModal = ({ item, onClose, onRegenerateAI }) => {
  const { aiSuggestions, suggestionsLoading } = item;


  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] flex flex-col border border-slate-700">
        <div className="p-8 overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-700">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="text-sky-400">
                <FiZap size={24} />
              </span>
              <span>Personalized AI Suggestions for "{item.title}"</span>
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Loading State */}
          {suggestionsLoading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-sky-400"></div>
              <p className="mt-4 text-slate-400">AI is generating fresh insights for you...</p>
            </div>
          ) : !aiSuggestions ? (
            <div className="text-center py-20 text-slate-500">
              <FiZap className="mx-auto text-5xl mb-4" />
              <p className="text-lg">No AI suggestions are available for this goal yet.</p>
              <button 
                onClick={() => onRegenerateAI(item._id)}
                className="mt-6 bg-sky-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-sky-700 transition flex items-center gap-2 mx-auto"
              >
                <FiRefreshCw /> Generate Now
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Left Column */}
                <div className="space-y-6">
                  {/* YouTube Videos */}
                  {aiSuggestions.youtubeVideos?.length > 0 && (
                    <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
                      <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-4">
                        <FiYoutube className="text-red-500" />
                        Targeted Video Recommendations
                      </h3>
                      <div className="space-y-4">
                        {aiSuggestions.youtubeVideos.map((video, index) => (
                          <div key={index} className="bg-slate-800/60 rounded-lg p-4 border-l-4 border-red-500">
                            <h4 className="font-bold text-sky-400 text-lg">{video.title}</h4>
                            {video.channel && (
                              <p className="text-xs text-red-400 font-semibold mt-1 mb-2 uppercase tracking-wider">
                                Channel: {video.channel}
                              </p>
                            )}
                            <p className="text-sm text-slate-300 leading-relaxed">{video.description}</p>
                            <a 
                              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(video.searchQuery)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 mt-4 bg-red-600 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-red-700 transition"
                            >
                              🔍 Search YouTube
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Communities */}
                  {aiSuggestions.communities?.length > 0 && (
                    <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
                      <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-4">
                        <FiUsers className="text-orange-400" />
                        Relevant Communities
                      </h3>
                      <div className="space-y-4">
                        {aiSuggestions.communities.map((community, index) => (
                          <div key={index} className="bg-slate-800/60 rounded-lg p-4 border-l-4 border-orange-500">
                            <h4 className="font-bold text-orange-400 text-lg">{community.name}</h4>
                            <p className="text-sm text-orange-300 font-medium mb-2">Platform: {community.platform}</p>
                            <p className="text-sm text-slate-300">{community.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Field Resources */}
                  {aiSuggestions.fieldResources && (
                    <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
                      <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-4">
                        <FiTool className="text-cyan-400" />
                        Essential Resources
                      </h3>
                      <div className="space-y-4">
                        {aiSuggestions.fieldResources.topChannels?.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-cyan-400 mb-2">Top Channels:</h4>
                            <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                              {aiSuggestions.fieldResources.topChannels.map((channel, index) => (
                                <li key={index}>{channel}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {aiSuggestions.fieldResources.essentialTools?.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-cyan-400 mb-2">Essential Tools:</h4>
                            <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                              {aiSuggestions.fieldResources.essentialTools.map((tool, index) => (
                                <li key={index}>{tool}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {aiSuggestions.fieldResources.mustReadBooks?.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-cyan-400 mb-2">Must-Read Books:</h4>
                            <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                              {aiSuggestions.fieldResources.mustReadBooks.map((book, index) => (
                                <li key={index}>{book}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Guidance Slips */}
                  {aiSuggestions.guidanceSlips?.length > 0 && (
                    <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
                      <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-4">
                        <FiTarget className="text-green-400" />
                        Expert Guidance
                      </h3>
                      <div className="space-y-4">
                        {aiSuggestions.guidanceSlips.map((guidance, index) => (
                          <div key={index} className="bg-slate-800/60 rounded-lg p-4 border-l-4 border-green-500">
                            <h4 className="font-bold text-green-400 text-lg">{guidance.title}</h4>
                            <p className="text-sm text-slate-300 mt-2 leading-relaxed">{guidance.content}</p>
                            {guidance.actionSteps?.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-slate-700/50">
                                <h5 className="text-sm font-semibold text-slate-200 mb-3">Action Steps:</h5>
                                <ul className="space-y-2">
                                  {guidance.actionSteps.map((step, stepIndex) => (
                                    <li key={stepIndex} className="flex items-start gap-3 text-sm text-slate-300">
                                      <FiCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                                      <span>{step}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skill Assessment */}
                  {aiSuggestions.skillAssessment && (
                    <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
                      <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-4">
                        <FiAward className="text-indigo-400" />
                        Skill Level Guide
                      </h3>
                      <div className="space-y-4">
                        {['beginner', 'intermediate', 'advanced'].map(level => (
                          aiSuggestions.skillAssessment[level]?.length > 0 && (
                            <div key={level} className="bg-slate-800/60 rounded-lg p-4 border-l-4 border-indigo-500">
                              <h4 className="font-bold text-indigo-400 capitalize text-lg mb-2">{level} Level</h4>
                              <ul className="space-y-2">
                                {aiSuggestions.skillAssessment[level].map((tip, index) => (
                                  <li key={index} className="flex items-start gap-3 text-sm text-slate-300">
                                    <span className="text-indigo-400 mt-1">•</span>
                                    <span>{tip}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Unique Ideas */}
                  {aiSuggestions.uniqueIdeas?.length > 0 && (
                    <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
                      <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-4">
                        <FiGift className="text-purple-400" />
                        Creative Implementation Ideas
                      </h3>
                      <div className="space-y-4">
                        {aiSuggestions.uniqueIdeas.map((idea, index) => (
                          <div key={index} className="bg-slate-800/60 rounded-lg p-4 border-l-4 border-purple-500">
                            <h4 className="font-bold text-purple-400 text-lg">{idea.title}</h4>
                            <p className="text-sm text-slate-300 mt-2">{idea.description}</p>
                            <p className="text-sm text-purple-300 mt-2 italic">
                              <strong>Implementation:</strong> {idea.implementation}
                            </p>
                            {idea.tools?.length > 0 && (
                              <div className="mt-3">
                                <p className="text-sm font-medium text-purple-300 mb-2">Tools needed:</p>
                                <div className="flex flex-wrap gap-2">
                                  {idea.tools.map((tool, toolIndex) => (
                                    <span key={toolIndex} className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded text-xs border border-purple-500/30">
                                      {tool}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Full Width Bottom Section */}
              <div className="space-y-8 pt-8 border-t border-slate-700">
                {/* Motivational Quote */}
                {aiSuggestions.motivationalQuote && (
                  <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 text-white rounded-lg p-8 text-center border border-blue-500/20">
                    <h3 className="text-lg font-semibold mb-4 flex items-center justify-center gap-2">
                      ✨ Inspiration for Your Journey
                    </h3>
                    <blockquote className="text-xl italic font-light text-slate-200">
                      "{aiSuggestions.motivationalQuote}"
                    </blockquote>
                  </div>
                )}

                {/* Next Steps */}
                {aiSuggestions.nextSteps?.length > 0 && (
                  <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
                    <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-6">
                      🎯 Your Immediate Action Plan
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {aiSuggestions.nextSteps.map((step, index) => (
                        <div key={index} className="bg-slate-800/60 rounded-lg p-5 border-l-4 border-blue-500">
                          <div className="flex items-center mb-3">
                            <span className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold mr-3">
                              {index + 1}
                            </span>
                            <span className="font-bold text-blue-400">Step {index + 1}</span>
                          </div>
                          <p className="text-slate-300 text-sm leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Practice Projects */}
                {aiSuggestions.fieldResources?.practiceProjects?.length > 0 && (
                  <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
                    <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-6">
                      🚀 Recommended Practice Projects
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {aiSuggestions.fieldResources.practiceProjects.map((project, index) => (
                        <div key={index} className="bg-slate-800/60 rounded-lg p-4 border-l-4 border-yellow-500">
                          <div className="flex items-center gap-3">
                            <span className="bg-yellow-500 text-slate-900 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                              {index + 1}
                            </span>
                            <span className="text-slate-300 text-sm">{project}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Learning Path */}
                {aiSuggestions.fieldResources?.learningPaths?.length > 0 && (
                  <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
                    <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-6">
                      📚 Structured Learning Path
                    </h3>
                    <div className="space-y-4">
                      {aiSuggestions.fieldResources.learningPaths.map((path, index) => (
                        <div key={index} className="flex items-center bg-slate-800/60 rounded-lg p-4 border-l-4 border-teal-500">
                          <span className="bg-teal-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">
                            {index + 1}
                          </span>
                          <span className="text-slate-300 flex-grow">{path}</span>
                          {index < aiSuggestions.fieldResources.learningPaths.length - 1 && (
                            <div className="ml-4 text-teal-400 text-xl">→</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons Footer */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-700 mt-8">
            <button 
              onClick={() => onRegenerateAI(item._id)}
              className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2"
            >
              <FiRefreshCw /> Generate Fresh Suggestions
            </button>
            <button 
              onClick={onClose}
              className="flex-1 bg-slate-600 text-white px-6 py-3 rounded-lg hover:bg-slate-700 transition-all font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisionItemCard;

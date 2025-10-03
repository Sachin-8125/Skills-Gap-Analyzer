import React, { useState, useEffect } from 'react';

const Dashboard = ({ user, onLogout }) => {
    const [userSkills, setUserSkills] = useState([]);
    const [allSkills, setAllSkills] = useState([]);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSkill, setSelectedSkill] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.id) return;
            setLoading(true);
            try {
                const [userRes, skillsRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/user/${user.id}`),
                    fetch(`${API_BASE_URL}/skills`),
                ]);
                const userData = await userRes.json();
                const skillsData = await skillsRes.json();
                setUserSkills(userData.skills || []);
                setAllSkills(skillsData);
            } catch (error) {
                console.error("Error fetching initial data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user.id]);

    const handleAddSkill = async () => {
        if (!selectedSkill) return;
        
        try {
            await fetch(`${API_BASE_URL}/user/${user.id}/skills`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ skillId: selectedSkill }),
            });
            
            // Refetch user data
            const userRes = await fetch(`${API_BASE_URL}/user/${user.id}`);
            const newUserData = await userRes.json();
            setUserSkills(newUserData.skills || []);
            setSelectedSkill('');
        } catch (error) {
            console.error("Failed to add skill:", error);
        }
    };
    
    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        setAnalysis(null);
        try {
            const res = await fetch(`${API_BASE_URL}/user/${user.id}/analyze`);
            const data = await res.json();
            setAnalysis(data);
        } catch(e) {
            console.error(e);
        }
        finally {
             setIsAnalyzing(false);
        }
    };
    
    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans">
            <div className="container mx-auto p-8">
                 <header className="flex justify-between items-center mb-12">
                     <div>
                        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                           Skills Gap Analyzer
                        </h1>
                         <p className="text-gray-400">Welcome, {user.name || user.email}!</p>
                    </div>
                    <button onClick={onLogout} className="bg-gray-700 hover:bg-red-600 px-6 py-2 rounded-md font-semibold">
                        Logout
                    </button>
                </header>

                <main className="grid md:grid-cols-2 gap-8">
                    {/* User Skills Section */}
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-3xl font-semibold mb-4 text-purple-400">Your Skills</h2>
                        {loading ? <p>Loading skills...</p> : (
                             <ul className="space-y-2 min-h-[100px]">
                                {userSkills.map((s) => (
                                    <li key={s.skillId} className="bg-gray-700 p-3 rounded-md animate-fade-in">{s.skill.name}</li>
                                ))}
                            </ul>
                        )}
                         <div className="mt-6 flex gap-4">
                            <select 
                                value={selectedSkill}
                                onChange={(e) => setSelectedSkill(e.target.value)}
                                className="flex-grow bg-gray-700 p-3 rounded-md outline-none"
                            >
                                <option value="">-- Add a skill --</option>
                                {allSkills.filter(s => !userSkills.some(us => us.skillId === s.id)).map(skill => (
                                    <option key={skill.id} value={skill.id}>{skill.name}</option>
                                ))}
                            </select>
                            <button onClick={handleAddSkill} className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-md font-semibold">
                                Add
                            </button>
                        </div>

                         <button 
                            onClick={handleAnalyze} 
                            disabled={isAnalyzing}
                            className="w-full mt-6 bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isAnalyzing ? 'Analyzing...' : 'Analyze My Skills Gap'}
                        </button>
                    </div>

                    {/* Analysis Section */}
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg min-h-[400px]">
                        <h2 className="text-3xl font-semibold mb-4 text-pink-500">Analysis Results</h2>
                         {!analysis && !isAnalyzing && <p className="text-gray-400">Click "Analyze" to see your personalized results.</p>}
                         {isAnalyzing && <p className="text-gray-400">Running analysis...</p>}
                         {analysis && (
                            <div className="animate-fade-in">
                                <div className="mb-6">
                                <h3 className="text-xl font-bold mb-2">Trending Remote Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {analysis.trendingSkills.map((ts) => (
                                        <span key={ts.skill.id} className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">{ts.skill.name}</span>
                                    ))}
                                </div>
                                </div>
                                
                                <div className="mb-6">
                                <h3 className="text-xl font-bold mb-2">Your Skills Gap</h3>
                                <div className="flex flex-wrap gap-2">
                                    {analysis.gap.length === 0 
                                    ? <p className="text-gray-400">No gap found! You have all the trending skills.</p> 
                                    : analysis.gap.map((g) => (
                                        <span key={g.skill.id} className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">{g.skill.name}</span>
                                    ))}
                                </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold mb-2">Personalized Roadmap</h3>
                                    <ul className="space-y-3">
                                        {analysis.roadmap.length === 0
                                        ? <p className="text-gray-400">Your roadmap will appear here.</p> 
                                        : analysis.roadmap.map((item) => (
                                            <li key={item.skill.id} className="bg-gray-700 p-4 rounded-md">
                                                <p className="font-bold text-purple-400">{item.skill.name}</p>
                                                <p className="text-gray-300">{item.suggestion}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                         )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
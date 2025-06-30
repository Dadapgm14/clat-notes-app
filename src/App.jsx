// App.jsx
import React, { useState, useEffect } from 'react'; import { supabase } from './supabaseClient'; import Auth from './Auth'; import NotebooksApp from './NotebooksApp'; import NotesApp from './NotesApp';

function App() { const [session, setSession] = useState(null); const [selectedNotebook, setSelectedNotebook] = useState(null);

useEffect(() => { supabase.auth.getSession().then(({ data }) => { setSession(data.session); });

const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
  setSession(session);
});

return () => {
  listener?.subscription.unsubscribe();
};

}, []);

const handleSignOut = async () => { await supabase.auth.signOut(); setSession(null); setSelectedNotebook(null); };

if (!session) { return <Auth onAuthSuccess={() => supabase.auth.getSession().then(({ data }) => setSession(data.session))} />; }

return ( <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"> <div className="p-4 flex justify-between items-center"> <h1 className="text-2xl font-bold">CLAUSE GK</h1> <button
onClick={handleSignOut}
className="text-sm text-red-500 border border-red-500 px-3 py-1 rounded hover:bg-red-50"
> Sign Out </button> </div> {selectedNotebook ? ( <NotesApp session={session} selectedNotebook={selectedNotebook} onBack={() => setSelectedNotebook(null)} /> ) : ( <NotebooksApp
session={session}
onNotebookSelect={setSelectedNotebook}
/> )} </div> ); }

export default App;
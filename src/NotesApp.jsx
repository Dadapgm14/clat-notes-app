// NotesApp.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function NotesApp({ session, selectedNotebook, onBack }) {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editText, setEditText] = useState('');
  const [fontColor, setFontColor] = useState('#000000');
  const [topics, setTopics] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [structuredMode, setStructuredMode] = useState(true);

  useEffect(() => {
    if (selectedNotebook?.id) {
      fetchNotes();
      fetchTopics();
    }
    if (session?.user) fetchFontColor();
  }, [selectedNotebook, session]);

  const fetchFontColor = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('font_color')
      .eq('id', session.user.id)
      .single();

    if (error) {
      console.error('Error fetching font color:', error);
      return;
    }

    if (data?.font_color) {
      setFontColor(data.font_color);
    } else {
      const defaultColor = '#000000';
      setFontColor(defaultColor);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ font_color: defaultColor })
        .eq('id', session.user.id);

      if (updateError) {
        console.error('Failed to set default font color:', updateError);
      }
    }
  };

  const updateFontColor = async (newColor) => {
    setFontColor(newColor);
    await supabase.from('profiles').update({ font_color: newColor }).eq('id', session.user.id);
  };

  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from('notes')
      .select(`*, user_profile:profiles!user_id(id, font_color)`)
      .eq('notebook_id', selectedNotebook.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notes with font color:', error);
    } else {
      setNotes(data);
    }
  };

  const fetchTopics = async () => {
    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .eq('notebook_id', selectedNotebook.id);

    if (!error) setTopics(data);
  };

  const getSuggestedTag = (text) => {
    const lowerText = text.toLowerCase();
    for (const topic of topics) {
      for (const tag of topic.tags) {
        if (lowerText.includes(tag.toLowerCase())) return topic.topic_name;
      }
    }
    return null;
  };

  const handleNoteSubmit = async () => {
    if (!newNote.trim()) return;

    const suggestedTag = getSuggestedTag(newNote);
    const finalTag = selectedTopic || suggestedTag;

    await supabase.from('notes').insert([{
      text: newNote,
      user_id: session.user.id,
      notebook_id: selectedNotebook.id,
      tag: finalTag || null,
    }]);

    setNewNote('');
    fetchNotes();
  };

  const handleDelete = async (id) => {
    await supabase.from('notes').delete().eq('id', id);
    fetchNotes();
  };

  const handleUpdate = async (id) => {
    await supabase.from('notes').update({ text: editText }).eq('id', id);
    setEditingNoteId(null);
    setEditText('');
    fetchNotes();
  };

  const uniqueTopics = [...new Set(topics.map((t) => t.topic_name))];

  const filteredNotes = (selectedTopic
    ? notes.filter((n) => n.tag === selectedTopic)
    : notes
  ).filter((n) =>
    n.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (n.tag && n.tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const groupedNotes = filteredNotes.reduce((acc, note) => {
    const heading = note.tag || 'Uncategorized';
    if (!acc[heading]) acc[heading] = [];
    acc[heading].push(note);
    return acc;
  }, {});

  const canEdit = selectedNotebook.user_id === session.user.id || selectedNotebook.shared;

  return (
    <div className="px-6 py-8 bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">📝 Notes for: {selectedNotebook.title}</h2>
        <button className="text-sm text-blue-500 underline" onClick={onBack}>
          ← Back to Notebooks
        </button>
      </div>

      <div className="mb-4 flex items-center gap-4 flex-wrap">
        <label className="font-semibold">Font Color:</label>
        <input
          type="color"
          value={fontColor}
          onChange={(e) => updateFontColor(e.target.value)}
          className="w-10 h-6 border rounded"
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={structuredMode}
            onChange={(e) => setStructuredMode(e.target.checked)}
          />
          Use structured format
        </label>
      </div>

      {uniqueTopics.length > 0 && (
        <div className="mb-4 flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedTopic(null)}
            className={`px-3 py-1 rounded text-sm border ${selectedTopic === null ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-700 text-black dark:text-white'}`}
          >
            All Topics
          </button>
          {uniqueTopics.map((topic) => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`px-3 py-1 rounded text-sm border ${selectedTopic === topic ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-700 text-black dark:text-white'}`}
            >
              {topic}
            </button>
          ))}
        </div>
      )}

      <textarea
        placeholder={structuredMode ? `Heading:\nWho:\nWhat:\nWhen:\nWhere:\nWhy:\nHow:\nWho did it first and when:` : 'Write a new note...'}
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        rows={structuredMode ? 8 : 4}
        className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
      />

      <div className="mt-2 flex items-center gap-2">
        <select
          value={selectedTopic || getSuggestedTag(newNote) || ''}
          onChange={(e) => setSelectedTopic(e.target.value || null)}
          className="border px-3 py-2 rounded bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        >
          <option value="">Select Topic (auto-suggested below)</option>
          {uniqueTopics.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <button
          onClick={handleNoteSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save Note
        </button>
      </div>

      <input
        type="text"
        placeholder="Search notes by text or tag..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full mt-6 mb-4 px-4 py-2 border rounded bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
      />

      {Object.entries(groupedNotes).map(([heading, notes]) => (
        <div key={heading} className="mb-6">
          <h3 className="text-lg font-bold mb-2">{heading}</h3>
          <div className="space-y-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="border rounded p-4 bg-white dark:bg-gray-800 dark:border-gray-700 shadow"
              >
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {note.tag || 'No topic'} · {new Date(note.created_at).toLocaleString()}
                </div>
                {editingNoteId === note.id ? (
                  <>
                    <textarea
                      value={editText}
                      onChange={(e) => {
                        setEditText(e.target.value);
                        e.target.style.height = 'auto';
                        e.target.style.height = e.target.scrollHeight + 'px';
                      }}
                      className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white resize-none overflow-hidden"
                      style={{ minHeight: '3rem' }}
                    />
                    <div className="mt-2 flex gap-2">
                      <button
                        className="text-sm text-green-600"
                        onClick={() => handleUpdate(note.id)}
                      >
                        Save
                      </button>
                      <button
                        className="text-sm text-gray-400"
                        onClick={() => {
                          setEditingNoteId(null);
                          setEditText('');
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p style={{ color: note.user_profile?.font_color || '#000000' }}>
                      {note.text}
                    </p>
                    {canEdit && (
                      <div className="flex gap-4 mt-2">
                        <button
                          className="text-sm text-yellow-500 underline"
                          onClick={() => {
                            setEditingNoteId(note.id);
                            setEditText(note.text);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="text-sm text-red-500 underline"
                          onClick={() => handleDelete(note.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default NotesApp;

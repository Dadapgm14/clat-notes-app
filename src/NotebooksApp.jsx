// NotebooksApp.jsx 
import React, { useState, useEffect } from 'react'; 
import { supabase } from './supabaseClient';

function NotebooksApp({ session, onNotebookSelect }) {
  const [notebooks, setNotebooks] = useState([]);
  const [title, setTitle] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [editingNotebookId, setEditingNotebookId] = useState(null);

  const fetchNotebooks = async () => {
    try {
      console.log("🟡 Fetching owned notebooks...");

      const { data: ownedNotebooks, error: ownedError } = await supabase
        .from('notebooks')
        .select(`
          *,
          topics (
            id,
            topic_name,
            tags
          ),
          shared_with (
            user_id
          )
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (ownedError) throw ownedError;
      console.log("✅ Owned notebooks:", ownedNotebooks);

      console.log("🟡 Fetching shared notebooks...");
      const { data: sharedEntries, error: sharedError } = await supabase
        .from('shared_with')
        .select(`
          notebook_id,
          notebooks (
            *,
            topics (
              id,
              topic_name,
              tags
            ),
            shared_with (
              user_id
            )
          )
        `)
        .eq('user_id', session.user.id);

      if (sharedError) throw sharedError;

      const sharedNotebooks = sharedEntries
        .map((entry) => entry.notebooks)
        .filter((nb) => nb);

      console.log("✅ Shared notebooks:", sharedNotebooks);

      const attachSharedUserIds = (notebooks) =>
        notebooks.map((nb) => ({
          ...nb,
          shared_with_ids: nb.shared_with?.map((sw) => sw.user_id) || [],
        }));

      const allNotebooks = attachSharedUserIds([
        ...(ownedNotebooks || []),
        ...(sharedNotebooks || []),
      ]);

      setNotebooks(allNotebooks);
    } catch (err) {
      console.error("🔥 Unexpected fetchNotebooks error:", err.message || err);
    }
  };

  useEffect(() => { if (session) fetchNotebooks(); }, [session]);

  const parseTagsInput = (input, notebookId) => {
    return input.split('\n').reduce((acc, line) => {
      const [topic, tagsRaw] = line.split(':');
      if (topic && tagsRaw) {
        const tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean);
        acc.push({ notebook_id: notebookId, topic_name: topic.trim(), tags });
      }
      return acc;
    }, []);
  };

  const createOrUpdateNotebook = async () => {
    if (!title.trim()) return;

    if (editingNotebookId) {
      const { error: updateError } = await supabase
        .from('notebooks')
        .update({ title })
        .eq('id', editingNotebookId);

      if (updateError) return console.error('Error updating notebook:', updateError);

      await supabase.from('topics').delete().eq('notebook_id', editingNotebookId);

      const tagsMap = parseTagsInput(tagsInput, editingNotebookId);

      if (tagsMap.length > 0) {
        const { error: insertError } = await supabase.from('topics').insert(tagsMap);
        if (insertError) return console.error('Error inserting updated topics:', insertError);
      }

      setEditingNotebookId(null);
    } else {
      const { data: notebook, error } = await supabase
        .from('notebooks')
        .insert([{ title, user_id: session.user.id }])
        .select()
        .single();

      if (error) return console.error('Error creating notebook:', error);

      const tagsMap = parseTagsInput(tagsInput, notebook.id);

      if (tagsMap.length > 0) {
        const { error: topicsError } = await supabase.from('topics').insert(tagsMap);
        if (topicsError) return console.error('Error inserting topics:', topicsError);
      }
    }

    setTitle('');
    setTagsInput('');
    fetchNotebooks();
  };

  const handleEdit = (notebook) => {
    setTitle(notebook.title);
    setEditingNotebookId(notebook.id);

    if (notebook.topics?.length) {
      const formatted = notebook.topics
        .map((t) => `${t.topic_name}: ${t.tags?.join(', ')}`)
        .join('\n');
      setTagsInput(formatted);
    } else {
      setTagsInput('');
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this notebook and all its contents?');
    if (!confirmed) return;

    const { error } = await supabase
      .from('notebooks')
      .delete()
      .eq('id', id);

    if (error) return console.error('Error deleting notebook:', error);
    fetchNotebooks();
  };

  const shareNotebook = async (notebookId, email) => {
    try {
      const trimmedEmail = email.trim().toLowerCase();

      const { data: user, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .ilike('email', trimmedEmail)
        .maybeSingle();

      if (fetchError) {
        console.error('Error querying profiles:', fetchError);
        alert('Error querying user. Try again.');
        return;
      }

      if (!user) {
        alert('No user with this email found.');
        return;
      }

      const { error: insertError } = await supabase
        .from('shared_with')
        .insert([{ notebook_id: notebookId, user_id: user.id }]);

      if (insertError) {
        console.error('Error sharing notebook:', insertError);
        alert('Failed to share notebook.');
      } else {
        alert('Notebook shared successfully!');
      }
    } catch (e) {
      console.error('Unexpected error in shareNotebook:', e);
      alert('Unexpected error occurred.');
    }
  };

  return (
    <div className="w-full px-6 py-8 bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <h2 className="text-xl font-bold mb-4">📒 Your Notebooks</h2>

      <div className="flex flex-col gap-2 mb-6">
        <input
          type="text"
          placeholder="Notebook Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded px-3 py-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />

        <textarea
          placeholder="Enter topics and tags like:\nPolitics: elections, government\nSpace: NASA, ISS"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value.replace(/\\n/g, '\n'))}
          rows={4}
          className="border rounded px-3 py-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />

        <button
          onClick={createOrUpdateNotebook}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          {editingNotebookId ? 'Update Notebook' : 'Create Notebook'}
        </button>
      </div>

      {notebooks.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No notebooks created yet.</p>
      ) : (
        <ul className="space-y-4">
          {notebooks.map((nb) => {
            const userIsOwner = nb.user_id === session.user.id;
            const isSharedWithUser = nb.shared_with_ids?.includes(session.user.id);
            const userHasEditAccess = userIsOwner || isSharedWithUser;

            return (
              <li
                key={nb.id}
                className="border p-4 rounded bg-white dark:bg-gray-800 dark:border-gray-700 shadow"
              >
                <h3 className="text-lg font-semibold">
                  {nb.title}
                  {!userIsOwner && (
                    <span className="ml-2 text-sm text-blue-400">(Shared)</span>
                  )}
                </h3>

                {nb.last_updated && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Last updated: {new Date(nb.last_updated).toLocaleString()}
                  </div>
                )}

                {nb.topics?.length > 0 && (
                  <ul className="mt-2 ml-2 space-y-1">
                    {nb.topics.map((topic) => (
                      <li key={topic.id}>
                        <span className="font-medium">{topic.topic_name}</span>
                        <span className="text-sm text-gray-500 ml-2">
                          ({topic.tags?.join(', ')})
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex gap-4 mt-2 flex-wrap">
                  <button
                    className="text-sm text-blue-500 underline"
                    onClick={async () => {
                      const { data, error } = await supabase
                        .from("notebooks")
                        .select(`
                          *,
                          topics (
                            id,
                            topic_name,
                            tags
                          )
                        `)
                        .eq("id", nb.id)
                        .single();

                      if (error) {
                        console.error("Error fetching notebook with topics:", error);
                      } else {
                        onNotebookSelect(data);
                      }
                    }}
                  >
                    Select Notebook
                  </button>

                  {userHasEditAccess && (
                    <>
                      <button
                        className="text-sm text-yellow-500 underline"
                        onClick={() => handleEdit(nb)}
                      >
                        Edit
                      </button>

                      {userIsOwner && (
                        <button
                          className="text-sm text-red-500 underline"
                          onClick={() => handleDelete(nb.id)}
                        >
                          Delete
                        </button>
                      )}

                      <button
                        className="text-sm text-purple-500 underline"
                        onClick={() => {
                          const email = prompt("Enter email to share with:");
                          if (email) shareNotebook(nb.id, email);
                        }}
                      >
                        Share
                      </button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default NotebooksApp;

// src/utils/aiTagger.js
export async function getAITag(text, headings) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer YOUR_OPENAI_API_KEY`, // Replace this
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant. Based on the provided list of headings, classify the following note content into the most appropriate heading from the list: ${headings.join(", ")}`,
        },
        {
          role: "user",
          content: text,
        },
      ],
    }),
  });

  const data = await response.json();
  const aiReply = data.choices?.[0]?.message?.content?.trim();

  // Ensure the result is a heading from the list
  return headings.includes(aiReply) ? aiReply : "Miscellaneous";
}
export async function getAITag(noteText) {
  const res = await fetch('http://localhost:3000/api/tag', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: noteText }),
  });

  if (!res.ok) {
    throw new Error('Failed to get AI tag');
  }

  const data = await res.json();
  return data.tag;
}

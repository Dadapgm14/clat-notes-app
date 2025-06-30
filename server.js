import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import OpenAI from 'openai';

config(); // Loads .env file
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const headings = [
  "EU", "Miscellaneous", "Nepal & Bhutan", "Extraterrestrial (Space)", "Budget 2022",
  "Parliament Winter Session", "Ukraine Invasion", "Diseases & Health", "COVID",
  "Farm Bills, Agriculture, Nutrition", "Reports and Indices", "Awards, Titles and Honors",
  "Military", "UN and International Organizations", "Psephology", "Maritime", "QUAD",
  "ASEAN", "CASFPLC", "Important Days", "USA & Canada", "Appointments", "Cyberspace/Science",
  "Indian Finance", "Schemes & Projects", "Sri Lanka", "Climate & Environment", "Bangladesh",
  "North East", "International Summits and Relations", "Legal Affairs", "Gulf Countries", "SCO",
  "Geography/Demography", "Laws & Amendments", "UK", "International Exercises", "Padma Awards",
  "COP29", "Riparian Affairs", "Jammu & Kashmir", "Middle East", "Culture", "Forest and Wildlife",
  "Sports", "International Finance", "Government of India/State News", "China", "NITI Aayog",
  "Nobel Prizes", "Natural Calamities (National & International)", "International Treaties & Bodies",
  "Russia", "Intelligence/Crime Agencies India", "Indian History", "Pakistan",
  "Islamic Emirate of Afghanistan", "Education", "Sustainable Development Goals (SDG 2030)",
  "Olympics", "Backward Classes & Reservations", "Korean Peninsula", "G7",
  "Population and Citizenship", "Geographical Disputes", "Myanmar", "Important HQs", "SAARC",
  "Leaked Documents", "Iran", "G20", "BRICS"
];

app.post('/api/tag', async (req, res) => {
  const { text } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a tagging assistant. Your job is to read the note and choose the most relevant tag from the following list. Reply ONLY with the tag. No explanation.\n\n${headings.join(', ')}`,
        },
        {
          role: 'user',
          content: text,
        },
      ],
    });

    const tag = response.choices[0].message.content.trim();
    res.json({ tag });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

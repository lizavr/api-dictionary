const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(bodyParser.json());

const dictionaryFile = 'dictionary.json';

const initialWords = [
  {
    id: uuidv4(),
    valueEn: 'Dog',
    valueRu: 'Собака',
    comments: 'Animal-friend',
    status: '0',
  },
  {
    id: uuidv4(),
    valueEn: 'Cat',
    valueRu: 'Кот',
    comments: 'Animal- nightmare',
    status: '1',
  },
  {
    id: uuidv4(),
    valueEn: 'Tired',
    valueRu: 'Усталь',
    comments: 'say no more',
    status: '2',
  },
];

const initializeDictionaryFile = () => {
  if (!fs.existsSync(dictionaryFile)) {
    writeDictionary(initialWords);
  }
};

const readDictionary = () => {
  try {
    const data = fs.readFileSync(dictionaryFile);
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeDictionary = (data) => {
  fs.writeFileSync(dictionaryFile, JSON.stringify(data, null, 2));
};

app.get('/words', (req, res) => {
  const words = readDictionary();
  res.json(words);
});

app.post('/words', (req, res) => {
  const { valueEn, valueRu, comments, status } = req.body;
  const words = readDictionary();
  const newWord = {
    id: uuidv4(),
    valueEn,
    valueRu,
    comments,
    status,
  };
  words.push(newWord);
  writeDictionary(words);
  res.status(201).json(newWord);
});

app.put('/words/:id', (req, res) => {
  const { id } = req.params;
  const { valueEn, valueRu, comments, status } = req.body;
  const words = readDictionary();
  const index = words.findIndex((word) => word.id === id);

  if (index === -1) return res.status(404).json({ error: 'Word not found' });

  words[index] = { ...words[index], valueEn, valueRu, comments, status };
  writeDictionary(words);
  res.json(words[index]);
});

app.delete('/words/:id', (req, res) => {
  const { id } = req.params;
  let words = readDictionary();
  words = words.filter((word) => word.id !== id);
  writeDictionary(words);
  res.status(204).send();
});

initializeDictionaryFile();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// const express = require('express');
// const axios = require('axios');

// const app = express();
// const port = 8008;

// app.get('/numbers', async (req, res) => {
//   let { url: urls } = req.query;
  
//   // Ensuring urls is always an array
//   if (!Array.isArray(urls)) {
//     urls = [urls];
//   }

//   if (!urls) {
//     return res.status(400).send({ error: 'Invalid input' });
//   }

//   const fetchPromises = urls.map((url) => 
//     axios.get(url, { timeout: 500 }).then(response => response.data.numbers).catch(() => [])
//   );

//   const results = await Promise.allSettled(fetchPromises);

//   let allNumbers = results
//     .filter(result => result.status === 'fulfilled')
//     .flatMap(result => result.value);

//   // Getting unique and sorted numbers
//   const uniqueNumbers = Array.from(new Set(allNumbers)).sort((a, b) => a - b);
  
//   res.send({ numbers: uniqueNumbers });
// });

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });


const express = require('express');
const axios = require('axios');

const app = express();
const port = 8008;

app.get('/numbers', async (req, res) => {
  const { url: urls } = req.query;

  // Input validation
  if (!urls) {
    return res.status(400).json({ error: 'Invalid input: URL parameter is missing.' });
  }

  const urlArray = Array.isArray(urls) ? urls : [urls];

  // Initializing an empty set to store unique numbers
  const uniqueNumbersSet = new Set();

  // Parallel fetching data from all URLs using Promise.allSettled to gracefully handle any rejection
  try {
    const results = await Promise.allSettled(urlArray.map((url) => axios.get(url, { timeout: 500 })));

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        const numbers = result.value.data.numbers;
        numbers.forEach((number) => uniqueNumbersSet.add(number));
      }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  // Converting set to array and sorting it in ascending order before sending in the response
  const sortedUniqueNumbers = Array.from(uniqueNumbersSet).sort((a, b) => a - b);
  res.status(200).json({ numbers: sortedUniqueNumbers });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

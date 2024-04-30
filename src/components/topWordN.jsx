import React, { useState } from 'react';

const TopWordN = () => {
  const [topNegativeWords, setTopNegativeWords] = useState([]);

  const fetchTopWords = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/top-words?category=negative');
      const topWords = await response.json();
        setTopNegativeWords(topWords);
    } catch (error) {
      console.error('Error fetching top words:', error);
    }
  };

  return (
    <div>
      <h2>Top Negative Words</h2>
      <ul className='list-unstyled'>
        {topNegativeWords.map(({ word, count }) => (
          <li key={word}>{word} ({count})</li>
        ))}
      </ul>
      <button className='btn btn-danger' onClick={() => fetchTopWords('negative')}>Get Top Negative Words</button>
    </div>
  );
};

export default TopWordN;
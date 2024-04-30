import React, { useState } from 'react';

const TopWordP = () => {
  const [topPositiveWords, setTopPositiveWords] = useState([]);

  const fetchTopWords = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/top-words?category=positive');
      const topWords = await response.json();
        setTopPositiveWords(topWords);
    } catch (error) {
      console.error('Error fetching top words:', error);
    }
  };

  return (
    <div>
      <h2>Top Positive Words</h2>
      <ul className='list-unstyled'>
        {topPositiveWords.map(({ word, count }) => (
          <li key={word}>{word} ({count})</li>
        ))}
      </ul>
      <button className='btn btn-success' onClick={() => fetchTopWords('positive')}>Get Top Positive Words</button>
    </div>
  );
};

export default TopWordP;
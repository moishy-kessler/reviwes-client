import React, { useState, useEffect } from 'react';
import TopWordP from './topWordP';
import TopWordN from './topWordN';


const ReviewsGrid2 = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchSentiment, setSearchSentiment] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const PAGE_SIZE = 500; // Portion size (number of records per page)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          sentiment: searchSentiment,
          text: searchText,
          page: currentPage,
        }).toString();

        const response = await fetch(`http://localhost:3001/api/reviews?${params}`);
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage, searchSentiment, searchText]);

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
    setCurrentIndex((currentPage + 1) * 500);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
    setCurrentIndex((currentPage + 1) * 500);
  };

  const handleSearchSentiment = (event) => {
    const sentiment = event.target.value;
    setSearchSentiment(sentiment);
    setCurrentPage(0); // Reset page when sentiment changes
    setCurrentIndex(0)
  };

  const handleSearchText = (event) => {
    const text = event.target.value;
    setSearchText(text);
    setCurrentPage(0); // Reset page when text changes
    setCurrentIndex(0);
  };

const [exportPage, setExportPage] = useState(0);

// Excel export function
const handleExport = async () => {
  try {
    const response = await fetch(`http://localhost:3001/api/export/${exportPage}`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reviews-page${exportPage+1}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    setExportPage(exportPage + 1);
  } catch (error) {
    console.error('Error exporting data:', error);
  }
};

    

  return (
    <div className='min-vw-100'>
        <h1 className='bg-body-tertiary border-3 p-5 text-center shadow'>Amazon Reviews</h1>
      <div className="filters row">
        <div className='col-4 text-center'>
        <h3 className='bg-success-subtle p-3'>Search by</h3>
        <select className='form-select' value={searchSentiment} onChange={handleSearchSentiment}>
          <option value="all">All</option>
          <option value="positive">Positive</option>
          <option value="negative">Negative</option>
        </select>
        </div>
        
        <div  className='col-4 text-center'>
        <h3 className='bg-success-subtle p-3'>free search</h3>
        <input className='input-group' type="text" placeholder="Search..." value={searchText} onChange={handleSearchText} />
        </div>
        <div  className='col-4 text-center'>
        <h3 className='bg-success-subtle p-3 '>Export to Excel</h3>
        <button className='btn btn-info m-1' onClick={handleExport}>Export to CSV</button>
        {exportPage > 0 && <button className='btn btn-info' onClick={handleExport}>Export Next Batch</button>}
        </div>
      </div>
      <div className="filters row">
        <div className='col-6 text-center'><TopWordP/></div>
        <div className='col-6 text-center'><TopWordN/></div>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="container">
          <div className='w-100 text-center'>
            {data.map((review, index) => (
              <div key={index}>
                <h3 className='text-start mx-3'>{currentIndex + 1 + index}</h3>
                <h3>{review.title}</h3>
                <p className='par mx-2'>{review.review}</p>
                <p><span className='fw-bold'>Sentiment: </span>{review.sentiment == 1 ? 'Negative' : 'Positive'}</p>
              </div>
            ))}
          </div>
          <div className="m-2">
            <button className="btn btn-info mx-2" disabled={currentPage === 0} onClick={handlePrevPage}>
              Previous Page
            </button>
            <button className="btn btn-info mx-2" onClick={handleNextPage}>Next Page</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsGrid2;

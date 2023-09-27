import React, { useEffect, useState } from 'react'
import { News } from '../../../types/news'

const AdminViewNews: React.FC = () => {
  const [news, setNews] = useState<News[]>([])

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/news`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setNews(data)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }, [])

  return (
    <div className='container'>
      {news.length > 0 ? (
        news.map((news) => (
          <div className='card mb-4' key={news._id}>
            <div className='card-header' style={{ backgroundColor: '#923D41' }}>
              <span style={{ color: 'white' }}>{news.newsTitle}</span>
            </div>
            <div className='card-body'>
              <b>
                Date Published: {news.publishedOn}{' '}
                <a href={`/manage-bulletin/news/${news._id}`}>
                  <i className='btn-sm btn-info'>Manage News</i>
                </a>
              </b>
              <br />
              <br />
              {news.newsContent.split('\n').map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>No news here yet</p>
      )}
      <br />
    </div>
  )
}

export default AdminViewNews

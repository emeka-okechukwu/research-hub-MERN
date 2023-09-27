import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../../components/Header/Header'
import { researchBinarySearch } from '../../searchFunctions/researchBinarySearch'
import { Research } from '../../types/research'

const OngoingResearch: React.FC = () => {
  const [researches, setResearches] = useState<Research[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/research/ongoing`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setResearches(data)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }, [])

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value
    setSearchTerm(searchTerm)
    setCurrentPage(1)

    if (searchTerm === '') {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/research/ongoing`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setResearches(data)
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
        })
    }
  }

  const filteredResearches = researchBinarySearch(researches, searchTerm)

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredResearches.slice(
    indexOfFirstItem,
    indexOfLastItem
  )

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const pageNumbers = []
  for (
    let i = 1;
    i <= Math.ceil(filteredResearches.length / itemsPerPage);
    i++
  ) {
    pageNumbers.push(i)
  }

  return (
    <div>
      <Header />
      <div className='container mt-1'>
        <h2 style={{ color: '#923D41' }}>
          <span className='fa fa-spinner'></span> Ongoing Research
        </h2>
        <br />

        <ul className='nav nav-tabs'>
          <li className='nav-item'>
            <button className='nav-link active' data-toggle='tab'>
              My Ongoing Research Studies
            </button>
          </li>
        </ul>

        <div className='tab-content container'>
          <br />
          <div className='row'>
            <div className='col-sm-4'>
              <input
                className='form-control'
                type='text'
                placeholder='enter research topic'
                maxLength={20}
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className='col-sm-3'></div>
            <div className='col-sm-3' style={{ textAlign: 'right' }}></div>
          </div>
          <br />
          {currentItems.length > 0 ? (
            <div className='table-responsive'>
              <table className='table table-hover table-sm custom-table'>
                <thead>
                  <tr>
                    <th scope='col'></th>
                    <th scope='col' className='text-nowrap'>
                      Research Topic
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((research) => (
                    <tr key={research._id}>
                      <td width='1%'>
                        <Link to={`/manage-research/${research._id}`}>
                          <i className='btn fa fa-eye'></i>
                        </Link>
                      </td>
                      <td>{research.researchTopic}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No ongoing research found</p>
          )}
          <nav>
            <ul className='pagination'>
              {pageNumbers.map((pageNumber) => (
                <li
                  key={pageNumber}
                  className={`page-item ${
                    pageNumber === currentPage ? 'active' : ''
                  }`}
                >
                  <button
                    className='page-link'
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <br />
      </div>
    </div>
  )
}

export default OngoingResearch

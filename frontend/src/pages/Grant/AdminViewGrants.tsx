import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminHeader from '../../components/Header/AdminHeader'
import GrantModal from '../../components/Modal/GrantModal'
import { Grant } from '../../types/grant'

const AdminViewGrants: React.FC = () => {
  const [grants, setGrants] = useState<Grant[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null)
  const itemsPerPage = 10

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/grant`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setGrants(data)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }, [])

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = grants.slice(indexOfFirstItem, indexOfLastItem)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const pageNumbers = []
  for (let i = 1; i <= Math.ceil(grants.length / itemsPerPage); i++) {
    pageNumbers.push(i)
  }

  const handleGrantClick = (grant: Grant) => {
    setSelectedGrant(grant)
  }

  const handleCloseModal = () => {
    setSelectedGrant(null)
  }

  return (
    <div>
      <AdminHeader />
      <div className='container mt-1'>
        <h2 style={{ color: '#923D41' }}>
          <span className='fas fa-hand-holding-usd'></span> View Grants
        </h2>
        <br />

        <ul className='nav nav-tabs'>
          <li className='nav-item'>
            <button type='button' className='nav-link active' data-toggle='tab'>
              Grants List
            </button>
          </li>
        </ul>
        <br />

        <div className='tab-content container'>
          {currentItems.length > 0 ? (
            currentItems.map((grant) => (
              <li className='media' key={grant._id}>
                <div className='media-left border border-danger rounded-lg'>
                  <div className='panel panel-danger text-center date'>
                    <div className='panel-heading month bg-warning border-bottom-0 rounded-top text-nowrap'>
                      <span className='panel-title strong'>
                        {new Date(grant.closingDate).toLocaleString('default', {
                          month: 'short',
                        })}
                      </span>
                    </div>
                    <div className='panel-body day text-danger'>
                      {new Date(grant.closingDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                </div>

                <div className='table-responsive'>
                  <div className='media-body pl-3'>
                    <h4 className='media-heading'>
                      {grant.grantName}{' '}
                      <i
                        className='btn-sm btn-secondary action-button view_details'
                        style={{ cursor: 'pointer' }}
                        data-toggle='modal'
                        data-target='#viewDetails'
                        onClick={() => handleGrantClick(grant)}
                      >
                        View Details
                      </i>{' '}
                      <Link to={`/manage-grant/${grant._id}`}>
                        <i className='btn-sm btn-info action-button'>
                          Manage Grant
                        </i>
                      </Link>
                    </h4>
                    <table className='table table-borderless table-sm grant-table'>
                      <thead className='thead-light'>
                        <tr>
                          <th>
                            <small>
                              <i className='fas fa-money-bills'></i> Maximum
                              Amount
                            </small>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            {grant.currency !== 'Other'
                              ? grant.currency + ' ' + grant.maximumAward
                              : grant.maximumAward}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p>No grants here yet</p>
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
                    type='button'
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

        {selectedGrant && (
          <GrantModal
            selectedGrant={selectedGrant}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  )
}

export default AdminViewGrants

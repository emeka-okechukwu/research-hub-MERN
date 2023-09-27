import React, { useEffect, useState } from 'react'
import AdminHeader from '../../components/Header/AdminHeader'
import UserDetails from '../../components/Modal/UserDetails'
import { userBinarySearch } from '../../searchFunctions/userBinarySearch'
import { User } from '../../types/user'

const AdminAllResearchers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [copiedUserId, setCopiedUserId] = useState<string>('')
  const [isCopied, setIsCopied] = useState<boolean>(false)
  const itemsPerPage = 10

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/users/admin/researchers`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.users)
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
      fetch(`${process.env.REACT_APP_BACKEND_URL}/users/admin/researchers`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUsers(data.users)
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
        })
    }
  }

  const getStatus = (verified: number): string => {
    switch (verified) {
      case 2:
        return 'Active'
      case 1:
        return 'Inactive'
      case 0:
        return 'Blocked'
      default:
        return 'Unknown'
    }
  }

  const handleCopyEmail = (userId: string, email: string) => {
    navigator.clipboard.writeText(email)
    setCopiedUserId(userId)
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }

  const filteredUsers = userBinarySearch(users, searchTerm)

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const pageNumbers = []
  for (let i = 1; i <= Math.ceil(filteredUsers.length / itemsPerPage); i++) {
    pageNumbers.push(i)
  }

  const handleUserClick = (user: User) => {
    setSelectedUser(user)
  }

  const handleCloseModal = () => {
    setSelectedUser(null)
  }

  return (
    <div>
      <AdminHeader />
      <div className='container mt-1'>
        <h2 style={{ color: '#923D41' }}>
          <span className='fa fa-users'></span> All Researchers
        </h2>
        <br />

        <ul className='nav nav-tabs'>
          <li className='nav-item'>
            <button className='nav-link active' data-toggle='tab'>
              Researchers List
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
                placeholder='enter name'
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
                      Name
                    </th>
                    <th scope='col' className='text-nowrap'>
                      Department
                    </th>
                    <th scope='col' className='text-nowrap'>
                      Rank
                    </th>
                    <th scope='col' className='text-nowrap'>
                      Status
                    </th>
                    <th scope='col' className='text-nowrap'></th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((user) => (
                    <tr key={user._id}>
                      <td width='1%'>
                        <i
                          className='btn fa fa-eye'
                          style={{
                            cursor: 'pointer',
                          }}
                          data-toggle='modal'
                          data-target='#viewDetails'
                          onClick={() => handleUserClick(user)}
                        ></i>
                      </td>
                      <td className='text-nowrap'>
                        {user.firstName} {user.lastName}
                      </td>
                      <td className='text-nowrap'>{user.department}</td>
                      <td className='text-nowrap'>{user.rank}</td>
                      <td className='text-nowrap'>
                        {getStatus(user.verified)}
                      </td>
                      <td className='text-nowrap' width='1%'>
                        <button
                          className='btn btn-light'
                          onClick={() => handleCopyEmail(user._id, user.email)}
                        >
                          {copiedUserId === user._id && isCopied
                            ? 'Copied!'
                            : 'Copy Email'}
                          <i className='btn fa fa-envelope'></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No researchers found</p>
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
        {selectedUser && (
          <UserDetails selectedUser={selectedUser} onClose={handleCloseModal} />
        )}
      </div>
    </div>
  )
}

export default AdminAllResearchers

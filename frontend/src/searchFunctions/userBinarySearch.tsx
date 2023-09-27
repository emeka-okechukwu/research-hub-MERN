import { User } from '../types/user'

export const userBinarySearch = (users: User[], searchTerm: string): User[] => {
  if (searchTerm === '') {
    return users
  }

  const sortedUsers = users.sort((a, b) =>
    a.firstName.localeCompare(b.firstName)
  )

  let left = 0
  let right = sortedUsers.length - 1

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    const currentUser = sortedUsers[mid]

    if (
      currentUser.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currentUser.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      const matchingUsers = []

      for (let i = mid; i >= left; i--) {
        if (
          sortedUsers[i].firstName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          sortedUsers[i].lastName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        ) {
          matchingUsers.push(sortedUsers[i])
        } else {
          break
        }
      }

      for (let i = mid + 1; i <= right; i++) {
        if (
          sortedUsers[i].firstName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          sortedUsers[i].lastName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        ) {
          matchingUsers.push(sortedUsers[i])
        } else {
          break
        }
      }

      return matchingUsers
    } else if (currentUser.firstName.toLowerCase() < searchTerm.toLowerCase()) {
      left = mid + 1
    } else {
      right = mid - 1
    }
  }

  return []
}

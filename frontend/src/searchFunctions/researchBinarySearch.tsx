import { Research } from '../types/research'

export const researchBinarySearch = (
  researches: Research[],
  searchTerm: string
): Research[] => {
  if (searchTerm === '') {
    return researches
  }

  const sortedResearches = researches.sort((a, b) =>
    a.researchTopic.localeCompare(b.researchTopic)
  )

  let left = 0
  let right = sortedResearches.length - 1

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    const currentResearch = sortedResearches[mid]

    if (
      currentResearch.researchTopic
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    ) {
      const matchingResearches = []

      for (let i = mid; i >= left; i--) {
        if (
          sortedResearches[i].researchTopic
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        ) {
          matchingResearches.push(sortedResearches[i])
        } else {
          break
        }
      }

      for (let i = mid + 1; i <= right; i++) {
        if (
          sortedResearches[i].researchTopic
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        ) {
          matchingResearches.push(sortedResearches[i])
        } else {
          break
        }
      }

      return matchingResearches
    } else if (
      currentResearch.researchTopic.toLowerCase() < searchTerm.toLowerCase()
    ) {
      left = mid + 1
    } else {
      right = mid - 1
    }
  }

  return []
}

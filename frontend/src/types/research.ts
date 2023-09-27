export interface Research {
  _id: string
  researchTopic: string
  researchProblem: string
  researchHypothesis?: string
  dataCollectionMethod?: string
  dataFindings?: string
  researchAbstract?: string
  grantInformation?: string
  publication?: string
  published?: number
  submittedBy?: string
  lastModified?: Date
  userDetails?: {
    firstName: string
    lastName: string
    department: string
    email: string
  }
}

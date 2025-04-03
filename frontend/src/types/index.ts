export interface Campaign {
  _id?: string
  name: string
  description: string
  status: "ACTIVE" | "INACTIVE" | "DELETED"
  leads: string[]
  accountIDs: string[]
}

export interface LinkedInProfile {
  name: string
  job_title: string
  company: string
  location: string
  summary: string
}

export interface LinkedInResponse extends LinkedInProfile {
  message: string
}

export interface LinkedInUrlRequest {
  linkedin_url: string
}


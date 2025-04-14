export type Gender = 'male' | 'female'
export type TobaccoUse = 'yes' | 'no'
export type CoverageAmount = number
export type TermLength = number

export interface LifeQuoteFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  age: number
  gender: Gender
  coverageAmount: CoverageAmount
  termLength: TermLength
  tobaccoUse: TobaccoUse
  utmSource?: string
}

export interface QuoteStep {
  id: number
  title: string
  description: string
}

export interface EmailData {
  firstName: string
  email: string
  coverageAmount: string
  termLength: string
} 
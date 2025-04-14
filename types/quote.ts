export type Gender = 'male' | 'female'

export type TobaccoUse = 'yes' | 'no'

export type CoverageAmount = 150000 | 250000 | 500000 | 700000 | 1000000 | 2000000

export type TermLength = 10 | 20 | 30

export interface EmailData {
  firstName: string
  email: string
  coverageAmount: string
  termLength: string
}

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
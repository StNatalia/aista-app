// ============================================================
// AISTA CV Builder — Core Types
// ============================================================

// --- Profession Mapping (the core data asset) ---------------

export type Region = 'flanders' | 'brussels' | 'wallonia'
export type Language = 'nl' | 'fr' | 'en'
export type Track = 'survival' | 'professional'
export type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

export interface TrackMapping {
  nl_title: string           // Belgian job title in Dutch
  fr_title: string           // Belgian job title in French
  en_title: string           // International job title in English
  isco_code: string          // ISCO-08 occupation code
  ats_keywords_nl: string[]  // ATS keywords for Dutch CV
  ats_keywords_fr: string[]  // ATS keywords for French CV
  vdab_categories: string[]  // VDAB job categories to search
  salary_range_be: string    // Typical salary range in Belgium
}

export interface ExperienceTransform {
  uk_pattern: string         // Typical Ukrainian experience description
  nl_output: string          // Belgian-style rewrite in Dutch
  fr_output: string          // Belgian-style rewrite in French
}

export interface ProfessionMapping {
  id: string                          // e.g. "accountant"
  uk_title: string                    // e.g. "Бухгалтер"
  uk_title_variants: string[]         // e.g. ["головний бухгалтер", "старший бухгалтер"]
  survival_track: TrackMapping
  professional_track: TrackMapping
  experience_transforms: ExperienceTransform[]
  recognition_info: {
    required: boolean
    body_nl: string          // Recognition authority in Flanders
    body_fr: string          // Recognition authority in Wallonia
    duration_months: string  // Typical duration
    notes: string
  }
}

// --- User Form Data -----------------------------------------

export interface FormData {
  // Step 1: Identity & Goal
  track: Track
  region: Region
  output_language: Language

  // Step 2: Profession
  profession_id: string           // matches ProfessionMapping.id
  uk_job_title: string            // their exact title in Ukrainian
  current_be_job: string          // what they do now in Belgium (if any)

  // Step 3: Experience
  experience_years: number
  experience_description: string  // free text in Ukrainian
  key_achievements: string        // free text: what they're proud of

  // Step 4: Education
  education_level: string         // bachelor, master, specialist, etc.
  education_field: string         // field of study
  institution: string
  graduation_year: string
  diploma_recognized: boolean

  // Step 5: Languages
  dutch_level: LanguageLevel | ''
  french_level: LanguageLevel | ''
  english_level: LanguageLevel | ''
  other_languages: string

  // Step 6: Target
  target_job_title: string        // what they want to become
  target_vacancy_text: string     // optional: paste the vacancy text

  // Step 7: Contact & Payment
  full_name: string
  email: string
}

// --- Generated Output ---------------------------------------

export interface GeneratedCV {
  // Header
  candidate_name: string
  target_title: string            // Belgian job title
  location: string
  email: string

  // Profile summary (2-3 sentences in Belgian style)
  profile_summary: string

  // Experience (rewritten in Belgian result-oriented style)
  experience: ExperienceEntry[]

  // Education
  education: EducationEntry[]

  // Skills
  technical_skills: string[]
  soft_skills: string[]
  languages: LanguageEntry[]

  // ATS keywords (embedded naturally)
  ats_keywords_used: string[]
}

export interface ExperienceEntry {
  job_title_be: string            // Belgian-style job title
  employer: string
  period: string
  location: string
  bullets: string[]               // Result-oriented bullets in target language
}

export interface EducationEntry {
  degree_be: string               // How to present the degree in Belgian context
  institution: string
  field: string
  year: string
  recognition_note?: string       // e.g. "Erkenning aangevraagd bij NARIC"
}

export interface LanguageEntry {
  language: string
  level: string                   // CEFR level
  cefr: LanguageLevel
}

export interface GeneratedMotivationLetter {
  opening: string
  why_this_role: string
  what_i_bring: string
  closing: string
}

export interface GeneratedProfessionList {
  items: ProfessionSuggestion[]
}

export interface ProfessionSuggestion {
  nl_title: string
  fr_title: string
  vdab_url: string
  match_reason: string            // Why this is a good match for the user
  level: 'survival' | 'professional' | 'stretch'
}

// --- API Payloads -------------------------------------------

export interface GenerateRequest {
  formData: FormData
  sessionId: string
}

export interface GenerateResponse {
  success: boolean
  cv: GeneratedCV
  motivationLetter: GeneratedMotivationLetter
  professionList: GeneratedProfessionList
  error?: string
}

// --- Stripe -------------------------------------------------

export interface CheckoutMetadata {
  sessionId: string
  email: string
  formDataEncoded: string         // JSON.stringify(FormData), stored in Stripe metadata
}

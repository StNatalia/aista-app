import { ProfessionMapping } from '@/types'
import accountant from '@/data/mappings/accountant.json'
import teacher from '@/data/mappings/teacher.json'
import officeManager from '@/data/mappings/office-manager.json'
import nurse from '@/data/mappings/nurse.json'

// All available profession mappings
const ALL_MAPPINGS: ProfessionMapping[] = [
  accountant as ProfessionMapping,
  teacher as ProfessionMapping,
  officeManager as ProfessionMapping,
  nurse as ProfessionMapping,
]

// For the form dropdown: list of available professions
export const PROFESSION_OPTIONS = ALL_MAPPINGS.map((m) => ({
  id: m.id,
  label: m.uk_title,
  variants: m.uk_title_variants,
}))

// Get a single mapping by id
export function getMappingById(id: string): ProfessionMapping | undefined {
  return ALL_MAPPINGS.find((m) => m.id === id)
}

// Get all mappings (for admin / future use)
export function getAllMappings(): ProfessionMapping[] {
  return ALL_MAPPINGS
}

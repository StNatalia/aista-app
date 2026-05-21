import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ShadingType,
  convertInchesToTwip,
} from 'docx'
import { GeneratedCV, GeneratedMotivationLetter } from '@/types'

// ============================================================
// Belgian CV color palette
// ============================================================
const COLORS = {
  primary: '1B4F8A',    // Dark blue — professional
  accent: '2E86AB',     // Medium blue — section headers
  light: 'F0F4F8',      // Light grey — background blocks
  text: '2D2D2D',       // Near-black for body text
  muted: '6B7280',      // Grey for secondary info
}

// ============================================================
// MAIN EXPORT: Generate DOCX buffer from CV data
// ============================================================
export async function generateCVDocx(cv: GeneratedCV): Promise<Buffer> {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Calibri',
            size: 22, // 11pt
            color: COLORS.text,
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.6),
              bottom: convertInchesToTwip(0.6),
              left: convertInchesToTwip(0.8),
              right: convertInchesToTwip(0.8),
            },
          },
        },
        children: [
          // --- HEADER: Name + Title ---
          buildHeader(cv),

          // --- PROFILE SUMMARY ---
          buildSectionTitle('PROFIEL / PROFIL'),
          buildProfileSummary(cv.profile_summary),

          // --- WORK EXPERIENCE ---
          buildSectionTitle('WERKERVARING / EXPÉRIENCE'),
          ...cv.experience.flatMap(buildExperienceEntry),

          // --- EDUCATION ---
          buildSectionTitle('OPLEIDING / FORMATION'),
          ...cv.education.flatMap(buildEducationEntry),

          // --- SKILLS ---
          buildSectionTitle('COMPETENTIES / COMPÉTENCES'),
          buildSkillsBlock(cv.technical_skills, cv.soft_skills),

          // --- LANGUAGES ---
          buildSectionTitle('TALEN / LANGUES'),
          buildLanguagesBlock(cv.languages),
        ],
      },
    ],
  })

  return await Packer.toBuffer(doc)
}

// ============================================================
// SECTION BUILDERS
// ============================================================

function buildHeader(cv: GeneratedCV): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: cv.candidate_name,
        bold: true,
        size: 52, // 26pt
        color: COLORS.primary,
        font: 'Calibri',
      }),
      new TextRun({
        text: `\n${cv.target_title}`,
        size: 28, // 14pt
        color: COLORS.accent,
        font: 'Calibri',
      }),
      new TextRun({
        text: `\n${cv.location}  ·  ${cv.email}`,
        size: 20, // 10pt
        color: COLORS.muted,
        font: 'Calibri',
      }),
    ],
    spacing: { after: 300 },
    border: {
      bottom: {
        color: COLORS.accent,
        style: BorderStyle.SINGLE,
        size: 6,
        space: 4,
      },
    },
  })
}

function buildSectionTitle(title: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: title,
        bold: true,
        size: 22, // 11pt
        color: COLORS.accent,
        allCaps: true,
        font: 'Calibri',
      }),
    ],
    spacing: { before: 300, after: 100 },
    border: {
      bottom: {
        color: COLORS.light,
        style: BorderStyle.SINGLE,
        size: 4,
        space: 2,
      },
    },
  })
}

function buildProfileSummary(summary: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: summary,
        size: 22,
        color: COLORS.text,
      }),
    ],
    spacing: { after: 200 },
  })
}

function buildExperienceEntry(exp: GeneratedCV['experience'][0]): Paragraph[] {
  const paragraphs: Paragraph[] = []

  // Job title + employer + period on one line
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: exp.job_title_be,
          bold: true,
          size: 24, // 12pt
          color: COLORS.primary,
        }),
        new TextRun({
          text: `  ·  ${exp.employer}`,
          size: 22,
          color: COLORS.muted,
        }),
        new TextRun({
          text: `  |  ${exp.period}  ·  ${exp.location}`,
          size: 20,
          color: COLORS.muted,
          italics: true,
        }),
      ],
      spacing: { before: 180, after: 60 },
    })
  )

  // Bullet points
  exp.bullets.forEach((bullet) => {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `• ${bullet}`,
            size: 22,
            color: COLORS.text,
          }),
        ],
        spacing: { after: 40 },
        indent: { left: 200 },
      })
    )
  })

  return paragraphs
}

function buildEducationEntry(edu: GeneratedCV['education'][0]): Paragraph[] {
  const paragraphs: Paragraph[] = []

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `${edu.degree_be} — ${edu.field}`,
          bold: true,
          size: 22,
          color: COLORS.primary,
        }),
        new TextRun({
          text: `  |  ${edu.institution}, ${edu.year}`,
          size: 20,
          color: COLORS.muted,
          italics: true,
        }),
      ],
      spacing: { before: 120, after: 40 },
    })
  )

  if (edu.recognition_note) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `ℹ ${edu.recognition_note}`,
            size: 18, // 9pt — smaller note
            color: COLORS.muted,
            italics: true,
          }),
        ],
        indent: { left: 200 },
        spacing: { after: 60 },
      })
    )
  }

  return paragraphs
}

function buildSkillsBlock(technical: string[], soft: string[]): Paragraph {
  const allSkills = [
    ...technical.map((s) => `● ${s}`),
    ...soft.map((s) => `○ ${s}`),
  ].join('   ')

  return new Paragraph({
    children: [
      new TextRun({
        text: allSkills,
        size: 22,
        color: COLORS.text,
      }),
    ],
    spacing: { after: 200 },
  })
}

function buildLanguagesBlock(languages: GeneratedCV['languages']): Paragraph {
  return new Paragraph({
    children: languages.flatMap((lang, idx) => [
      new TextRun({
        text: `${lang.language}: `,
        bold: true,
        size: 22,
      }),
      new TextRun({
        text: `${lang.level} (${lang.cefr})${idx < languages.length - 1 ? '   ' : ''}`,
        size: 22,
        color: COLORS.muted,
      }),
    ]),
    spacing: { after: 200 },
  })
}

// ============================================================
// MOTIVATION LETTER DOCX
// ============================================================
export async function generateMotivationLetterDocx(
  motivationLetter: GeneratedMotivationLetter,
  candidateName: string
): Promise<Buffer> {
  const bodySpacing = { spacing: { after: 240, line: 276 } }

  const doc = new Document({
    styles: {
      default: {
        document: { run: { font: 'Calibri', size: 22, color: COLORS.text } },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1.0),
              bottom: convertInchesToTwip(1.0),
              left: convertInchesToTwip(1.2),
              right: convertInchesToTwip(1.2),
            },
          },
        },
        children: [
          // Candidate name header
          new Paragraph({
            children: [
              new TextRun({ text: candidateName, bold: true, size: 28, color: COLORS.primary, font: 'Calibri' }),
            ],
            spacing: { after: 80 },
          }),
          // Divider
          new Paragraph({
            border: { bottom: { color: COLORS.accent, size: 6, style: BorderStyle.SINGLE } },
            spacing: { after: 320 },
            children: [],
          }),
          // 4 paragraphs of the letter
          new Paragraph({
            children: [new TextRun({ text: motivationLetter.opening, font: 'Calibri', size: 22 })],
            ...bodySpacing,
          }),
          new Paragraph({
            children: [new TextRun({ text: motivationLetter.why_this_role, font: 'Calibri', size: 22 })],
            ...bodySpacing,
          }),
          new Paragraph({
            children: [new TextRun({ text: motivationLetter.what_i_bring, font: 'Calibri', size: 22 })],
            ...bodySpacing,
          }),
          new Paragraph({
            children: [new TextRun({ text: motivationLetter.closing, font: 'Calibri', size: 22 })],
            spacing: { after: 560 },
          }),
          // Signature
          new Paragraph({
            children: [new TextRun({ text: candidateName, bold: true, font: 'Calibri', size: 22 })],
            spacing: { after: 0 },
          }),
        ],
      },
    ],
  })

  return Buffer.from(await Packer.toBuffer(doc))
}

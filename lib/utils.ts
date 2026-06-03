import { PDFParse } from 'pdf-parse'

export const formatDate = (value: string | number | Date | null | undefined) => {
  if (!value) return ''

  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export async function extractPdfText(buffer: Buffer): Promise<string> {
  let parser: PDFParse | undefined
  try {
    parser = new PDFParse({ data: buffer })
    const result = await parser.getText()
    return result.text
  } catch (error) {
    console.error('Error extracting PDF text:', error)
    return ''
  } finally {
    await parser?.destroy()
  }
}

export const extractJson = (text: string) => {
  const trimmed = text.trim()

  const fenceStripped = trimmed
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim()

  const firstBrace = fenceStripped.indexOf('{')
  const lastBrace = fenceStripped.lastIndexOf('}')
  if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
    return fenceStripped
  }
  return fenceStripped.slice(firstBrace, lastBrace + 1)
}
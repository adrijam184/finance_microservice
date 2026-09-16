import { jsPDF } from 'jspdf'

export function createIncomePdf(summary) {
  const document = new jsPDF()
  document.setFont('helvetica', 'bold')
  document.setFontSize(20)
  document.text('Income calculation', 20, 24)
  document.setFont('helvetica', 'normal')
  document.setFontSize(12)

  const rows = [
    ['Person A own income', summary.ownA],
    ['Person B own income', summary.ownB],
    ['Joint income', summary.joint],
    ['Total money in', summary.total],
    ['Person A share', `${summary.shares.personA.toFixed(1)}%`],
    ['Person B share', `${summary.shares.personB.toFixed(1)}%`],
  ]

  rows.forEach(([label, value], index) => {
    document.text(label, 20, 42 + index * 12)
    document.text(String(value), 125, 42 + index * 12)
  })

  return document
}

export function downloadIncomePdf(summary) {
  createIncomePdf(summary).save('income-calculation.pdf')
}

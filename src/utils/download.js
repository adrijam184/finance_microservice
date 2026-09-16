export function downloadFile(content, fileName, type = 'application/json') {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}

export function downloadIncomeJson(summary) {
  downloadFile(JSON.stringify(summary, null, 2), 'income-calculation.json')
}

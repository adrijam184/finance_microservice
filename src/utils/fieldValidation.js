export function validateIncomeFields(values) {
  const errors = {}

  for (const field of ['personA', 'personB', 'extraIn']) {
    const value = values[field]
    if (value === '' || value === null || value === undefined) {
      errors[field] = 'Enter an amount'
    } else if (!Number.isFinite(Number(value)) || Number(value) < 0) {
      errors[field] = 'Use a zero or positive amount'
    }
  }

  return errors
}

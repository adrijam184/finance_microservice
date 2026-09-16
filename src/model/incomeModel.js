const STORAGE_KEY = 'finance-income-calculations'

export function calculateOwnIncome(incomeLines) {
  return incomeLines.reduce((total, income) => total + Number(income || 0), 0)
}

export function calculateTotalIn(ownA, ownB, extraIn) {
  return Number(ownA || 0) + Number(ownB || 0) + Number(extraIn || 0)
}

export function calculateJointIncome(totalIn, ownA, ownB) {
  return Number(totalIn || 0) - Number(ownA || 0) - Number(ownB || 0)
}

export function calculateShares(ownA, ownB, peopleCount = 2) {
  const personA = Number(ownA || 0)
  const personB = Number(ownB || 0)
  const personalIncome = personA + personB

  if (peopleCount === 1) return { personA: 100, personB: 0 }
  if (personalIncome === 0) return { personA: 50, personB: 50 }

  return {
    personA: (personA / personalIncome) * 100,
    personB: (personB / personalIncome) * 100,
  }
}

export function calculateIncomeSummary({ personA, personB, extraIn, peopleCount = 2 }) {
  const ownA = calculateOwnIncome([personA])
  const ownB = calculateOwnIncome([personB])
  const totalIncome = calculateTotalIn(ownA, ownB, extraIn)
  const jointIncome = calculateJointIncome(totalIncome, ownA, ownB)

  return {
    inputs: { personA: ownA, personB: ownB, extraIn: Number(extraIn || 0), totalIn: totalIncome, peopleCount },
    ownA,
    ownB,
    joint: jointIncome,
    totalIn: totalIncome,
    total: totalIncome,
    shares: calculateShares(ownA, ownB, peopleCount),
    calculatedAt: new Date().toISOString(),
  }
}

export function saveIncomeCalculation(summary) {
  const previous = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...previous, summary]))
}

export function loadIncomeCalculations() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
}

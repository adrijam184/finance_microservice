import { calculateIncomeSummary, loadIncomeCalculations, saveIncomeCalculation } from '../model/incomeModel.js'
import { validateIncomeFields } from '../utils/fieldValidation.js'

const initialState = {
  values: { personA: '', personB: '', extraIn: '' },
  errors: {},
  summary: null,
  savedCount: 0,
}

class IncomeViewModel {
  #state = initialState
  #listeners = new Set()

  constructor() {
    this.#state = { ...initialState, savedCount: loadIncomeCalculations().length }
  }

  getSnapshot = () => this.#state

  subscribe = (listener) => {
    this.#listeners.add(listener)
    return () => this.#listeners.delete(listener)
  }

  #publish(nextState) {
    this.#state = nextState
    this.#listeners.forEach((listener) => listener())
  }

  changeField = (name, value) => {
    this.#publish({
      ...this.#state,
      values: { ...this.#state.values, [name]: value },
      errors: { ...this.#state.errors, [name]: undefined },
    })
  }

  calculate = () => {
    const errors = validateIncomeFields(this.#state.values)
    if (Object.keys(errors).length > 0) {
      this.#publish({ ...this.#state, errors })
      return false
    }

    const summary = calculateIncomeSummary(this.#state.values)
    saveIncomeCalculation(summary)
    this.#publish({ ...this.#state, errors: {}, summary, savedCount: this.#state.savedCount + 1 })
    return true
  }
}

export const incomeViewModel = new IncomeViewModel()

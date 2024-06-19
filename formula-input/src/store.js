import { create } from 'zustand';

const useStore = create(set => ({
  tags: [],
  expenses: [
    { name: 'Hardware Expense', amount: 0 },
    { name: 'Dental & Vision Expense', amount: 680 },
    { name: 'Health Insurance Expense', amount: 3500 },
    { name: 'Advertising Budget', amount: 11652.39 },
  ],
  result: undefined,
  addTag: tag => set(state => ({ tags: [...state.tags, tag] })),
  removeTag: index => set(state => ({ tags: state.tags.filter((_, i) => i !== index) })),
  updateTag: (index, newTag) => set(state => ({
    tags: state.tags.map((tag, i) => i === index ? newTag : tag),
  })),
  calculateExpression: () => {
    const variableValues = {
      'Payment Processing Fees': 100,
      'Payroll Bonus G&A': 200,
      'SUM': 300,
      'Payroll Bonus S&M': 400
    };
    
    return set(state => {
      const expression = state.tags.map(tag => tag.id).join('');
      const evaluatedExpression = expression.replace(/\b([a-zA-Z\s&]+)\b/g, match => variableValues[match] || 0);
      let result;
      try {
        result = eval(evaluatedExpression);  // Note: Using eval has security implications; use a safe alternative if possible.
      } catch (error) {
        result = 'Error in expression';
      }
      return { result };
    });
  },
}));

export default useStore;
import { query } from 'express-validator'

export const overviewQueryValidator = [
  query('period')
    .optional()
    .isIn(['week', 'month', 'year'])
    .withMessage('period phải là một trong các giá trị: week, month, year'),
]

export const heatmapQueryValidator = [
  query('period')
    .optional()
    .isIn(['week', 'month', 'year'])
    .withMessage('period phải là một trong các giá trị: week, month, year'),
]

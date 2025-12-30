import { query } from 'express-validator'

export const overviewQueryValidator = [
  query('period')
    .optional({ nullable: true })
    .isIn(['week', 'month', 'year'])
    .withMessage('period phải là một trong các giá trị: week, month, year'),
]

export const heatmapQueryValidator = [
  query('period')
    .optional({ nullable: true })
    .isIn(['week', 'month', 'year'])
    .withMessage('period phải là một trong các giá trị: week, month, year'),
]

import { body, param } from 'express-validator'

export const registerValidator = [
  body('email')
    .notEmpty()
    .withMessage('Email là bắt buộc')
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password là bắt buộc')
    .isLength({ min: 6 })
    .withMessage('Password phải có ít nhất 6 ký tự'),
  body('name')
    .notEmpty()
    .withMessage('Tên là bắt buộc')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Tên phải có từ 2-50 ký tự'),
]

export const loginValidator = [
  body('email')
    .notEmpty()
    .withMessage('Email là bắt buộc')
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),
  body('password').notEmpty().withMessage('Password là bắt buộc'),
]

// export const changePasswordValidator = [
//   body('oldPassword').notEmpty().withMessage('Mật khẩu cũ là bắt buộc'),
//   body('newPassword')
//     .notEmpty()
//     .withMessage('Mật khẩu mới là bắt buộc')
//     .isLength({ min: 6 })
//     .withMessage('Mật khẩu mới phải có ít nhất 6 ký tự'),
// ]

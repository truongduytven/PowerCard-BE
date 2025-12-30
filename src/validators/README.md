# Validators

Folder này chứa các validators để kiểm tra dữ liệu đầu vào của API trước khi đến service layer.

## Cấu trúc

```
validators/
├── index.ts                    # Helper function validate()
├── authValidator.ts            # Validators cho authentication
├── flashcardValidator.ts       # Validators cho flashcard APIs
├── studysetValidator.ts        # Validators cho study set APIs
├── foldersetValidator.ts       # Validators cho folder set APIs
├── topicValidator.ts           # Validators cho topic APIs
├── studyValidator.ts           # Validators cho study/learning APIs
└── overviewValidator.ts        # Validators cho overview/analytics APIs
```

## Cách sử dụng

### 1. Import validator và helper function

```typescript
import { validate } from '../validators'
import { loginValidator, registerValidator } from '../validators/authValidator'
```

### 2. Áp dụng vào route

```typescript
router.post('/signin', validate(loginValidator), authController.login)
router.post('/signup', validate(registerValidator), authController.register)
```

### 3. Response khi validation fail

Khi validation thất bại, API sẽ tự động trả về response dạng:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email là bắt buộc"
    },
    {
      "field": "password",
      "message": "Password phải có ít nhất 6 ký tự"
    }
  ]
}
```

## Các loại validation

### Body validation
Kiểm tra dữ liệu trong request body:
```typescript
body('email')
  .notEmpty()
  .withMessage('Email là bắt buộc')
  .isEmail()
  .withMessage('Email không hợp lệ')
```

### Param validation
Kiểm tra URL parameters:
```typescript
param('id')
  .notEmpty()
  .withMessage('ID là bắt buộc')
  .isUUID()
  .withMessage('ID phải là UUID hợp lệ')
```

### Query validation
Kiểm tra query string:
```typescript
query('page')
  .optional()
  .isInt({ min: 1 })
  .withMessage('page phải là số nguyên dương')
```

## Ví dụ validators có sẵn

### Auth Validators
- `registerValidator`: email, password (min 6 chars), name (2-50 chars)
- `loginValidator`: email, password
- `changePasswordValidator`: oldPassword, newPassword (min 6 chars)

### Flashcard Validators
- `markFlashcardValidator`: flashcardId (UUID), isMarked (boolean)
- `flashcardIdParamValidator`: flashcardId param (UUID)

### Study Set Validators
- `createStudySetValidator`: title, description, flashcards array
- `updateStudySetValidator`: id param, optional fields
- `getStudySetsQueryValidator`: page, limit, search, filters
- `studySetIdParamValidator`: id param (UUID)

### Folder Set Validators
- `createFolderSetValidator`: title, description, studySetIds array
- `updateFolderSetValidator`: id param, optional fields
- `addStudySetToFolderValidator`: id param, studySetId

### Topic Validators
- `createTopicValidator`: name (1-100 chars), description
- `updateTopicValidator`: id param, optional fields
- `topicIdParamValidator`: id param (UUID)

### Study/Learning Validators
- `startLearningValidator`: studySetId param (UUID)
- `submitAnswerValidator`: flashcardId, difficultyId, userLearnId (UUIDs)
- `updateDifficultyValidator`: difficulties array with id and minutes

### Overview Validators
- `overviewQueryValidator`: period (week/month/year)
- `heatmapQueryValidator`: period (week/month/year)

## Tạo validator mới

Để tạo validator mới, tạo file trong folder `validators/`:

```typescript
import { body, param, query } from 'express-validator'

export const myValidator = [
  body('fieldName')
    .notEmpty()
    .withMessage('Field là bắt buộc')
    .isString()
    .withMessage('Field phải là string')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Field phải có từ 1-100 ký tự'),
]
```

## Các validation rules thường dùng

### String validation
- `.notEmpty()` - Không được rỗng
- `.trim()` - Loại bỏ khoảng trắng đầu cuối
- `.isLength({ min: x, max: y })` - Độ dài
- `.isEmail()` - Email hợp lệ
- `.isURL()` - URL hợp lệ

### Number validation
- `.isInt()` - Số nguyên
- `.isFloat()` - Số thực
- `.isInt({ min: x, max: y })` - Số trong khoảng

### Boolean validation
- `.isBoolean()` - Boolean (true/false)

### UUID validation
- `.isUUID()` - UUID hợp lệ

### Array validation
- `.isArray()` - Phải là mảng
- `.isArray({ min: x, max: y })` - Mảng có độ dài

### Date validation
- `.isISO8601()` - Date ISO format
- `.isDate()` - Date hợp lệ

### Custom validation
```typescript
.custom((value) => {
  if (value !== 'expected') {
    throw new Error('Custom error message')
  }
  return true
})
```

## Lợi ích

✅ **Validate sớm**: Lỗi được phát hiện ngay tại route handler, không cần đến service
✅ **Clean code**: Service layer không cần validate input nữa
✅ **Consistent error format**: Tất cả validation errors có format giống nhau
✅ **Type safety**: Đảm bảo dữ liệu đúng type trước khi xử lý
✅ **Reusable**: Validators có thể tái sử dụng cho nhiều routes
✅ **Easy to maintain**: Tập trung validation logic ở một nơi

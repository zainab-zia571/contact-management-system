// ── USERNAME ──────────────────────────────────────────────
export const validateUsername = (value) => {
  if (!value || !value.trim())
    return 'Username is required'
  if (value.trim().length < 3)
    return 'Username must be at least 3 characters'
  if (value.trim().length > 30)
    return 'Username cannot exceed 30 characters'
  if (!/^[a-zA-Z0-9_]+$/.test(value.trim()))
    return 'Username can only contain letters, numbers and underscores'
  if (!/[a-zA-Z]/.test(value.trim()))
    return 'Username must contain at least one letter'
  if (/^\d+$/.test(value.trim()))
    return 'Username cannot be all numbers'
  return ''
}

// ── EMAIL ─────────────────────────────────────────────────
export const validateEmail = (value) => {
  if (!value || !value.trim())
    return 'Email is required'
  // \- inside [] is unnecessary — use - at end of character class
const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!regex.test(value.trim()))
    return 'Please enter a valid email address (e.g. john@gmail.com)'
  const domain = value.split('@')[1]
  // optional chain instead of domain && domain.includes
  if (!domain?.includes('.'))
    return 'Email domain is not valid'
  const tld = domain.split('.').pop()
  if (!tld || tld.length < 2)
    return 'Email domain extension is not valid'
  return ''
}

// ── PHONE ─────────────────────────────────────────────────
export const validatePhone = (value) => {
  if (!value || !value.trim())
    return 'Phone number is required'
  const stripped = value.trim().replaceAll(' ', '')
  if (/[a-zA-Z]/.test(stripped))
    return 'Phone number cannot contain letters'
  if (!/^\+?[0-9]{7,15}$/.test(stripped))
    return 'Phone must be 7-15 digits, only numbers and optional + allowed'
  return ''
}

// ── PASSWORD ──────────────────────────────────────────────
export const validatePassword = (value) => {
  if (!value)
    return 'Password is required'
  if (value.length < 6)
    return 'Password must be at least 6 characters'
  if (!/[a-zA-Z]/.test(value))
    return 'Password must contain at least one letter'
  if (!/[0-9]/.test(value))
    return 'Password must contain at least one number'
  return ''
}

// ── NAME ──────────────────────────────────────────────────
export const validateName = (value, fieldName = 'Name') => {
  if (!value || !value.trim())
    return `${fieldName} is required`
  if (value.trim().length < 2)
    return `${fieldName} must be at least 2 characters`
  if (/[0-9]/.test(value))
    return `${fieldName} cannot contain numbers`
  if (!/^[a-zA-Z\s'-]+$/.test(value))
    return `${fieldName} can only contain letters, spaces and hyphens`
  return ''
}

// ── CONTACT EMAIL ─────────────────────────────────────────
export const validateContactEmail = (value) => {
  if (!value || !value.trim())
    return 'Email address is required'
  return validateEmail(value)
}

// ── CONTACT PHONE ─────────────────────────────────────────
export const validateContactPhone = (value) => {
  if (!value || !value.trim())
    return 'Phone number is required'
  return validatePhone(value)
}
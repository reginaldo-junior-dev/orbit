export const PASSWORD_RULE_TEXT =
  'Password must have at least 8 characters with upper and lower case letters and a number'

export function isValidPassword(value) {
  return (
    value.length >= 8 && /[a-z]/.test(value) && /[A-Z]/.test(value) && /\d/.test(value)
  )
}

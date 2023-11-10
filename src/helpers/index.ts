export const isValidPhone = (phone: string) => {
  const regex = /^([+]?[7|8] [\s-(]?[9][0-9]{2}[\s-)]?) ?([\d]{3})[\s-]?([\d]{2})[\s-]?([\d]{2})$/
  return regex.test(phone)
}
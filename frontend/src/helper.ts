import { Api } from '@/api/api'
import dayjs from 'dayjs'

/**
 * The list of of the statuses used in the system.
 */
export const statuses = ['Pending Review', 'In Review', 'Additional Information Required', 'Awaiting Approval', 'Purchased', 'Denied']
export type Status = typeof statuses[number]

/**
 * The list of of the book types used in the system.
 */
export const bookTypes = ['Book', 'Audiobook']
export type BookType = typeof bookTypes[number]

/**
 * Creates an instance of the api to be used throughout the front end.
 */
export const api = new Api({
  withCredentials: true
})

/**
 * Gets the payload from the JWT Token.
 * @param token - The JWT Token.
 */
export function getPayload (token : string) {
  return JSON.parse(atob(token.split('.')[1]))
}

/**
 * Formats a date.
 * @param date - The date string.
 */
export function formatDate (date : string) {
  return dayjs(date).format('ddd D MMM YYYY @ H:mm')
}

/**
 * Formats a price to GBP.
 * @param price - The price to be formatted.
 */
export function formatPrice (price : string) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'GBP' }).format(Number.parseInt(price))
}

/**
 * Generates a random ID
 */
export function generateId () {
  const idPart = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
  }
  return `${idPart()}${idPart()}-${idPart()}-${idPart()}-${idPart()}-${idPart()}${idPart()}${idPart()}`
}

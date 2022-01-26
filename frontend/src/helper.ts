import { Api } from '@/api/api'
import dayjs from 'dayjs'

export const statuses = ['Pending Review', 'In Review', 'Additional Information Required', 'Awaiting Approval', 'Purchased', 'Denied']
export type Status = typeof statuses[number]

export const bookTypes = ['Book', 'Audiobook']
export type BookType = typeof bookTypes[number]

export const api = new Api({
  withCredentials: true
})

export function getPayload (token : string) {
  return JSON.parse(atob(token.split('.')[1]))
}

export function formatDate (date : string) {
  return dayjs(date).format('ddd D MMM YYYY @ H:mm')
}

export function formatPrice (price : string) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'GBP' }).format(Number.parseInt(price))
}

import { Api } from '@/api/api'
import dayjs from 'dayjs'

export const api = new Api({
  withCredentials: true
})

export function getPayload (token : string) {
  return JSON.parse(atob(token.split('.')[1]))
}

export function formatDate (date : string) {
  return dayjs(date).format('ddd D MMM YYYY @ H:mm')
}

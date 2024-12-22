import { getUser } from '@/services/apiAuth'

export async function isAuthenticated() {
  const user = await getUser()

  if (user) {
    return true
  }

  return false
}

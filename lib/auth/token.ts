const KEY = 'kino:token'
let token: string | null = null 

export const getToken = () => token

export function loadToken() {
  try {
    token = localStorage.getItem(KEY)
  } catch {
    token = null
  }
  return token
}

export function saveToken(next: string | null) {
  token = next 
  try {
    if (next) localStorage.setItem(KEY, next)
    else localStorage.removeItem(KEY)
  } catch {
    // storage blocked: the session just won't survive a reload
  }
}
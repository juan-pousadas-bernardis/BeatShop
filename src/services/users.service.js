// src/services/users.service.js
// Servicio para manejar todas las operaciones de usuarios contra MockAPI

export const INITIAL_USERS = [
  {
    id: "1",
    name: "Juan Manuel",
    email: "juanmanuelpb2005@gmail.com",
    password: "admin123",
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
    birthDate: "2005-01-01",
    province: "buenos-aires",
    createdAt: "2026-03-10T10:00:00.000Z"
  },
  {
    id: "2",
    name: "Martín Benítez",
    email: "martin@trapmusic.ar",
    password: "password123",
    image: "/assets/images/user2.png",
    birthDate: "1998-08-22",
    province: "caba",
    createdAt: "2026-03-12T14:20:00.000Z"
  },
  {
    id: "3",
    name: "Lucía Fernández",
    email: "lucia.rnb@gmail.com",
    password: "password123",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    birthDate: "2001-11-04",
    province: "cordoba",
    createdAt: "2026-03-18T16:45:00.000Z"
  }
]

const LOCAL_STORAGE_KEY = 'beatshop_users_cache'

export const getFallbackUsers = () => {
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (cached) {
    try {
      const parsed = JSON.parse(cached)
      const hasAdmin = parsed.some(
        (u) => u.email && u.email.toLowerCase() === 'juanmanuelpb2005@gmail.com'
      )
      if (!hasAdmin) {
        parsed.unshift(INITIAL_USERS[0])
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed))
      }
      return parsed
    } catch (e) {
      console.error('Error parsing cached users', e)
    }
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_USERS))
  return INITIAL_USERS
}

export const saveFallbackUsers = (users) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(users))
}

const getBaseUrl = () => {
  return (import.meta.env.VITE_MOCKAPI_URL || '').replace(/\/+$/, '')
}

export const isMockApiConfigured = () => {
  const url = getBaseUrl()
  return Boolean(url && !url.includes('tu-proyecto') && url.startsWith('http'))
}

// 1. Obtener todos los usuarios (GET /users)
export const getUsers = async () => {
  const baseUrl = getBaseUrl()

  if (isMockApiConfigured()) {
    try {
      const res = await fetch(`${baseUrl}/users`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        // Garantizar que la foto esté accesible como image y avatar
        const mapped = data.map((u) => ({
          ...u,
          image: u.image || u.avatar || '/assets/images/user2.png',
          avatar: u.image || u.avatar || '/assets/images/user2.png'
        }))
        saveFallbackUsers(mapped)
        return mapped
      }
      return getFallbackUsers()
    } catch (error) {
      console.warn('MockAPI users GET failed, using fallback:', error.message)
      return getFallbackUsers()
    }
  }

  return getFallbackUsers()
}

// 2. Obtener un usuario por ID (GET /users/:id)
export const getUserById = async (id) => {
  const baseUrl = getBaseUrl()

  if (isMockApiConfigured()) {
    try {
      const res = await fetch(`${baseUrl}/users/${id}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const u = await res.json()
      return {
        ...u,
        image: u.image || u.avatar || '/assets/images/user2.png',
        avatar: u.image || u.avatar || '/assets/images/user2.png'
      }
    } catch (error) {
      console.warn('MockAPI user GET failed, searching fallback:', error.message)
    }
  }

  const users = getFallbackUsers()
  const found = users.find((u) => String(u.id) === String(id))
  if (!found) throw new Error('Usuario no encontrado')
  return found
}

// 3. Crear un usuario (POST /users)
export const createUser = async (userData) => {
  const baseUrl = getBaseUrl()
  const imageVal = userData.image || userData.avatar || '/assets/images/user2.png'

  const payload = {
    name: userData.fullname || userData.name || '',
    email: (userData.email || '').trim(),
    password: (userData.password || '').trim(),
    birthDate: userData.birthdate || userData.birthDate || '',
    province: userData.province || '',
    image: imageVal,
    createdAt: userData.createdAt || new Date().toISOString()
  }

  if (isMockApiConfigured()) {
    try {
      const res = await fetch(`${baseUrl}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`Error en MockAPI: HTTP ${res.status} - ${errorText}`)
      }
      const created = await res.json()
      const normalizedCreated = {
        ...created,
        image: created.image || payload.image,
        avatar: created.image || payload.image
      }
      const current = getFallbackUsers()
      saveFallbackUsers([normalizedCreated, ...current])
      return normalizedCreated
    } catch (error) {
      console.error('Error al enviar POST a MockAPI:', error)
      // Guardar también en fallback para que no se pierda la experiencia
      const current = getFallbackUsers()
      const fallbackNew = { ...payload, id: String(Date.now()), avatar: imageVal }
      saveFallbackUsers([fallbackNew, ...current])
      throw error
    }
  }

  const current = getFallbackUsers()
  const newUser = {
    ...payload,
    id: String(Date.now()),
    avatar: imageVal
  }
  saveFallbackUsers([newUser, ...current])
  return newUser
}

// 4. Actualizar usuario (PUT /users/:id)
export const updateUser = async (id, userData) => {
  const baseUrl = getBaseUrl()
  const imageVal = userData.image || userData.avatar || ''

  const payload = {
    name: userData.fullname || userData.name,
    email: (userData.email || '').trim(),
    password: userData.password ? String(userData.password).trim() : undefined,
    birthDate: userData.birthdate || userData.birthDate,
    province: userData.province,
    ...(imageVal ? { image: imageVal } : {})
  }

  // Eliminar campos undefined
  Object.keys(payload).forEach((key) => payload[key] === undefined && delete payload[key])

  if (isMockApiConfigured()) {
    try {
      const res = await fetch(`${baseUrl}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        const errText = await res.text()
        throw new Error(`HTTP ${res.status}: ${errText}`)
      }
      const updated = await res.json()
      const normalizedUpdated = {
        ...updated,
        image: updated.image || payload.image,
        avatar: updated.image || payload.image
      }
      const current = getFallbackUsers()
      saveFallbackUsers(current.map((u) => (String(u.id) === String(id) ? normalizedUpdated : u)))
      return normalizedUpdated
    } catch (error) {
      console.error('MockAPI user PUT error:', error)
      const current = getFallbackUsers()
      const updated = { ...payload, id: String(id), avatar: imageVal }
      saveFallbackUsers(current.map((u) => (String(u.id) === String(id) ? { ...u, ...updated } : u)))
      throw error
    }
  }

  const current = getFallbackUsers()
  const updated = { ...payload, id: String(id), avatar: imageVal }
  saveFallbackUsers(current.map((u) => (String(u.id) === String(id) ? { ...u, ...updated } : u)))
  return updated
}

// 5. Eliminar usuario (DELETE /users/:id)
export const deleteUser = async (id) => {
  const baseUrl = getBaseUrl()

  if (isMockApiConfigured()) {
    try {
      const res = await fetch(`${baseUrl}/users/${id}`, {
        method: 'DELETE'
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const current = getFallbackUsers()
      saveFallbackUsers(current.filter((u) => String(u.id) !== String(id)))
      return data
    } catch (error) {
      console.warn('MockAPI user DELETE failed, removing from fallback:', error.message)
    }
  }

  const current = getFallbackUsers()
  saveFallbackUsers(current.filter((u) => String(u.id) !== String(id)))
  return { success: true, id }
}

// Sembrar usuarios iniciales en MockAPI
export const seedMockApiUsers = async () => {
  const baseUrl = getBaseUrl()
  if (!isMockApiConfigured()) {
    throw new Error('Debes configurar una URL válida de MockAPI en el archivo .env')
  }

  const results = []
  for (const item of INITIAL_USERS) {
    const { id, ...dataToPost } = item
    const res = await fetch(`${baseUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...dataToPost,
        createdAt: new Date().toISOString()
      })
    })
    if (res.ok) {
      results.push(await res.json())
    }
  }
  return results
}

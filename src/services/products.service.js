// src/services/products.service.js
// Servicio para manejar todas las operaciones de productos contra MockAPI

export const INITIAL_PRODUCTS = [
  {
    id: "1",
    name: "Boombap Classic",
    price: 85000,
    description: "Beat boombap con samples vintage de vinilo, kicks pesados y scratches analógicos auténticos. Ideal para raperos que buscan ese sonido clásico de la vieja escuela con un toque moderno.",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/outdoor_ambience.ogg",
    audrioUrl: "https://actions.google.com/sounds/v1/ambiences/outdoor_ambience.ogg",
    category: "Hip Hop",
    bpm: 92,
    createdAt: "2026-03-15T12:00:00.000Z"
  },
  {
    id: "2",
    name: "Trap Looper",
    price: 45000,
    description: "Beat trap con 808 profundos, hi-hats en tresillo y atmósfera oscura. Diseñado para rimas rápidas y coros energéticos con pegada de club.",
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/daytime_forest_bonfire.ogg",
    audrioUrl: "https://actions.google.com/sounds/v1/ambiences/daytime_forest_bonfire.ogg",
    category: "Hip Hop",
    bpm: 140,
    createdAt: "2026-03-15T14:30:00.000Z"
  },
  {
    id: "3",
    name: "Melodic Drill",
    price: 50000,
    description: "Beat drill con melodías emotivas de piano y cuerdas, 808 slides agresivos y patrones de percusión sincopados al estilo UK y New York.",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
    audioUrl: "",
    audrioUrl: "",
    category: "Trap",
    bpm: 142,
    createdAt: "2026-03-20T10:15:00.000Z"
  },
  {
    id: "4",
    name: "Dark R&B",
    price: 65000,
    description: "Beat R&B contemporáneo con pads atmosféricos envolventes, grooves lentos y líneas de bajo sub con texturas vocales procesadas.",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
    audioUrl: "",
    audrioUrl: "",
    category: "R&B",
    bpm: 85,
    createdAt: "2026-03-22T16:00:00.000Z"
  },
  {
    id: "5",
    name: "Jazz Fusion",
    price: 55000,
    description: "Beat jazz fusión con piano acústico grabado en estudio, batería con escobillas y swing refinado, sumado a un contrabajo walking muy cálido.",
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=80",
    audioUrl: "",
    audrioUrl: "",
    category: "Jazz",
    bpm: 95,
    createdAt: "2026-03-25T11:45:00.000Z"
  },
  {
    id: "6",
    name: "House Vibe",
    price: 40000,
    description: "Beat house enérgico con groove four-on-the-floor, sintetizadores analógicos brillantes y drops listos para encender cualquier pista.",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
    audioUrl: "",
    audrioUrl: "",
    category: "House",
    bpm: 124,
    createdAt: "2026-03-28T09:30:00.000Z"
  },
  {
    id: "7",
    name: "Ambient Dreams",
    price: 70000,
    description: "Beat ambient con texturas etéreas, pads evolutivos y ritmos minimalistas. Perfecto para proyectos conceptuales, intros y bandas sonoras.",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80",
    audioUrl: "",
    audrioUrl: "",
    category: "Electronic",
    bpm: 110,
    createdAt: "2026-04-01T15:20:00.000Z"
  },
  {
    id: "8",
    name: "Latin Flow",
    price: 60000,
    description: "Beat latino con percusión caribeña, dembow moderno, bajos redondos y acordes de guitarra acústica que contagian movimiento.",
    image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80",
    audioUrl: "",
    audrioUrl: "",
    category: "Latin",
    bpm: 98,
    createdAt: "2026-04-05T18:00:00.000Z"
  }
]

const LOCAL_STORAGE_KEY = 'beatshop_products_cache'

const getFallbackProducts = () => {
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (cached) {
    try {
      return JSON.parse(cached)
    } catch (e) {
      console.error('Error parsing cached products', e)
    }
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS))
  return INITIAL_PRODUCTS
}

const saveFallbackProducts = (products) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products))
}

const getBaseUrl = () => {
  return (import.meta.env.VITE_MOCKAPI_URL || '').replace(/\/+$/, '')
}

export const isMockApiConfigured = () => {
  const url = getBaseUrl()
  return Boolean(url && !url.includes('tu-proyecto') && url.startsWith('http'))
}

// 1. Obtener todos los productos (GET /products)
export const getProducts = async () => {
  const baseUrl = getBaseUrl()

  if (isMockApiConfigured()) {
    try {
      const res = await fetch(`${baseUrl}/products`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      // Normalizar audioUrl y audrioUrl
      const normalized = data.map((p) => ({
        ...p,
        audioUrl: p.audioUrl || p.audrioUrl || '',
        audrioUrl: p.audrioUrl || p.audioUrl || ''
      }))
      saveFallbackProducts(normalized)
      return normalized
    } catch (error) {
      console.warn('MockAPI request failed, using local fallback:', error.message)
      return getFallbackProducts()
    }
  }

  return getFallbackProducts()
}

// 2. Obtener un producto por ID (GET /products/:id)
export const getProductById = async (id) => {
  const baseUrl = getBaseUrl()

  if (isMockApiConfigured()) {
    try {
      const res = await fetch(`${baseUrl}/products/${id}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const p = await res.json()
      return {
        ...p,
        audioUrl: p.audioUrl || p.audrioUrl || '',
        audrioUrl: p.audrioUrl || p.audioUrl || ''
      }
    } catch (error) {
      console.warn('MockAPI request failed, searching in local fallback:', error.message)
    }
  }

  const products = getFallbackProducts()
  const found = products.find((p) => String(p.id) === String(id))
  if (!found) throw new Error('Producto no encontrado')
  return found
}

// 3. Crear un producto nuevo (POST /products)
export const createProduct = async (productData) => {
  const baseUrl = getBaseUrl()
  const audio = productData.audioUrl || productData.audrioUrl || ''
  const payload = {
    ...productData,
    price: Number(productData.price) || 0,
    audioUrl: audio,
    audrioUrl: audio,
    createdAt: productData.createdAt || new Date().toISOString()
  }

  if (isMockApiConfigured()) {
    try {
      const res = await fetch(`${baseUrl}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const created = await res.json()
      const current = getFallbackProducts()
      saveFallbackProducts([created, ...current])
      return created
    } catch (error) {
      console.warn('MockAPI POST failed, saving to local fallback:', error.message)
    }
  }

  const current = getFallbackProducts()
  const newProduct = {
    ...payload,
    id: String(Date.now())
  }
  saveFallbackProducts([newProduct, ...current])
  return newProduct
}

// 4. Actualizar un producto existente (PUT /products/:id)
export const updateProduct = async (id, productData) => {
  const baseUrl = getBaseUrl()
  const audio = productData.audioUrl || productData.audrioUrl || ''
  const payload = {
    ...productData,
    price: Number(productData.price) || 0,
    audioUrl: audio,
    audrioUrl: audio
  }

  if (isMockApiConfigured()) {
    try {
      const res = await fetch(`${baseUrl}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const updated = await res.json()
      const current = getFallbackProducts()
      saveFallbackProducts(current.map((p) => (String(p.id) === String(id) ? updated : p)))
      return updated
    } catch (error) {
      console.warn('MockAPI PUT failed, updating local fallback:', error.message)
    }
  }

  const current = getFallbackProducts()
  const updated = { ...payload, id: String(id) }
  saveFallbackProducts(current.map((p) => (String(p.id) === String(id) ? { ...p, ...updated } : p)))
  return updated
}

// 5. Eliminar un producto (DELETE /products/:id)
export const deleteProduct = async (id) => {
  const baseUrl = getBaseUrl()

  if (isMockApiConfigured()) {
    try {
      const res = await fetch(`${baseUrl}/products/${id}`, {
        method: 'DELETE'
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const current = getFallbackProducts()
      saveFallbackProducts(current.filter((p) => String(p.id) !== String(id)))
      return data
    } catch (error) {
      console.warn('MockAPI DELETE failed, removing from local fallback:', error.message)
    }
  }

  const current = getFallbackProducts()
  saveFallbackProducts(current.filter((p) => String(p.id) !== String(id)))
  return { success: true, id }
}

// Sembrar los 8 beats iniciales
export const seedMockApiProducts = async () => {
  const baseUrl = getBaseUrl()
  if (!isMockApiConfigured()) {
    throw new Error('Debes configurar una URL válida de MockAPI en el archivo .env')
  }

  const results = []
  for (const item of INITIAL_PRODUCTS) {
    const { id, ...dataToPost } = item
    const res = await fetch(`${baseUrl}/products`, {
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

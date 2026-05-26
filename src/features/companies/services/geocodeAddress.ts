const VWORLD_API_URL = '/vworld-proxy/req/address'

interface VWorldResponse {
  response: {
    status: string
    result?: {
      point?: {
        x: string
        y: string
      }
    }
  }
}

const round7 = (n: number) => Math.round(n * 1e7) / 1e7

async function fetchCoord(
  address: string,
  type: 'ROAD' | 'PARCEL',
  apiKey: string
): Promise<{ latitude: number; longitude: number } | null> {
  const params = new URLSearchParams({
    service: 'address',
    request: 'getCoord',
    type,
    address,
    key: apiKey,
    format: 'json',
    crs: 'EPSG:4326',
  })

  const res = await fetch(`${VWORLD_API_URL}?${params}`)
  if (!res.ok) return null

  const json: VWorldResponse = await res.json()
  const point = json.response?.result?.point
  if (!point) return null

  const longitude = parseFloat(point.x)
  const latitude = parseFloat(point.y)
  if (isNaN(latitude) || isNaN(longitude)) return null

  return { latitude: round7(latitude), longitude: round7(longitude) }
}

export async function geocodeAddress(
  address: string
): Promise<{ latitude: number; longitude: number } | null> {
  const apiKey = import.meta.env.VITE_VWORLD_API_KEY
  if (!apiKey || !address.trim()) return null

  try {
    const result = await fetchCoord(address, 'ROAD', apiKey)
    if (result) return result

    return await fetchCoord(address, 'PARCEL', apiKey)
  } catch {
    console.warn('지오코딩 실패:', address)
    return null
  }
}

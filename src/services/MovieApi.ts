import Api from 'services/BaseService'
// Interfaces
import { IGetListPayload, IDetailPayload } from '@/interfaces/IPayloads'
import { log } from 'console'

/**
 * Remove api_key from params if present
 */
const sanitizeParams = (params?: any) => {
  if (!params) return params
  const { api_key, ...rest } = params
  return rest
}

export const getTrending = async (type: string, payload: object) => {
  const response = await Api().get(`/trending/all/${type}`, { params: sanitizeParams(payload) })
  return response
}

export const getNewRelease = async (type: string, payload: IGetListPayload) => {
  const response = await Api().get(`/${type}/latest`, { params: sanitizeParams(payload) })
  return response
}

export const getPopular = async (type: string, payload: IGetListPayload) => {
  const response = await Api().get(`/${type}/popular`, { params: sanitizeParams(payload) })
  return response
}

export const getTopRated = async (type: string, payload: IGetListPayload) => {
  const response = await Api().get(`/${type}/top_rated`, { params: sanitizeParams(payload) })
  return response
}

export const getNowPlaying = async (payload: IGetListPayload) => {
  const response = await Api().get('/movie/now_playing', { params: sanitizeParams(payload) })
  return response
}

export const getUpcoming = async (payload: IGetListPayload) => {
  const response = await Api().get('/movie/upcoming', { params: sanitizeParams(payload) })
  return response
}

export const getAiringToday = async (payload: IGetListPayload) => {
  const response = await Api().get('/tv/airing_today', { params: sanitizeParams(payload) })
  return response
}

export const getOnTheAir = async (payload: IGetListPayload) => {
  const response = await Api().get('/tv/on_the_air', { params: sanitizeParams(payload) })
  return response
}

export const getDetail = async (type: string, id: string, payload: IDetailPayload) => {
  const response = await Api().get(`/${type}/${id}`, { params: sanitizeParams(payload) })
  return response
}

export const getCredits = async (type: string, id: string, payload: IDetailPayload) => {
  const response = await Api().get(`/${type}/${id}/credits`, { params: sanitizeParams(payload) })
  return response
}

export const getTrailers = async (type: string, id: string, payload: IDetailPayload) => {
  const response = await Api().get(`/${type}/${id}/videos`, { params: sanitizeParams(payload) })
  return response
}

export const getReviews = async (type: string, id: string, payload: IDetailPayload) => {
  const response = await Api().get(`/${type}/${id}/reviews`, { params: sanitizeParams(payload) })
  return response
}

export const getRecommendation = async (type: string, id: string, payload: IDetailPayload) => {
  const response = await Api().get(`/${type}/${id}/recommendations`, { params: sanitizeParams(payload) })
  return response
}

export const searchFilm = async (payload: object) => {
  const response = await Api().get(`search/movie`, { params: sanitizeParams(payload) })
  return response
}

export const searchTv = async (payload: object) => {
  const response = await Api().get(`search/tv`, { params: sanitizeParams(payload) })
  return response
}

export const getSeasonsAndEpisodes = async (tvId: number) => {
  try {
    const tvDetailsResponse = await Api().get(`/tv/${tvId}`)

    const seasons = tvDetailsResponse.data.seasons || []

    const seasonDetails = await Promise.all(
      seasons.map(async (season: any) => {
        const seasonResponse = await Api().get(
          `/tv/${tvId}/season/${season.season_number}`
        )

        return {
          season_number: season.season_number,
          episodes: seasonResponse.data.episodes || [],
        }
      })
    )

    return {
      title: tvDetailsResponse.data.name,
      seasons: seasonDetails,
    }
  } catch (error) {
    console.error('Error fetching seasons and episodes:', error)
    throw error
  }
}

// Helper method to construct the URL for TV
const constructTvUrl = (vidsrc: string): string => {
  const urlParts = vidsrc.split('/')
  const id = urlParts[urlParts.length - 3]
  const season = urlParts[urlParts.length - 2]
  const episode = urlParts[urlParts.length - 1]

  if (!id || !season || !episode) {
    throw new Error(
      'Invalid `vidsrc` URL structure for TV. Unable to extract ID, season, or episode.'
    )
  }

  return `https://vidsrcme.vidsrc.icu/embed/tv?tmdb=${id}&season=${season}&episode=${episode}&autoplay=1`
}

// Helper method to construct the URL for Movie
const constructMovieUrl = (vidsrc: string): string => {
  const urlParts = vidsrc.split('/')
  const id = urlParts[urlParts.length - 1]

  if (!id) {
    throw new Error(
      'Invalid `vidsrc` URL structure for Movie. Unable to extract ID.'
    )
  }

  return `https://vidsrcme.vidsrc.icu/embed/movie?tmdb=${id}&autoplay=1`
}

// Main method to get original sources
export const getOriginalSource = async (vidsrc: string): Promise<string[]> => {
  try {
    const isTv = vidsrc.includes('/tv/')
    const isMovie = vidsrc.includes('/movie/')

    if (!isTv && !isMovie) {
      throw new Error(
        'Invalid `vidsrc` URL structure. URL must contain either `/tv/` or `/movie/`.'
      )
    }

    const requestUrl = isTv
      ? constructTvUrl(vidsrc)
      : constructMovieUrl(vidsrc)

    const response = await fetch(requestUrl)
    if (!response.ok) {
      throw new Error(
        `Failed to fetch data from ${requestUrl}: ${response.statusText}`
      )
    }

    const html = await response.text()

    const iframeSrcMatch = html.match(/<iframe[^>]+src="([^"]+)"/)
    if (!iframeSrcMatch || !iframeSrcMatch[1]) {
      throw new Error('Iframe with src not found in the HTML response.')
    }

    const primarySrc = iframeSrcMatch[1].startsWith('//')
      ? `https:${iframeSrcMatch[1]}`
      : iframeSrcMatch[1]

    const backupUrls: string[] = Array.from(
      html.matchAll(/<div class="server"[^>]*data-hash="([^"]+)"/g)
    )
      .map(match => match[1])
      .filter(hash => hash)
      .map(hash => `https://${hash}`)

    const allSources = [primarySrc, ...backupUrls]

    return allSources
  } catch (error) {
    console.error('Error in getOriginalSource:', error)
    return []
  }
}

import Api from 'services/BaseService'
// Interfaces
import { IGetListPayload, IDetailPayload } from '@/interfaces/IPayloads'
import { log } from 'console'

export const getTrending = async (type: string, payload: object) => {
  const response = await Api().get(`/trending/all/${type}`, { params: payload })
  return response
}

export const getNewRelease = async (type: string, payload: IGetListPayload) => {
  const response = await Api().get(`/${type}/latest`, { params: payload })
  return response
}

export const getPopular = async (type: string, payload: IGetListPayload) => {
  const response = await Api().get(`/${type}/popular`, { params: payload })
  return response
}

export const getTopRated = async (type: string, payload: IGetListPayload) => {
  const response = await Api().get(`/${type}/top_rated`, { params: payload })
  return response
}

export const getNowPlaying = async (payload: IGetListPayload) => {
  const response = await Api().get('/movie/now_playing', { params: payload })
  return response
}

export const getUpcoming = async (payload: IGetListPayload) => {
  const response = await Api().get('/movie/upcoming', { params: payload })
  return response
}

export const getAiringToday = async (payload: IGetListPayload) => {
  const response = await Api().get('/tv/airing_today', { params: payload })
  return response
}

export const getOnTheAir = async (payload: IGetListPayload) => {
  const response = await Api().get('/tv/on_the_air', { params: payload })
  return response
}

export const getDetail = async (type: string, id: string, payload: IDetailPayload) => {
  const response = await Api().get(`/${type}/${id}`, { params: payload })
  return response
}

export const getCredits = async (type: string, id: string, payload: IDetailPayload) => {
  const response = await Api().get(`/${type}/${id}/credits`, { params: payload })
  return response
}

export const getTrailers = async (type: string, id: string, payload: IDetailPayload) => {
  const response = await Api().get(`/${type}/${id}/videos`, { params: payload })
  return response
}

export const getReviews = async (type: string, id: string, payload: IDetailPayload) => {
  const response = await Api().get(`/${type}/${id}/reviews`, { params: payload })
  return response
}

export const getRecommendation = async (type: string, id: string, payload: IDetailPayload) => {
  const response = await Api().get(`/${type}/${id}/recommendations`, { params: payload })
  return response
}

export const searchFilm = async (payload: object) => {
  const response = await Api().get(`search/movie`, { params: payload })
  return response
}

export const searchTv = async (payload: object) => {
  const response = await Api().get(`search/tv`, { params: payload })
  return response
}


export const getSeasonsAndEpisodes = async (tvId: number) => {
  try {
    // Step 1: Fetch TV show details to get the seasons
    const tvDetailsResponse = await Api().get(`/tv/${tvId}`, {
      params: { api_key: import.meta.env.VITE_API_KEY },
    });
    
    const seasons = tvDetailsResponse.data.seasons || [];
    
    // Step 2: For each season, fetch the episodes
    const seasonDetails = await Promise.all(
      seasons.map(async (season: any) => {
        const seasonResponse = await Api().get(`/tv/${tvId}/season/${season.season_number}`, {
          params: { api_key: import.meta.env.VITE_API_KEY },
        });
        
        return {
          season_number: season.season_number,
          episodes: seasonResponse.data.episodes || [],
        };
      })
    );
    

    return {
      title: tvDetailsResponse.data.name,
      seasons: seasonDetails,
    };
  } catch (error) {
    console.error('Error fetching seasons and episodes:', error);
    throw error;
  }
};

export const getOriginalSource = async (vidsrc: string): Promise<string[]> => {
  try {
    // Step 1: Parse the `vidsrc` details (e.g., `https://vidsrc.icu/embed/tv/36361/1/1`)
    const urlParts = vidsrc.split('/');
    const id = urlParts[urlParts.length - 3]; // Extract the ID
    const season = urlParts[urlParts.length - 2]; // Extract the season
    const episode = urlParts[urlParts.length - 1]; // Extract the episode

    if (!id || !season || !episode) {
      throw new Error('Invalid `vidsrc` URL structure. Unable to extract ID, season, or episode.');
    }

    // Step 2: Construct the new URL
    const requestUrl = `https://vidsrcme.vidsrc.icu/embed/tv?tmdb=${id}&season=${season}&episode=${episode}&autoplay=1`;

    // Step 3: Fetch the HTML content of the constructed URL
    const response = await fetch(requestUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${requestUrl}: ${response.statusText}`);
    }
    const html = await response.text();

    // Step 4: Parse the iframe `src` from the HTML
    const iframeSrcMatch = html.match(/<iframe[^>]+src="([^"]+)"/);
    if (!iframeSrcMatch || !iframeSrcMatch[1]) {
      throw new Error('Iframe with src not found in the HTML response.');
    }
    const primarySrc = iframeSrcMatch[1].startsWith('//') ? `https:${iframeSrcMatch[1]}` : iframeSrcMatch[1];

    // Step 5: Extract backup server URLs from the `data-hash` attributes in the servers section
    const backupUrls: string[] = Array.from(html.matchAll(/<div class="server"[^>]*data-hash="([^"]+)"/g))
      .map(match => match[1])
      .filter(hash => hash) // Filter out any invalid matches
      .map(hash => `https://${hash}`);

    // Step 6: Combine the primary iframe URL with the backup server URLs
    const allSources = [primarySrc, ...backupUrls];

    // Step 7: Return the combined list of URLs
    return allSources;
  } catch (error) {
    console.error('Error in getOriginalSource:', error);
    return []; // Return an empty array on error to avoid breaking calling components
  }
};





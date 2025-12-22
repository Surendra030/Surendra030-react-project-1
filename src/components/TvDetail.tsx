import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSeasonsAndEpisodes } from '@/services/MovieApi';
import { getOriginalSource } from '@/services/MovieApi';

interface Episode {
  episode_number: number;
  name: string;
}

interface Season {
  season_number: number;
  episodes: Episode[];
}

interface ShowDetails {
  title: string;
  seasons: Season[];
}

interface SelectedData {
  sNum: null | number;
  epNum: null | number;
}

interface TvDetailProps {
  setselectedData: Dispatch<SetStateAction<SelectedData>>;
}
 
const TvDetail: React.FC<TvDetailProps> = ({ setselectedData }) => {

  const { id } = useParams<{ id: string }>();

  const vidsrc = import.meta.env.VITE_BASE_VIDSRC_URL;

  const [showDetails, setShowDetails] = useState<ShowDetails | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);

  // ✅ Added: track copied episode
  const [copiedEpisode, setCopiedEpisode] = useState<number | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (id) {
        const data = await getSeasonsAndEpisodes(parseInt(id));
        setShowDetails(data);

        const validSeasons = data.seasons.filter(
          (season) => season.season_number > 0
        );

        if (validSeasons.length > 0) {
          const firstSeason = validSeasons[0];
          setSelectedSeason(firstSeason.season_number);

          if (firstSeason.episodes.length > 0) {
            setselectedData({
              sNum: firstSeason.season_number,
              epNum: firstSeason.episodes[0].episode_number,
            });
          }
        }
      }
    };
    fetchDetails();
  }, [id, setselectedData]);

  const handleSeasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSeason(parseInt(event.target.value));
  };

  // ✅ Added: handle copy logic
  const handleCopy = async (
  e: React.MouseEvent,
  season: number,
  episode: number
) => {
  e.stopPropagation();

  if (!id) return;

  try {
    const VidSrcUrl = `${vidsrc}/tv/${id}/${season}/${episode}`;

    // ✅ WAIT for async result
    const sources = await getOriginalSource(VidSrcUrl);

    if (sources.length > 0) {
      // ✅ copy REAL iframe src
      await navigator.clipboard.writeText(sources[0]);
    } else {
      await navigator.clipboard.writeText("No Url Found");
    }

    setCopiedEpisode(episode);
    setTimeout(() => setCopiedEpisode(null), 1500);

  } catch (err) {
    console.error("Copy failed", err);
    await navigator.clipboard.writeText("Failed to fetch source");
  }
};


  const selectedSeasonEpisodes =
    showDetails?.seasons.find(
      (season) => season.season_number === selectedSeason
    )?.episodes || [];

  return (
    <div className="p-5 text-white">
      {showDetails ? (
        <div>

          <div className="w-full flex flex-row items-center justify-between mb-4">
            <label htmlFor="seasonSelect" className="text-white font-semibold text-lg">
              Select Season:
            </label>
            <select
              id="seasonSelect"
              value={selectedSeason}
              onChange={handleSeasonChange}
              className="text-gray-900 p-2 rounded-md text-lg"
            >
              {showDetails.seasons.map((season) => (
                <option key={season.season_number} value={season.season_number}>
                  Season {season.season_number}
                </option>
              ))}
            </select>
          </div>

          <div>
            <h2 className="text-white text-xl font-semibold mb-2">Episodes:</h2>
            <div className="flex flex-col gap-4 h-[75vh] overflow-y-scroll">
              {selectedSeasonEpisodes.map((episode) => (
                <div
                  key={episode.episode_number}
                  onClick={() => {
                    setselectedData({
                      sNum: selectedSeason,
                      epNum: episode.episode_number
                    });
                  }}
                  className={`p-2 rounded-lg cursor-pointer border-2 transform transition-all
                    ${
                      copiedEpisode === episode.episode_number
                        ? 'bg-green-200 border-green-500'
                        : 'bg-gray-100 border-gray-300 hover:border-blue-500'
                    }
                  `}
                >
                  <div className="flex justify-between items-center text-gray-600">
                    <div className="flex">
                      Ep : {episode.episode_number}
                      <strong className="ms-4 text-lg font-medium">
                        {episode.name}
                      </strong>
                    </div>

                    {/* ✅ COPY BUTTON */}
                    <button
                      onClick={(e) =>
                        handleCopy(e, selectedSeason, episode.episode_number)
                      }
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                    >
                      Copy
                    </button>

                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default TvDetail;

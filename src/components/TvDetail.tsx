import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSeasonsAndEpisodes } from '@/services/MovieApi';

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
  const [showDetails, setShowDetails] = useState<ShowDetails | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<number>(1); // Default to Season 1 if it exists

  useEffect(() => {
    const fetchDetails = async () => {
      if (id) {
        const data = await getSeasonsAndEpisodes(parseInt(id));
        setShowDetails(data);
        if (data.seasons.length > 0) {
          setSelectedSeason(data.seasons[0].season_number); // Set to Season 1 or the first available season
        }
      }
    };
    fetchDetails();
  }, [id]);

  const handleSeasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSeason(parseInt(event.target.value));
  };

  const selectedSeasonEpisodes =
    showDetails?.seasons.find(
      (season) => season.season_number === selectedSeason
    )?.episodes || [];

  return (
    <div className=" p-5 text-white ">
      {showDetails ? (
        <div>

          <div className=" w-full flex flex-row  items-center justify-between mb-4">
            <label htmlFor="seasonSelect" className=" text-white font-semibold text-lg">
              Select Season:
            </label>
            <select
              id="seasonSelect"
              value={selectedSeason}
              onChange={handleSeasonChange}
              className="text-gray-900   p-2   rounded-md  text-lg"
            >
              {showDetails.seasons.map((season) => (
                <option key={season.season_number} value={season.season_number}>
                  Season {season.season_number}
                </option>
              ))}
            </select>
          </div>

          <div>
            <h2 className=" text-white text-xl font-semibold mb-2">Episodes:</h2>
            <div className="flex flex-col gap-4 h-[75vh] overflow-y-scroll">
              {selectedSeasonEpisodes.map((episode) => (
                <div
                  key={episode.episode_number}
                  className="p-1 bg-gray-100  rounded-lg text-left cursor-pointer transform transition-transform border-2 border-gray-300 hover:border-blue-500"
                  onClick={() =>{
                  setselectedData({sNum:selectedSeason,epNum:episode.episode_number})
                  }
                  }
                >
                  <div className=" flex flex-row justify-start text-gray-600">Ep : {episode.episode_number}
                    <strong className=" text-left text-lg font-medium mb-1 ms-4">{episode.name}</strong>
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

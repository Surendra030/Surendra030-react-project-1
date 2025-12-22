import { IMovieDetail } from '@/interfaces/IMovieDetail';
import { getOriginalSource, getSeasonsAndEpisodes } from '@/services/MovieApi';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface SelectedData {
  sNum: number | null;
  epNum: number | null;
}

interface VideoContentProps {
  selectedData: SelectedData;
}

const TvShowContent: React.FC<VideoContentProps> = ({ selectedData }) => {
  const [source, setSource] = useState("");
  const [maxEpisodes, setMaxEpisodes] = useState<number>(0);

  const { type, id } = useParams();
  const { sNum, epNum } = selectedData;

  const vidsrc = import.meta.env.VITE_BASE_VIDSRC_URL;

  // Get max episodes for selected season
  useEffect(() => {
    const fetchEpisodesCount = async () => {
      if (!id || !sNum) return;

      const data = await getSeasonsAndEpisodes(parseInt(id));
      const season = data.seasons.find(
        (s: any) => s.season_number === sNum
      );

      if (season) {
        setMaxEpisodes(season.episodes.length);
      }
    };

    fetchEpisodesCount();
  }, [id, sNum]);

  // Get iframe source
  useEffect(() => {
    const fetchSource = async () => {
      if (type && id && sNum !== null && epNum !== null) {
        const temp = await getOriginalSource(
          `${vidsrc}/${type}/${id}/${sNum}/${epNum}`
        );
        setSource(temp[0]);
      }
    };
    fetchSource();
  }, [type, id, sNum, epNum, vidsrc]);


  // ---------- Navigation Logic ----------
  const goNext = () => {
    if (!epNum || !maxEpisodes) return;
    if (epNum < maxEpisodes) {
      window.dispatchEvent(
        new CustomEvent("changeEpisode", {
          detail: { sNum, epNum: epNum + 1 }
        })
      );
    }
  };

  const goPrev = () => {
    if (!epNum) return;
    if (epNum > 1) {
      window.dispatchEvent(
        new CustomEvent("changeEpisode", {
          detail: { sNum, epNum: epNum - 1 }
        })
      );
    }
  };

  return (
    <div className="flex flex-col gap-4">

      {/* Player */}
      <div className="flex flex-row space-x-6 overflow-x-hidden no-scrollbar scroll-smooth">
        <div
          key={`trailer-${id}`}
          className="lg:w-[500px] md:w-[450px] w-[360px] lg:h-[300px] md:h-[250px] h-[200px] rounded-lg cursor-pointer relative"
        >
          <iframe
            src={source}
            title="Tvshow"
            className="border border-white shadow-2xl w-full h-[200px] md:w-[450px] md:h-[250px] lg:w-[500px] lg:h-[300px] rounded-lg object-cover"
            allow="fullscreen; encrypted-media; autoplay"
            allowFullScreen={true}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <button
          onClick={goPrev}
          disabled={!epNum || epNum === 1}
          className="px-4 py-2 bg-blue-500 disabled:bg-gray-500 rounded-lg text-white"
        >
          ⏮ Prev
        </button>

        <button
          onClick={goNext}
          disabled={!epNum || epNum === maxEpisodes}
          className="px-4 py-2 bg-green-500 disabled:bg-gray-500 rounded-lg text-white"
        >
          ⏭ Next
        </button>
      </div>

    </div>
  );
};

export default TvShowContent;

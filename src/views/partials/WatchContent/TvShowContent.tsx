import { IMovieDetail } from '@/interfaces/IMovieDetail';
import { getOriginalSource } from '@/services/MovieApi';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface SelectedData {
  sNum: number | null;
  epNum: number | null;
}

interface VideoContentProps {
  selectedData: SelectedData;

  // ✅ ADDED (optional, non-breaking)
  onSourceChange?: (source: string) => void;
}

const TvShowContent: React.FC<VideoContentProps> = ({
  selectedData,
  onSourceChange
}) => {
  const [source, setSource] = useState("");

  const { type, id } = useParams();
  const { sNum, epNum } = selectedData;

  const vidsrc = import.meta.env.VITE_BASE_VIDSRC_URL;

  useEffect(() => {
    const fetchSource = async () => {
      if (type && id && sNum !== null && epNum !== null) {
        const temp = await getOriginalSource(
          `${vidsrc}/${type}/${id}/${sNum}/${epNum}`
        );

        const iframeSource = temp[0];

        setSource(iframeSource);

        // ✅ notify parent / listener
        if (onSourceChange) {
          onSourceChange(iframeSource);
        }
      }
    };

    fetchSource();
  }, [type, id, sNum, epNum, vidsrc, onSourceChange]);

  return (
    <div className="flex flex-row space-x-6 overflow-x-hidden no-scrollbar scroll-smooth">
      <div
        key={`trailer-${id}`}
        className="lg:w-[500px] md:w-[450px] w-[360px] lg:h-[300px] md:h-[250px] h-[200px] rounded-lg cursor-pointer relative"
      >
        {/* Video Player Iframe */}
        <iframe
          src={source}
          title="Tvshow"
          className="border border-white shadow-2xl w-full h-[200px] md:w-[450px] md:h-[250px] lg:w-[500px] lg:h-[300px] rounded-lg object-cover"
          allow="fullscreen; encrypted-media; autoplay"
          allowFullScreen={true}
        />
      </div>
    </div>
  );
};

export default TvShowContent;

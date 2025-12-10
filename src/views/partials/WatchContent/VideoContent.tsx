import { IMovieDetail } from '@/interfaces/IMovieDetail';
import { getOriginalSource } from '@/services/MovieApi';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface IProps {
  movie: IMovieDetail;
}

const VideoContent = () => {
  const { type, id } = useParams();
  const [source, setSource] = useState("");
  const vidsrc = import.meta.env.VITE_BASE_VIDSRC_URL;

  // ✅ ADDED: copy feedback state (optional UI)
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchSource = async () => {
      if (type && id !== null) {
        const temp = await getOriginalSource(`${vidsrc}/${type}/${id}`);
        setSource(temp[0]);
      }
    };

    fetchSource();
  }, [type, id, vidsrc]);

  // ✅ ADDED: copy function
  const handleCopySource = async () => {
    if (!source) {
      await navigator.clipboard.writeText("No source found");
      return;
    }

    await navigator.clipboard.writeText(source);
    setCopied(true);

    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-row space-x-6 overflow-x-hidden no-scrollbar scroll-smooth">
      <div
        key={`trailer-${id}`}
        className="lg:w-[500px] md:w-[450px] w-[360px] lg:h-[300px] md:h-[250px] h-[200px] rounded-lg cursor-pointer relative"
      >
        {/* ✅ COPY BUTTON */}
        <button
          onClick={handleCopySource}
          className={`absolute top-2 right-2 z-10 px-3 py-1 text-sm rounded 
            ${copied ? 'bg-green-500' : 'bg-blue-500'} text-white`}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>

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

export default VideoContent;

import { IMovieDetail } from '@/interfaces/IMovieDetail';
import { getOriginalSource } from '@/services/MovieApi';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface IProps {
  movie: IMovieDetail;
}

const VideoContent = () => {
  const { type, id } = useParams();
  const [source, setSource] = useState(""); // Explicitly define type as string[]
  const vidsrc = import.meta.env.VITE_BASE_VIDSRC_URL;

  useEffect(() => {
    const fetchSource = async () => {
      if (type && id  !== null) {
        const temp = await getOriginalSource(`${vidsrc}/${type}/${id}`);
        setSource(temp[0]);

      }
    };

    fetchSource();
  }, [type, id,  vidsrc]);


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
        allow="fullscreen; encrypted-media; autoplay"  // Allow full-screen and other features
        allowFullScreen={true}  // Enabling full-screen mode
      />
      </div>
    </div>
  );
};

export default VideoContent;

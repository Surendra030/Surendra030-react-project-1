import { IMovieDetail } from '@/interfaces/IMovieDetail';
import { useParams, useNavigate } from 'react-router-dom';

interface IProps {
  movie: IMovieDetail;
}

const VideoContent = () => {
  const { type, id } = useParams();
  const vidsrc = import.meta.env.VITE_BASE_VIDSRC_URL;


  return (
    <div className="  flex space-x-6 w-full overflow-hidden no-scrollbar scroll-smooth">
      <div
        key={`trailer-${id}`}
        className="w-full max-h-[200px] md:w-[450px] md:h-[250px] lg:w-[500px] lg:h-[320px] rounded-lg cursor-pointer relative"
      >
        <iframe
          src={`${vidsrc}/${type}/${id}`}
          allow="fullscreen"
          allowFullScreen
          title="Movie"
          className="border border-white shadow-2xl w-full h-[200px] md:w-[450px] md:h-[250px] lg:w-[500px] lg:h-[300px] border border-white rounded-lg object-cover"
        />

      </div>
    </div>
  );
};

export default VideoContent;

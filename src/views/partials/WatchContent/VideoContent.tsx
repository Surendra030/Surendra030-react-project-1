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
        className="lg:w-[500px] md:w-[450px] w-full lg:h-[300px] md:h-[250px] h-[200px] rounded-lg cursor-pointer relative"
      >
        <iframe
          src={`${vidsrc}/${type}/${id}`}

          className=" border border-white lg:w-[500px] md:w-[450px] w-full  lg:h-[300px] md:h-[250px] h-[200px] rounded-lg object-cover"
        />

      </div>
    </div>
  );
};

export default VideoContent;

import { IMovieDetail } from '@/interfaces/IMovieDetail';
import { useParams, useNavigate } from 'react-router-dom';

interface IProps {
  movie: IMovieDetail;
}

const DetailContent = ({ movie }: IProps) => {
  const { type, id } = useParams();
  

  return (
    <div className="flex space-x-6 w-full overflow-x-hidden no-scrollbar scroll-smooth">
      <div
        key={`trailer-${id}`}
        className="border border-red lg:w-[500px] md:w-[450px] w-full lg:h-[350px] md:h-[250px] h-[200px] rounded-lg cursor-pointer relative"
      >
        <img
          src={`https://www.themoviedb.org/t/p/w1920_and_h800_multi_faces${movie.backdrop_path}`}
          alt="Movie preview"
          className="lg:w-[500px] md:w-[450px] w-full lg:h-[300px] md:h-[250px] h-[200px] rounded-lg object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
          <button className="text-white text-3xl">▶</button>
        </div>
      </div>
    </div>
  );
};

export default DetailContent;

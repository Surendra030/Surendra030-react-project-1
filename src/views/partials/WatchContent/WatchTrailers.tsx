import { IMovieTrailers } from 'interfaces/IMovieTrailers';
import { useParams } from 'react-router-dom';

interface IProps {
  trailers: IMovieTrailers[];
}

const WatchTrailers = ({ trailers }: IProps) => {
  const { type, id } = useParams();
  let trailerLen: number = trailers.length;
  console.log(trailerLen);

  return (
    <div className="flex space-x-6 overflow-x-auto no-scrollbar scroll-smooth">
      {trailerLen === 0 ? (
        <h1 className='text-white'>No Trailer Available</h1>
      ) : (
        trailers.map((trailer, index) => (
          <div
            key={`trailer-${index}`}
            className="lg:w-[500px] md:w-[450px] w-[360px] lg:h-[300px] md:h-[250px] h-[200px] rounded-lg"
          >
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title={trailer.name}
              frameBorder="0"
              allow="encrypted-media;"
              allowFullScreen
              className="lg:w-[500px] md:w-[450px] w-[360px] lg:h-[300px] md:h-[250px] h-[200px] rounded-lg"
            />
          </div>
        ))
      )}
    </div>
  );
};

export default WatchTrailers;

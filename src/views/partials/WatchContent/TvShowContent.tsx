import { IMovieDetail } from '@/interfaces/IMovieDetail';
import { useParams, useNavigate } from 'react-router-dom';

interface IProps {
  movie: IMovieDetail;
}

interface SelectedData {
  sNum: number | null;
  epNum: number | null;
}

interface VideoContentProps {
  selectedData: SelectedData;
}

const TvShowContent: React.FC<VideoContentProps> = ({ selectedData }) => {
  const { type, id } = useParams();
  console.log(selectedData);

  const {sNum,epNum} = selectedData
  
const vidsrc = import.meta.env.VITE_BASE_VIDSRC_URL;
  console.log(`${vidsrc}/${type}/${id}`);
  

  return (<div className="flex flex-row space-x-6 overflow-x-hidden no-scrollbar scroll-smooth">
    <div
      key={`trailer-${id}`}
      className="lg:w-[500px] md:w-[450px] w-[360px] lg:h-[300px] md:h-[250px] h-[200px] rounded-lg cursor-pointer relative"
    >
      <iframe
        src={`${vidsrc}/${type}/${id}/${sNum}/${epNum}`}
        title='Tvshow'
        className="border border-white shadow-2xl w-full h-[200px] md:w-[450px] md:h-[250px] lg:w-[500px] lg:h-[300px] border border-white rounded-lg object-cover"
        />
      
    </div>
  </div>
  );
};

export default TvShowContent;

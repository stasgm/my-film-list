import { InformationCircleIcon, ExternalLinkIcon } from '@heroicons/react/outline';
import { IFilm } from '../types';

interface IProps {
  film: IFilm;
  // onPostFilm: (film: INewFilm) => void;
  setFilm: (film: IFilm) => void;
}

const FilmDialog = ({ setFilm, film }: IProps) => {
  // const [tempFilm, setFilm] = useState<INewFilm>(initialState);

  // useEffect(() => {
  //   setFilm(film || initialState);
  // }, [film, setFilm]);

  return (
    <div className="overflow-hidden flex flex-wrap">
      <div className="my-2 mx-4 flex sm:flex-row flex-col w-full">
        <div className="w-20 self-start sm:self-center">
          <label className="text-gray-600 font-semibold sm:text-base text-sm" htmlFor="name">
            Name
          </label>
        </div>
        <div className="relative rounded-md shadow-sm inline-block w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <InformationCircleIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            className="focus:ring-indigo-500 focus:border-indigo-500 pl-10 sm:text-sm border-gray-300 rounded-md placeholder-gray-400  w-full"
            id="name"
            placeholder="Name"
            type="text"
            value={film.name}
            onChange={(el) => setFilm({ ...film, name: el.currentTarget.value })}
          />
        </div>
      </div>
      <div className="my-2 mx-4 flex sm:flex-row flex-col w-full">
        <div className="w-20 self-start sm:self-center">
          <label className="text-gray-600 font-semibold sm:text-base text-sm" htmlFor="url">
            URL
          </label>
        </div>
        <div className="relative rounded-md shadow-sm inline-block w-full ">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ExternalLinkIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            className="focus:ring-indigo-500 focus:border-indigo-500 pl-10 sm:text-sm border-gray-300 rounded-md placeholder-gray-400 w-full"
            id="url"
            placeholder="Url"
            type="text"
            value={film.url}
            onChange={(el) => setFilm({ ...film, url: el.currentTarget.value })}
          />
        </div>
      </div>
    </div>
  );
};

export default FilmDialog;

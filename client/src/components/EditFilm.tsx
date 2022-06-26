import { useEffect, useState } from 'react';
import { InformationCircleIcon, ExternalLinkIcon } from '@heroicons/react/outline';
import { Button } from './ButtonGroup';
import { IFilm, INewFilm } from '../types';


interface IProps {
  film?: IFilm | null;
  postFilm: (film: INewFilm) => void;
}

const initialState: INewFilm = {
  name: '',
  url: ''
}

const EditFilm = ({ postFilm, film }: IProps) => {
  useEffect(() => {
    setFilm(film || initialState);
  }, [film])

  const [tempFilm, setFilm] = useState<INewFilm>(initialState);

  return (
    <div className="bg-white sm:rounded-lg shadow overflow-hidden sm:mb-2 py-2">
      <div className="my-2 whitespace-nowrap sm:inline py-2">
        <label
          className="text-gray-600 ml-4 mr-4 font-semibold w-14 inline-block sm:w-auto sm:text-sm"
          htmlFor="name"
        >
          Name
        </label>
        <div className="relative rounded-md shadow-sm inline-block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <InformationCircleIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            className="focus:ring-indigo-500 focus:border-indigo-500 block pl-10 sm:text-sm border-gray-300 rounded-md placeholder-gray-400 w-auto sm:w-48 md:w-96"
            id="name"
            placeholder="Name"
            size={16}
            type="text"
            value={tempFilm.name}
            onChange={(el) => setFilm({ ...tempFilm, name: el.currentTarget.value })}
          />
        </div>
      </div>
      <div className="my-2 whitespace-nowrap sm:inline sm:ml-2 md:ml-4">
        <label
          className="text-gray-600 ml-4 mr-4 font-semibold w-14 inline-block sm:w-auto sm:text-sm"
          htmlFor="url"
        >
          URL
        </label>
        <div className="relative rounded-md shadow-sm inline-block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ExternalLinkIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            className="focus:ring-indigo-500 focus:border-indigo-500 block pl-10 sm:text-sm border-gray-300 rounded-md placeholder-gray-400 w-auto sm:w-48 md:w-96"
            id="url"
            placeholder="Url"
            size={16}
            type="text"
            value={tempFilm.url}
            onChange={(el) => setFilm({ ...tempFilm, url: el.currentTarget.value })}
          />
        </div>
      </div>
      <div className="my-2 whitespace-nowrap sm:inline sm:ml-2 md:ml-4">
        <Button
          className="px-4 py-2 border mr-2 border-gray-300 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-200"
          onClick={() => postFilm(tempFilm)}
        >
          Post
        </Button>
        <Button
          className="px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-200"
          onClick={() => setFilm(initialState)}
        >
          Clear
        </Button>
      </div>
    </div>
  )
}

export default EditFilm;

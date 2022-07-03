import { useEffect, useMemo, useState, useCallback } from 'react';
import { InformationCircleIcon, ExternalLinkIcon } from '@heroicons/react/outline';
import { useFilmMutations } from '../queries/queries';
import { IFilm } from '../types';
import { isFilm } from '../utils';
import { Button } from './ButtonGroup';

interface IProps {
  film?: IFilm;
  onClose: () => void;
}

const FilmDialog = ({ film, onClose }: IProps) => {
  const initialState: IFilm = useMemo(() => ({
    id: '',
    seen: false,
    name: '',
    url: '',
  }), []);

  const [tmpFilm, setTmpFilm] = useState<IFilm>(initialState);

  useEffect(() => {
    setTmpFilm(film || initialState);
  }, [film, initialState]);

  const mutation = useFilmMutations();

  const handlePostFilm = useCallback(() => {
    if (isFilm(tmpFilm)) {
      tmpFilm.id
        ? mutation.updateFilm.mutate(tmpFilm)
        : mutation.addFilm.mutate(tmpFilm)
    }

    onClose();
  }, [mutation.addFilm, mutation.updateFilm, onClose, tmpFilm]);

  return (
    <>
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
              value={tmpFilm.name}
              onChange={(el) => setTmpFilm({ ...tmpFilm, name: el.currentTarget.value })}
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
              value={tmpFilm.url}
              onChange={(el) => setTmpFilm({ ...tmpFilm, url: el.currentTarget.value })}
            />
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b border-slate-200">
        <Button
          className="w-full font-bold uppercase inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          className="bg-emerald-500 font-bold uppercase w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 text-white text-base font-medium text-gray-700 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-20 sm:text-sm mt-3"
          onClick={handlePostFilm}
        >
          Ok
        </Button>
      </div>
    </>
  );
};

export default FilmDialog;

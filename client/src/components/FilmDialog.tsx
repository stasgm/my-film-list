import { useEffect, useMemo, useState, useCallback } from 'react';
import { InformationCircleIcon, ExternalLinkIcon } from '@heroicons/react/outline';
import { useFilmMutations } from '../queries/queries';
import { IResource, IType } from '../types';
import { isResource } from '../utils';
import { Button } from './ButtonGroup';

interface IProps {
  resource?: IResource;
  onClose: () => void;
}

const FilmDialog = ({ resource, onClose }: IProps) => {
  const initialState: IResource = useMemo(() => ({
    id: '',
    seen: false,
    name: '',
    url: '',
    type: IType.film
  }), []);

  const [tmpFilm, setTmpFilm] = useState<IResource>(initialState);

  useEffect(() => {
    setTmpFilm(resource || initialState);
  }, [resource, initialState]);

  const mutation = useFilmMutations();

  const handlePostFilm = useCallback(() => {
    if (isResource(tmpFilm)) {
      tmpFilm.id
        ? mutation.updateFilm.mutate(tmpFilm)
        : mutation.addFilm.mutate(tmpFilm)
    }

    onClose();
  }, [mutation.addFilm, mutation.updateFilm, onClose, tmpFilm]);

  const setType = (type: string): IType => Number.parseInt(type) as IType;

  return (
    <>
      <div className="overflow-hidden flex flex-wrap">
        <div className="my-2 mx-4 flex sm:flex-row flex-col w-full">
          <div className="w-20 self-start sm:self-center">
            <label className="text-gray-600 font-semibold sm:text-base text-sm" htmlFor="type">
              Type
            </label>
          </div>
          <div className="relative rounded-md shadow-sm inline-block w-full ">
            <select
              value={tmpFilm.type || 0}
              onChange={(el) => setTmpFilm({ ...tmpFilm, type: setType(el.currentTarget.value) })}
              className="focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md placeholder-gray-400 w-full font-normal"
              id="type"
              placeholder="Type"
            >
              <option value="0">Film</option>
              <option value="1">Serial</option>
            </select>
          </div>
        </div>
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
        <div className="mt-3 mx-4 flex sm:flex-row flex-col w-full">
          <div className="flex items-center mb-4">
            <input
              className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              id="seen"
              type="checkbox"
              checked={tmpFilm.seen}
              value=""
              onChange={(el) => setTmpFilm({ ...tmpFilm, seen: el.currentTarget.checked })}
            />
            <label htmlFor="seen" className="ml-2 text-gray-600 font-semibold sm:text-base text-sm">Seen</label>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row justify-end rounded-b border-slate-200">
        <Button
          className="w-full font-bold uppercase inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base text-white hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:ml-3 sm:w-20 sm:text-sm"
          onClick={handlePostFilm}
        >
          Ok
        </Button>
        <Button
          className="w-full font-bold uppercase inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-red-600 text-white text-base  hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm mt-3"
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </>
  );
};

export default FilmDialog;

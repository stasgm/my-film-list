import { useEffect, useMemo, useState, useCallback } from 'react';
import { ExternalLinkIcon } from '@heroicons/react/outline';
import { useFilmMutations } from '../queries/queries';
import { IFilmInfo, IResource, ISerialInfo, IType } from '../types';
import { Button } from './ButtonGroup';

interface IProps {
  resource: IResource;
  onClose: () => void;
}

const FilmInfo = ({ resource, onClose }: IProps) => {
  const [info, setInfo] = useState<ISerialInfo | IFilmInfo | undefined>(undefined);

  useEffect(() => {
    setInfo(resource.info);
  }, [resource.info]);

  const mutation = useFilmMutations();

  const handlePostInfo = useCallback(() => {
    mutation.updateFilm.mutate({ ...resource, info });

    onClose();
  }, [info, mutation.updateFilm, onClose, resource]);

  return (
    <>
      <div className="my-2 mx-2 w-full inset-y-0 left-0 pl-3">
        <a href={resource.url} target="_blank" rel="noreferrer" className="no-underline hover:underline inline-flex items-center cursor-pointer">
          <ExternalLinkIcon className="h-5 w-5 text-gray-400" />
          <span className="overflow-hidden ml-2">{resource.url}</span>
        </a>
      </div>
      {resource.type === IType.serial
        ? (
          <div className="my-2 mx-2 w-full pl-3">
            Serial info
          </div>)
        : null
      }
      {resource.type === IType.film
        ? (
          <div className="my-6 mx-2 w-full inset-y-0 left-0 pl-3">
            Film info
          </div>)
        : null
      }
      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row justify-end rounded-b border-slate-200">
        <Button
          className="w-full font-bold uppercase inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-500 text-base font-medium text-white hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:ml-3 sm:w-20 sm:text-sm"
          onClick={handlePostInfo}
        >
          Ok
        </Button>
        <Button
          className="font-bold uppercase w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-red-600 text-white text-base font-medium text-gray-700 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm mt-3"
          onClick={onClose}
        >
          Cancel
        </Button>

      </div>
    </>
  );
};

export default FilmInfo;

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

  const [editMode, setEditMode] = useState<boolean>(false);

  useEffect(() => {
    setInfo(resource.info);
  }, [resource.info]);

  const mutation = useFilmMutations();

  const handlePostInfo = useCallback(() => {
    mutation.updateFilm.mutate({ ...resource, info });

    setEditMode(false);
  }, [info, mutation.updateFilm, resource]);

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
          <div className="border-l-neutral-600 border-b-2 my-2 mx-2 grow pl-3">
            Serial info:
          </div>)
        : null
      }
      {resource.type === IType.film
        ? (
          <div className="border-l-neutral-600 border-b-2 my-2 mx-2 grow pl-3">
            Film info:
          </div>)
        : null
      }
      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row justify-end rounded-b border-slate-200">
        <Button
          className="w-full font-bold uppercase inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:ml-3 sm:w-24 sm:text-sm"
          onClick={editMode ? handlePostInfo : () => setEditMode(true)}
        >
          {editMode ? 'Save' : 'Edit'}
        </Button>
        <Button
          className="w-full font-bold uppercase inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-red-600 text-white text-base hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-24 sm:text-sm mt-3"
          onClick={editMode ? () => setEditMode(false) : onClose}
        >
          {editMode ? 'Cancel' : 'Close'}
        </Button>
      </div>
    </>
  );
};

export default FilmInfo;

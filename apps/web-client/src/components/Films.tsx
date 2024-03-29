import { useMemo, useCallback } from 'react';
import { FilmIcon, TvIcon as SerialIcon } from '@heroicons/react/24/outline';
import Highlighter from 'react-highlight-words';

import ActionButton from './ActionButton';
import FilmDialog from './FilmDialog';
import FilmInfo from './FilmInfo';
import Loader from './Loader';
import Table from './Table';
import { useModal } from './Modal';
import { useFilms, useFilmMutations } from '../queries/queries';

import { IResource, IResourceType, ResourceTypeFilter, StatusFilter, } from '../types';
// import { useToken } from '../hooks';
type FilterableFilm = IResource & { lowerCaseTitle: string };

interface IProps {
  search: string;
  statusFilter: StatusFilter;
  typeFilter: ResourceTypeFilter;
}

const FilmList = ({ search, statusFilter, typeFilter }: IProps) => {
  const { openModal, closeModal } = useModal();
  const mutation = useFilmMutations();

  const films = useFilms();

  const handleEditFilm = useCallback((id: string) => {
    const filmEdit = films.data?.find(el => el.id === id);

    if (!filmEdit) {
      return;
    }

    openModal({
      title: "Edit film",
      component: <FilmDialog resource={filmEdit} onClose={closeModal} />,
    });
  }, [closeModal, films.data, openModal]);

  const filterableData = useMemo(
    () =>
      films.data?.map<FilterableFilm>(film => ({ ...film, lowerCaseTitle: film.name?.toLowerCase() })),
    [films.data]
  );

  const { filteredData, hasMatchingText, searchTokens } = useMemo(() => {
    if (!filterableData) {
      return {}
    }

    let filteredData = filterableData;

    if (statusFilter === StatusFilter.seen) {
      filteredData = filteredData.filter(film => film.seen)
    } else if (statusFilter === StatusFilter.watch) {
      filteredData = filteredData.filter(film => !film.seen)
    }

    if (typeFilter === ResourceTypeFilter.film) {
      filteredData = filteredData.filter(film => film.type === IResourceType.film)
    } else if (typeFilter === ResourceTypeFilter.serial) {
      filteredData = filteredData.filter(film => film.type === IResourceType.serial)
    }

    const trimmedSearch = search.trim();
    const searchTokens = trimmedSearch.toLowerCase().split(/\s+/);

    const hasMatchingText = (film: FilterableFilm) => {
      return (
        searchTokens[0] === "" || searchTokens.every(token => film.lowerCaseTitle.includes(token))
      )
    };

    if (trimmedSearch) {
      filteredData = filteredData.filter(hasMatchingText)
    }

    return { filteredData, hasMatchingText, searchTokens }
  }, [filterableData, search, statusFilter, typeFilter])

  const filmsNumberText = useMemo(() => {
    return `${filteredData?.length} records in base`;
  }, [filteredData?.length]);

  const handleShowFilmInfo = useCallback((id: string) => {
    const filmEdit = films.data?.find(el => el.id === id);

    if (!filmEdit) {
      return;
    }

    openModal({
      title: `${filmEdit.name}`,
      component: <FilmInfo resource={filmEdit} onClose={closeModal} />,
    });
  }, [closeModal, films.data, openModal]);

  const handleDeleteFilm = useCallback((id: string) => {
    openModal({
      title: "Delete film",
      message: "Are you sure you want to delete this film?",
      onOk: () => {
        mutation.deleteFilm.mutate(id);
      }
    });
  }, [mutation.deleteFilm, openModal]);

  const handleUpdatFilmeSeenStatus = useCallback((id: string, status: boolean) => {
    openModal({
      title: "Update the film status",
      message: `Are you sure you want to update the film status to ${status ? 'SEEN' : 'NOT SEEN'}?`,
      onOk: () => {
        mutation.updateFilmStatus.mutate({ id, status });
      }
    });
  }, [mutation.updateFilmStatus, openModal]);


  if (films.isError || !filteredData || !hasMatchingText) {
    return <Loader error={films.error} />
  }

  const Title = (value: string = '', row: FilterableFilm) => {
    const isMatching = hasMatchingText(row);
    const res = isMatching ? (
      <Highlighter
        autoEscape
        highlightClassName="font-bold text-black bg-yellow-300"
        searchWords={searchTokens || []}
        textToHighlight={value}
      />
    ) : (
      value
    );

    const isFilm = row.type === IResourceType.film;

    return (
      <span className="hover:underline inline-flex cursor-pointer items-center text-base" onClick={() => handleShowFilmInfo(row.id)}>
        <span>{isFilm ? <FilmIcon className="tv:h-6 tv:w-6 h-5 w-5 inline mr-2 tv:mr-6" /> : <SerialIcon className="tv:h-6 tv:w-6 h-5 w-5 inline mr-2 tv:mr-6" />}</span>
        <span>{res}</span>
      </span>
    );
  };

  const Actions = (value: string, row: FilterableFilm) => {
    return (
      <div className="flex justify-evenly m-1">
        <ActionButton onClick={() => handleUpdatFilmeSeenStatus(row.id, !row.seen)}>
          {row.seen ?
            (<>
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </>
            ) : (
              <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            )}
        </ActionButton>
        <ActionButton onClick={() => handleEditFilm(row.id)} >
          <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </ActionButton>
        <ActionButton onClick={() => handleDeleteFilm(row.id)}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
          </path>
        </ActionButton>
      </div>
    )
  }

  const URLcomponent = (value: string, row: FilterableFilm) => {
    return (
      <a href={row.url} target="_blank" rel="noreferrer" className="no-underline hover:underline ">
        <span className="overflow-hidden text-base">{row.url}</span>
      </a>
    )
  };

  const columns = [
    {
      headClassName: "sm:w-2/6 w-5/6",
      key: "name",
      render: Title,
      title: "Title",
    },
    {
      headClassName: "sm:w-3/6 hidden sm:table-cell",
      key: "url",
      render: URLcomponent,
      title: "URL",
    },
    {
      headClassName: "sm:w-1/6 w-1/6 text-center",
      key: "id",
      render: Actions,
      title: "Actions",
    },
  ];

  return (
    <>
      <div className="my-1 items-center ml-4">
        <label
          className="text-gray-600 font-semibold sm:text-sm tv:text-lg"
        >
          {filmsNumberText}
        </label>
      </div>
      <div className="sm:bg-white sm:rounded-lg sm:shadow overflow-hidden">
        <Table columns={columns} dataRows={filteredData} rowKey="id" />
        {(films.data?.length || 0) === 0 && (
          <div className="px-6 py-3 text-center italic text-gray-700">Your film list is empty</div>
        )}
        {(films.data?.length || 0) > 0 && filteredData.length === 0 && (
          <div className="px-6 py-3 text-center italic text-gray-700">No result found</div>
        )}
      </div>
    </>
  )
}

export default FilmList;

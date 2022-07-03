import { useMemo, useState } from 'react';
import { FilmIcon } from '@heroicons/react/solid';
import Highlighter from 'react-highlight-words';
import Loader from './Loader';
import Table from './Table';
import { useFilms, useFilmMutations } from '../queries/queries';

import '../styles/App.css';
import { IFilm, INewFilm, StatusFilter } from '../types';
import SearchPanel from './SearchPanel';
import EditFilm from './EditFilm';
import ActionButton from './ActionButton';
import { useModal } from './Modal';

type FilterableFilm = IFilm & { lowerCaseTitle: string };

const FilmList = () => {
  const { setModal } = useModal();

  const films = useFilms();
  const mutation = useFilmMutations();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(StatusFilter.toSee);

  const [selectedFilm, setSelctedFilm] = useState<IFilm | null>(null);

  const filterableData = useMemo(
    () =>
      films.data?.map<FilterableFilm>(film => ({ ...film, lowerCaseTitle: film.name.toLowerCase() })),
    [films.data]
  );

  const { filteredData, hasMatchingText, searchTokens } = useMemo(() => {
    if (!filterableData) {
      return {}
    }

    let filteredData = filterableData;

    if (statusFilter === StatusFilter.seen) {
      filteredData = filteredData.filter(film => film.seen)
    } else if (statusFilter === StatusFilter.toSee) {
      filteredData = filteredData.filter(film => !film.seen)
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
  }, [filterableData, search, statusFilter])

  if (films.isError || !filteredData || !hasMatchingText) {
    return <Loader error={films.error} />
  }

  const isFilm = (film: INewFilm | IFilm): film is IFilm => {
    return (film as IFilm).id !== undefined;
  }

  const postFilm = (film: INewFilm | IFilm) => {
    if (isFilm(film)) {
      mutation.updateFilm.mutate(film);
    } else {
      mutation.addFilm.mutate(film);
    }
    setSelctedFilm(null);
  };

  const selectFilm = (id?: string) => {
    setModal({
      content: <EditFilm
        onPostFilm={postFilm}
        film={selectedFilm}
        onUnselectedFilm={() => setSelctedFilm(null)}
        onDeleteFilm={handleDeleteFilm}
      />,
      onOk: () => { console.log("save") }
    });

    const film = films.data?.find(el => el.id === id);

    setSelctedFilm(film || null);
  };


  const handleDeleteFilm = (id: string) => {
    setModal({
      title: "Delete film",
      message: "Are you sure you want to delete this film?",
      onOk: () => {
        mutation.deleteFilm.mutate(id);
        selectedFilm && setSelctedFilm(null);
      }
    });
  };

  const Title = (value: string, row: FilterableFilm) => {
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

    return <a href={row.url} target="_blank" rel="noreferrer" className="no-underline hover:underline"><FilmIcon className="h-5 w-5 inline mr-2" /> {res}</a>
  };

  const Actions = (value: string, row: FilterableFilm) => {
    const onClickSeen = () => mutation.updateFilmStatus.mutate({ id: row.id, status: !row.seen });

    return (
      <div className="flex justify-evenly m-1">
        <ActionButton onClick={onClickSeen}>
          {row.seen ?
            (<>
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </>
            ) : (
              <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            )}
        </ActionButton>
        <ActionButton onClick={() => selectFilm((selectedFilm?.id === row.id) ? undefined : row.id)} active={selectedFilm?.id === row.id}>
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
        <span className="overflow-hidden">{row.url}</span>
      </a>
    )
  };

  const columns = [
    {
      headClassName: "w-2/6",
      key: "name",
      render: Title,
      title: "Title",
    },
    {
      headClassName: "w-3/6",
      key: "url",
      render: URLcomponent,
      title: "URL",
    },
    {
      headClassName: "w-2/6 text-center",
      key: "id",
      render: Actions,
      title: "Actions",
    },
  ];

  return (
    <>
      <SearchPanel setSearch={setSearch} setStatusFilter={setStatusFilter} statusFilter={statusFilter} />
      <EditFilm
        onPostFilm={postFilm}
        film={selectedFilm}
        onUnselectedFilm={() => setSelctedFilm(null)}
        onDeleteFilm={handleDeleteFilm}
      />
      <div className="bg-white sm:rounded-lg shadow overflow-hidden min-h-96">
        <Table columns={columns} dataRows={filteredData} rowKey="id" selected={selectedFilm?.id} />
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

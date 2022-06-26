import { useMemo, useState } from 'react';
import { CheckIcon, XIcon } from '@heroicons/react/solid';
import Highlighter from 'react-highlight-words';
import Loader from './Loader';
import Table from './Table';
import { useFilms, useFilmMutations } from '../queries/queries';

import '../styles/App.css';
import { IFilm, INewFilm, StatusFilter } from '../types';
import SearchPanel from './SearchPanel';
import EditFilm from './EditFilm';

type FilterableFilm = IFilm & { lowerCaseTitle: string };

const FilmList = () => {
  const films = useFilms();
  const mutation = useFilmMutations();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(StatusFilter.all);

  const [selectedFilm, setSelctedFilm] = useState<IFilm | undefined>();

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
    } else if (statusFilter === StatusFilter.film) {
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

  const Seen = (value: boolean, row: FilterableFilm) => {
    const onClick = () => mutation.updateFilmStatus.mutate({ id: row.id, status: !row.seen });

    const res = value ? (
      <>
        <CheckIcon className="h-5 w-5 text-green-500 inline" />Yes
      </>
    ) : (
      <>
        <XIcon className="h-5 w-5 text-indigo-500 inline" onClick={onClick} />No
      </>
    );

    return <span className="cursor-pointer" onClick={onClick}>{res}</span>;
  }

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
    return <a href={row.url} target="_blank" rel="noreferrer" className="no-underline hover:underline">{res}</a>
  };

  const selectFilm = (id: string) => {
    const film = films.data?.find(el => el.id === id);

    setSelctedFilm(film);
  };

  function isFilm(film: INewFilm | IFilm): film is IFilm {
    return (film as IFilm).id !== undefined;
  }

  const postFilm = (film: INewFilm | IFilm) => {
    if (isFilm(film)) {
      mutation.updateFilm.mutate(film);
    } else {
      mutation.addFilm.mutate(film);
    }
    setSelctedFilm(undefined);
  };

  const deleteFilm = (id: string) => {
    mutation.deleteFilm.mutate(id);
    setSelctedFilm(undefined);
  };

  const Id = (value: string, row: FilterableFilm) => {
    return <span className="no-underline hover:underline cursor-pointer" onClick={() => selectFilm(row.id)}>{value}</span>
  };

  const columns = [
    {
      key: "id",
      title: "#",
      render: Id
    },
    {
      headClassName: "w-3/4",
      key: "name",
      render: Title,
      title: "Title",
    },
    {
      headClassName: "w-1/6",
      key: "seen",
      render: Seen,
      title: "Seen",
    },
  ];

  return (
    <>
      <SearchPanel setSearch={setSearch} setStatusFilter={setStatusFilter} statusFilter={statusFilter} />
      <EditFilm
        onPostFilm={postFilm}
        film={selectedFilm}
        onUnselectedFilm={() => setSelctedFilm(undefined)}
        onDeleteFilm={deleteFilm}
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

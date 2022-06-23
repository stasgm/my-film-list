import { useMemo, useState } from 'react';
import { CheckIcon, SearchIcon, XIcon } from '@heroicons/react/solid';
import Highlighter from 'react-highlight-words';
import ButtonGroup from './ButtonGroup';
import Loader from './Loader';
import Table from './Table';
import { useFilms } from '../queries/queries';

import '../styles/App.css';
import { IFilm, StatusFilter } from '../types';

type FilterableFilm = IFilm & { lowerCaseTitle: string, completed: boolean };

const FilmList = () => {
  const films = useFilms();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(StatusFilter.all);

  const filterableData = useMemo(
    () =>
      films.data?.map<FilterableFilm>(film => ({ ...film, lowerCaseTitle: film.name.toLowerCase(), completed: false })),
    [films.data]
  );

  const { filteredData, hasMatchingText, searchTokens } = useMemo(() => {
    if (!filterableData) {
      return {}
    }

    let filteredData = filterableData;

    if (statusFilter === StatusFilter.seen) {
      filteredData = filteredData.filter(film => film.completed)
    } else if (statusFilter === StatusFilter.film) {
      filteredData = filteredData.filter(film => !film.completed)
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

  const Seen = (value: boolean) =>
    value ? (
      <>
        <CheckIcon className="h-5 w-5 text-green-500 inline" />Yes
      </>
    ) : (
      <>
        <XIcon className="h-5 w-5 text-indigo-500 inline" />No
      </>
    )

  const Title = (value: string, row: FilterableFilm) => {
    const isMatching = hasMatchingText(row)
    return isMatching ? (
      <Highlighter
        autoEscape
        highlightClassName="font-bold text-black bg-yellow-300"
        searchWords={searchTokens || []}
        textToHighlight={value}
      />
    ) : (
      value
    )
  };

  const columns = [
    {
      key: "id",
      title: "#",
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
      <div className="bg-white sm:rounded-lg shadow overflow-hidden sm:mb-6 py-2">
        <div className="my-2 whitespace-nowrap sm:inline">
          <label
            className="text-gray-600 ml-4 mr-4 font-semibold w-14 inline-block sm:w-auto sm:text-sm"
            htmlFor="search"
          >
            Search
          </label>
          <div className="relative rounded-md shadow-sm inline-block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              className="focus:ring-indigo-500 focus:border-indigo-500 block pl-10 sm:text-sm border-gray-300 rounded-md placeholder-gray-400 w-auto sm:w-48 md:w-64"
              id="search"
              placeholder="Keywords"
              size={16}
              type="search"
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="my-2 whitespace-nowrap sm:inline sm:ml-2 md:ml-4">
          <label
            className="text-gray-600 ml-4 mr-4 font-semibold w-14 inline-block sm:w-auto sm:text-sm"
            htmlFor="search"
          >
            Status
          </label>
          <ButtonGroup>
            {/* Buttons use two handlers here: onClick for keyboard navigation, and onMouseDown for UI reactivity  */}
            <ButtonGroup.Button
              active={statusFilter === StatusFilter.all}
              onClick={() => setStatusFilter(StatusFilter.all)}
              onMouseDown={() => setStatusFilter(StatusFilter.all)}
            >
              All
            </ButtonGroup.Button>
            <ButtonGroup.Button
              active={statusFilter === StatusFilter.seen}
              onClick={() => setStatusFilter(StatusFilter.seen)}
              onMouseDown={() => setStatusFilter(StatusFilter.seen)}
            >
              Seen
            </ButtonGroup.Button>
            <ButtonGroup.Button
              active={statusFilter === StatusFilter.film}
              onClick={() => setStatusFilter(StatusFilter.film)}
              onMouseDown={() => setStatusFilter(StatusFilter.film)}
            >
              To see
            </ButtonGroup.Button>
          </ButtonGroup>
        </div>
      </div>

      <div className="bg-white sm:rounded-lg shadow overflow-hidden min-h-96">
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

  // return (
  //   <div className="app">
  //     <header className="app-header">
  //       <p>
  //         Films: ({filmCount.data || 0})
  //       </p>
  //       <p>
  //         {formattedList}
  //       </p>
  //       <></>
  //     </header>
  //   </div>
  // )
}

export default FilmList;

import { SearchIcon } from '@heroicons/react/solid';
import ButtonGroup from './ButtonGroup';

import '../styles/App.css';
import { StatusFilter } from '../types';

interface IProps {
  statusFilter: StatusFilter;
  setSearch: (text: string) => void;
  setStatusFilter: (status: StatusFilter) => void;
}

const SearchPanel = ({ statusFilter, setStatusFilter, setSearch }: IProps) => {
  return (
    <div className="bg-white sm:rounded-lg shadow overflow-hidden sm:mb-2 py-2">
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
  )
}

export default SearchPanel;
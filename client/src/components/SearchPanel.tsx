import { MagnifyingGlassIcon as SearchIcon } from '@heroicons/react/24/outline';
import ButtonGroup from './ButtonGroup';

import { ResourceTypeFilter, StatusFilter } from '../types';
interface IProps {
  statusFilter: StatusFilter;
  typeFilter: ResourceTypeFilter;
  addNewFilm: () => void;
  setSearch: (text: string) => void;
  setStatusFilter: (status: StatusFilter) => void;
  setTypeFilter: (status: ResourceTypeFilter) => void;
}

const FilterLabel = ({ title, htmlFor }: { title: string, htmlFor: string }) => {
  return (
    <label
      className="text-white sm:text-gray-600 sm:ml-4 sm:mr-4 font-semibold w-12 inline-block sm:w-auto sm:text-sm tv:text-lg mr-3"
      htmlFor={htmlFor}
    >
      {title}
    </label>
  )
}

const SearchPanel = ({ statusFilter, typeFilter, addNewFilm, setStatusFilter, setSearch, setTypeFilter }: IProps) => {
  return (
    <div className="sm:bg-gray-200 sm:rounded-lg sm:shadow overflow-hidden py-0 sm:py-2">
      <div className="whitespace-nowrap sm:inline items-center w-full relative rounded-md shadow-sm inline-block grow">
        <ButtonGroup.Button
          className="sm:ml-4 px-4 py-2 sm:w-40 w-full border text-sm tv:text-lg font-medium text-white rounded-lg hover:bg-green-700 bg-green-800"
          onClick={addNewFilm}
        >
          Add new film
        </ButtonGroup.Button>
      </div>
      <div className="my-2 whitespace-nowrap sm:inline flex items-center w-full">
        <FilterLabel title="Search" htmlFor="search" />
        <div className="relative rounded-md shadow-sm inline-block grow sm:grow-0 w-max">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-6 w-6 text-gray-400" />
          </div>
          <input
            className="focus:ring-indigo-500 focus:border-indigo-500 block pl-10 sm:text-sm tv:text-lg border-gray-300 rounded-md placeholder-gray-400 w-full sm:w-48 md:w-64"
            id="search"
            placeholder="Keywords"
            size={16}
            type="search"
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="my-2 whitespace-nowrap sm:inline flex items-center w-full">
        <FilterLabel title="Status" htmlFor="status" />
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
            active={statusFilter === StatusFilter.watch}
            onClick={() => setStatusFilter(StatusFilter.watch)}
            onMouseDown={() => setStatusFilter(StatusFilter.watch)}
          >
            Watch
          </ButtonGroup.Button>
        </ButtonGroup>
      </div>
      <div className="my-2 whitespace-nowrap sm:inline flex items-center w-full">
        <FilterLabel title="Type" htmlFor="type" />
        <ButtonGroup>
          {/* Buttons use two handlers here: onClick for keyboard navigation, and onMouseDown for UI reactivity  */}
          <ButtonGroup.Button
            active={typeFilter === ResourceTypeFilter.all}
            onClick={() => setTypeFilter(ResourceTypeFilter.all)}
            onMouseDown={() => setTypeFilter(ResourceTypeFilter.all)}
          >
            All
          </ButtonGroup.Button>
          <ButtonGroup.Button
            active={typeFilter === ResourceTypeFilter.film}
            onClick={() => setTypeFilter(ResourceTypeFilter.film)}
            onMouseDown={() => setTypeFilter(ResourceTypeFilter.film)}
          >
            Films
          </ButtonGroup.Button>
          <ButtonGroup.Button
            active={typeFilter === ResourceTypeFilter.serial}
            onClick={() => setTypeFilter(ResourceTypeFilter.serial)}
            onMouseDown={() => setTypeFilter(ResourceTypeFilter.serial)}
          >
            Serials
          </ButtonGroup.Button>
        </ButtonGroup>
      </div>
    </div>
  )
}

export default SearchPanel;

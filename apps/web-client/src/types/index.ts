export enum IResourceType {
  'film' = 0,
  'serial' = 1
}

export interface ISerialInfo {
  season?: number;
  episode?: number;
}

export interface IFilmInfo {

}

export interface IResource {
  id: string;
  name: string;
  url: string;
  seen?: boolean;
  type?: IResourceType;
  info?: ISerialInfo | IFilmInfo;
}

export interface IFilm extends IResource {
  id: string;
  name: string;
  url: string;
  seen?: boolean;
  type?: IResourceType;
}

export interface ISerial extends IResource {
  id: string;
  name: string;
  url: string;
  seen?: boolean;
  type?: IResourceType;
}

export interface INewFilm extends Omit<IFilm, 'id'> {
  id?: string;
};

export interface INewFilmState { id: string, status: boolean };

export enum StatusFilter {
  all,
  seen,
  watch,
};

export enum ResourceTypeFilter {
  'all' = -1,
  'film' = 0,
  'serial' = 1,
};

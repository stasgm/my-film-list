export enum IType {
  'film',
  'serial'
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
  type?: IType;
  info?: ISerialInfo | IFilmInfo;
}

export interface IFilm extends IResource {
  id: string;
  name: string;
  url: string;
  seen?: boolean;
  type?: IType;
}

export interface ISerial extends IResource {
  id: string;
  name: string;
  url: string;
  seen?: boolean;
  type?: IType;
}

export interface INewFilm extends Omit<IFilm, 'id'> {
  id?: string;
};

export interface INewFilmState { id: string, status: boolean };

export enum StatusFilter {
  all,
  seen,
  watch,
}

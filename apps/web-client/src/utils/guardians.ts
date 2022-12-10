import { IFilm, INewFilm, IResource, ISerial, IResourceType } from "../types";

const isResource = (film: INewFilm | IResource | null | undefined): film is IResource => {
  return (film as IResource)?.id !== undefined;
};

const isFilm = (film: INewFilm | IResource | null | undefined): film is IFilm => {
  return isResource(film) && film.type === IResourceType.film;
};

const isSerial = (film: INewFilm | IResource | null | undefined): film is ISerial => {
  return isResource(film) && film.type === IResourceType.serial;
};

export { isFilm, isSerial, isResource }

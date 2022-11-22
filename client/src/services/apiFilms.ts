import apiClient from "./apiClient";
import { IResource, INewFilm, INewFilmState } from "../types";

const filmsPath = '/api/films';


const filmsApi = {
  fetchFilms: async (): Promise<IResource[]> => {
    // const controller = new AbortController()
    // const data: CancelablePromise<IResource[]> = (async () => {
    //   try {
    //     const { data } = await request(`${filmsPath}`);
    //     return data;
    //   } catch (err) {
    //     return [];
    //   }
    // })();

    // data.cancel = () => controller.abort()

    try {
      const { data } = await apiClient.get(filmsPath);
      return data;
    } catch (err) {
      return [];
    }
  },

  fetchFilm: async (id: string): Promise<IResource> => {
    const { data } = await apiClient.get(`${filmsPath}/${id}`);
    return data;
  },

  addFilm: async (film: INewFilm): Promise<IResource> => {
    const { data } = await apiClient.post(filmsPath, film);
    return data;
  },

  updateFilm: async (film: IResource): Promise<IResource> => {
    const { data } = await apiClient.put(`${filmsPath}/${film.id}`, film);
    return data;
  },

  updateStatus: async (filmState: INewFilmState): Promise<IResource> => {
    const { data } = await apiClient.patch(`${filmsPath}/${filmState.id}`, { seen: filmState.status });
    return data;
  },

  deleteFilm: async (id: string): Promise<IResource> => {
    const { data } = await apiClient.delete(`${filmsPath}/${id}`);
    return data;
  },
}

export class FetchError<PayloadType> extends Error {
  method: string
  url: string
  status: number
  jsonData: PayloadType
  code: string

  constructor(method: string, url: string, status: number, code: string, jsonData: PayloadType) {
    super("API error")
    this.method = method
    this.url = url
    this.status = status
    this.jsonData = jsonData
    this.code = code
  }
}

export { filmsApi };

import axios from "axios";
import { IFilm } from "../types";

export class CancelablePromise<PayloadType> extends Promise<PayloadType> {
  public cancel?: () => void
}

const fetchApi = {
  fetchFilms: async (): CancelablePromise<IFilm[]> => {
    const controller = new AbortController()
    const data: CancelablePromise<IFilm[]> = (async () => {
      try {
        const { data } = await axios.get('/api/films');
        return data;
      } catch (err) {
        return [{}];
      }
    })();

    data.cancel = () => controller.abort()

    return data;
  },

  fetchFilm: async (id: string): CancelablePromise<IFilm> => {
    const { data } = await axios.get(`/api/films/${id}`);
    return data;
  },

  addFilm: async (film: IFilm): CancelablePromise<IFilm> => {
    const { data } = await axios.post(`/api/films`, film);
    return data;
  },

  updateFilm: async (id: string, film: IFilm): CancelablePromise<IFilm> => {
    const { data } = await axios.put(`/api/films/${id}`, film);
    return data;
  },

  updateStatus: async (id: string, status: boolean): CancelablePromise<IFilm> => {
    const { data } = await axios.patch(`/api/films/${id}`, { seen: status });
    return data;
  },

  deleteFilm: async (id: string): CancelablePromise<IFilm> => {
    const { data } = await axios.delete(`/api/films/${id}`);
    return data;
  },
}

export class FetchError<PayloadType> extends Error {
  method: string
  url: string
  status: number
  jsonData: PayloadType

  constructor(method: string, url: string, status: number, jsonData: PayloadType) {
    super("API error")
    this.method = method
    this.url = url
    this.status = status
    this.jsonData = jsonData
  }
}

export default fetchApi;
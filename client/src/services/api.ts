import axios from "axios";
import { IFilm } from "../types";

export class CancelablePromise<PayloadType> extends Promise<PayloadType> {
  public cancel?: () => void
}

const fetchApi = {
  fetchFilms: async (): CancelablePromise<IFilm[]> => {
    const controller = new AbortController()

    const data: CancelablePromise<IFilm[]> = (async () => {
      const { data } = await axios.get('/api/list');
      return data;
    })();

    data.cancel = () => controller.abort()

    return data;
  },

  fetchFilm: async (): CancelablePromise<IFilm> => {
    const { data } = await axios.get('/api/list/:id');
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

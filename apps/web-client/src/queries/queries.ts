import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IResource } from "../types";
import { filmsApi } from '../services/apiFilms';

const useFilmsQuery = <T>(select: (data: IResource[]) => T) => useQuery(['films'], filmsApi.fetchFilms, { select });

const useFilms = () => useFilmsQuery((films) => films);

const useFilm = (filmId: string) => useQuery(['films', filmId], () => filmsApi.fetchFilm(filmId));

const useFilmMutations = () => {
  const queryClient = useQueryClient();

  const addFilm = useMutation(filmsApi.addFilm, {
    onSuccess: () => {
      queryClient.invalidateQueries(['films']);
    }
  });

  const updateFilm = useMutation(filmsApi.updateFilm, {
    onSuccess: () => {
      queryClient.invalidateQueries(['films']);
    }
  });

  const deleteFilm = useMutation(filmsApi.deleteFilm, {
    onSuccess: () => {
      queryClient.invalidateQueries(['films']);
    }
  });


  // const addFilm = useMutation(
  //   (film: IResource) => filmsApi.addFilm(film),
  //   {
  //     onMutate: async (film) => {
  //       // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
  //       await queryClient.cancelQueries('films');

  //       // Snapshot the previous value
  //       const previousFilms = queryClient.getQueryData<IResource[]>('films');

  //       // Optimistically update to the new value
  //       if (previousFilms) {
  //         queryClient.setQueryData<IResource[]>('films', {
  //           ...previousFilms,
  //           ...film
  //         })
  //       }

  //       return { previousFilms }
  //     }
  //   }
  // );

  const updateFilmStatus = useMutation(filmsApi.updateStatus, {
    onSuccess: () => {
      queryClient.invalidateQueries(['films']);
    }
  });

  // const updateFilmStatus = useMutation((filmState: INewFilmState) => filmsApi.updateStatus(filmState.id, filmState.newStatus), {
  //   onSuccess: (data, variables) => {
  //     queryClient.setQueryData(['todo', { id: variables.id }], data)
  //   },
  // })

  // const updateFilmStatus = useMutation(
  //   ({ id, newStatus }: { id: string, newStatus: boolean }) => filmsApi.updateStatus(id, newStatus),
  //   {
  //     onMutate: async (filmStatus) => {
  //       // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
  //       await queryClient.cancelQueries(['films', filmStatus.id]);

  //       // Snapshot the previous value
  //       const previousFilms = queryClient.getQueryData(['films']);
  //       const previousFilms1 = queryClient.getQueryData(['films', { id: filmStatus }]);

  //       // Optimistically update to the new value
  //       if (previousFilms) {
  //         queryClient.setQueryData<IResource[] | undefined>('films', old => old?.map(i => i.id === filmStatus.id ? { ...i, filmStatus } : i))
  //       }

  //       return { previousFilms }
  //     },
  //     onError: (err, filmStatus, context) => {
  //       queryClient.setQueryData(
  //         "films",
  //         context ? context.previousFilms : context
  //       );
  //     },
  //     onSuccess: (data, filmStatus, context) => {
  //       queryClient.setQueryData(["films", { id: filmStatus.id }], data);
  //       // queryClient.setQueryData<IResource[] | undefined>('films', old => old?.map(i => i.id === (context?.previousFilms as IResource).id ? data : i))
  //     },
  //     onSettled: (data) => {
  //       queryClient.invalidateQueries(['films', data?.id]);
  //     },
  //   }
  // );

  return { updateFilmStatus, addFilm, updateFilm, deleteFilm };
};

export { useFilms, useFilm, useFilmMutations }

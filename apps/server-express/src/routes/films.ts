import express from 'express';

const router = express.Router()

import {
  getFilms,
  getFilm,
  createFilm,
  deleteFilm,
  updateFilm,
  patchFilm,
} from '../controllers/films';

router.get('/', getFilms)
router.get('/:id', getFilm)
router.post('/', createFilm)
router.put('/:id', updateFilm)
router.patch('/:id', patchFilm)
router.delete('/:id', deleteFilm)

export default router;

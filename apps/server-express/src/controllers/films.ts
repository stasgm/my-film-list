import { Request, Response } from "express";
import { ObjectId } from 'mongodb';
import { ApmHelper, ApmSpanType } from '@libs/apm';
import { IResourceType } from '@libs/types';

interface IDBFilm {
  _id: ObjectId;
  name: string;
  url: string;
  seen: boolean;
  type: IResourceType;
}

const mapFilm = (film: IDBFilm) => {
  return {
    id: film._id,
    name: film.name,
    url: film.url,
    seen: film.seen,
    type: film.type,
  };
};

type RequestT = (req: Request, res: Response) => Promise<void>;
// API
const getFilms: RequestT = async (req, res) => {
  const userId = req.auth?.payload.sub;
  const transaction = ApmHelper.startTransaction('Get films', ApmSpanType.API_REQUEST);
  const span = ApmHelper.startSpan('/api/films', ApmSpanType.API_REQUEST, {
    transaction,
    data: {
      userId,
    },
  });

  const collection = req.app.locals.collection;

  const films = await collection.find({ userId }).toArray();
  const list = films.map((i: IDBFilm) => mapFilm(i));

  res.send(list);

  ApmHelper.finishSpan(span);
  ApmHelper.finishTransaction(transaction);
};

const getFilm: RequestT = async (req, res) => {
  const userId = req.auth?.payload.sub;
  const transaction = ApmHelper.startTransaction('Get film by id', ApmSpanType.API_REQUEST);
  const span = ApmHelper.startSpan('/api/films/:id', ApmSpanType.API_REQUEST, {
    transaction,
    data: {
      userId,
    },
  });

  const id = new ObjectId(req.params.id);

  const collection = req.app.locals.collection;
  const film = await collection.findOne({ _id: id, userId });

  res.send(mapFilm(film));

  ApmHelper.finishSpan(span);
  ApmHelper.finishTransaction(transaction);
};

const createFilm: RequestT = async (req, res) => {
  const userId = req.auth?.payload.sub;
  const transaction = ApmHelper.startTransaction('Add a new film', ApmSpanType.API_REQUEST);
  const span = ApmHelper.startSpan('/api/films', ApmSpanType.API_REQUEST, { transaction });

  const newFilm = req.body
    ? {
      name: req.body.name,
      url: req.body.url,
      seen: req.body.seen || false,
      type: req.body.type || 0,
      userId,
    }
    : {
      error: 'body is empty',
    };

  if (!req.body) {
    ApmHelper.finishSpan(span);
    ApmHelper.finishTransaction(transaction);
    res.sendStatus(400);
  } else {
    const collection = req.app.locals.collection;

    const result = await collection.insertOne(newFilm);

    ApmHelper.finishSpan(span);
    ApmHelper.finishTransaction(transaction);

    res.send({
      id: result.insertedId,
      ...newFilm,
    });
  }
};

const deleteFilm: RequestT = async (req, res) => {
  const userId = req.auth?.payload.sub;
  const transaction = ApmHelper.startTransaction('Delete film', ApmSpanType.API_REQUEST);
  const span = ApmHelper.startSpan('/api/films', ApmSpanType.API_REQUEST, { transaction });

  const id = new ObjectId(req.params.id);

  const collection = req.app.locals.collection;

  const result = await collection.findOneAndDelete({ _id: id, userId });
  const film = result.value;

  res.send(mapFilm(film));

  ApmHelper.finishSpan(span);
  ApmHelper.finishTransaction(transaction);
};

const updateFilm: RequestT = async (req, res) => {
  const userId = req.auth?.payload.sub;
  const transaction = ApmHelper.startTransaction('Update film', ApmSpanType.API_REQUEST);
  const span = ApmHelper.startSpan('/api/films/:id', ApmSpanType.API_REQUEST, { transaction });

  const filmData = req.body
    ? {
      name: req.body.name,
      url: req.body.url,
      seen: req.body.seen || false,
      type: req.body.type || 0,
      userId,
    }
    : {
      error: 'body is empty',
    };

  if (!req.body) {
    ApmHelper.finishSpan(span);
    ApmHelper.finishTransaction(transaction);

    res.sendStatus(400);
  } else {

    const id = new ObjectId(req.params.id);

    const collection = req.app.locals.collection;

    const result: { value: IDBFilm } = await collection.findOneAndUpdate(
      { _id: id, userId },
      { $set: filmData },
      { returnDocument: 'after' },
    );

    const film = result.value;

    ApmHelper.finishSpan(span);
    ApmHelper.finishTransaction(transaction);

    res.send(mapFilm(film));
  }
};

const patchFilm: RequestT = async (req, res) => {
  const userId = req.auth?.payload.sub;
  const transaction = ApmHelper.startTransaction('Update film', ApmSpanType.API_REQUEST);
  const span = ApmHelper.startSpan('/api/films/:id', ApmSpanType.API_REQUEST, { transaction });

  const filmData = req.body
    ? {
      ...req.body,
    }
    : {
      error: 'body is empty',
    };

  if (!req.body) {
    ApmHelper.finishSpan(span);
    ApmHelper.finishTransaction(transaction);

    res.sendStatus(400);
  } else {

    const id = new ObjectId(req.params.id);

    const collection = req.app.locals.collection;

    const result: { value: IDBFilm } = await collection.findOneAndUpdate(
      { _id: id, userId },
      { $set: filmData },
      { returnDocument: 'after' },
    );

    const film = result.value;

    ApmHelper.finishSpan(span);
    ApmHelper.finishTransaction(transaction);

    res.send(mapFilm(film));
  }
};

export {
  getFilms,
  getFilm,
  createFilm,
  patchFilm,
  updateFilm,
  deleteFilm
}

import * as express from 'express';

export const notFound = (res: express.Response) => {
  res.status(404).send('Not found');
};

export const badRequest = (res: express.Response) => {
  res.status(400).send('Bad request');
};

export const internalServerError = (res: express.Response) => {
  res.status(500).send('Internal Server Error');
};

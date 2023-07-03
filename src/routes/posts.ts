import * as express from 'express';
import { prisma } from '../common/prisma';
import axios from 'axios';
import { badRequest, internalServerError } from '../common/errors';
import { Post } from '@prisma/client';
import { PaginatedResponse } from '../common/paginated-response';

const postsRouter = express.Router();
postsRouter.get('/', async (req, res) => {
  const userId = Number.isInteger(+req.query.userId) ? +req.query.userId : null;

  const page = Number.isInteger(+req.query.page) ? +req.query.page : 1;
  const limit = Number.isInteger(+req.query.limit) ? +req.query.limit : 4;

  if (!userId) return badRequest(res);
  const posts = await getPosts(userId, page, limit).catch((e) =>
    internalServerError(res)
  );
  res.send(posts);
});

postsRouter.delete('/:id', async (req, res) => {
  const id = Number.isInteger(+req.params.id) ? +req.params.id : null;
  if (!id) return badRequest(res);

  const deleted = await prisma.post.delete({ where: { id } }).catch(() => null);
  if (!deleted) return internalServerError(res);

  res.status(204).send();
});

const getPosts = async (
  userId: number,
  page = 1,
  limit = 4
): Promise<PaginatedResponse<Post>> => {
  const posts = await getPostsFromDB(userId, page, limit);
  if (!posts.totalCount) {
    const postsToSave = await getPostsFromExternalAPI(userId).then((posts) =>
      posts.map(({ id, ...post }) => post)
    );
    await prisma.post.createMany({ data: postsToSave });
  }

  return getPostsFromDB(userId, page, limit);
};
const getPostsFromDB = async (
  userId: number,
  page: number,
  limit: number
): Promise<PaginatedResponse<Post>> => {
  const findMany = prisma.post.findMany({
    where: { userId },
    skip: (page - 1) * limit,
    take: limit,
  });
  const count = prisma.post.count({ where: { userId } });
  const [posts, totalCount] = await Promise.all([findMany, count]);

  return new PaginatedResponse<Post>(posts, page, totalCount);
};

const getPostsFromExternalAPI = async (userId: number): Promise<Post[]> => {
  const url = process.env.EXTERNAL_API + `/posts?userId=${userId}`;
  return await axios.get<Post[]>(url).then((r) => r.data);
};

export { postsRouter };

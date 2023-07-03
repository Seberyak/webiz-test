import * as express from 'express';
import axios from 'axios';
import * as process from 'process';
import { User } from '../types/user';
import { sortAndPaginate } from '../common/utils';
import { PaginatedResponse } from '../common/paginated-response';

const usersRouter = express.Router();
usersRouter.get('/', async (req, res) => {
  const page = Number.isInteger(+req.query.page) ? +req.query.page : 1;
  const limit = Number.isInteger(+req.query.limit) ? +req.query.limit : 4;

  const data = await fetchUsers(page, limit);
  await res.send(data);
});
const fetchUsers = async (
  page = 1,
  limit = 4
): Promise<PaginatedResponse<User>> => {
  const url = process.env.EXTERNAL_API + '/users';
  const users = await axios.get<User[]>(url).then((r) => r.data);
  const totalCount = users.length;

  const start = (page - 1) * limit;
  const end = start + limit;

  const sorted = sortAndPaginate(start, end, users, 'name');
  return new PaginatedResponse(sorted, page, totalCount);
};

export { usersRouter };

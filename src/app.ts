import { config } from 'dotenv';
config();
import * as express from 'express';

import { usersRouter as usersRouter } from './routes/users';
import { prisma } from './common/prisma';
import { postsRouter } from './routes/posts';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/users', usersRouter);
app.use('/posts', postsRouter);

const port = +process.env.PORT || 3000;

app.listen(port, async () => {
  console.log('server is running');
  await prisma.$connect();
});

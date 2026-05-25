import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import usersRouter from './routes/users';

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/users', usersRouter);

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});

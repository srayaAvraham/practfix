import express from 'express';
import { json } from 'body-parser';
import { userRouter } from './routes/user';
import mongoose from 'mongoose';
import { VideoRouter } from './routes/video';
import { config } from './config';
const app = express();
const uri: string = config.mongoURL;

mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true }, (err) => { })

app.use(json());

app.use('/api/user/', userRouter);
app.use('/api/video/', VideoRouter);

app.listen(3002, () => {
  console.log(`server is listening on port 3002`);
});
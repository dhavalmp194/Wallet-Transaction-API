import express, { Request, Response } from 'express';
import path from 'path';
import 'dotenv/config';

const app = express();
const port = 3000;

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
import TransactionContoller from './controllers/TransactionContoller';
app.use('/', TransactionContoller);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

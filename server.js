import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import cors from 'cors'
import categoryroutes from './routes/categoryroutes.js';
import authroutes from './routes/authroutes.js';
import productroutes from './routes/productroutes.js';
import path from 'path';
import { fileURLToPath} from 'url';
import { dirname } from 'path';


//config env
dotenv.config();

//esmodule fix
const __filename= fileURLToPath(import.meta.url);
const __dirnname= path.dirname(__filename)

//db connection
connectDB();

//rest object
const app = express();

//mmiddleware
app.use(cors())
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, './client/build')))

//routing
app.use('/api/auth', authroutes);
app.use('/api/category', categoryroutes);
app.use('/api/product', productroutes);

//rest api
app.use('*', function(req, res) {
    res.sendFile(path.join(__dirname, './client/build/index.html'))
})



//server port
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));

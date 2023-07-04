import dotenv from 'dotenv';
import path from 'path';

const envPath: string = path.resolve(__dirname, '../env/test.env');

dotenv.config({ path: envPath });

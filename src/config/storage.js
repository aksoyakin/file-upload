import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..', '..');

export const storagePath = process.env.STORAGE_PATH || path.join(rootDir, 'uploads');
export const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

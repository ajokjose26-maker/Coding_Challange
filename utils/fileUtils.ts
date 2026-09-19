import * as fs from 'fs';
import * as path from 'path';

export function readJsonFile<T>(relativePath: string): T {
  const filePath = path.resolve(__dirname, '..', relativePath);
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

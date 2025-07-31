import fs from 'fs';
import path from 'path';

export const exportData = (data, fileName = 'backup.json') => {
  const filePath = path.join('backups', fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  return filePath;
};

export const importData = (filePath) => {
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
};

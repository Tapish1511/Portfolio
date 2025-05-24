import fs from 'node:fs'
import {parentPort, workerData} from 'worker_threads'

if(workerData?.action === 'image')
{
    fs.writeFileSync(workerData.filePath, workerData.data, 'base64');
}
else
{
    fs.writeFileSync(workerData.filePath, JSON.stringify(workerData.data));
}
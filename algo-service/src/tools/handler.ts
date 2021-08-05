import fs from "fs";
const { PythonShell } = require("python-shell");
import path from 'path';
import extract from "extract-zip";
import rimraf from "rimraf";
import util from "util";
import minioService from "../minioService";
import mongoService from '../mongoService';
// const { bucketName } = require('../../config');

/**
 * Compare between physio and patien 
 * @param {*} videoId mongoId of patient video
 * @param {*} fileName name of filename from openpose
 * @param {*} patientFileZipPath temporary path of json file
 * @param {*} bucketName name of bucket in minio
 */
const patientHandler = async (videoId: string, fileName: string, patientFileZipPath: string, bucketName: string): Promise<void> => {
    // init path 
    const physioJsonsPathMinio: string = (await mongoService.getPhysioDetailsByPracticeId(videoId)).jsonPath;
    const pathInBucket: string = physioJsonsPathMinio.split('/').splice(-2).join('/');
    const physioFileZipPath: string = path.resolve(path.join(__dirname, `../../temp/${physioJsonsPathMinio.split('/').splice(-1).join('/')}`));
    // Fetch jsonzip of physio from minio
    await minioService.fetchjsonZip(bucketName, pathInBucket, physioFileZipPath);
    const dirOutputExpert: string = physioFileZipPath.split(".").slice(0, -1).join(".");
    const dirOutputPatient: string = patientFileZipPath.split(".").slice(0, -1).join(".");
    // Extract zip files
    await extract(patientFileZipPath, { dir: dirOutputPatient });
    await extract(physioFileZipPath, { dir: dirOutputExpert });
    console.log("Extraction complete");
    const pyRun = util.promisify(PythonShell.run).bind(PythonShell);
    // Run DTW and graphs from python
    const outputPython = await pyRun(path.join(__dirname, "../../../DTW-algorithm/main.py"), {
        args: [
            dirOutputExpert,
            dirOutputPatient,
        ],
    });
    try {
        //Upload files of json and graphs to minio and save path in mongo
        const jsonPath = await minioService.uploadFile(bucketName, patientFileZipPath, `jsonzips/${fileName}`);
        console.log('[x] save jsons in minio');
        const twoLineGraphPath = await minioService.uploadFile(bucketName, outputPython[0], `twolinesgraph/${path.parse(outputPython[0]).base}`);
        console.log('[x] save two Line Graph Path in minio');
        const optimalGraphPath = await minioService.uploadFile(bucketName, outputPython[1], `optimalgraph/${path.parse(outputPython[1]).base}`);
        console.log('[x] save optimal Graph Path in minio');
        await mongoService.updateVideoDetails(videoId, { jsonPath, optimalGraphPath, twoLineGraphPath, score: outputPython[2], status: 'success' });
        console.log('[x] save minio Paths and score in mongo');
    } catch (error) {
        console.error(`An error has accourred while trying to save json files of id: ${videoId}`);
        throw error;
    }
    // Delete all file temporary
    fs.unlinkSync(outputPython[0]);
    fs.unlinkSync(outputPython[1]);
    rimraf.sync(dirOutputPatient);
    rimraf.sync(dirOutputExpert);
    fs.unlinkSync(physioFileZipPath);
    console.log("finished");
};

/**
 * Save jsons of physio in minio
 * @param {*} videoId mongoId of patient video
 * @param {*} fileName name of filename from openpose
 * @param {*} patientFileZipPath temporary path of json file
 * @param {*} bucketName name of bucket in minio
 */
const physioHandler = async (videoId: string, fileName: string, patientFileZipPath: string, bucketName: string) => {
    try {
        // Save jso of physio in minio
        const minioPath: string = await minioService.uploadFile(bucketName, patientFileZipPath, `jsonzips/${fileName}`);
        console.log('[x] save jsons in minio');
        // Update status in mongo
        await mongoService.updateVideoDetails(videoId, { jsonPath: minioPath, status: 'success' });
    } catch (error) {
        console.error(`An error has accourred while trying to save json files of id: ${videoId}`);
        throw error;
    }
};

export {
    patientHandler,
    physioHandler,
}
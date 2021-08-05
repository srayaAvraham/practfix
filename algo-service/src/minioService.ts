import { Client } from "minio";
import fs from 'fs';
// import path from 'path';
import config from './config';
const minioConfig = config.minio;

const minioBaseURL = minioConfig.minioBaseURL;
const minioClient = new Client({
    endPoint: minioConfig.endPoint,
    port: minioConfig.port,
    useSSL: minioConfig.useSSL,
    accessKey: minioConfig.accessKey,
    secretKey: minioConfig.secretKey,
});

/**
 * 
 * @param bucketName bucket name in minio
 * @param filePath path in temp dir
 * @param pathInMinio path to upload in minio
 * @returns 
 */
const uploadFile = async (bucketName: string, filePath: string, pathInMinio: string): Promise<string> => {
    const fileStream = fs.createReadStream(filePath)
    const fileStat = fs.statSync(filePath);
    try {
        await minioClient.putObject(bucketName, pathInMinio, fileStream, fileStat.size);
        return `${minioBaseURL}/${bucketName}/${pathInMinio}`;
    } catch (error) {
        throw error;
    }
};

/**
 * 
 * @param bucketName bucket name in minio
 * @param pathInMinio path to fetch in minio
 * @param filePath path to store in temp dir
 * @returns 
 */
const fetchjsonZip = async (bucketName: string, pathInMinio: string, filePath: string): Promise<string> => {
    try {
        await minioClient.fGetObject(bucketName, pathInMinio, filePath);
        return filePath;
    } catch (error) {
        throw error;
    }
};

export default {
    uploadFile,
    fetchjsonZip,
};




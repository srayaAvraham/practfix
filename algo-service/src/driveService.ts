import fs from "fs";
import readline from "readline";
import util from 'util';
import path from 'path';
import { storage_v1 } from "googleapis";
const { google } = require("googleapis");
const getfilelist = require("google-drive-getfilelist");


// If modifying these scopes, delete token.json.
const SCOPES = [
  "https://www.googleapis.com/auth/drive.metadata.readonly",
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/drive.file",
];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH: string = path.join(__dirname, '../token.json');

/**
 * Get file from googledrive by folderId and name of file
 * @param folderId 
 * @param filename 
 * @returns 
 */
const getFile = async (folderId: string, filename: string): Promise<string> => {
  const { client_secret, client_id, redirect_uris } = JSON.parse(fs.readFileSync(path.join(__dirname, '../credentials.json'), 'utf-8')).installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );
  let token: Object
  try {
    token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
  } catch (error) {
    try {
      token = await getAccessToken(oAuth2Client);

    } catch (error) {
      console.log(error)
    }
  } finally {
    oAuth2Client.setCredentials(token);
    // Get fileId from google drive
    const fileId = await getfileId(oAuth2Client, folderId, filename);
    if (fileId) {
      // Get file from google drive
      const path: string = await getFileById(oAuth2Client, fileId, filename);
      // Delete file from google drive
      await deleteFileById(oAuth2Client, fileId);
      console.log(`delete file ${filename} from google drive`);
      return path;
    }
    return null;
  }
};


/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
async function getAccessToken(oAuth2Client: any): Promise<Object> {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  // Prepare readline.question for promisification
  // @ts-expect-error
  (rl.question[util.promisify.custom] as any) = (question: any) => {
    return new Promise((resolve) => {
      rl.question(question, resolve);
    });
  };
  const code = await util.promisify(rl.question)('Enter the code from that page here: ');
  //   const {code, err} = await question("Enter the code from that page here: ");
  rl.close()
  const getToken = util.promisify(oAuth2Client.getToken).bind(oAuth2Client);
  const token = await getToken(code);
  // Store the token to disk for later program executions
  fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
    if (err) return console.error(err);
    console.log("Token stored to", TOKEN_PATH);
  });

  return token;
}

/**
 * Get file by id
 * @param auth 
 * @param folderId 
 * @param filename 
 * @returns 
 */
async function getfileId(auth: any, folderId: string, filename: string): Promise<string> {
  const resource = {
    auth: auth,
    id: folderId,
    fields: "files(name,id)",
  };
  const GetFileList = util.promisify(getfilelist.GetFileList);
  let res = await GetFileList(resource)
  let fileDetails = res.fileList[0].files.find((x: {name: string, id: string}) => x.name == filename);
  return fileDetails ? fileDetails.id : null;
}

/**
 * Delete file from google drive by id
 * @param auth 
 * @param fileId 
 */
const deleteFileById = async (auth: any, fileId: string): Promise<void> => {
  const drive = google.drive({ version: "v3", auth });
  await drive.files.delete({ fileId });
};

/**
 * Get list of file from google drive
 * @param auth 
 * @param query 
 * @returns 
 */
const getFilelist = async (auth: any, query: string) => {
  if (query) {
    const drive = google.drive({ version: "v3", auth });
    const res = await drive.files.list({
      q: query,
      fields: 'files(id, name)',
      spaces: 'drive',
    })
    return res;
  } else {
    console.log(`cant bring query`);
  }
}

/**
 * Get file from google drive
 * @param auth 
 * @param fileId 
 * @param filename 
 * @returns 
 */
const getFileById = async (auth: any, fileId: string, filename: string): Promise<string> => {
  if (fileId) {
    const drive = google.drive({ version: "v3", auth });
    const res = await drive.files.get({ fileId, alt: "media" }, { responseType: "stream" });
    return new Promise((resolve, reject) => {
      const filePath = path.join(__dirname, `../temp/${filename}`);
      console.log(`writing to ${filePath}`);
      const dest = fs.createWriteStream(filePath);
      // let progress = 0;

      res.data
        .on("end", () => {
          console.log("Done downloading file.");
          dest.end();
          resolve(path.resolve(filePath));
        })
        .on("error", (err: any) => {
          console.error("Error downloading file.");
          reject(err);
        })
        .pipe(dest);
    });
  } else {
    console.log(`the file ${filename} not exist`);
  }
}

export {
  getFile,
};

// 1. Google Cloud Storage interactions des fichiers
// Créer deux buckets GCS : un où on peut upload une vidéo, puis un autre où les vidéos uploader seront "processed"
// Vider les repertoires raw et processed une fois la vidéo traitée
// On a besoin que notre video_processing_service puisse:
//          - télécharger une vidéo depuis GCS
//          - traiter la vidéo
//          - publier la vidéo traitée dans GCS

import { Storage } from "@google-cloud/storage";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";

const storage = new Storage();

const rawVideoBucketName =  "SD-videos-raw";
const processedVideoBucketName = "SD-videos-processed";

const localRawVideoPath = "./videos-raw";
const localProcessedVideoPath = "./videos-processed";

// Creation du répertoire contenant les vidéos à traiter et celles déjà traitées
export function setupDirectories() {
    ensureDirectoryExistence(localRawVideoPath);
    ensureDirectoryExistence(localProcessedVideoPath);
}


/**
 * @param rawVideoName - Le nom du fichier pré-conversion {@link localRawVideoPath}
 * @param processedVideoName - Le nom du fichier post-conversion {@link localProcessedVideoPath}
 * @returns - Une promesse résolue dès que la vidéo est convertie
 */
export function convertVideo(rawVideoName: string, processedVideoName: string) {
    return new Promise<void> ((resolve, reject) => {
        ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
            .outputOptions("-vf", "scale=-1:360") // 360p
            .on("end", function() {
                console.log("Video processing finished successfully.");
                resolve();
            })
            .on("error", function(err: any) {
                console.log(`An error orrcured: ${err.message}`); 
                reject(err);
            })
            .save(`${localProcessedVideoPath}/${processedVideoName}`);
    });
}


/**
 * @param fileName - Le nom du fichier à télécharger depuis 
 * {@link rawVideoBucketName} à l'intéreur de 
 * {@link localRawVideoPath}.
 * @returns - Une promesse résolue quand le fichier est téléchargé 
 */
export async function downloadRawVideo(fileName: string) {
    await storage.bucket(rawVideoBucketName)
        .file(fileName)
        .download({ destination: `${localRawVideoPath}/${fileName}`});
    
    console.log(
        `gs://${rawVideoBucketName}/${fileName} downloaded to ${localRawVideoPath}/${fileName}`
    );
}


/**
 * @param fileName - Le nom du fichier à transférer depuis 
 * {@link localProcessedVideoPath} à l'intéreur de 
 * {@link processedVideoBucketName}.
 * @returns - Une promesse résolue quand le fichier est transféré 
 */
export async function uploadProcessedVideo (fileName: string) {
    const bucket = storage.bucket(processedVideoBucketName);

    // Télécharger la vidéo dans le bucket GCS
    await bucket.upload(`${localProcessedVideoPath}/${fileName}`, {
            destination: fileName,
    });
    console.log(`${localProcessedVideoPath}/${fileName} uploaded to gs://${processedVideoBucketName}/${fileName}.`);

    // Mettre la vidéo accessible publiquement
    await bucket.file(fileName).makePublic();
}


/**
 * @param fileName - Le nom du fichier à supprimer du dossier {@link localRawVideoPath}
 * @returns - Une promesse résolue dès que le fichier à bien été supprimé.
 */
export function deleteRawVideo(fileName: string) {
    return deleteFile(`${localRawVideoPath}/${fileName}`);
}


/**
 * @param fileName - Le nom du fichier à supprimer du dossier {@link localProcessedVideoPath}
 * @returns - Une promesse résolue dès que le fichier à bien été supprimé.
 */
export function deleteProcessedVideo(fileName: string) {
    return deleteFile(`${localProcessedVideoPath}/${fileName}`);
}


/**
 * @param filePath - Le chemin contenant le fichier à détruire
 * @returns - Une promesse réqolue quand le fichier est détruit
 */
function deleteFile(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log(`Failed to delete file at ${filePath}`, err);
                    reject(err);
                } else {
                    console.log(`File deleted at ${filePath}`)
                    resolve();
                }
            });
        } else {
            console.log(`File not found at ${filePath}, skipping the delete.`);
            // reject ou resolve ?
            resolve();
        }
    });
}


/**
 * Vérifier si le répertoire qui contient les vidéos existe, sinon le créer
 * @param {string} dirPath - Le chemin à vérifier
 */
function ensureDirectoryExistence(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, {recursive: true}); // recursive: true permet la création de répertoires imbriqués
        console.log(`Direcotry created at ${dirPath}`);
    } else {
        console.log(`Directory already exists at ${dirPath}`);
    }
}
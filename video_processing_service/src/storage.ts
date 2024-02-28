// 1. Google Cloud Storage interactions des fichiers
// Créer deux buckets GCS : un où on peut upload une vidéo, puis un autre où les vidéos uploader seront "processed"
// Vider les repertoires raw et processed une fois la vidéo "processed"
// On a besoin que notre video_processing_service puisse:
//          - télécharger une vidéo depuis GCS
//          - traiter la vidéo
//          - publier la vidéo tratée dans GCS

import { Storage } from "@google-cloud/storage";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import { resolve } from "path";

const storage = new Storage();

const rawVideoBucketName =  "SD-videos-raw";
const processedVideoBucketName = "SD-videos-processed";

const localRawVideoPath = "./videos-raw";
const localProcessedVideoPath = "./videos-processed";

// Creation du répertoire contenant les vidéos à traiter et celles déjà traitées
export function setupDirectories() {
}

/**
 * @param rawVideoName - Le nom du fichier pré-conversion {@link localRawVideoPath}
 * @param processedVideoName - Le nom du fichier post-conversion {@link localProcessedVideoPath}
 * @returns - Une promesse résolue dès que la vidéo est convertie
 */
export function convertVideo(rawVideoName: string, processedVideoName: string) {
    return new Promise (resolve, reject) => {
        ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
            .outputOptions("-vf", "scale=-1:360") // 360p
            .on("end", function() {
                console.log("Video processing finished successfully.");
                resolve();
            })
            .on("error", function(err: any) {
                console.log(`An error orrcured: ${err.message}`); 
            })
            .save(`${localProcessedVideoPath}/${processedVideoName}`);
    }
}
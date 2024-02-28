// 1. Google Cloud Storage interactions des fichiers

import { Storage } from "@google-cloud/storage";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";

// Creation du répertoire contenant les vidéos à traiter
export function setupDirectories() {

}

/**
 * @param rawVideoName - Le nom du fichier pré-conversion {@link localRawvideoPath}
 * @param processedVideoName - Le nom du fichier post-conversion {@link localProcessedVideoPath}
 * @returns - Une promesse résolue dès que la vidéo est convertie
 */
export function convertVideo(rawVideoName: string, processedVideoName: string) {

    
}
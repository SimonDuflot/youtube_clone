import express from "express";
import ffmpeg from "fluent-ffmpeg";
import { setupDirectories } from "./storage";

// Créer les répertoires locales qui contiendront les vidéos
setupDirectories();

const app = express();
app.use(express.json());

// app.get("/", (req, res) => {
//     res.send("Hello World !");
// });


// // Mettre la function call dans un autre fichier ? Is it cleaner ?
// app.post("/process-video", (req, res) => {
//     // Récupérer le chemin de la vidéo à convertir et la donner au body de la request
//     const inputFilePath = req.body.inputFilePath;
//     const outputFilePath = req.body.outputFilePath;

//     if (!inputFilePath || !outputFilePath){
//         let missingPaths = [];
//         if (!inputFilePath){
//             missingPaths.push(`${inputFilePath}`);
//         }
//         if (!outputFilePath){
//             missingPaths.push(`${outputFilePath}`);
//         }
//         res.status(400).send(`Bad Request: Missing file path => ${missingPaths.join()}` );
//     }  
// });

// Traiter un fichier vidéo depuis GCS et en modifier la qualité en 360p
app.post('/process-video', (req,res) => {
    // Récupère le bucket dans GCS ey le nom du fichier depuis Cloud Pub/Sub service de message
    // Cloud Pub/Sub va nous permettre de télécharger et distribuer nos données de manière asynchronous (sans avoir à attendre que l'utilisateur recoive les données, ou qu'il ait besoin de fournir une saisie). 
    // Cloud Pub/Sub fonctionne comme une queue. A chaque fois qu'une vidéo sera téléchargée dans le bucket GCS, Pub/Sub notifiera notre app.post 
    let data;
    try {
        const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
        data = JSON.parse(message);
        // on vérifie si le fichier existe depuis l'objet data avec la propriété name
        if (!data.name) {
            throw new Error('Invalid message payload received');
        }
    } catch (error) {
        console.error(error);
        return res.status(400).send('Bad Request: missing filename.');
    }
});

const port = process.env.PORT || 3000; 
app.listen(port, () => {
    console.log(
        `Video processing service listening at http://localhost:${port}`)
});
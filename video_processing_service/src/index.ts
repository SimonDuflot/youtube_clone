import express from "express";
import ffmpeg from "fluent-ffmpeg";

const app = express();
app.use(express.json());

// app.get("/", (req, res) => {
//     res.send("Hello World !");
// });


// Mettre la function call dans un autre fichier ? Is it cleaner ?
app.post("/process-video", (req, res) => {
    // Récupérer le chemin de la vidéo à convertir et la donner au body de la request
    const inputFilePath = req.body.inputFilePath;
    const outputFilePath = req.body.outputFilePath;

    if (!inputFilePath || !outputFilePath){
        let missingPaths = [];
        if (!inputFilePath){
            missingPaths.push(`${inputFilePath}`);
        }
        if (!outputFilePath){
            missingPaths.push(`${outputFilePath}`);
        }
        res.status(400).send(`Bad Request: Missing file path => ${missingPaths.join()}` );
    }

    
    ffmpeg(inputFilePath)
        .outputOptions("-vf", "scale=-1:360") // 360p
        .on("end", function() {
            res.status(200).send("Video processing finished successfully.");
        })
        .on("error", function(err: any) {
            console.log(`An error orrcured: ${err.message}`); 
            res.status(500).send(`Internal Server Error: ${err.message}`);
        })
        .save(outputFilePath);
});

const port = process.env.PORT || 3000; 
app.listen(port, () => {
    console.log(
        `Video processing service listening at http://localhost:${port}`)
});
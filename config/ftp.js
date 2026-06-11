const ftp = require("basic-ftp");
const fs = require("fs");

const ftpConfig = {
    host: "127.0.0.1",
    user: "ftpuser",
    password: "Chance123.",
    secure: false,  
};

async function uploadImage(localFilePath, remoteFilePath) {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        client.ftp.verbose = true;
        await client.access(ftpConfig);


        if (!fs.existsSync(localFilePath)) {
            console.error("❌ Fichier introuvable:", localFilePath);
            return false;
        }

        await client.uploadFrom(localFilePath, remoteFilePath);
        console.log(`✅ Fichier envoyé sur le serveur FTP : ${remoteFilePath}`);

        console.log("✅ Image envoyée avec succès :", remoteFilePath);
        return remoteFilePath;
    } catch (err) {
        console.error("Erreur FTP:", err);
        return false;
    } finally {
        client.close();
    }
}

module.exports = { uploadImage };

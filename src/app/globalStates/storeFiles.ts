import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { getDatabase, ref as dbRef, set } from "firebase/database";
import { initializeApp } from "firebase/app";
import { uploadBytesResumable } from "firebase/storage";
import firebaseConfig from "../FirebaseData.json"


const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const database = getDatabase(app);
interface FileWithPreview extends File {
  preview?: string;
}
// zapisywanie plików w bazie
export const handleFileUpload = async (files:FileWithPreview[]) => {
    if (!files||!files.length) return;

    for (const file of files) {
        const storageRef = ref(storage, `uploads/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
    
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
          },
          (error) => {
            console.error("Upload failed:", error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("File available at", downloadURL);
    
            const fileRef = dbRef(database, `files/${file.name}`);
            await set(fileRef, {
              name: file.name,
              url: downloadURL,
              createdAt: new Date().toISOString(),
            });
          }
        );
      }
  };


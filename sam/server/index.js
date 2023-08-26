const express = require('express');
const multer = require('multer');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

app.use(cors());

mongoose.connect('mongodb://localhost:27017/fileDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const fileSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  data: Buffer,
});

const File = mongoose.model('File', fileSchema);

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 10, // 10 MB limit
  },
});

app.post('/upload', upload.single('file'), async (req, res) => {
  const { originalname, mimetype, buffer } = req.file;

  const file = new File({
    filename: originalname,
    contentType: mimetype,
    data: buffer,
  });

  try {
    await file.save();
    res.status(200).send('File uploaded successfully');
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Server Error');
  }
});

app.get('/files', async (req, res) => {
  try {
    const files = await File.find({}, 'filename'); 
    res.status(200).json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).send('Server Error');
  }
});

app.get('/download/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const file = await File.findOne({ filename });

    if (!file) {
      return res.status(404).send('File not found');
    }

    res.setHeader('Content-Disposition', `attachment; filename=${file.filename}`);
    res.setHeader('Content-Type', file.contentType);
    res.send(file.data);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).send('Server Error');
  }
});


app.delete('/delete/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const deletedFile = await File.findOneAndDelete({ filename });

    if (!deletedFile) {
      return res.status(404).send('File not found');
    }

    res.status(200).send('File deleted successfully');
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).send('Server Error');
  }
});




const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

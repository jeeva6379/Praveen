import React, { useState, useEffect } from 'react';

import axios from 'axios';

function App1() {
  const [file, setFile] = useState(null);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    fetchFileList();
  }, []);

  const fetchFileList = async () => {
    try {
      const response = await axios.get('http://localhost:3001/files');
      setFileList(response.data);
    } catch (error) {
      console.error('Error fetching file list:', error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        console.log('File uploaded successfully');
        fetchFileList(); // Refresh the file list
      } else {
        console.error('File upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleDelete = async (filename) => {
    try {
      const response = await axios.delete(`http://localhost:3001/delete/${filename}`);

      if (response.status === 200) {
        console.log('File deleted successfully');
        fetchFileList(); // Refresh the file list
      } else {
        console.error('File deletion failed');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload File</button>
      <div>
        <h2>Uploaded Files:</h2>
        <ul>
          {fileList.map((file, index) => (
            <li key={index}>
              {file.filename}{' '}
              <a href={`http://localhost:3001/download/${file.filename}`} download>
                Download
              </a>{' '}
              <button onClick={() => handleDelete(file.filename)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App1;

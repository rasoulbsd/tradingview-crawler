const axios = require('axios');
const fs = require('fs');

const filePath = '/sdf1015/Tue-Jun-06-2023/Positions-14:41:07.csv'; // Replace with actual file path
const downloadEndpoint = 'http://91.107.215.42:8000/download_csv'; // Replace with actual API endpoint URL

// Create an Axios instance with authentication headers
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODYwNjQ1MTAsImV4cCI6MTY4NjQxMDExMH0.HPTr8Msw3kMSGXCJSNWmMjcSPhjE6wD6sZOrohCHKso'; // Replace with actual JWT token
const authToken = `Bearer ${token}`;
const axiosInstance = axios.create({
  headers: {
    Authorization: authToken,
  },
  responseType: 'stream',
});

// Send a POST request to the /download endpoint
console.log(`Downloading file from ${downloadEndpoint}...`);
axiosInstance.post(downloadEndpoint, { filePath })
  .then((response) => {
    // Save the response data to a file
    const filename = response.headers['content-disposition'].split('=')[1];
    const newFilename = `new_${filename}`; // Specify a new filename here
    const outputPath = path.join(__dirname, newFilename); // Specify a different directory path here
    const fileStream = fs.createWriteStream(outputPath);
    console.log(fileStream)
    response.data.pipe(fileStream);

    // Handle success cases
    response.data.on('end', () => {
      console.log(`File downloaded successfully: ${outputPath}`);
    });

    // Handle error cases
    response.data.on('error', (err) => {
      console.error(err);
    });
  })
  .catch((error) => {
    console.error(error);
  });
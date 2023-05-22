const axios = require('axios');
const fs = require('fs');

const filePath = '/root/tradingview-crawler/crawlers/../downloads/desab19561//Mon-May-15-2023/Positions-09:44:01.csv'; // Replace with actual file path
const downloadEndpoint = 'http://91.107.215.42:8000/download_csv'; // Replace with actual API endpoint URL

// Create an Axios instance with authentication headers
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODQxNDg0OTMsImV4cCI6MTY4NDQ5NDA5M30.8xDKinsUatJG6MfxaP-kfmGEa5RFtxo-wR7HKjWU7ho'; // Replace with actual JWT token
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
    console.error(error.response.data.message);
  });
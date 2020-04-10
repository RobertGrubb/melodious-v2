const express = require('express');
const app = express();

const port = 3008;

app.use(express.static('public'));
app.listen(port, () => console.log(`Overlay development server listening on ${port}`));

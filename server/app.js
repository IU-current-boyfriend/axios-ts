const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST');
  next();
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get('/get_demo', (req, res, next) => {
  res.json({
    error_code: 0,
    error_msg: 'ok',
    data: []
  })
});

app.post('/post_demo', (req, res, next) => {
  res.json({
    error_code: 0,
    error_msg: 'ok',
    data: []
  })
});


app.listen(3000, () => {
  console.log('监听成功火箭🚀...');
})
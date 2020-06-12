const router = require('express').Router();
const axios = require('axios');

router.get('/', (req, res)=>{
  res.render('index');
})

router.get('/user', (req, res)=>{
  const access_token = 'c1e33379c5a6b541cc722ddd48dea3c74844ff85';
  const url = 'https://api.github.com/user/repos';
  const options = {
    headers: {
      'Authorization': `token ${access_token}`
    }
  }
  axios.get(url, options).then(data=>{
    res.send({data: data.data});
  }).catch(err=>{
    res.send(err.message);
  })
})
module.exports = router;

const router = require('express').Router();
const axios = require('axios');
const {getAll} = require('../utils/getTread');

const client_id = '681031d720239e5cb9f7'
const client_secret = '982cdc83169153156e25ed00a2c9823f3be3a2ff'

router.get('/user', async (req, res)=>{
  const { code } = req.query;
  if(!code) return res.send({error: true, message: 'Invalid Code'})
  const access_token = await getAccessToken(code);
  res.cookie('access_token', access_token);
  res.redirect('http://localhost:3000/home')
})

async function getAccessToken(code) {
  const url = 'https://github.com/login/oauth/access_token';
  const reqBody = { client_id, client_secret, code }

  const data = await axios.post(url, reqBody);
  const body = data.data;
  const urlSearchParams = new URLSearchParams(data.data);
  const access_token = urlSearchParams.get('access_token');
  return access_token;
}

async function getGithubPublicRepo(access_token){
  const url = 'https://api.github.com/repositories';
  const options = {
    headers: {
      'Authorization': `token ${access_token}`
    }
  }
  let data = await axios.get(url, options);
  let body = data.data;
  return body;
}

function getUserRepos(access_token){
  const url = 'https://api.github.com/user/repos';
  const options = {
    headers: {
      'Authorization': `token ${access_token}`
    }
  }
  return axios.get(url, options).then(data=>{
    return data.data
  }).catch(err=>{
    return [];
  })
}
router.get('/github/getTreads', (req, res) => {
    getAll().then(data=>{
      res.send({status: true, data})
    }).catch(err=> {
      res.send({status: false, err: err.message})
    });
});

router.post('/github/repo', (req, res)=>{
  let {mode, access_token} = req.body;
  if(mode == 'trend'){
    getAll().then(data=>{
      res.send({status: true, data})
    }).catch(err=> {
      res.send({status: false, err: err.message, data: []})
    });
  }else if(mode == 'publicRepos'){
    getGithubPublicRepo(access_token).then(data=>{
      res.send({status: true, data: data})
    }).catch(err=>{
      res.send({status: false, err: err.message, data: []})
    })
  }else if(mode == 'myRepos'){
    getUserRepos(access_token).then(data=>{
      res.send({status: true, data: data})
    }).catch(err=>{
      res.send({status: false, err: err.message, data: []})
    })
  }
})

module.exports = router;

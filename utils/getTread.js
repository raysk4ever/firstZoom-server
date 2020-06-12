const cheerio = require('cheerio')
const axios = require('axios');

async function getAll(url = 'https://github.com/trending'){
  return axios.get(url).then(response=>{
    let htmlBody = response.data;
    let $ = cheerio.load(htmlBody);
    let main = $('.application-main > main > div.explore-pjax-container .Box div:nth-child(2) article');
    let data = []
    main.each(function(index){
      // console.log(index);
      data[index] = {}

      // get repo fullName
      let fullName = $(this).children('h1').text();
      data[index].fullName = fullName.trim().replace(/\s/g, "")

      // get desc
      let desc = $(this).children('p').text();
      data[index].desc = desc.trim()

      // get lang
      let lang = $(this).children('div.f6').children('span.d-inline-block').children('span:nth-child(2)').html();
      data[index].lang = lang

      // get total star and forks
      $(this).children('div.f6').children('a').each(function(ai){
        if(ai == 0){
          let star = $(this).text().trim();
          data[index].star = star;
        }else if(ai == 1){
          let forks = $(this).text().trim();
          data[index].forks = forks;
        }
      })

      // get buildby
      $(this).children('div.f6').children('span.d-inline-block').children('a').each(function(bi){
        let devName = $(this).children('img').attr('alt')
        let devImg = $(this).children('img').attr('src')
        let devData = {
          devName,
          devImg
        }
        if(data[index].buildBy) data[index].buildBy = [...data[index].buildBy, devData]
        else data[index].buildBy = [devData]
      })

      // today star
      let todayStar = $(this).children('div.f6').children('span.float-sm-right').text().trim()
      data[index].todayStar = todayStar;
    })
    return data;
  })
}

module.exports = { getAll };

// getAll();

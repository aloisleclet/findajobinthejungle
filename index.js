const Bot = require('./bot.class');

const utils = require('./utils');

(async () =>
{
  let bot = new Bot();
 
  await bot.init();
  
  console.log('welcometothejungle_bot need your login informations.'); 
//  let email = await utils.ask('email: ');
//  let password = await utils.ask_password();
 // await bot.login(email, password);

//  let job = await utils.ask('your futur job: ');
//  let country = await utils.ask('country (ex:"Rhones"): ');
//  let technos = await utils.ask('With what technologies do you want to work (separate with ",". ex: "js, php, node.js")?'); 
//  technos = technos.split(", ");
 
  await bot.search('dev js', 'Paris');
  await bot.scrap_all(); 
  //0. Before all create an account on welcometojungle.co
  //1. Ask user login
  //2. Ask technos, tools
  //3. Massive apply 

 // let url_test = [
 //   "https://www.welcometothejungle.co/fr/jobs?query=dev&page=1&configure%5Bfilters%5D=website.reference%3Awttj_fr&configure%5BhitsPerPage%5D=30&refinementList%5Boffice.district%5D%5B%5D=Rh%C3%B4ne"
 // ];
 // let random = Math.ceil(Math.random() * url_test.length - 1);
 


 
  //UPDATE
  //bot.update
  //RUN
  //bot.run
  //await bot.kill();
})();

const CONFIG = require('./config');
const puppeteer = require('puppeteer');
const utils = require('./utils');

class Bot
{
  constructor()
  {
  }

  async init()
  {
    let options = {
      headless: CONFIG.headless,
      dumpio: true,
      args: [
        '--disable-features=site-per-process',
        '--no-default-browser-check',
        '--disable-bundled-ppapi-flash',
        
        '--ignore-certificate-errors',

        '--safebrowsing-disable-auto-update',
        '--safebrowsing-disable-download-protection',
        '--disable-client-side-phishing-detection',
      ]
    }

    this.browser = await puppeteer.launch({headless: CONFIG.headless})
    this.page = await this.browser.newPage()
  }


  //need to be private
  async execute(url, f) //better name => scrap or read
  {
    await this.page.goto(url, {'waitUntil' : 'load'});
    await this.page.waitFor(2000);

    //select dynamically which class to add may be useful for multi site compatibility
    let site = url.split('https://www.')[1].split('.fr')[0];
    console.log('['+site+'] '+url);

    await this.page.addScriptTag({ path: './utils.js' });
    await this.page.addScriptTag({ path: './indeed.class.js' });
    await this.page.waitFor(2000);

//prepare function to pass in evaluate

    f = f.toString();

    return await this.page.evaluate(({f, CONFIG}) =>
    {
      const create_f = new Function(' return ('+ f +').apply(null, arguments)');
      return create_f.call(null, CONFIG.user);
    }, {f, CONFIG});
  }

  async apply(url)
  {
    let user = CONFIG.user;

    let page = this.page;

    await page.goto(url, {'waitUntil' : 'load'});
    await page.click('.jobsearch-IndeedApplyButton-contentWrapper:first-child');
    
    //await page.waitFor("iframe");
    
    await page.waitFor('.indeed-apply-bd');
    //await page.waitFor(".indeed-apply-popup");
    await page.waitFor(3000);
   // console.log(await page.$(".indeed-apply-popup .ia-FilePicker input"));
  
    let element_handle = await page.$('.indeed-apply-popup');
    console.log(element_handle);

    let frame = await element_handle.contentFrame();
    console.log(await frame.$('body'));
    //let test = await frame.$("input");
    //await console.log(test);
    
    //let main_frame = await page.mainFrame(); 
    //let child_frames = await main_frame.childFrames();
    
    //await console.log(await child_frames[0].contentFrame().$("input"));
   // await console.log(await child_frames[1].$("input"));
   // await console.log(await child_frames[2].$("input"));
 
    //let element_handle = await page.$(".indeed-apply-popup");
    //let frame = await element_handle.contentFrame();
    //await page.waitFor(3000);
//    console.log(await frame.$(".ia-FilePicker"));
 
    //let element_handle = await page.frames()[0];
    //console.log(element_handle)
    //console.log(await element_handle.$(".ia-FilePicker"));
    //let iframe = await element_handle.contentFrame();
    //iframe.waitForSelector(".ia-FilePicker");
    //console.log(await iframe.$(".ia-FilePicker"));
 

   // await page.waitFor(5000);
   // await page.keyboard.type(user.first_name+" "+user.last_name);
   // await page.keyboard.press("Tab");
   // await page.keyboard.type(user.email);
   // await page.keyboard.press("Tab");
   // await page.keyboard.type(user.phone);
   // await page.keyboard.press("Tab");
   // const input = await page.$(".ia-FilePicker input");
   // await input.uploadFile(user.cv);
   // await this.click(".icl-Button--primary");
 
  }
  
  //login welcome to the jungle

  async login(email, password)
  {
    let page = this.page;

    await page.goto('https://www.welcometothejungle.co/fr', {'waitUntil' : 'load'});
    let login_button = await page.$('a[title="Se connecter"]');
    if (login_button)
      await login_button.click();
    await page.waitForNavigation(); 
    
    let email_field = await page.$('input[name="email"]');
    let password_field = await page.$('input[name="password"]');
    let submit_button = await page.$$('button[type="submit"]');

    if (email_field && password_field && submit_button.length == 2)
    {
      console.log('login in progress');
      
      await page.focus('#sessions-new-email', {delay: Math.ceil(Math.random() * 200)});
      await page.keyboard.type(email);
      
      await page.focus('input[name="password"]');
      await page.keyboard.type(password, {delay: Math.ceil(Math.random() * 200)});
     
      await submit_button[1].hover();
      await page.waitFor(500);
       
      await submit_button[1].click(); 
      await page.waitForNavigation();

      if (page.url() == 'https://www.welcometothejungle.co/fr')
        console.log('login success');
      else
        console.log('login failed'); 
    }
    else
    {
      console.log('login failed -> try with a better internet connection.');
    } 
  }

  //

  async search(job, country)
  {
    let page = this.page;

    await page.goto('https://www.welcometothejungle.co/fr', {'waitUntil' : 'load'});
  
    let link = await page.$('a[href="/fr/jobs"]');
    link.click();
    await page.waitForNavigation();

    let search = await page.$('input[type="search"]');
    await search.focus();
    await page.keyboard.type(job, {delay: Math.ceil(Math.random() * 200)});
    await page.waitFor(1000); 
    let dropdown_button = await page.$('.sc-iujRgT');
    await dropdown_button.click(); 

    await page.waitFor(1000); 
    let dropdown_country = await page.$$('.sc-lkqHmb');
    await dropdown_country[2].click(); 
    await page.waitFor(4000);
    let search_country = await page.$$('input.ais-SearchBox-input');
    await search_country[1].focus();
    await page.keyboard.type(country, {delay: Math.ceil(Math.random() * 200)});

    await page.waitFor(1000); 
    let checkbox_country = await page.$$('.sc-bXGyLb.jpclem');
    checkbox_country = checkbox_country[1];
    checkbox_country = await checkbox_country.$('span.ais-RefinementList-labelText');
    await checkbox_country.click();

    let close_dropdown = await page.$('.sc-iujRgT.bIZuln'); 
    await close_dropdown.click(); 
  }

  async scrap_all()
  {

    let page = this.page;   
    let job_links = await page.$$('.ais-Hits-item a');
    console.log(job_links);
    let i = 0;
   
 
    while (i < job_links.length)
    {
      console.log(job_links[i]);
      await job_links[i].click();
      await page.waitForNavigation();
      page.goBack();
      i++;
    }
   /* 
    //const scrap_next_page = (start) =>
    //{
    //  let url_with_arg = url;

    //  if (start >= 10)
    //    url_with_arg += '&start='+start;

    //  return this.execute(url_with_arg, list);
    //};
 
    let start = 0;
    let jobs = [];
 
    while (start < end)
    {
     // console.log(await scrap_one(start));
      let next_jobs = await scrap_next_page(start);
      jobs.push(next_jobs);

      start += 10;
    }

    jobs = jobs.flat();

    console.log(jobs.length+' jobs found'); 

    //scrap all page in dirty mode 
    i = 0;

    while (i < jobs.length)
    {
      let complete_job = await this.do('page', jobs[i].url);
      jobs[i].description = complete_job.description;
      i++;
    }

    return jobs;
    */
  }

  async search_new_job()
  {
    let jobs = await this.scrap_all('https://www.indeed.fr/jobs?q=developpeur+web&l=lyon', config.take_n_last_job);
    let i = 0;

    let job_user_match = (job, user) =>
    {
      let i = 0;
      let title_match = [];
      let description_match = [];

      while (i < user.technos.length)
      {
        if (job.description.toLowerCase().indexOf(user.technos[i]) != -1)
          description_match.push(user.technos[i]); 
        if (job.title.toLowerCase().indexOf(user.technos[i]) != -1)
          title_match.push(user.technos[i]); 
        i++;
      }
      console.log(job.title);
      console.log(title_match);
      console.log(description_match);
      console.log('score: '+Number(description_match.length + title_match.length * 10));

      return Number(description_match.length + title_match.length * 10);
    }

    while (i < jobs.length)
    {
      if (job_user_match(jobs[i], CONFIG.user) > 3)
        console.log('APPLY !!!!');
      //check if it's in db if not add task
      i++;
    }   
 
  }

  async kill()
  {
   await this.browser.close()
  }  
}

module.exports = Bot;


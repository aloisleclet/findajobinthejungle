const readline = require('readline');

//transform relative date in absolute date

let date_rel_to_ts = function (date_rel)
{
  // search heure(s) mois jour(s)
  let unit = '';
  let digit;
  let date_abs;

  let re_day = /jour/i;
  let re_hour = /heure/i;

  if (date_rel.search(re_hour) != -1)
    unit = 'h';
  else if (date_rel.search(re_day) != -1)
    unit = 'j';
  else
    return false;
  console.log(unit); 

  digit = Number(date_rel.substr(0, 2)); 
 

  if (unit == 'h')
  {
    date_abs = new Date().getTime();
  }
  else
  {
    date_abs = new Date().getTime() - (digit * 24 * 60 * 60 * 1000);
  }

  return date_abs; 
};


//ask password via commandline
let ask_password = () => new Promise((res, rej) => {
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout 
  });  

  let end = false;

  process.stdin.on('data', c =>
  {
    if (!end)
    {
      c = c + '';
      if (c == '\n' || c == '\r' || c == '\u0004')
      {
        process.stdin.pause();
      }
      else
      {
        process.stdout.clearLine();
        readline.cursorTo(process.stdout, 0);
        process.stdout.write('password: ' + Array(rl.line.length + 1).join('*'));
      }
    }
  });

  rl.question('password: ', password => {
    rl.history = rl.history.slice(1);
    end = true;
    rl.close();
    res(password);
  });
});

//ask something via commandline

let ask = (query) => new Promise((res, rej) =>
{
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout 
  }); 

  rl.question(query, answer => {
    rl.close();
    res(answer);
  });
});

module.exports = {
  date_rel_to_ts: date_rel_to_ts,
  ask_password: ask_password,
  ask: ask
}

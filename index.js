require('console.table');

constc creds = require('creds');

module.exports = {
  'Nelnet': function (browser) {
    const wait = 2000;
    let data = [];

    browser
      // go to nelnet
      .url('https://www.nelnet.com/welcome')

      // enter usernane
      .waitForElementVisible('#username')
      .pause(wait)
      .setValue('#username', creds.username)
      .click('#submit-username')

      // enter password
      .waitForElementVisible('#Password')
      .setValue('#Password', creds.password)
      .click('#submit-password')
      .pause(wait)

      // go to loan details
      .url('https://www.nelnet.com/Loan/Details')
      .waitForElementVisible('#maincontent')
      .pause(wait)

      // open group details
      .click('.account-row a')
      .waitForElementVisible('#maincontent')

      // get all data
      .elements('css selector', '.account-detail div tr td', function (elements) {
        elements.value.forEach( function(element, i) {
          browser.elementIdText(element.ELEMENT, function(result){
            if(result.value) data.push(result.value);
          });
        });
      })

      // format data
      .perform( () => {
        const chunk_size = 8;
        const groups = data.map( (e,i) => { 
            return i%chunk_size===0 ? data.slice(i,i+chunk_size) : null; 
        })
        .filter(function(e){ return e; });

        let tables = [];
        for(let i=0,l=groups.length;i<l;i++){

          let monthly_interest = parseInt(groups[i][3].replace(/%/, '')) / 100 / 12;
          let principle_format = parseInt(groups[i][6].replace(/\$|,/g, ''));
          let interest_per_month = principle_format * monthly_interest;

          total += principle_format;

          tables.push({
            'due date': groups[i][0],
            'fees': groups[i][1],
            'status': groups[i][2],
            'interest rate': groups[i][3],
            'accrued interest': groups[i][4],
            'last payment recieved': groups[i][5],
            'outstanding balance': groups[i][6],
            'principle balance': groups[i][7],
            'interest per month': "$"+ interest_per_month.toFixed(2),
            'total': i+1 == groups.length ? '$'+total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ''
          });
        }

        console.log('tables: ', tables);

        console.table(tables);
      })
      .pause()

      .end();


    }
  };

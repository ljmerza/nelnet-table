require('console.table');

const creds = require('../creds');

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
      .pause(3000)

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


        // reformat data
        const chunk_size = 8;
        const groups = data.map( (e,i) => { 
            return i%chunk_size===0 ? data.slice(i,i+chunk_size) : null; 
        })
        .filter(function(e){ return e; });

        console.log(' groups: ',   groups);


        // reformat to console table format
        let tables = groups.map( (currentValue, index, array) => {
          const monthly_interest = parseInt(groups[i][3].replace(/%/, '')) / 100 / 12;
          const principle_format = parseInt(groups[i][6].replace(/\$|,/g, ''));
          const interest_per_month = principle_format * monthly_interest;

          return {
            'due date': currentValue[0],
            'fees': currentValue[1],
            'status': currentValue[2],
            'interest rate': currentValue[3],
            'accrued interest': currentValue[4],
            'last payment recieved': currentValue[5],
            'outstanding balance': currentValue[6],
            'principle balance': currentValue[7],
            'interest per month': "$"+ interest_per_month.toFixed(2),
            'total': index+1 == groups.length ? '$'+total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ''
          };
        });

        console.log('tables: ', tables);

        console.table(tables);
      })
      .pause()

      .end();


    }
  };
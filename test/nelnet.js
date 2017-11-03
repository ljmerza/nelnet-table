const creds = require('../creds');
const AsciiTable = require('ascii-table')

var table = new AsciiTable('Nelnet Loans')
table
  .setHeading('Due Date','Fees','Status','Interest Rate','Accrued Interest','Last Payment Received','Outstanding Balance','Principle Balance','Interest Per Month','Total', 'Total Interest Per Month')

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
      .click('.account-row:nth-child(1) a')
      .waitForElementVisible('#maincontent')
      .pause(wait)

      .click('.account-row:nth-child(2) a')
      .waitForElementVisible('#maincontent')
      .pause(5000)

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
        let total = 0, total_int = 0;
        // reformat data
        const chunk_size = 8;
        const loans = data.map( (e,i) => { 
            return i%chunk_size===0 ? data.slice(i,i+chunk_size) : null; 
        })
        .filter(function(e){ return e; });

        // reformat to console table format
        const tables = loans.forEach( (loan, index) => {

          const monthly_interest = parseInt(loan[3].replace(/%/, '')) / 100 / 12;
          const outstanding_format = parseInt(loan[6].replace(/\$|,/g, ''));
          const interest_per_month = outstanding_format * monthly_interest;
          total += outstanding_format;
          total_int += interest_per_month

          table.addRow(
            loan[0],loan[1],loan[2],
            loan[3],loan[4],loan[5],
            loan[6],loan[7],
            '$'+ interest_per_month.toFixed(2),
            '$'+total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            '$'+total_int.toFixed(2)
          );
        });

        console.log(table.toString())
      })
      .end();


    }
  };
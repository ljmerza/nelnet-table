var Nightmare = require('nightmare');		
var nightmare = Nightmare({ show: true });
require('console.table');

let creds = require('./creds');
let username = creds.username;
let password = creds.password;

nightmare
  // go to website
  .goto('https://www.nelnet.com/welcome')
  .wait('#username')
  .wait(2000)
  // enter username and wait for password input
  .type('#username', username)
  .click('#submit-username')
  .wait('#Password')
  .wait(2000)
  // enter password and wait for account screen
  .type('#Password', password)
  .click('#submit-password')
  .wait('#mainNavigation li:nth-child(2) a')
  .wait(1000)
  // go to loan details page
  .goto('https://www.nelnet.com/Loan/Details')
  .wait('.account-row:nth-child(2) a span')
  .wait(2000)
  // click on show loan details
  .click('.account-row:nth-child(1) a span')
  .wait(1000)
  .click('.account-row:nth-child(1) a span')
  .wait(1000)
  .click('.account-row:nth-child(2) a span')
  .wait(1000)
  .click('.account-row:nth-child(2) a span')
  .wait(1000)
  // get loan data
  .evaluate(function () {
        let accurued_interest = Array.from(
        	document.querySelectorAll('.groupLoanDetails .account-detail div:nth-child(3) tr:nth-child(2) td:nth-child(2)'))
        	.map(element => element.innerText);
        let interest = Array.from(
        	document.querySelectorAll('.groupLoanDetails .account-detail div:nth-child(3) tr:nth-child(1) td:nth-child(2) span'))
        	.map(element => element.innerText);
        let principle = Array.from(
        	document.querySelectorAll('.groupLoanDetails .account-detail div:nth-child(4) tr:nth-child(2) td:nth-child(2)'))
        	.map(element => element.innerText);
        let outstanding = Array.from(
        	document.querySelectorAll('.groupLoanDetails .account-detail div:nth-child(4) tr:nth-child(1) td:nth-child(2)'))
        	.map(element => element.innerText);

        return [accurued_interest, interest, principle, outstanding];
  })
  .end()
  .then(function (result) {
    let accurued_interest = result[0];
    let interest = result[1];
    let principle = result[2];
    let outstanding = result[3];

    let data = [];
    let total = 0;

    for(let i=0;i<accurued_interest.length;i++) {

    	let monthly_interest = parseInt(interest[i].replace(/%/, '')) / 100 / 12;
    	let principle_format = parseInt(outstanding[i].replace(/\$|,/g, ''));
    	let interest_per_month = principle_format * monthly_interest;

    	total += principle_format;


    	data.push({
    		'accurued interest': accurued_interest[i],
    		'interest': interest[i],
    		'principle': principle[i],
    		'outstanding': outstanding[i],
    		'interest per month': "$"+ interest_per_month.toFixed(2),
    		'total': i+1 == accurued_interest.length ? '$'+total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ''
    	});
    }

    console.table(data);
  })
  .catch(function (error) {
    console.error('Search failed:', error);
  })
;
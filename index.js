var Nightmare = require('nightmare');		
var nightmare = Nightmare({ show: true });
require('console.table');

let creds = require('./creds');
let username = creds.username;
let password = creds.password;

nightmare
  .goto('https://www.nelnet.com/welcome')
  .wait('#username')
  .wait(3000)
  .type('#username', username)
  .click('#submit-username')
  .wait('#Password')
  .wait(2000)
  .type('#Password', password)
  .click('#submit-password')
  .wait('#mb1 > li:nth-child(2) > a')
  .wait(2000)
  .click('#mb1 > li:nth-child(2) > a')
  .wait('#area-one .account-row:nth-child(1) a')
  .wait(2000)
  .click('#area-one .account-row:nth-child(1) a')
  .wait(1000)
  .click('#area-one .account-row:nth-child(1) a')
  .wait(1000)
  .click('#area-one .account-row:nth-child(2) a')
  .wait(1000)
  .click('#area-one .account-row:nth-child(2) a')

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

    for(let i=0;i<accurued_interest.length;i++) {

    	let monthly_interest = parseInt(interest[i].replace(/%/, '')) / 100 / 12;
    	let principle_format = parseInt(outstanding[i].replace(/\$|,/g, ''));
    	let interest_per_month = principle_format * monthly_interest;

    	data.push({
    		'accurued_interest': accurued_interest[i],
    		'interest': interest[i],
    		'principle': principle[i],
    		'outstanding': outstanding[i],
    		'interest per month': "$"+ interest_per_month.toFixed(2)
    	});
    }

    console.table(data);
  })
  .catch(function (error) {
    console.error('Search failed:', error);
  })
;
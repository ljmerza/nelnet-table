# nelnet-table

Gets all loans on nelnet, computes monthly interest for each loan, and show data in ascii table.

---
I wanted a quick and easy way to see which student loans I should be concentrating on. My go to for website scraping is Python's requests and beautifulsoup4 libraries but I decided to see what the nodejs nightmare library was about. Nelnet uses AngularJS 1.4.9 with csrf tokens so given the messy nature of AngularJS DOM structures I opted for a higher lwevel browser automation library. 

This script gets all my student loans and displays the principle, interest, accured interest, outstanding balance, and my own calulated monthly interest field. I use this monthly interest to know which student loan I should be concentrating on to minimize my interest payments.

---
# how to use

git clone https://github.com/ljmerza/nelnet-table.git

rename example.creds.json to creds.json and enter your username and password to log into nelnet

npm start 


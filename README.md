# pokescraper
web scraper for pokemon sprites

based on a tutorial from [Scotch.io](https://scotch.io/tutorials/scraping-the-web-with-node-js) 

Web API:
 * GET /scraper -> runs the scraping of the sprites and creates json file of all the urls
 * GET /export -> looks for exported file, creates directory to put images in it and write images coming from url in the directory

`npm i -g nodemon` to use live reaload on save, 
`npm install` to install project dependencies, 
`nodemon server.js` to run/watch the project.

Things still to add:
- creating a zip file with all the images and download them from browser
- frontend to maybe add some more selectiveness on the pictures to download

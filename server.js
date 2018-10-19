/* this scraper is based on a tutorial from Scotch.io
 https://scotch.io/tutorials/scraping-the-web-with-node-js
*/

var express = require('express');
var fs = require('fs');
var request = require('request');
var async = require('async');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res){

    //All the web scraping magic will happen here
    

        // The URL we will scrape from - in our example Anchorman 2.

        url = 'https://pokemondb.net/sprites';

        // The structure of our request call
        // The first parameter is our URL
        // The callback function takes 3 parameters, an error, response status code and the html
    
        request(url, function(error, response, html){
    
            // First we'll check to make sure no errors occurred when making the request
    
            if(!error){
                // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
    
                var $ = cheerio.load(html);
    
                // Finally, we'll define the variables we're going to capture
    
                var name, imgurl;
                var json = [];
                
                $('.icon-pkmn').filter(function(index){

                    // Let's store the data we filter into a variable so we can easily see what's going on.
         
                         var data = $(this);
                        //  console.log(data);
         
                    // In examining the DOM we notice that the title rests within the first child element of the header tag. 
                    // Utilizing jQuery we can easily navigate and get the text by writing the following code:
         
                    imgurl = data.attr('data-src');
                    // Once we have our title, we'll store it to the our json object.
                    var obj = { name : "", imgurl : ""};
                        obj.name = index;
                        obj.imgurl = imgurl;
                        json.push(obj);
                })
                
                
                // To write to the system we will use the built in 'fs' library.
                // In this example we will pass 3 parameters to the writeFile function
                // Parameter 1 :  output.json - this is what the created filename will be called
                // Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
                // Parameter 3 :  callback function - a callback function to let us know the status of our function

                fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){

                    console.log('File successfully written! - Check your project directory for the output.json file');

                })

                // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
                res.send('Check your console!')
                
            }
        });

        
  })

  app.get('/export', function(req, res) {
    
    fs.exists('output.json', function(exists) {
        if (exists) {
            if (!fs.existsSync('images')){
                fs.mkdirSync('images');
            }
            var list = require('./output.json');
            // create a queue object with concurrency 2
            var q = async.queue(function(task, callback) {
                request(task.imgurl).pipe(fs.createWriteStream(__dirname + '/images/'+ task.name+'.png'));
                callback();
            }, 2);


            // assign a callback
            q.drain = function() {
                console.log('all items have been processed');
            };

            for (i in list) {
                q.push(list[i], function(err) {
                    console.log('finished processing ', list[i].imgurl);
                });
            }
            
            res.send('Exporting to folder');
        } else {
            res.send("you haven't scraped yet! scraper first")
        }
      });

  });

  app.listen('8081');
  
  console.log('Magic happens on port 8081');
  
  exports = module.exports = app;
# Animal Blog

The Animal Blog website is a student project.  The website allows the user to register for an account and perform basic CRUD operations on animal entries.

This website uses the React library to build user interface components for the client.  Express runs the backend server connected with MongoDB database, both currently from a local host.  Users are authenticated by a json web token stored in a cookie on the browser.

Animal Blog has been tested on Google Chrome.  
1st party cookies and javascript must be enabled to use this website.


                          |--Register
                          |
                          |--Login
                Nav       |
                 |        |--Logout
                 |        |             
##-----index----App-------|--Main--Item                            
                 |        |             |--Item
                 |        |--Profile----|--Edit 
               Footer     |             |--Delete
                          |--Create
                          |
                          |--Error
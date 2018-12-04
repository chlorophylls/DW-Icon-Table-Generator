# Dreamwidth Icon Table Generator

Webapp that instantly generates HTML that you can copy and paste to display your avatars/graphics in a nice, neat, numbered table on Dreamwidth (or anywhere that accepts HTML).

Uses HTML, CSS (Bootstrap), and Javascript (jQuery).

## Features

* Adding image links one at a time
* Adding multiple image links at a time, separated by semicolons (;)
* Adding all images from an Imgur album thanks to integrating the Imgur API
* Table style customization
* Icon cell (spacing, background color) customization
* Numbering (big or small or regular font size, color) customization
* Ability to preview table

## Notes
* The table is centered by default. Remove <center> tags manually if you don't want that, and format as you will.

## Imgur API Rate limit
* This webapp only makes GET requests, not POST requests.
* The Imgur API rate limit is [described here](https://apidocs.imgur.com/#rate-limits) as follows: 
> The Imgur API uses a credit allocation system to ensure fair distribution of capacity. Each application can allow *approximately 1,250 uploads per day or approximately 12,500 requests per day.* If the daily limit is hit five times in a month, then the app will be blocked for the rest of the month. (...) We also limit each user (via their IP Address) for each application, this is to ensure that no single user is able to spam an application.
* What this means is that, for each day, this application allows for up to 500 different users to to process 25 Imgur albums each. Or, 1 obsessive user to process 12500 Imgur albums. Or 125 users to process 100 albums. Do the math, etc.
* Either way, based on usage statistics, the application will probably never hit this daily 12,500 request limit, so don't worry about it too much.
	
## Leaving feedback
If you want to leave feedback, either:
* [Post it on the Issues page if you have a GitHub account](https://github.com/chlorophylls/Dreamwidth-Icon-Table-Generator/issues), or 
* [Leave a comment on this Dreamwidth post](https://septentrione.dreamwidth.org/6012.html?mode=reply). Anonymous posting is on, IP addresses are not logged, comments are not screened, etc.
	
## Credit
* [Minty Bootstrap 4 layout at Bootswatch](https://bootswatch.com/minty/)

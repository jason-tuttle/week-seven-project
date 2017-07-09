# Stat Tracker
## Build an application people can use to track any stats they want about themselves on a daily basis

You are going to build an application to track personal statistics about their activities. A personal statistic is a numerical record for a person in a time series by day. For example, let's say you wanted to track how many flights of stairs you walked up in a day. A sample week might look like:  

    Date	      Flights  
    06/19/2017	8  
    06/20/2017	6  
    06/21/2017	7  
    06/22/2017	6  
    06/23/2017	8  
    06/24/2017	4  
    06/25/2017	6

Users of your application can create as many different activities to track as they want.

You will be building an API to create and serve this data backed by MongoDB.

**API Specification**  
For your API, we have specified the endpoints you'll need and what they should do. The URLs we using are not prefixed: yours should have /api/ in front of them.

All the endpoints require authentication. You can use JSON Web Tokens for authentication, or if you prefer, you can use HTTP Basic Authentication. Feel free to use Passport to make this part easier.

    Verb	URL	       Action
    GET	/activities	Show a list of all activities I am tracking, and links to their individual pages
    POST	/activities	Create a new activity for me to track.
    GET	/activities/{id}	Show information about one activity I am tracking, and give me the data I have recorded for that activity.
    PUT	/activities/{id}	Update one activity I am tracking, changing attributes such as name or type. Does not allow for changing tracked data.
    DELETE	/activities/{id}	Delete one activity I am tracking. This should remove tracked data for that activity as well.
    POST	/activities/{id}/stats	Add tracked data for a day. The data sent with this should include the day tracked. You can also override the data for a day already recorded.
    DELETE	/stats/{id}	Remove tracked data for a day.

**Hard mode**  
Build a front-end for your API using HTML, CSS, and browser-side JavaScript.

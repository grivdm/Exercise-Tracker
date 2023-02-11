# API Project: Exercise Tracker

__for [FreeCodeCamp](https://www.freecodecamp.org/learn/back-end-development-and-apis/back-end-development-and-apis-projects/exercise-tracker)__

[Click](https://exercise-tracker-grivdm.glitch.me/)

+ The endpoint ```POST /api/users``` with form data creates a new user or requests user's data from db and returns an object with ```username``` and ```_id``` e.g. ```{username: "fcc_test", _id: "5fb5853f734231456ccb3b05"}```
+ The request to ```GET /api/users``` returns an array. Each element in the array in is an object literal containing a user's ```username``` and ```_id```
+ ```POST``` to ```/api/users/:_id/exercises```  with form data returns the user object with the exercise fields added, e.g. ```{username: "fcc_test", description: "test", duration: 60, date: "Mon Jan 01 1990", _id: "5fb5853f734231456ccb3b05"}```
+ A ```GET``` request to ```/api/users/:_id/logs``` will return the user object with a ```log``` array of all the exercises added. e.g. ``` {
  username: "fcc_test",
  count: 1,
  _id: "5fb5853f734231456ccb3b05",
  log: [{
    description: "test",
    duration: 60,
    date: "Mon Jan 01 1990",
  }]
}```
+ You can add ```from```, ```to``` and ```limit``` parameters to a ```GET /api/users/:_id/logs``` request to retrieve part of the log of any user. ```from``` and ```to``` are dates in ```yyyy-mm-dd``` format. ```limit``` is number of logs to send back, e.g. ```GET /api/users/:_id/logs?[from][&to][&limit]```

 ### Example usage:
https://exercise-tracker-grivdm.glitch.me/api/users  
https://exercise-tracker-grivdm.glitch.me/api/users/63e7bc02d9244300af174c23/logs



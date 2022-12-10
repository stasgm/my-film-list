# My fillm list

[![Netlify Status](https://api.netlify.com/api/v1/badges/2e932c1f-419e-4904-8d67-b912d8594f78/deploy-status)](https://app.netlify.com/sites/my-film-list/deploys)

## Todo

### Back end

- [ ] add auth0.com support
- [x] add envs (dev, test, prod)
- [ ] deploy to Heroku
- [ ] update patch method to pass only needed props
- [ ] add sort number and sort by sort number
- [ ] add tests
  - [ ] unit test
  - [ ] integration test

### Front end


- [x] add login\logout
  - [ ] profile buttons
- [ ] add fields:
  - [ ] film genres
  - [x] type (serial\film). Add to filters
  - [ ] last serial episode
- [ ]  add details page for film information (links, description)
- [ ]  add filter by genres (select multiple options)
- [x]  add filter by type
- [x]  filters save in local storage
- [ ]  for mobiles hide action buttons and show menu button with popup actions
- [x]  add sticky headers
- [ ]  add creation date time and sort by date\time
- [ ]  add sort number and sort by sort number
- [x]  for serials change icon
- [x]  add even and odd rules
- [x]  BUG: set default type
- [ ]  add global error boundry component
- [ ]  add global error handling for api requests
- [ ]  add a spinner that indicates the progress of the action (edit\add\delete)
- [ ]  add toast messages after successful\failed actions
- [ ]  add button to show filter (disabled by default)
- [x]  show the number of the filtered items after 'total film' title

## Deployment

### Heroku

- heroku git:remote -a my-film-list
- heroku config:set YARN_PRODUCTION=false (*to disable Only installing dependencies*)
- heroku config:set NODE_ENV=production
- heroku config:set MONGO_URI= (*mongo db link*)
- git push -f heroku HEAD:master

# My fillm list

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

- [ ] add login\logout\profile buttons
- [ ] add fields:
  - [ ] film genres
  - [x] type (serial\film). Add to filters
  - [ ] last serial episode
- [ ]  add details page for film information (links, description)
- [ ]  add filter by genres (select multiple options)
- [x]  add filter by type
- [x]  filters save in local storage
- [ ]  for mobiles hide action buttons and show menu button with popup actions
- [ ]  add sticky headers
- [ ]  add creation date time and sort by date\time
- [ ]  add sort number and sort by sort number
- [x]  for serials change icon
- [x]  add even and odd rules
- [x]  BUG: set default type

## Deployment

### Heroku

- heroku git:remote -a my-film-list
- heroku config:set YARN_PRODUCTION=false (*to disable Only installing dependencies*)
- heroku config:set NODE_ENV=production
- heroku config:set MONGO_URI= (*mongo db link*)
- git push -f heroku HEAD:master

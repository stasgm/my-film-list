# Simple nodejs server

## Todo

### Back end

- [ ]  add auth0.com support
- [x] add envs (dev, test, prod)
- [ ] deploy to Heroku

### Front end

- [ ] add login\logout\profile buttons
- [ ] add fields:
  - [ ] film genres
  - [ ] type (serial\film). Add to filters
  - [ ] last serial episode
- [ ]  add details page for film information (links, description)
- [ ]  add filter by genres (select multiple options)
- [ ]  add filter by type
- [ ]  filters save in local storage
- [ ]  for mobiles hide action buttons and show menu button with popup actions
- [ ]  add sticky headers
- [ ]  add creation date time  and sort by date\time

## Deployment

### Heroku

- heroku git:remote -a my-film-list
- heroku config:set YARN_PRODUCTION=false (*to disable Only installing dependencies*)
- heroku config:set NODE_ENV=production
- heroku config:set MONGO_URI= (*mongo db link*)
- git push -f heroku HEAD:master

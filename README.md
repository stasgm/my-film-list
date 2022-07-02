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
- [ ]  when click the 'edit' button highlight it and undo action on the next click  

## Deployment

### Heroku

- heroku git:remote -a my-film-list
- heroku config:set YARN_PRODUCTION=false (*to disable Only installing dependencies*)
- heroku config:set NODE_ENV=production
- heroku config:set MONGO_URI= (*mongo db link*)
- git push -f heroku HEAD:master

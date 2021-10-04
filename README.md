# cs3219-project-ay2122-2122-s1-g34

## Setup
1. Install docker and `docker-compose`
1. Clone repo and run `docker-compose up`
1. Visit [localhost:3000](http://localhost:3000) to start developing for the frontend
1. API gateway runs on `localhost:5000` by default

## How to install npm packages
1. To install additional node modules to the frontend, first run the command below to access the container shell

```
docker exec -it cs3219-project-ay2122-2122-s1-g34_client_1 /bin/ash
```

2. After entering the container shell, you can `yarn add` any modules you want
1. Use `exit` to exit the shell
1. Likewise for backend, but use:
```
docker exec -it cs3219-project-ay2122-2122-s1-g34_api-gateway_1 /bin/ash
```

## Code organization
### Frontend
- `/src`
  - `index.tsx`: Entry point file that renders the React component tree.
  - `/app`: contains app-wide setup and layout that depends on all the other folders.
  - `/common`: hooks, generic components, utils, etc. contains truly generic and reusable utilities and components.
  - `/features`: contains all "feature folders". Has folders that contain all functionality related to a specific feature.
  - Learn more: https://redux.js.org/style-guide/style-guide#structure-files-as-feature-folders-with-single-file-logic
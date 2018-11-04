# room-admin

## View
https://wannabanana.github.io/admin/

## File structure
```
admin
├─ gulpconfig.js
├─ gulpfile.js
├─ package.json
└─ source
       ├─ account
       │    ├─ css
       │    ├─ index.html
       │    └─ js
       ├─ css
       ├─ img
       ├─ index.html
       ├─ item
       │    ├─ css
       │    ├─ index.html
       │    ├─ item-vali
       │    └─ js
       ├─ js
       ├─ login
       │    └─ index.html
       └─ room-vali
              ├─ css
              ├─ index.html
              └─ js
```

## Usage
### step1
```
git clone https://github.com/WannaBanana/admin.git
npm install
```

### step2
This will build all files and start server at 8080 port
```
npm start 
```

This will build all files
```
npm run build
```

This will build all files and deploy the git page by pushing files to branch in gh-pages
```
npm run deploy
```

If there are some errors when using command of deploy, just like
```
TypeError: Cannot read property '0' of null...
```

try to use
```
cd node_modules/gulp-gh-pages/
npm install --save gift@0.10.2
cd ../../
gulp deploy
```


## Tools
- [Materializecss](https://materializecss.com/)

## About
It's a project in class.

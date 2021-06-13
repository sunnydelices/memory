# MEMORY GAME
This repository holds the code of the memory game for Oclock technical test

## Setup

To get it working, follow these steps:

**Download Composer dependencies**
Make sure you have Composer installed(https://getcomposer.org/download/)
and then run:
```
composer install
```

**Setup the Database**
Adjust the database configuration in .env Then, create the database and the schema
```
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
```

**Start the built-in web server**
You can use Apache or symfony built-in web server :
```
php bin/console server:run
```

**Download npm dependencies**
Make sure you have npm installed(https://nodejs.org) and then run:
```
npm install
```

**Start webpack **
```
./node_modules/.bin/webpack --watch
```

Now check out at `http://localhost:8000`

## Have fun !

If you have suggestions or questions, feel free to message me.

# Sail

> Navigate databases and share results

**Work in progress, not yet fully functionnal**

## What is it ?

**Sail** allows to navigate fast and easily around a database.

Its sole purpose is to hepl `SELECT` data, this tool is _not_ made to create or modify data.

There are 2 main areas: the console and the boards.

### The console

![Screenshot of Sail console](http://lipsumarium.com/images-Sail/console.png)

This is where developers work. Write queries in the top box and view results.

Clicking a table on the left column will make a simple `SELECT * FROM <table>` and execute it.

It is possible to right-click on any value returned by the database in order to use it in a new query. 
Right-click a value then choose a table and a field and it will generate a `SELECT * FROM <table> WHERE <field>=<value>` and execute it.


### The boards

Boards are nice presentation of existing queries. A board is a collection of cards. A card shows the result of a query.

This is perfect to share a query with other people you work with.

Boards also support variables. These variables can be used in queries and users can modify them easily.

Additionnaly, cards can render the results of queries in a more graphical manner.


## Requirements
* PHP
* MySQL
* Google Chrome (haven't tested anywhere else yet)

## Install

Build javascript:

`npm install && npm run build`

You will also need the following database (self DB) to store boards:

```
CREATE TABLE IF NOT EXISTS `board` (
  `id` varchar(32) NOT NULL,
  `crdate` INT NOT NULL,
  `config` text NOT NULL,
  `vars` TEXT NOT NULL,

  PRIMARY KEY (id)
) DEFAULT CHARSET=utf8;
```

Set "self" and "target" database credentials in `settings.json`.


## Keyoard shortcuts

### Console

* `cmd + p` focus table search
* `alt + enter` execute query (when query box focused)
* `enter` in search field when 1 item found selects the item


## Credits
* Logo: "sailing boat" by Jacqueline Fernandes from the Noun Project
* Icons:
  * console by Vignesh Nandha Kumar from the Noun Project
  * board by Jake Dunham from the Noun Project
  * Key by il Capitano from the Noun Project


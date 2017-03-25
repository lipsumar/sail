# Sail

> Navigate databases and share results

**🚧 Alpha version**

## What is it ?

**Sail** allows to navigate fast and easily around a database.

Its sole purpose is to help `SELECT` data, this tool is _not_ made to create or modify data.

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

#### Board config example
```yaml
title: Latest campaigns overview
id: latest-campaigns
vars:
  top_num: Number of campaigns
cards:
  - title: Top latest campaigns
    query: |
      SELECT *
      FROM t_campaigns
      WHERE deleted=0 AND live=1
      ORDER BY date DESC
      LIMIT $top_num
  
  - row: 
    - title: Total campaigns
      renderer: CardCount
      width: 50%
      query: SELECT count(*) AS num FROM t_campaigns WHERE deleted=0 

    - title: Total live campaigns
      width: 50%
      renderer: CardCount
      query: SELECT count(*) AS num FROM t_campaigns WHERE deleted=0 AND live=1
```


## Special features

### Clickable SQL results
SQL values can be made clickable by naming a column `_sail_url`. 
The values of that column will be rendered as a link.

To name links, use the following syntax: `link_name->http://link.com`.

You can easily link to other boards by crafting a link like `#board/<board-id>`, and even name it: `click_me->#board/<board-id>`.

This feature works in console and boards.

### Query builder [⚡Experimental]
To create joins easily, first click a table then `cmd + click` another table: a JOIN query will be made (but not executed automatically).

🚧 This feature is under development, it currently doesn't do table aliases or ON clause yet.


## Requirements
* PHP
* MySQL
* Google Chrome (Firefox seems fine)

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

Set "self" and "target" database credentials in `settings.php`.

You may set `db_self` to `null` to disable boards; only the console will be usable.

### Example settings.php
```php
<?php
$SAIL_SETTINGS = [
    "db_self" => [
        "host" =>"localhost",
        "name" =>"sail",
        "user" =>"root",
        "pass" =>"root",
        "prefix" => ""
    ],
    "db_target" =>[
        "host" =>"localhost",
        "name" =>"test",
        "user" =>"root",
        "pass" =>"root"
    ],
    "path" => "/Sail/",
    "styled_rows" =>[
        [
            "column" => "hidden",
            "value" => 1,
            "style" => "color: #999"
        ],
        [
            "column" => "deleted",
            "value" => 1,
            "style" => "text-decoration: line-through"
        ]
    ]
];

```

* `db_self` is the database used by Sail to store boards (optional)
* `db_target` is the database the queries should be perfomed on.
* `path` is the directory where you installed Sail.
* `styled_rows` allows to style table rows if it contains a `column` matching `value` (applies to boards and console)



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
  * edit by Icons fest from the Noun Project


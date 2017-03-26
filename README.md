# Sail

> Navigate databases and share results

**🚧 Alpha version**

📢 🚨   👋 **Help wanted !** 🚨  📢  
Are you good at PHP ? Do you like querying databases ? Come talk to me on Twitter [@lipsumar](https://twitter.com/lipsumar) or by [email](mailto:piremmanuel@gmail.com) !

## What is it ?

**Sail** is a web app to query a database.
* provides easy ways to navigate a database and share live results;
* allows to turn query results into graphs;
* build boards containing multiple result cards.

Developers can use Sail to craft queries, navigate the database and create boards.  
Clients, project managers or anyone authorized can browse the boards with a few clicks and access live data in a comprehensible manner.

**Sail is not** a replacement for PHPMyAdmin or other similar tools. It's only focused on reading data.  
Sail does not allow to create or modify data.



## The console

Developers can use the console to create `SELECT` queries:

![Screenshot of the Sail console](http://lipsumarium.com/images-Sail/console.png)

Write queries in the top box and view results. Result cards will stack on top of each other, providing a history of all queries executed.

A few shortcuts allow to navigate quickly around the data, even without foreign keys:

* Click a table on the left column to make a simple `SELECT * FROM <table>` and execute it.
* Right click a value in the result table to use it in a new query. You can select the table and field to use to generate a query like `SELECT * FROM <table> WHERE <field>=<value>`.




## The boards

A board is a collection of cards. A card shows the result of a query:

![Screenshot of a Sail board](http://lipsumarium.com/images-Sail/example-board.png)

Queries can be rendered as a simple table (default) or using special cards:

### CardTimeline

![Screenshot of a timeline](http://lipsumarium.com/images-Sail/card-timeline.png)

### CardCount

![Screenshot of a count](http://lipsumarium.com/images-Sail/card-count.png)

### CardScatterPlot

![Screenshot of a count](http://lipsumarium.com/images-Sail/card-scatterplot.png)

_More cards are coming !_



Boards also support variables. These variables can be used in queries and users can modify them easily.



### Board config example
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


## Features

### Linkable boards
All boards have a unique URL for easy sharing.

If a board contains variables, the URL can also specify them: `server.com/sail/#board/campaigns?from=10-03-2016`

### Clickable SQL results
SQL values can be made clickable by naming a column `_sail_url`. 
The values of that column will be rendered as a link.

```sql
SELECT CONCAT('http://google.com?q=', name) as _sail_url FROM t_campaigns
```

To name links, use the following syntax: `link_name->http://link.com`.

```sql
SELECT CONCAT(name, '->http://google.com?q=', name) as _sail_url FROM t_campaigns
```

You can easily link to other boards by crafting a link like `#board/<board-id>`, and even name it: `click_me->#board/<board-id>`.

This feature works in both console and boards.

### Styled rows
Some rows can be dynamically styled. For instance you can apply a ~~strikethrough~~ on rows marked as deleted.  
(see the example settings.php below)

This feature works in both console and boards.

### Query builder [⚡Experimental]
To create joins easily (on databases without foreign keys defined), first click a table then `cmd + click` another table: a JOIN query will be made (but not executed automatically).

🚧 This feature is under development, it currently doesn't do table aliases or ON clause yet.

🚧 Foreign keys are not supported yet.


## Requirements
* PHP
* MySQL
* Google Chrome (Firefox seems fine though)

## Install

### 1. Clone this repo (at the root of your webserver):

```$ git clone https://github.com/lipsumar/sail.git```

### 2. Build javascript:

```$ npm install && npm run build```

### 3. Create self dB (optional)
You will need the following database (self DB) to store boards:

```
CREATE TABLE IF NOT EXISTS `board` (
  `id` varchar(32) NOT NULL,
  `crdate` INT NOT NULL,
  `config` text NOT NULL,
  `vars` TEXT NOT NULL,

  PRIMARY KEY (id)
) DEFAULT CHARSET=utf8;
```

### 4. Configure settings.php

**Example settings.php**
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

You may set `db_self` to `null` to disable boards; then only the console will be usable.

### 5. Security notes

🚧 This is an early version, no security feature have been built-in yet.

Be aware that Sail is a tool that will allow anyone with access to it to send queries to be executed on the server. Just like PHPMyAdmin. However the big difference is that Sail stores the DB user/password and connects all users directly.

**You are responsible for providing a security access to Sail**, such as htpasswd.

**You should use a read-only user** to connect to the target DB. 

User management will be built it, with verious levels of access, but at the moment everyone can do everything. I recommend running this on https with htpasswd.

--> 👋 Help wanted ! Contact me on Twitter [@lipsumar](https://twitter.com/lipsumar) or by [email](mailto:piremmanuel@gmail.com)


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


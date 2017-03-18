# Sail

> Navigate databases and share results

**Work in progress, not yet functionnal**

## Requirements
* PHP
* MySQL
* Google Chrome (haven't tested anywhere else yet)

## Install

Build javascript:

`npm install && browserify -o bundle.js js/main.js`

You will also need the following database (self DB) to store boards:

```
CREATE TABLE IF NOT EXISTS `board` (
  `id` varchar(8) NOT NULL,
  `config` text NOT NULL,

  PRIMARY KEY (id)
) DEFAULT CHARSET=utf8;
```


## Credits
* Logo: "sailing boat" by Jacqueline Fernandes from the Noun Project
* Icons:
  * console by Vignesh Nandha Kumar from the Noun Project
  * board by Jake Dunham from the Noun Project


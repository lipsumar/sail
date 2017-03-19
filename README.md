# Sail

> Navigate databases and share results

**Work in progress, not yet functionnal**

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
  `id` varchar(8) NOT NULL,
  `config` text NOT NULL,

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


module.exports = {
  "parserOptions":{
    "ecmaVersion": 6
  },
  "sourceType": "module",
  "impliedStrict": true,
  "ecmaFeatures":{},
  "env":{
    "browser": true
  },
  "extends":"eslint:recommended",
  rules:{
    semi: [2, "always"],
    indent: ["error"]
  },
  globals:{
    require: false,
    module: false,
    d3: false,
    ace: false
  }
};

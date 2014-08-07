node-amc
========

Node module to open and manipulate AntMovieCatalog XML files



Installation
-----------

    npm install node-amc

Dependencies
-----------

    * [xmldom](https://github.com/jindw/xmldom) -- `npm install xmldom`
    * [xpath](https://github.com/goto100/xpath) -- `npm install xpath`

Note that dependencies should be installed automatically when you install the module


Usage
-----------


    var Catalog = require('node-amc').Amc;
    var catalog = new Catalog();

    catalog.loadFromFile('catalog.xml', function () {
        // do something after catalog is loaded
        catalog.getCatalogInfo();
    });

Another solution is to pass the filename when creating the Catalog object

    var catalog = new Catalog('catalog.xml', function () {
        // do something after catalog is loaded
        catalog.getCatalogInfo();
    });

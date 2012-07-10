Mantis Project Search
=====================

This modifies the project dropdown in the [Mantis Bug Tracker](http://mantisbt.org) to be a searchable list. This is useful if your project list is extensive.

Installation
------------

To enable this functionality you have to copy the *mantis-project-search* folder into your main Mantis directory and then add the js and css files along with jquery and jquery UI anywhere in the head of the mantis page.

```html
<!-- mantis project search -->
<!-- need jquery and jquery UI (use local versions if you prefer) -->
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min.js"></script>
<link rel="stylesheet" class="theme-link" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.21/themes/base/jquery-ui.css" type="text/css" media="screen" />
<!-- autocomplete code & css -->
<script type="text/javascript" src="mantis-project-search/mantis-project-search.js"></script>
<link rel="stylesheet" href="mantis-project-search/mantis-project-search.css" type="text/css" />
```

Categories
----------

If you are reading this then you most likely have a large number projects in your Mantis installation. Searching them makes things easier but you can also create "categories" i.e. top level groupings for multiple projects.

#### Enabling categories

To enable your own categories modify the categories array based on the example provided in the code:

```javascript
var categories = [
	//{id: "0",    name: "All Mantis Projects",     css_class: "project-search-category-all-mantis-projects"}
	//{id: "1",    name: "Top Level Category 1",    css_class: "project-search-category-top-level-1"}
	//{id: "1;2",  name: "Lower Level Category 2",  css_class: "project-search-category-lower-level-2"}
	//{id: "1;10", name: "Lower Level Category 10", css_class: "project-search-category-lower-level-10"}
	//{id: "20",   name: "Top Level Category 20",   css_class: "project-search-category-top-level-20"}
];
```

The groupings will be made based on the IDs you define - i.e. any project that has the exact ID or starts with the ID you have defined will belong to the particular category.
The CSS class that you define will be applied to all items in the category (including the header item).


Compatibility
-------------

Tested on Mantis v1.1.8, but should work on newer versions as well. Let me know if you had problems or success in getting this to work on any particular version.
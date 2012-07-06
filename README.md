Mantis Project Search
=====================

This modifies the project dropdown in the [Mantis Bug Tracker](http://mantisbt.org) to be a searchable list. This is useful if your project list is extensive.

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

Tested on Mantis v1.1.8, but should work on newer versions as well. Let me know if you had problems or success in getting this to work on any particular version.

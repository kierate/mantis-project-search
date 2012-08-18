$.widget( "custom.mantiscomplete", $.ui.autocomplete, {
	options: {
		getHiddenField: function() {
			return null;
		}
	},
	//this function is slightly different than the core one to show the project list on key up/down
	_move: function( direction, event ) {
		if ( !this.menu.element.is(":visible") ) {
			var field = this.options.getHiddenField();
			var selected_project = field == null ? null : field.attr("selected-project-name");
			var original_value   = field == null ? null : field.val();

			//when the typed in value is the selected project then on key up/down we show the whole list of projects
			if (this.element.val() == selected_project) {
				this.search( "", event );
				this.scrollToSelectedProject(original_value);
			} else {
				//by default search based on the typed in value - this is what core autocomplete does
				this.search( null, event );
			}

			return;
		}
		if ( this.menu.first() && /^previous/.test(direction) ||
				this.menu.last() && /^next/.test(direction) ) {
			this.element.val( this.term );
			this.menu.deactivate();
			return;
		}
		this.menu[ direction ]( event );
	},

	scrollToSelectedProject: function(original_value) {
		if (original_value.length != 0) {
			var li = this.menu.element.children("li.ui-menu-item[originalvalue='" + original_value + "']");

			var offset = li.offset().top - this.menu.element.offset().top;
			var scroll = this.menu.element.scrollTop();
			var top = Math.round(scroll + offset);
			this.menu.element.scrollTop(top);

			this.menu.activate(null, li);
		}
	},
	//render the menu with categories
	_renderMenu: function( ul, items ) {
		var self = this;
		var current_category = "";
		$.each( items, function( index, item ) {
			//if using categories
			if (typeof item.category != 'undefined') {
				//show the category (whenever it is different than the last one)
				if ( item.category != current_category ) {
					$( "<li></li>" )
						.addClass( "ui-autocomplete-category" )
						.addClass( item.css_class )
						.text( item.category )
						.appendTo( ul );

					current_category = item.category;
				}
			}
			self._renderItem( ul, item );
		});
	},
	//this function is almost the same as core but adds the css class and the originalvalue attribute to the item
	_renderItem: function( ul, item) {
		return $( "<li></li>" )
			.addClass(item.css_class)
			.attr( "originalvalue", item.multi_level_project_ids )
			.data( "item.autocomplete", item )
			.append( $( "<a></a>" ).text( item.label ) )
			.appendTo( ul );
	}
});

$(document).ready(function() {
	//remove the original mantis "Switch" button (not needed even without the autocompletion)
	$('form[name=form_set_project] input[value=Switch]').hide();

	//add autocompletion to the "top project selection" dropdown
	var data = dropdownToAutocomplete('form[name=form_set_project] select[name=project_id]', true, true);

	//when moving issues in mantis the dummy "All projects" project is not used
	data.shift();

	//add autocompletion to the "move issue(s) to project" dropdown
	dropdownToAutocomplete('form[action=bug_actiongroup.php] table[class=width75] select[name=project_id]', false, false, data);
});

function dropdownToAutocomplete(dropdown_field_selector, select_multi_level_project_ids, submit_form_on_selection, data_to_use)
{
	if ($(dropdown_field_selector).length == 0) {
		return false;
	}

	var prefix = getSelectorPrefix(dropdown_field_selector);
	var wrapper = prefix + '_ac_wrapper';
	var autocomplete = prefix + '_ac';
	var hidden = prefix + '_hidden';

	var ac_input = $('<div id="' + wrapper + '" class="project-select-ac-wrapper" style="display:none"></div>');
	ac_input.append('<input id="' + autocomplete + '" class="project-select-ac" type="text" value="" />');
	ac_input.append('<input id="' + hidden + '" type="hidden" value="" name="project_id" />');
	$(dropdown_field_selector).after(ac_input);

	//hide + disable the original dropdown field
	$(dropdown_field_selector).hide();
	$(dropdown_field_selector).attr("disabled", "disabled");

	//show the autocomplete field
	$('#' + wrapper).css('display', 'inline');

	//when a user selects the autocomplete field - select the text
	$("#" + autocomplete).focus(function(){
		$(this).select();
		//fix issue with the input being deselected in Chrome
		$(this).mouseup(function(e){
			e.preventDefault();
		});
	});

	//get the data for the autocompletion
	var data = new Array();
	if (data_to_use == undefined) {

		//define the categories to group by
		//the higher level categories have to be defined before the lower lever ones
		var categories = [
			//{id: "0",    name: "All Mantis Projects",     css_class: "project-search-category-all-mantis-projects"}
			//{id: "1",    name: "Top Level Category 1",    css_class: "project-search-category-top-level-1"}
			//{id: "1;2",  name: "Lower Level Category 2",  css_class: "project-search-category-lower-level-2"}
			//{id: "1;10", name: "Lower Level Category 10", css_class: "project-search-category-lower-level-10"}
			//{id: "20",   name: "Top Level Category 20",   css_class: "project-search-category-top-level-20"}
		];

		//loop through items in the original dropdown (which is now hidden)
		$(dropdown_field_selector + ' option').each(function(index) {
			if ($(this).text().length != 0) {
				//figure out the project id (within a multi-level project hierarchy - separated by semi-colons)
				var val = $(this).attr('value').split(';');
				var project_id = val[val.length-1];

				//as a base the current item has the id and a text (plus an empty css class)
				var current = {
					label:                    $(this).text(),
					value:                    project_id,
					multi_level_project_ids:  $(this).attr('value'),
					css_class:                 ""
				};

				//if using categories
				if (categories.length > 0) {
					//find what "category" to put the current mantis project into
					var current_category_name;
					var current_category_css_class;
					var i;
					for (i = 0; i < categories.length; i++) { //goes through all categories defined above
						if (current.multi_level_project_ids == categories[i].id) { //the multi-level project ids equal to the category id (so top-level match)
							current_category_name = categories[i].name;
							current_category_css_class = categories[i].css_class;
						} else if (current.multi_level_project_ids.indexOf(categories[i].id) == 0) { //the multi-level project ids begin with the category id (so sub-category)
							current_category_name = categories[i].name;
							current_category_css_class = categories[i].css_class;
						}
					}

					//store the category name and css class in the current item
					current.category = current_category_name;
					current.css_class = current_category_css_class;
				}

				//add the current item (id, text and optionally the category information)
				data.push(current);
			}
		});

		//when using categories the array has to be reordered slightly to
		//cover cases where one category is split and shows up multiple times
		if (categories.length > 0) {
			//order all mantis projects according to the category first
			var data_reordered = new Array();
			for (i = 0; i < categories.length; i++) { //for each category
				for (j = 0; j < data.length; j++) { //for each mantis project
					if (data[j].category == categories[i].name) { //if the current project is within the current category
						data_reordered.push(data[j]);
					}
				}
			}
			data = data_reordered;
		}
	} else {
		data = data_to_use;
	}

	//if one of the options in the dropdown was selected then show it in the autocomplete field
	var selected_option = $(dropdown_field_selector + ' option:selected');
	if (selected_option.length > 0) {
		//put the text in the input field
		$("#" + autocomplete).val(selected_option.text());
		//put the value in the hidden field
		$("#" + hidden).val(selected_option.val());
		//store the original text in a hidden field for later use
		$("#" + hidden).attr("selected-project-name", selected_option.text());
	}

	//initialise auto complete
	$("#" + autocomplete).mantiscomplete({
		source: data,
		minLength: 0, //this has to be 0 for the "Show all" toggle to work
		getHiddenField: function() {
			return $("#" + hidden);
		},
		focus: function(event, ui) {
			return false; //you can show the value when an item is in focus with $('#project-select-ac').val(ui.item.label);
		},
		select: function(event, ui) {
			//when an option is selected:
			//put the text in the input field
			$(this).val(ui.item.label);
			//put the value in the hidden field
			if (select_multi_level_project_ids) {
				$("#" + hidden).val(ui.item.multi_level_project_ids);
			} else {
				$("#" + hidden).val(ui.item.value);
			}

			if (submit_form_on_selection) {
				//submit the form
				$(this).parents('form').submit();
			}

			return false;
		}
	});

	//add a link to show all items (imitate the regular dropdown behaviour)
	//this pretty much makes it into a combobox (could use some more styling though)
	$("<a>")
		.attr("tabIndex", -1)
		.attr("title", "Show All Items")
		.appendTo($('#' + wrapper))
		.button({
			icons: {
				primary: "ui-icon-triangle-1-s"
			},
			text: false
		})
		.click(function() {
			var input = $("#" + autocomplete);
			//close if already visible
			if (input.mantiscomplete("widget").is(":visible")) {
				input.mantiscomplete("close");
				return;
			}

			$(this).blur();

			//pass empty string as value to search for, displaying all results
			input.mantiscomplete("search", "");
			input.focus();

			//if there was a project selected then scroll to it and activate it
			input.mantiscomplete("scrollToSelectedProject", $("#" + hidden).val());
		});

	return data;
}

function getSelectorPrefix(selector)
{
	selector = selector.replace(/[\]]/g, "");
	selector = selector.replace(/[[\\#\;\&\,\.\+\*\~\\\'\:\"\!\^\$\(\)\=\>\|\/\s]/g, "_");
	selector = selector.replace(/_{2,}/g, "_");

	return selector;
}
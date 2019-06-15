let current_year = new Date().getFullYear();
const list_items = ['Dashboard', 'Users', 'Products', 'Locations'];

const toolbar = {
  view: "toolbar", css: "webix_dark",
  cols: [
    { view: "label", label: "My App", align: "center", maxWidth: "100" },
    {},
    {
      view: "button", type: "icon", icon: "mdi mdi-account",
      label: "Profile", autowidth: "true", css: "webix_transparent",
      popup: "settings"
    }
  ]
};

const sidebar = {
  rows: [
    { view: "list", 
      data: list_items, 
      select: true, 
      css: "list", 
      width: 200,
      on: {
        onAfterSelect: function(id) {
          $$(id).show();
        }
      }
       },
    { view: "label", label: "<span class='webix_icon wxi-check'></span>Connected", align: "center", css: "connect-message" }
  ]
};

const small_film_set = [
  { id: 1, title: "The Shawshank Redemption", year: 1994, votes: 678790, rating: 9.2, rank: 1, category: "Thriller" },
  { id: 2, title: "The Godfather", year: 1972, votes: 511495, rating: 9.2, rank: 2, category: "Crime" },
  { id: 3, title: "The Godfather: Part II", year: 1974, votes: 319352, rating: 9.0, rank: 3, category: "Crime" },
  { id: 4, title: "The Good, the Bad and the Ugly", year: 1966, votes: 213030, rating: 8.9, rank: 4, category: "Western" },
  { id: 5, title: "Pulp fiction", year: 1994, votes: 533848, rating: 8.9, rank: 5, category: "Crime" },
  { id: 6, title: "12 Angry Men", year: 1957, votes: 164558, rating: 8.9, rank: 6, category: "Western" }
];



const data = { 
  view: "datatable", 
  id: "film_list", 
  url: "src/data.js", 
  columns:[
    { id:"rank", header: [ "Rank", { content:"numberFilter"}], template:"#rank#", sort: "int", css: "rankings" },
    { id:"title", header: [ "Title", { content:"textFilter"}], template:"#title#", width: 300, sort: "string" },
    { id:"year", header:[ "Year", { content:"numberFilter"}], template:"#year#", sort: "int" },
    { id:"votes", header:[ "Votes", { content:"numberFilter"}], template:"#votes#", sort: "int" },
    { id:"rating", header:[ "Rating", { content:"numberFilter"}], template:"#rating#", sort: "int" },
    { view:"list", id:"delete_entry", header: "", template: "<span class='webix_icon wxi-trash'></span>" }
  ],
  select: true,
  on: {
    onAfterSelect: function(id){
      const item = $$("film_list").getItem(id);
      $$("edit_films").setValues(item);
      $$("update_entry").setValue("Save");
    }
    
  },
  onClick: {
    "wxi-trash": function(e, id) {
      this.remove(id);
      return false;
    }
  }, 
  hover: "hover"
};

const form = {
  view: "form", id: "edit_films", 
  elements: [
    { template: "Edit films", type: "section" },
    { view: "text", label: "Title", name: "title", invalidMessage: "Title cannot be empty" },
    { view: "text", label: "Year", name: "year", invalidMessage: `Year should be between 1970 and ${current_year}` },
    { view: "text", label: "Rating", name: "rating", invalidMessage: "Rating cannot be empty or equal 0" },
    { view: "text", label: "Votes", name: "votes", invalidMessage: "Votes must be less than 100000" },
    {
      cols: [
        {
          view: "button", value: "Add new", id:"update_entry", css: "webix_primary", click: function () {
            let result = $$("edit_films").validate();
            if (result) {
              const values = $$("edit_films").getValues();
              if (values.id) {
                $$("film_list").updateItem(values.id, values);
                webix.message("Entry successfully updated");
              } else {
                $$("film_list").add(values);
                webix.message("Entry successfully added");
              }
              $$("film_list").clearSelection();
              $$("edit_films").clear();
              $$("update_entry").setValue("Add new");
            }
          }
        },
        {
          view: "button", value: "Clear", click: function () {
            webix.confirm({
              title: "Clear the form",
              text: "Do you really want to clear this form?"
            }).then(
              function () {
                $$("edit_films").clear();
                $$("edit_films").clearValidation();
                webix.message("Form cleared");
              },
              function () {
                webix.message("Cancelled");
              }
            );
          }
        }
      ]
    },
    {}
  ],
  rules: {
    title: webix.rules.isNotEmpty,
    votes: function (vote) {
      return vote < 100000;
    },
    year: function (year) {
      return year >= 1970 && year <= current_year;
    },
    rating: function (rating) {
      return webix.rules.isNotEmpty(rating) && rating > 0;
    },
  },
  elementsConfig: {
    bottomPadding: 30
  },
  width: 300
};

const copyright = "The software is provided by <a target='_blank' href='https://webix.com'>https://webix.com</a>. All rights reserved (c)";

const footer = { view: "template", template: copyright, autoheight: true, css: "footer" };

const main = {
  cells: [
    { id: "Dashboard", cols: [ data, form ]},
    { id: "Users", template: "Users"},
    { id: "Products", template: "Products"},
    { id: "Admin", template: "Admin"}
  ]
}

webix.ui({
  id: "app",
  rows: [
    toolbar,
    { cols: [ sidebar, { view: "resizer" }, main ]},
    footer
  ]
});

let button_popup = webix.ui({
  view: "popup",
  id: "settings",
  body: {
    view: "list",
    data: [
      { id: 1, name: "Settings" },
      { id: 2, name: "Log Out" }
    ],
    template: "#name#",
    autoheight: true,
    autowidth: true,
    select: true
  }
});

let current_year = new Date().getFullYear();
const list_items = ['Dashboard', 'Users', 'Products', 'Locations'];

const small_film_set = [
  { id: 1, title: "The Shawshank Redemption", year: 1994, votes: 678790, rating: 9.2, rank: 1, category: "Thriller" },
  { id: 2, title: "The Godfather", year: 1972, votes: 511495, rating: 9.2, rank: 2, category: "Crime" },
  { id: 3, title: "The Godfather: Part II", year: 1974, votes: 319352, rating: 9.0, rank: 3, category: "Crime" },
  { id: 4, title: "The Good, the Bad and the Ugly", year: 1966, votes: 213030, rating: 8.9, rank: 4, category: "Western" },
  { id: 5, title: "Pulp fiction", year: 1994, votes: 533848, rating: 8.9, rank: 5, category: "Crime" },
  { id: 6, title: "12 Angry Men", year: 1957, votes: 164558, rating: 8.9, rank: 6, category: "Western" }
];

const form = [
  { template: "Edit films", type: "section" },
  { view: "text", label: "Title", name: "title", invalidMessage: "Title cannot be empty" },
  { view: "text", label: "Year", name: "year", invalidMessage: `Year should be between 1970 and ${current_year}` },
  { view: "text", label: "Rating", name: "rating", invalidMessage: "Rating cannot be empty or equal 0" },
  { view: "text", label: "Votes", name: "votes", invalidMessage: "Votes must be less than 100000" },
  {
    cols: [
      {
        view: "button", value: "Add new", css: "webix_primary", click: function () {
          let result = $$("edit_films").validate();
          if (result) {
            let current_entry = $$("edit_films").getValues();
            $$("film_list").add(current_entry);
            webix.message("Entry successfully added");
          }
        }
      },
      {
        view: "button", value: "Clear", click: function () {
          webix.confirm({
            title: "Form is incomplete",
            text: "Do you still want to continue?"
          }).then(
            function () {
              $$("edit_films").setValues("");
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
];

const copyright = "The software is provided by <a target='_blank' href='https://webix.com'>https://webix.com</a>. All rights reserved (c)";

webix.ui({
  rows: [
    {
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
    },
    {
      cols: [
        {
          rows: [
            { view: "list", data: list_items, css: "list" },
            { view: "label", label: "<span class='webix_icon wxi-check'></span>Connected", align: "center", css: "connect-message" }
          ]
        },
        { view: "resizer" },
        { view: "datatable", id: "film_list", data: small_film_set, autoConfig: true, gravity: 3 },
        {
          view: "form", id: "edit_films", elements: form,
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
          gravity: 2
        }
      ]
    },
    { view: "template", template: copyright, autoheight: true, css: "footer" }
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

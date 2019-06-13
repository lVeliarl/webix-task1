const list_items = [ 'Dashboard', 'Users', 'Products', 'Locations'];
const small_film_set = [
	{ id:1, title:"The Shawshank Redemption", year:1994, votes:678790, rating:9.2, rank:1, category:"Thriller"},
	{ id:2, title:"The Godfather", year:1972, votes:511495, rating:9.2, rank:2, category:"Crime"},
	{ id:3, title:"The Godfather: Part II", year:1974, votes:319352, rating:9.0, rank:3, category:"Crime"},
	{ id:4, title:"The Good, the Bad and the Ugly", year:1966, votes:213030, rating:8.9, rank:4, category:"Western"},
	{ id:5, title:"Pulp fiction", year:1994, votes:533848, rating:8.9, rank:5, category:"Crime"},
	{ id:6, title:"12 Angry Men", year:1957, votes:164558, rating:8.9, rank:6, category:"Western"}
];
const form = [
  { template:"Edit films", type:"section"},
  { view:"text", label:"Title", name:"title"},
  { view:"text", label:"Year", name:"year"},
  { view:"text", label:"Rating", name:"rating"},
  { view:"text", label:"Votes", name:"votes"},
  { cols: [
    { view:"button", value:"Add new", css:"add-new"},
    { view:"button", value:"Clear"}
  ]}
];
const copyright = "The software is provided by <a target='_blank' href='https://webix.com'>https://webix.com</a>. All rights reserved (c)";

webix.ui({
  view:"layout",
  rows: [
    { cols: [
      { view: "label", label: "My App", align: "center", css:"app-name"},
      { gravity: 8},
      { view: "button", type:"icon", icon:"mdi mdi-account", label: "Profile", css: "profile"}
    ], css: "app-header"},
    { cols: [
      { view: "list", data: list_items, autoheight: true, css: "list"},
      { view: "resizer"},
      { view: "datatable", data: small_film_set, autoConfig: true, gravity: 3, height: 900},
      { view: "form", id: "edit_films", elements: form}
    ]},
    { view:"template", template: copyright, autoheight: true, css:"footer"}
    ]
});

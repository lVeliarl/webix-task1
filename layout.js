let current_year = new Date().getFullYear();

const list_items = ['Dashboard', 'Users', 'Products', 'Admin'];

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
    {
      view: "list",
      data: list_items,
      id: "sidebar",
      select: true,
      css: "list",
      width: 200,
      on: {
        onAfterSelect: function (id) {
          $$(id).show();
        }
      },
      scroll: "auto"
    },
    { view: "label", label: "<span class='webix_icon wxi-check'></span>Connected", align: "center", css: "connect-message" }
  ]
};

const options = [
  { "id": 1, "value": "Drama" },
  { "id": 2, "value": "Fiction" },
  { "id": 3, "value": "Comedy" },
  { "id": 4, "value": "Horror" }
];

const data = {
  view: "datatable",
  id: "film_list",
  url: "src/data.js",
  columns: [
    { id: "rank", header: ["Rank", { content: "numberFilter" }], template: "#rank#", sort: "int", css: "rankings" },
    { id: "title", header: ["Title", { content: "textFilter" }], template: "#title#", sort: "string", fillspace: true },
    { id: "categoryId", header: ["Category", { content: "textFilter" }], sort: "string", collection: options },
    { id: "votes", header: ["Votes", { content: "textFilter" }], template: "#votes#", sort: "int" },
    { id: "rating", header: ["Rating", { content: "textFilter" }], template: "#rating#", sort: "string" },
    { id: "year", header: "Year", template: "#year#" },
    { view: "list", id: "delete_entry", header: "", template: "<span class='webix_icon wxi-trash'></span>" }
  ],
  scheme: {
    $init: function (obj) {
      obj.categoryId = randomRange(1, 5);
    }
  },
  select: true,
  on: {
    onAfterLoad: function () {
      $$("film_list").data.each(function (obj, id) {
        let convertedVotes = obj.votes.replace(/\,/g, '');
        $$("film_list").updateItem(id + 1, { votes: convertedVotes });
      })
    }
  },
  onClick: {
    "wxi-trash": function (e, id) {
      webix.confirm({
        title: "Delete this film",
        text: "Do you really want to delete this film from the list?"
      }).then(
        function () {
          $$("film_list").remove(id);
          webix.message("Item removed");
        },
        function () {
          webix.message("Cancelled");
        })
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
          view: "button", value: "Save", id: "update_entry", css: "webix_primary", click: function () {
            $$("edit_films").save();
          }
        },
        {
          view: "button", value: "Clear", click: function () {
            webix.confirm({
              title: "Clear the form",
              text: "Do you really want to clear this form?"
            }).then(
              function () {
                $$("film_list").clearSelection();
                clearView();
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
      return webix.rules.isNotEmpty(rating) && parseFloat(rating.replace(/,/g, '')) > 0;
    },
  },
  elementsConfig: {
    bottomPadding: 30
  },
  width: 300
};

const copyright = "The software is provided by <a target='_blank' href='https://webix.com'>https://webix.com</a>. All rights reserved (c)";

const footer = { view: "template", template: copyright, autoheight: true, css: "footer" };

const customers_toolbar = {
  view: "toolbar",
  cols: [
    {
      view: "text", id: "customers_filter",
      on: {
        onTimedKeyPress: function () {
          var value = this.getValue().toLowerCase();
          $$("customers_list").filter(function (obj) {
            return obj.name.toLowerCase().indexOf(value) !== -1 ||
              obj.country.toLowerCase().indexOf(value) !== -1;
          })
        }
      }
    },
    {
      view: "button", value: "Sort asc", maxWidth: 200, css: "webix_primary", click: function () {
        $$("customers_list").sort("#name#", "asc");
      }
    },
    {
      view: "button", value: "Sort desc", maxWidth: 200, css: "webix_primary", click: function () {
        $$("customers_list").sort("#name#", "desc");
      }
    },
    {
      view: "button", value: "Add new", maxWidth: 200, css: "webix_primary", click: function () {
        $$("customers_list").add({
          "name": "Tanya Krieg", "age": randomRange(18, 51), "country": "Germany"
        })
      }
    }
  ]
}

webix.protoUI({
  name: "edit_list"
}, webix.EditAbility, webix.ui.list);

const customers_list = {
  view: "edit_list",
  id: "customers_list",
  url: "src/users.js",
  editable: true,
  editor: "text",
  editValue: "name",
  editaction: "dblclick",
  template: "#name# from #country# <span class='webix_icon wxi-close remove-customer'></span>",
  scheme: {
    $init: function (obj) {
      if (obj.age < 26) {
        obj.$css = "highlight";
      }
    }
  },
  onClick: {
    "remove-customer": function (e, id) {
      webix.confirm({
        title: "Remove the user",
        text: "Do you really want to remove this user from the list?"
      }).then(
        function () {
          $$("customers_list").remove(id);
          webix.message("User removed");
        },
        function () {
          webix.message("Cancelled");
        })
      return false;
    }
  },
  select: true,
  maxHeight: 250
}

const customers_chart = {
  view: "chart",
  id: "customers_chart",
  type: "bar",
  value: "#count#",
  tooltip: "Number of residents: #count#",
  xAxis: {
    title: "Country",
    template: "#country#",
    lines: true
  },
  yAxis: {}
}

const company_products = {
  view: "treetable",
  id: "Products",
  columns: [
    { id: "id", header: "" },
    { id: "title", header: "Title", template: "{common.treetable()} #title#", width: 250, editor: "text" },
    { id: "price", header: "Price", editor: "text" }
  ],
  url: "src/products.js",
  editable: true,
  editaction: "dblclick",
  on: {
    onAfterLoad: function () {
      this.openAll();
    }
  },
  rules: {
    "title": function (obj) {
      return webix.rules.isNotEmpty(obj) && obj.length > 2;
    },
    "price": function (obj) {
      return webix.rules.isNotEmpty(obj) && obj > 0;
    }
  }
}

const tabbar = {
  view: "tabbar",
  id: "filter_films",
  options: [
    { id: 1, value: "All" },
    { id: 2, value: "Old" },
    { id: 3, value: "Modern" },
    { id: 4, value: "New" }
  ],
  on:{
    onChange:function(){
      $$("film_list").filterByAll();
    }

  }
}

const main = {
  cells: [
    {
      id: "Dashboard",
      cols: [
        {
          rows: [
            tabbar, data
          ]
        },
        form
      ]
    },
    { id: "Users", rows: [customers_toolbar, customers_list, customers_chart] },
    company_products,
    { id: "Admin", template: "Admin" }
  ]
}

webix.ready(function () {
  webix.ui({
    id: "app",
    rows: [
      toolbar,
      { cols: [sidebar, { view: "resizer" }, main] },
      footer
    ]
  }),
    $$("sidebar").select("Dashboard");
  $$("edit_films").bind($$("film_list"));

  $$("film_list").registerFilter(
    $$("filter_films"),
    {
      columnId: "year",
      compare: function (value, filter, item) {
        if (filter == 1) {
          return value;
        }
        if (filter == 2) {
          return value < 1980;
        }
        if (filter == 3) {
          return value >= 1980 && value < 2010;
        } else return value >= 2010;
      }
    },
    {
      getValue: function (node) { return node.getValue(); },
      setValue: function (node, value) { node.setValue(value); }
    }
  )

  $$("customers_chart").sync($$("customers_list"), function () {
    this.group({
      by: "country",
      map: {
        count: ["name", "count"]
      }
    })
  });
})

const button_popup = webix.ui({
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

function clearView() {
  $$("edit_films").clear();
  $$("edit_films").clearValidation();
}

function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

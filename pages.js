var pages = [
  {
    title: "dear R,",
    content: `you may think yourself a small detective traveling through small towns. solving simple mysteries.
    <br><br>
    however, the world is far more mysterious than we anticipated. you must first learn <em>how things function</em> before you find <em>the anomaly</em>.
    <br><br>
    <button onclick="nav(1)">i've left a gift on the countertop. don't forget to bring it with you.</button>
    <br><br>
    i miss you already.
    <br><br>
    <span style="float:right">love, B</span>`
  },
  {
    title: "upon the countertop",
    content: `lies a small yellow highlighter. B's favorite.
    <br><br>
    as you uncap it, you instinctively understand that you can <em>highlight</em> words that you come across to <em>interact</em> with them.
    <br><br>
    now, it's time to set off to the train station.`,
    typeStyle: "type",
    func: function() {
      v.canHighlight = true;
      container.classList.remove("noselect");
    }
  },
  {
    title: "B",
    content: `you have no way of contacting B at the moment.`,
    typeStyle: "type"
  },
  {
    title: "yourself",
    content: "I've got work to do.",
    typeStyle: "typeWords"
  },
  {
    title: "...",
    content: "B is... cagey like that. that's just how you two have been.",
    typeStyle: "type"
  }
];

var pageInteractions = {
  "train/station": function() { generateMystery() },

  "highlighter": function() { nav(1) },
  "counter": function() { nav(1) },
  "B": function() { nav(2) },

  "R/you": function() { nav(3) },
};

var pageComparisons = [
  {
    one: ["miss", 0], //keyword, page number
    two: ["no way of contact", 0],
    jump: 4 //result of comparison
  }
];

function init_pages() {
  _history.log.push(pages[0]);

  pagination(0);
}

function generateMystery() {
  while (bookmarks.firstElementChild) {
    bookmarks.firstElementChild.remove();
  }

  _history.log = [];
  _history.cursor = 0;

  let m = mystery();

  pages = m.pages;
  pageInteractions = m.pageInteractions;
  pageComparisons = m.pageComparisons;

  nav(1);
}
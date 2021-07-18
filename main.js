var container, root, cursor, content, pagination, title, notes, bookmarks;
var mouse = {
  x:-1,
  y:-1,
  element: null,
  text: null,
  minCursorSize: undefined,
};
var page = 0;
var _history = {
  log: [],
  cursor: 0,
};

window.onload = function() {
  // initialization

  container = document.getElementById("container");
  content = document.getElementById("content");
  _pagination = document.getElementById("pagination");
  title = document.getElementById("title");
  notes = document.getElementById("notes");
  bookmarks = document.getElementById("bookmark_container");
  root = document.documentElement;

  // cursor

  cursor = document.getElementById("cursor");
  cursor.style.left = window.innerWidth / 2 + "px";
  cursor.style.top = window.innerHeight / 2 +"px";
  mouse.minCursorSize = parseFloat(window.getComputedStyle(container, null).getPropertyValue('font-size')) * 2;
  document.onmousemove = function(e) {
    mouse.x = e.pageX;
    mouse.y = e.pageY;

    if (mouse.text) {
      let w = mouse.x - mouse.text.x;
      let h = mouse.y - mouse.text.y;

      mouse.text.offsetX = w/2;
      mouse.text.offsetY = h/2;

      if (Math.abs(w) < mouse.minCursorSize) w = mouse.minCursorSize;
      if (Math.abs(h) < mouse.minCursorSize) h = mouse.minCursorSize;

      root.style.setProperty('--cursor-width', Math.abs(w)+"px");
      root.style.setProperty('--cursor-height', Math.abs(h)+"px");
    }
  };
  document.onmousedown = function(e) {
    if (!v.canHighlight && !mouse.element) return;

    cursor.classList.remove("t");
    cursor.classList.remove("inactive");
    cursor.classList.add("active");

    if (!cursor.classList.contains("buttonhover")) {
      mouse.text = {
        x: mouse.x,
        y: mouse.y,
        offsetX: 0,
        offsetY: 0
      }
    }
  };
  document.onmouseup = function(e) {
    if (mouse.text) {
      root.style.setProperty('--cursor-width', "2em");
      root.style.setProperty('--cursor-height', "2em");
      mouse.text = null;
      cursor.classList.add("t");

      setTimeout(function() {
        cursor.classList.remove("active");
        cursor.classList.add("inactive");
      }, 250)
    } else {
      cursor.classList.remove("active");
      cursor.classList.add("inactive");
    }

    // this causes typing to replace other pages
    // if (_stopTyping) _finishTyping = true;

    hover();
  };

  document.onselectionchange = function() {
    if (v.canHighlight) highlighter();
  };

  setInterval(function() {
    let posx = cursor.offsetLeft;
    let posy = cursor.offsetTop;
    let x = posx + 0.1 * (mouse.x - posx);
    let y = posy + 0.1 * (mouse.y - posy);

    if (mouse.element) {
      let offsetX = (mouse.x - mouse.element.x) / mouse.element.width;
      let offsetY = (mouse.y - mouse.element.y) / mouse.element.height;

      x -= offsetX * (mouse.element.width / 11);
      y -= offsetY * (mouse.element.height / 11);
    } else if (mouse.text) {
      x = mouse.text.x+mouse.text.offsetX;
      y = mouse.text.y+mouse.text.offsetY;
    }

    cursor.style.left = x+"px";
    cursor.style.top = y+"px";
  }, 10);

  // pages

  init_pages();
};

function hover(element) {
  if (element == null) {
    root.style.setProperty('--cursor-width', "2em");
    root.style.setProperty('--cursor-height', "2em");
    mouse.element = null;
    cursor.classList.remove("buttonhover");
    return;
  }

  let box = element.getBoundingClientRect();
  let w = element.offsetWidth;
  let h = element.offsetHeight;

  mouse.element = {
    x: box.left + w/2, // center
    y: box.top + h/2, // center
    width: w,
    height: h
  };

  root.style.setProperty('--cursor-width', w+"px");
  root.style.setProperty('--cursor-height', h+"px");

  if (mouse.text) {
    cursor.classList.remove("active");
    mouse.text = null;
  }
  cursor.classList.add("buttonhover");
}

function printPage(p, typeStyle) {
  if (p.title) {
    // this fuckery for safari artifacting, no other redrawing method works
    const clone = document.createElement("h1");
    clone.id = "title";
    clone.innerHTML = p.title;
    title.replaceWith(clone);
    title = clone;
  }
  if (!p.speed) p.speed = null;
  if (!p.func) p.func = null;
  typeStyle = typeStyle || "default";

  let pagecontent = p.content.replace(/\<button/g, `<button onmouseover="hover(this)" onmouseout="hover()"`);

  switch (typeStyle) {
    case "type":
      type(content, pagecontent, p.speed, p.func);
      break;
    case "typeWords":
      typeWords(content, pagecontent, p.func);
      break;
    default:
      _stopTyping = true;
      _loop = requestAnimationFrame(function() {
        content.innerHTML = pagecontent;
      });
      if (p.func) p.func();
      break;
  }

  toggleNotes("hide");

  var children = bookmarks.children;
  for (let i=0; i<children.length; i++) {
    let bookmark = children[i];
    if (bookmark.name == _history.cursor) {
      bookmark.classList.add("onpage")
    } else {
      bookmark.classList.remove("onpage");
    }
  }
}

function nav(p) {
  if (_history.log.includes(pages[p])) {
    pagination(_history.log.indexOf(pages[p]) - _history.cursor);
    return;
  }

  printPage(pages[p], pages[p].typeStyle);

  _history.log.push(pages[p]);
  _history.cursor = _history.log.length-1;

  pagination(0, true);
}

function pagination(dir, disablePrint) {
  _history.cursor += dir;

  if (_history.cursor < 0) _history.cursor = 0;
  else if (_history.cursor >= _history.log.length) _history.cursor = _history.log.length-1;

  let p = "";
  let dp = _history.cursor+1;

  if (dp > 1) {
    p += `<button onmouseover="hover(this)" onmouseout="hover()" onclick="pagination(-1)">&lsaquo;</button>`;
  } else {
    p += "<span></span>"
  }

  if (_history.cursor >= 2) {
    p += "<span>...</span>";
  } else {
    p += "<span></span>"
  }

  if (_history.cursor >= 1) {
    let num = dp-1;
    p += `<button onmouseover="hover(this)" onmouseout="hover()" onclick="pagination(-1)">`+num+`</button>`;
  } else {
    p += "<span></span>"
  }

  p += `<span>`+dp+`</span>`;

  if (dp < _history.log.length) {
    let num = dp+1;
    p += `<button onmouseover="hover(this)" onmouseout="hover()" onclick="pagination(1)">`+num+`</button>`;
  } else {
    p += "<span></span>"
  }

  if (_history.log.length > dp + 1){
    p += "<span>...</span>";
  } else {
    p += "<span></span>"
  }

  if (_history.log.length > dp){
    p += `<button onmouseover="hover(this)" onmouseout="hover()" onclick="pagination(1)">&rsaquo;</button>`;
  } else {
    p += "<span></span>"
  }

  _pagination.innerHTML = p;

  if (disablePrint) return;
  printPage(_history.log[_history.cursor]);
}
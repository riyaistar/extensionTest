fetch(chrome.extension.getURL("widget/widget.html"))
  .then((response) => response.text())
  .then((result) => {
    var new_elem = document.createElement('div');
    var isdragged = false;
    new_elem.innerHTML = result;

    var something = document.querySelector('body').firstChild;
    document.querySelector('body').insertBefore(new_elem, something);
    var initialScreenHeight = window.innerHeight, initialScreenWidth = window.innerWidth;
    chrome.storage.sync.get('mymove', (res) => {
      if (res.mymove) {
        document.getElementById('salesken_div').style.left = res.mymove.position_x + 'px'
        document.getElementById('salesken_div').style.top = res.mymove.position_y + 'px'
      } else {
        document.getElementById('salesken_div').style.left = window.screenX + window.outerWidth - 400 + 'px';
        document.getElementById('salesken_div').style.top = window.screenY + window.outerHeight - 300 + 'px';
      }
    })

    let iconUrl = chrome.extension.getURL("images/app-icon(512x512).png");
    document.getElementById("skenicon").src = iconUrl;
    document.getElementById("skenicon").addEventListener("click", function (event) {
      console.log(event)
      if (!isdragged) {
        if (document.getElementById("salesken-cue-container").style.display === "block") {
          document.getElementById("salesken-cue-container").style.display = "none";
        } else {
          openpopup();
          document.getElementById("salesken-cue-container").style.display = "block";
        }
      }
      isdragged = false;

    });

    window.addEventListener("resize", (event) => {
      var initialPosX = parseInt(document.getElementById('salesken_div').style.left);
      var initialPosY = parseInt(document.getElementById('salesken_div').style.top);

      var currentScreenHeight = window.innerHeight, currentScreenWidth = window.innerWidth;

      if (initialScreenHeight != currentScreenHeight) {
        var currentY = (initialPosY * currentScreenHeight) / initialScreenHeight;
        document.getElementById('salesken_div').style.top = currentY + "px";
        repositionPopup();
      }
      if (initialScreenWidth != currentScreenWidth) {
        var currentX = (initialPosX * currentScreenWidth) / initialScreenWidth;
        document.getElementById('salesken_div').style.left = currentX + "px";
        repositionPopup();
      }
    });


    document.getElementById("sken-container-close").addEventListener("click", () => {
      document.getElementById("salesken-cue-container").style.display = "none";
      isdragged = false;
    });

    dragElement(document.getElementById("salesken_div"));

    function dragElement(elmnt) {
      var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
      if (document.getElementById(elmnt.id + "header")) {
        /* if present, the header is where you move the DIV from:*/
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
      } else {
        /* otherwise, move the DIV from anywhere inside the DIV:*/
        elmnt.onmousedown = dragMouseDown;
      }

      function dragMouseDown(e) {

        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
      }

      function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        var winW = document.documentElement.clientWidth || document.body.clientWidth,
          winH = document.documentElement.clientHeight || document.body.clientHeight;
        maxX = winW - elmnt.offsetWidth - 1,
          maxY = winH - elmnt.offsetHeight - 1;
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        // set the element's new position:
        //console.log((elmnt.offsetLeft - pos1), maxY, (elmnt.offsetLeft - pos1), maxX);
        if ((elmnt.offsetTop - pos2) <= maxY && (elmnt.offsetTop - pos2) >= 0) {
          elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        }
        if ((elmnt.offsetLeft - pos1) <= maxX && (elmnt.offsetLeft - pos1) >= 0) {
          elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }
        repositionPopup();
        isdragged = true;
      }

      function closeDragElement(event) {

        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;


        browser.storage.sync.set("divposition", {
          position_x: document.getElementById('salesken_div').offsetLeft,
          position_y: document.getElementById('salesken_div').offsetTop
        });

        document.getElementById("salesken-cue-container").style.right = null;

      }
    }
    function repositionPopup() {
      var iconleftpos = parseInt(document.getElementById('salesken_div').style.left)
      var icontoppos = parseInt(document.getElementById('salesken_div').style.top)
      if (document.getElementById("salesken-cue-container").style.display === "block") {
        if (document.getElementById("salesken-cue-container").style.right === "0px") {
          if ((window.innerWidth - iconleftpos) > 333) {
            document.getElementById("salesken-cue-container").style.right = window.innerWidth - iconleftpos + "px";
          }
        } else {
          if ((window.innerWidth - iconleftpos) < 333) {
            document.getElementById("salesken_div").style.left = window.innerWidth - 333 + "px";
          }
        }
      }


    }

    function openpopup() {
      var iconleftpos = parseInt(document.getElementById('salesken_div').style.left)
      var icontoppos = parseInt(document.getElementById('salesken_div').style.top)

      if ((screen.width - iconleftpos - 100) < 333) {
        document.getElementById("salesken-cue-container").style.right = 0
      } else {
        document.getElementById("salesken-cue-container").style.right = null;
      }


      if ((screen.height - icontoppos - 100) < 500) {
        document.getElementById("salesken-cue-container").style.bottom = -10 + "px";
        document.getElementById("salesken-cue-container").style.top = null;
      } else {
        document.getElementById("salesken-cue-container").style.top = 0 + "px";
        document.getElementById("salesken-cue-container").style.bottom = null;

      }

    }

  }).catch((error) => {
    console.error('Error:', error);
  });

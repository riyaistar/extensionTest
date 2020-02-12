fetch(chrome.extension.getURL("widget/widget.html"))
  .then((response) => response.text())
  .then((result) => {
    var new_elem = document.createElement('div');

    new_elem.innerHTML = result;



    var something = document.querySelector('body').firstChild;

    document.querySelector('body').insertBefore(new_elem, something);


    var move_x = browser.storage.sync.get('mymove').then((res) => {
      document.getElementById('mydiv').style.left = res.mymove.position_x + 'px'
      document.getElementById('mydiv').style.top = res.mymove.position_y + 'px'

    });

    let iconUrl = chrome.extension.getURL("images/app-icon(512x512).png");
    document.getElementById("skenicon").src = iconUrl;
    document.getElementById("skenicon").addEventListener("click", function () {
      document.getElementById("salesken-cue-container").style.display = "block";

    });



    document.getElementById("sken-container-close").addEventListener("click", () => {
      document.getElementById("salesken-cue-container").style.display = "none";
    });

    dragElement(document.getElementById("mydiv"));

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
      }

      function closeDragElement(event) {
        console.log(event.x)
        console.log(event.y)

        if (event.x > screen.width) {
          event.x = screen.width - 20
        }
        browser.storage.sync.set({
          mymove: {
            position_x: event.clientX,
            position_y: event.clientY
          }
        });
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
      }
    }


  }).catch((error) => {
    console.error('Error:', error);
  });

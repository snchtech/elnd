console.log('work');
var blackCircle = '&#9679; ';
var openCircle = '&#9678; ';

(function() {
	"use strict";
    function define_JSLists() {
		var JSLists = {};

		var JSLists_Error = function(error, alertType) {
			console.log(error);
		}
		var getUl = function(){
			return document.getElementsByTagName("UL");
		};

		var getOl = function(){
			return document.getElementsByTagName("OL");
		};

		var getAllLists = function(){
			var olLists = Array.prototype.slice.call(document.getElementsByTagName("UL")),
				ulLists = Array.prototype.slice.call(document.getElementsByTagName("OL"))
			var gLists = olLists.concat(ulLists);
			return gLists;
		}

		JSLists.searchList = function(listId, searchTerm) {
			var i, j, lilNodes, liItems = document.getElementsByTagName("LI");
			for(i=0; i<liItems.length; i++) {
                if(liItems[i].hasChildNodes()) {
                    for(j=0; j<liItems[i].childNodes.length; j++) {
                        if(liItems[i].childNodes[j].innerHTML == searchTerm) {
							//?????
                        }
                    }
                }
			}
		}

		JSLists.collapseAll = function(listId) {
			var i, ulLists = document.getElementsByTagName("UL");
			for(i=0; i<ulLists.length; i++) {
               if(ulLists[i].className == "jsl-collapsed") {
                    console.log(ulLists[i].className + '\n' + '@');
               }
			};
		};

		JSLists.openAll = function(listId){
			var i, olLists = Array.prototype.slice.call(document.getElementsByTagName("UL")),
				ulLists = Array.prototype.slice.call(document.getElementsByTagName("OL"))
			var gLists = olLists.concat(ulLists);

			for(i=1; i<gLists.length; i++) {
				gLists[i].setAttribute('class', 'jsl-open');
			};
		};

		JSLists.padUnorderedLists = function(listId) {
			var i, listItems = document.getElementById(listId).getElementsByTagName("UL");
			for(i=0; i<listItems.length; i++) {
				listItems[i].classList.add('jslist-ul');
			}
		};

		JSLists.padOrderedLists = function(listId) {
			var i, listItems = document.getElementById(listId).getElementsByTagName("UL");
			for(i=0; i<listItems.length; i++) {
				listItems[i].classList.add('jslist-ol');
			}
		};

		JSLists.padLists = function(listId) {
			console.log('padList');
			var i, listItems = document.getElementById(listId).getElementsByTagName("LI");
			for(i=0; i<listItems.length; i++) {
				if(listItems[i].childNodes[0].className != "jsl-collapsed-arrow") {
					listItems[i].classList.add('jslist-li');
				}
			}
			for(i=1; i<listItems.length; i++) {
				// console.log(listItems[i].childNodes.length);
				if(listItems[i].classList = "jslist-li" && listItems[i].childNodes.length < 2) {
					listItems[i].innerHTML = blackCircle + listItems[i].innerHTML
				}
			}
			this.padUnorderedLists(listId);
			this.padOrderedLists(listId);
		};

        JSLists.createTree = function(listId, bulletPoint) {
			document.getElementById(listId).style.display = "none;"
			var i, j, curElem, ulCount, olCount, listItems = document.getElementById(listId).getElementsByTagName('LI'); //this should be the main parent
			for(i=0; i<listItems.length; i++) {
				if(listItems[i].id.length > 0) {
					curElem = document.getElementById(listItems[i].id);
                    ulCount = document.getElementById(listItems[i].id).getElementsByTagName("UL");
                    if(ulCount.length > 0){
                        for(j=0; j<ulCount.length; j++) {
                            if(ulCount[j].nodeName == "UL") {
                                break;
                            }
                        }
                        ulCount[j].setAttribute('class', 'jsl-collapsed');
                        var tglDiv = document.createElement("div");
                        tglDiv.setAttribute('class', 'jsl-list-closed');
                        tglDiv.setAttribute("id", listItems[i].id + i +'_tgl');
                        curElem.insertBefore(tglDiv, curElem.childNodes[0]);

                        document.getElementById(listItems[i].id + i +'_tgl').addEventListener('click', function(e) {
                            document.getElementById(e.target.id).classList.toggle('jsl-list-open');
                            document.getElementById(e.target.id).parentElement.lastElementChild.classList.toggle('jsl-open');
                            e.stopPropagation();
                        },true);
                    }
                } else {
					listItems[i].setAttribute("id", listId+"tmp"+i);
					curElem = document.getElementById(listId+"tmp"+i);
					ulCount = document.getElementById(listItems[i].id).getElementsByTagName("UL");

					if(ulCount.length > 0) { //There is a nested UL in this LI element, now find the position of the UL
						for(j=0; j<ulCount.length; j++) {
							if(ulCount[j].nodeName == "UL") {
								break; //Multiple UL's? //Set class collapseAll here
							}
						}
						ulCount[j].setAttribute('class', 'jsl-collapsed');
						var tglDiv = document.createElement("div");
						tglDiv.setAttribute('class', 'jsl-list-closed');
						tglDiv.setAttribute("id", listItems[i].id + i +'_tgl');
						curElem.insertBefore(tglDiv, curElem.childNodes[0]);

						document.getElementById(listItems[i].id + i +'_tgl').addEventListener('click', function(e){
							document.getElementById(e.target.id).classList.toggle('jsl-list-open');
							document.getElementById(e.target.id).parentElement.lastElementChild.classList.toggle('jsl-open');
							e.stopPropagation();
						},true);
					}
					listItems[i].removeAttribute("id");
				}
			}
			setTimeout(function() {
				document.getElementById(listId).style.display = "block;"
			}, 50); // stops FOUC!
			this.padLists(listId);
		};

		// JSLists.applyToList = function(listId, listType, applyIcons, applyTheme, themeNumber){
		//Check the params here
		// does the id exist?
		JSLists.applyToList = function(listId, bulletPoint) {
            this.createTree(listId, "UL");
		};
	return JSLists;
    }

	//define the JSLists library in the global namespace if it doesn't already exist
	if(typeof(JSLists) === 'undefined') {
		window.JSLists = define_JSLists();
	}else{
		console.log("JSLists already defined.");
	}
})();

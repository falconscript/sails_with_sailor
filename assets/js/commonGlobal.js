/* Common set of functions and globals designed for personal
 * ease of use in cross-browser hole filling
 * and simplification of some issues as well
 * as common operations.

 * Below:
 * GET variable parsing
 * SelectTable
 * addScript dynamically
 * Menu API
 * dump Function
 * JavaScript Tabbed Pane (Lebowitz)
 */

// Used by multiple applications (and login page) for logging in
function AJAXlogin(loginUrl) {
	$('#error').html("");

	$.ajax({
		url: loginUrl,
		data: {
			"login": document.LoginForm.elements[0].value,
			"password": document.LoginForm.elements[1].value,
			"ReferTo": document.LoginForm.ReferTo.value,
			"stayloggedin": document.LoginForm.elements[4].checked
		},
		beforeSend: function(xhr, settings) {
			$('#error').html("");
		},
		type: "POST"
	}).done(function(data, success, xhr) {

		if(data === "FAILED_LOGIN")
			$('#error').html("Wrong Username or Password.");
		else if (data === "SUCCESSFUL_LOGIN") {

			if($("input[name=ReferTo]"))
				window.location = $("input[name=ReferTo]").val();
			else if(document.referrer)
				window.location = document.referrer;
			else
				window.location = document.domain;
		}
		else
			$('#error').html("Error. The database is probably offline.<br />" + data);
	});
}

// Create Address Bar Variables... remove XSS opportunities
var addBarVars = {};
var badChars = /[\?\{\}\"<>\&:]/g;
var questionSpot = window.location.href.indexOf("?");
var GETpairs = questionSpot == -1 ? [] : window.location.href.substr(questionSpot+1).split( "&" );

for(var i in GETpairs) {
	if(!GETpairs[i] || !GETpairs[i].split) continue;

    var key = decodeURI(GETpairs[i].split('=')[0]).replace(badChars,'');
    var value = decodeURI(GETpairs[i].split('=')[1]).replace(badChars,'');
    addBarVars[key] = value;
}

// Console protection
var console = console || {};
console.log = console.log || function() { };

/*
 * Much simpler straightforward needs of making SelectTable
 * The old version of SelectTable made when I was learning JavaScript
 *
 * Default backgrounds and selected text colors are used
 *
 * Prerequisites:
 * obtainElementsFunction should be a function to obtain the necessary items
 * Pass in colors object with constants declared
 *
 *
 *
 * Define color choices in css, classnames are defined:
 * .st_selected
 * .st_unselected
 * You may add a :hover to both of them at your leisure
 */
function SelectTable(obtainElementsFunction) {

	// Confirm API used correctly
	if(typeof obtainElementsFunction != "function") {
		alert("makeSelectTable: First argument must be function");
		return;
	}

	if(this == window) {
		alert("makeSelectTable: Must call with new operator");
		return;
	}


	var self = this; // Set available for onclick handler
	// Grab elements
	var arr = obtainElementsFunction();
	this.selectitems = arr;
	var selectedClassname = 'st_selected';
	var unselectedClassname = 'st_unselected';

	// Attach listeners
	for(var i in this.selectitems) {
		if(!this.selectitems[i] || !this.selectitems[i].style) continue;

		(function (item) { // closure
			// Assure that all start unselected
			item.removeClassName(selectedClassname).addClassName(unselectedClassname);

			item.oldClick = arr[i].onclick; // Preserve onclick if necessary

			item.onclick = function() {
				this.removeClassName(unselectedClassname).addClassName(selectedClassname);
				this.selectedvar = true;
				self.selectedItem = this;

				// Unselect all current
				for(var j in arr) {
					if(arr[j] && arr[j].style && arr[j] != this) {
						arr[j].selectedvar = false;
						arr[j].removeClassName(selectedClassname).addClassName(unselectedClassname);
					}
				}

				if(typeof this.oldClick == "function") this.oldClick();
			};

		})(this.selectitems[i]);
	}

	this.getSelectedItem = function() {
		return this.selectedItem;
	};

	// Return the index of selectitems of a DOM item.
	// Useful for searching.
	this.indexOf = function(domElement) {

		for(var i in this.selectitems) {
			if(this.selectitems[i] == domElement)
				return i;
		}

		return -1;
	};

	this.selectIfExists = function(domElement) {
		var index = this.indexOf(domElement);
		if(index != -1) {
			domElement.onclick();
		}
	};

	this.selectNext = function() {
		var isNext = false;
		for(var i in this.selectitems) {
			if(isNext && this.selectitems[i].onclick) {
				this.selectitems[i].onclick();
				return;
			}

			if(this.selectitems[i] && this.selectitems[i].selectedvar)
				isNext = true;
		}
	};
}


// Dynamically add JS/CSS file to DOM
function addScript(filename) {

	var ext = filename.split('.').pop(),
		fileref;

	if (ext == "js" || ext == "php") {
			fileref = document.createElement('script');
			fileref.setAttribute("type","text/javascript");
			fileref.setAttribute("src", filename);
	} else if (ext == "css") {
			fileref = document.createElement("link");
			fileref.setAttribute("rel", "stylesheet");
			fileref.setAttribute("type", "text/css");
			fileref.setAttribute("href", filename);
	}

	if (typeof fileref != "undefined") {
		document.getElementsByTagName("head")[0].appendChild(fileref);
		return fileref;
	}
}

// Dynamically add CSS code directly to the page.
function addCss(cssCode) {

	var styleElement = document.createElement("style");

	styleElement.type = "text/css";

	if (styleElement.styleSheet) {
    	styleElement.styleSheet.cssText = cssCode;
    } else {
    	styleElement.appendChild(document.createTextNode(cssCode));
    }

    document.getElementsByTagName("head")[0].appendChild(styleElement);
}

// Simple menu UI created when learning JavaScript
// Attempts to maintain old eventlisteners
// requirements: main item taken in, has TWO children.
function makeMenu(item) {
	item.oldOnClick = item.onclick;
	item.onclick = function toggleVisibility() {

		var children = this.childNodes;

		for(var i in children) {
			if(children[i] && children[i].style) {
				// Toggle visibility
				if(children[i].style.display == "none") //if hidden, show.
					children[i].style.display = "block";
				else //shown, so hide it
					children[i].style.display = "none";
			}
		}

		if(typeof this.oldOnClick == 'function')
			this.oldOnClick();
	};
	item.onmouseout = function () {
		var children = this.childNodes;

		for(var i in children) {
			if(children[i] && children[i].style)
				children[i].style.display = "none";
		}
	};


	item.style.cursor = "pointer";
	item.style.zIndex = "3";
	item.style.position = "absolute";
	item.style.border = "5px grey outset";
	item.style.padding = "2px";
	item.onmouseover = function(){ this.style.background = "whitesmoke"; };
	item.onmouseout = function(){ this.style.background = "white"; };
	var children = item.childNodes;

	for(var i in children) {
		if(children[i] && children[i].style) {
			children[i].style.zIndex = "5";
			children[i].style.display = "block";
		}

		var grandchildren = children[i].childNodes;

		for(var m in grandchildren) {
			if(grandchildren[m] && grandchildren[m].style) {
				grandchildren[m].onmouseover = function() { this.style.background = "white";   };
				grandchildren[m].onmouseout =  function() { this.style.background = "inherit"; };
			}
		}
	}
	item.onclick();
}

/*
 * Personal TabbedPane implementation
 *
 * Pass in a getter function to get all header
 * elements (Recommended by class)
 * set each header's name as id of body divs
 *
 * <div class="aHeader" name="bodyItem"></div>
 * correponds to
 * <div id="bodyItem">
 */
function Lebowitz(getElements) {

	if(typeof getElements != "function") {
		alert("getElements isn't a function");
		return;
	}

	this.headers = getElements();
	var self = this;

	for(var i in this.headers) {

		if(!this.headers[i] || !this.headers[i].getAttribute)
			continue;

		(function (header) { // closure
			var correspondingBodyDiv = document.getElementById(header.getAttribute("name"));

			header.bodyDiv = correspondingBodyDiv;

			if(!correspondingBodyDiv)
				alert(header.id + "\nLebowitz: BodyDiv's name for this comes up as null!");

			//onclick management
			header.oldonclick = header.onclick;
			header.onclick = function() {
				var elems = self.headers;
				for(var k in elems) {
					if(!elems[k] || !elems[k].style || !elems[k].bodyDiv)
						continue;

					if (elems[k] != this) {
						elems[k].bodyDiv.style.display = "none";
						elems[k].bodyDiv.style.visibility = "hidden";
					} else if(elems[k] == header && header.bodyDiv) {
						this.bodyDiv.style.display = "block";
						this.bodyDiv.style.visibility = "visible";
					}
				}

				// Because of this, you may hit recursion issues if you call Lebowitz
				// twice on the same set of elements. LAME.
				//if(typeof header.oldonclick == 'function')
				//	header.oldonclick();
			};
		})(this.headers[i]);
	}
}



/*
 * Dump function for JavaScript variables
 *
 * Inspired by PHP's var_dump
 * Call on object with optional shouldAlert boolean
 * To see details of the object.
 *
 * Upon calling, window.dumpvar can be accessed
 * with a variable copy at time of calling.
 */
function dump(obj, shouldAlert) {
	// test for string
	if(typeof obj == "string") {
		var out = obj;
	} else {
		var out = '';
		for (var i in obj)
			out += i + ": " + obj[i] + "\n\n";
	}
	// Alert
	if(shouldAlert) {
		alert(out);
	} else {
		// If avoiding alerts has been chosen...
		var pre = document.createElement('pre');
		pre.innerHTML = out;
		document.body.appendChild(pre);
	}

	// Set a window variable equal to this item, for further debugging
	window["dumpvar"] = obj;

	// Include it into an array
	(  window.dumpArray = window.dumpArray || []   ).push(obj);
}


/* Element Fix
 * Forgot where this source came from, I didn't make it
 *
 * Provide prototyping and declaration for each DOM item
 * to be an Element. Modern browsers do this already,
 * this is mostly just hole patching.
 *
 *  Usage example to add function to all DOM elements
 *  Element.prototype.yourFunction = function() {
 *          alert("yourFunction");
 *  };
 */
if(!window.Element) {
    Element = function() {};

    // Override and catch document.createElement via Closure
    var __createElement = document.createElement;

    document.createElement = function(tagName) {

        var element = __createElement(tagName);

        for(var key in Element.prototype)
        	element[key] = Element.prototype[key];

        return element;
    }
}

// Common jQuery-like className changers. Developed when jQuery had bugs
Element.prototype.hasClassName = function(name) {
  return new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)").test(this.className);
};

Element.prototype.addClassName = function(name) {
  if (!this.hasClassName(name)) {
    //this.className = this.className ? [this.className, name].join(' ') : name;
    this.className = this.className ? this.className.split(' ').concat([name]).join(' ') : name;
  }
  return this;
};

Element.prototype.removeClassName = function(name) {
  if (this.hasClassName(name)) {
    //var c = this.className;
    //this.className = c.replace(new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)", "g"), "");
    var classes = this.className.split(' ');
    classes.splice(classes.indexOf(name), 1);
    this.className = classes.join(' ');
  }
  return this;
};
Element.prototype.html = function(html) {
	if(['string', 'number'].indexOf(typeof html) != -1) {
		this.innerHTML = html;
	}

	return this.innerHTML;
};
Element.prototype.appendHTML = function(html) {
	if(['string', 'number'].indexOf(typeof html) != -1) {
		this.innerHTML += html;
	} else {
		console.log("Something weird was passed into .html - " + html);
	}
};
/*Element.prototype.hide = function() {
	if(this.style.display == 'none') {
		this.oldDisplay = this.style.display;
		this.style.display = 'none';
	}
};
Element.prototype.show = function() {
	if(this.style.display != 'none') {
		this.style.display = (this.oldDisplay) ? this.oldDisplay : 'block';
	}
};*/
/* This is a new feature that allows you to turn an in-page template/tag
 * into a full fledged UI component.
 *
 * The usage is getByIdEtc('anId').createJSTemplateFromDOMElement
 */
/*Element.prototype.createJSTemplateFromDOMElement = function() {
	var elementCopyNotInDom = this.cloneNode(true);
	document.body.remove(this);
	return elementCopyNotInDom;
};*/

var UITemplate = function(arg1) {
	// Constructor

	if(typeof arg1 == 'string') {
		alert('I do not have any accessor methods implemented for string yet');
		// arg1 = $(arg1); // set arg1 to this DOMElement. It will
	}
	if(typeof arg1 !== 'object') {
		alert('You did not pass an object into UITemplate');
	}
	if(! ('innerHTML' in arg1)) {
		alert('You passed an object into UITemplate, but it is not a DOM element');
	}
	// Else, make object.

	var elementCopyNotInDom = this.cloneNode(true);
	document.body.remove(this);
	return elementCopyNotInDom;
};
UITemplate.prototype = {

};


/*
 * Simple encryption decryption and compression functions
 * Uses CSV formatting
 */
function decodeASCII(ar) { //Make string normal
  var k = [];
  k = ar.split(',');
  var str='';

  for(var i=0;i<ar.length;i++)
	str += String.fromCharCode(k[i]);

  return str;
}

function encodeAsASCII(str) { //Messes up a string
  var str2='';
  for(var i=0;i<str.length;i++) {
    str2+=str.charCodeAt(i)//.toString();
    if(i<str.length-1) str2+=',';
  }
  return str2;
}

function lzw_encode(s) {
    var dict = {};
    var data = (s + "").split("");
    var out = [];
    var currChar;
    var phrase = data[0];
    var code = 256;
    for (var i=1; i<data.length; i++) {
        currChar=data[i];
        if (dict[phrase + currChar] != null) {
            phrase += currChar;
        }
        else {
            out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
            dict[phrase + currChar] = code;
            code++;
            phrase=currChar;
        }
    }
    out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
    for (var i=0; i<out.length; i++) {
        out[i] = String.fromCharCode(out[i]);
    }
    return out.join("");
}

// Decompress an LZW-encoded string
function lzw_decode(s) {
    var dict = {};
    var data = (s + "").split("");
    var currChar = data[0];
    var oldPhrase = currChar;
    var out = [currChar];
    var code = 256;
    var phrase;
    for (var i=1; i<data.length; i++) {
        var currCode = data[i].charCodeAt(0);
        if (currCode < 256) {
            phrase = data[i];
        }
        else {
           phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
        }
        out.push(phrase);
        currChar = phrase.charAt(0);
        dict[code] = oldPhrase + currChar;
        code++;
        oldPhrase = phrase;
    }
    return out.join("");
}


// Include script dedicated to filling holes in IE functions
// Including, but not limited to, getElementsByName/ClassName
if (navigator.appName == 'Microsoft Internet Explorer') {
	addScript("iemethods.js");
}


//var myObject = eval('(' + myJSONtext + ')');  //Json decode

//if(typeof(window.external) != 'undefined')
//yes, this is evil browser sniffing, but only IE has this bug


/* // DR's Never Ending InFinite loop
// For if a window resizes, the scroll bar dynamically can be sized
var origHeight = 0;
function variableScrollHeight(){
  //asdf
  setTimeout(this, 1000);
  window.innerHeight;
}
var firstUrl = '';
var neifCount = 0;
var links = '';
var prevHeight = 0;
//neif = N - iNefficient, E - inEffient, I - Inefficient, F - ineFFicient
//aka Never Ending InFinite loop
function neif() {

    //maintain proper body height (so that you can scroll all the way to the bottom,
    //a side effect of css at the top with the search box)
    if ( (window.innerHeight - 82) != prevHeight) { //single equals cause we don't need type co-ersion, and I suspect it would be more efficient without this.
      //console.error('changed body height + offset');
      prevHeight = window.innerHeight - 82;
      byId('bodyHeight').innerText = 'html>body{height:'+prevHeight + 'px !important;}';
    }

    links = byClass('l');
    //if firstUrl differs from the first links URL, we have new results!
    if (links[0] && links[links.length - 1]) {
      if (firstUrl != links[0].href) {
        firstUrl = links[0].href;
        html.setAttribute('scout-round', neifCount++);
        preview(firstUrl, 0);
      }
      if (!links[0].onclick || !links[links.length - 1].onclick) {
        linkMods();
      }
    }

    setTimeout(neif, 200);
};*/
/*
	IndexOf Developed by Robert Nyman, http://www.robertnyman.com
	Code/licensing: http://code.google.com/p/getelementsbyclassname/
*/

if (!Array.prototype.indexOf)
  {

    Array.prototype.indexOf = function(searchElement /*, fromIndex */)
    {


    "use strict";

    if (this === void 0 || this === null)
      throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    if (len === 0)
      return -1;

    var n = 0;
    if (arguments.length > 0)
    {
      n = Number(arguments[1]);
      if (n !== n)
        n = 0;
      else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0))
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
    }

    if (n >= len)
      return -1;

    var k = n >= 0
          ? n
          : Math.max(len - Math.abs(n), 0);

    for (; k < len; k++)
    {
      if (k in t && t[k] === searchElement)
        return k;
    }
    return -1;
  };

}


/* Bafflingly stupid doesn't work.
//var getElementsByClassName = function (className, tag, elm){
var getElementsByClassName;
	if (document.getElementsByClassName) {
		getElementsByClassName = function (className, tag, elm) {
			elm = elm || document;
			var elements = elm.getElementsByClassName(className),
				nodeName = (tag)? new RegExp("\\b" + tag + "\\b", "i") : null,
				returnElements = [],
				current;
			for(var i=0, il=elements.length; i<il; i+=1){
				current = elements[i];
				if(!nodeName || nodeName.test(current.nodeName)) {
					returnElements.push(current);
				}
			}
			return returnElements;
		};
	}
	else if (document.evaluate) {
		getElementsByClassName = function (className, tag, elm) {
			tag = tag || "*";
			elm = elm || document;
			var classes = className.split(" "),
				classesToCheck = "",
				xhtmlNamespace = "http://www.w3.org/1999/xhtml",
				namespaceResolver = (document.documentElement.namespaceURI === xhtmlNamespace)? xhtmlNamespace : null,
				returnElements = [],
				elements,
				node;
			for(var j=0, jl=classes.length; j<jl; j+=1){
				classesToCheck += "[contains(concat(' ', @class, ' '), ' " + classes[j] + " ')]";
			}
			try	{
				elements = document.evaluate(".//" + tag + classesToCheck, elm, namespaceResolver, 0, null);
			}
			catch (e) {
				elements = document.evaluate(".//" + tag + classesToCheck, elm, null, 0, null);
			}
			while ((node = elements.iterateNext())) {
				returnElements.push(node);
			}
			return returnElements;
		};
	}
	else {
		getElementsByClassName = function (className, tag, elm) {
			tag = tag || "*";
			elm = elm || document;
			var classes = className.split(" "),
				classesToCheck = [],
				elements = (tag === "*" && elm.all)? elm.all : elm.getElementsByTagName(tag),
				current,
				returnElements = [],
				match;
			for(var k=0, kl=classes.length; k<kl; k+=1){
				classesToCheck.push(new RegExp("(^|\\s)" + classes[k] + "(\\s|$)"));
			}
			for(var l=0, ll=elements.length; l<ll; l+=1){
				current = elements[l];
				match = false;
				for(var m=0, ml=classesToCheck.length; m<ml; m+=1){
					match = classesToCheck[m].test(current.className);
					if (!match) {
						break;
					}
				}
				if (match) {
					returnElements.push(current);
				}
			}
			return returnElements;
		};
	};
	//return getElementsByClassName(className, tag, elm);
//};
//Code below this line is separately created.
document.getElementsByClassName = getElementsByClassName;*/

var getElementsByName = function(name, tag)
{
    if(!tag)
        tag = '*';
    var elems = document.getElementsByTagName(tag);
    var res = [];
    for(var i=0;i<elems.length;i++)
	{
        var att = elems[i].getAttribute('name');
        if(att == name)
            res.push(elems[i]);
    }
    return res;
};
var getElementsByClassName2 = function(name, tag)
{
    if(!tag)
        tag = '*';
    var elems = this.getElementsByTagName(tag);
    var res = [];
    for(var i in elems)
	{
        var att = elems[i].className;
        if(att == name)
            res.push(elems[i]);
        else
        {
	        if( att && att.indexOf(' ') )
	        {
		        var arr = att.split(' ');
		        for(var c in arr) // Could use indexOf here
		        {
			        if(arr[c] == name)
			        	res.push(elems[i]);
		        }
	        }
        }
    }
    return res;
};
document.getElementsByName = getElementsByName;
//Hopefully we get testing for IE6/7/8/9 done separately someday

//This is dependent on JSLibrary's Window.element
Element.prototype.getElementsByName = getElementsByName;
Element.prototype.getElementsByClassName = getElementsByClassName2; //Mine
document.getElementsByClassName = getElementsByClassName2; // Still Mine
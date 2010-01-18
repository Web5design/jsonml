﻿/*
	JsonML_DOM.js
	DOM to JsonML utility

	Created: 2007-02-15-2235
	Modified: 2008-08-31-2206

	Copyright (c)2006-2009 Stephen M. McKamey
	Distributed under an open-source license: http://jsonml.org/license
*/

var JsonML;
if ("undefined" === typeof JsonML) {
	JsonML = {};
}

/*JsonML*/ JsonML.parseDOM = function(/*DOM*/ elem, /*function*/ filter) {
	if (!elem || !elem.nodeType) {
		return null;
	}

	var i, jml, att, hasAttrib = false;
	switch (elem.nodeType) {
		case 1:  // element
		case 9:  // document
		case 11: // documentFragment
			jml = [elem.tagName||""];
			att = {};

			var a = elem.attributes;
			for (i=0; a && i<a.length; i++) {
				if (a[i].specified) {
					if (a[i].name === "style") {
						att.style = elem.style.cssText ? elem.style.cssText : a[i].value;
					} else if ("string" === typeof a[i].value) {
						att[a[i].name] = a[i].value;
					}
					hasAttrib = true;
				}
			}
			if (hasAttrib) {
				jml.push(att);
			}
			if (elem.hasChildNodes()) {
				for (i=0; i<elem.childNodes.length; i++) {
					var c = elem.childNodes[i];
					c = JsonML.parseDOM(c, filter);
					if (c) {
						jml.push(c);
					}
				}
			}
			return ("function" === typeof filter) ? filter(jml) : jml;
		case 3: // text node
			return elem.nodeValue;
		case 10: // doctype
			jml = ["!DOCTYPE"];
			att = {};
			if (elem.name) {
				att.name = String(elem.name);
				hasAttrib = true;
			}
			if (elem.publicId) {
				att.publicId = String(elem.publicId);
				hasAttrib = true;
			}
			if (elem.systemId) {
				att.systemId = String(elem.systemId);
				hasAttrib = true;
			}
			if (elem.baseURI) {
				att.baseURI = String(elem.baseURI);
				hasAttrib = true;
			}
			if (hasAttrib) {
				jml.push(att);
			}
			return ("function" === typeof filter) ? filter(jml) : jml;
		default: // comments, etc.
			return null;
	}
};

/*JsonML*/ JsonML.parseHTML = function(/*string*/ html, /*function*/ filter) {
	var elem = document.createElement("div");
	elem.innerHTML = html;
	var jml = JsonML.parseDOM(elem, filter);
	if (jml.length === 2) {
		return jml[1];
	}

	// make wrapper a document fragment
	jml[0] = "";
	return jml;
};

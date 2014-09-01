// Avoid `console` errors in browsers that lack a console
(function() {
	var method;
	var noop = function () {};
	var methods = [
		'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
		'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
		'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
		'timeStamp', 'trace', 'warn'
	];
	var length = methods.length;
	var console = (window.console = window.console || {});
	while (length--) {
		method = methods[length];
		// Only stub undefined methods
		if (!console[method]) {
			console[method] = noop;
		}
	}
}());


// jQUERY PLUGINS

// jQuery Aim
!function(a){function b(b){if(b){if(a("#jquery-aim-debug").length)return;n=d()}else a("#jquery-aim-debug").remove(),n=null;m=b}function c(a){var b=.25,c=a.outerWidth(),d=a.outerHeight(),e=a.offset().left,f=a.offset().top,g=Math.sqrt(c*c+d*d),h=g/2*(1+b);a.data("aim-data",{rect:{x0:e,y0:f,x1:e+c,y1:f+d},radius:h,center:{x:e,y:f},hover:0})}function d(){var b=a("<div>").attr({id:"#jquery-aim-debug"}).css({width:2*p,height:2*p,"margin-left":-p,"margin-top":-p,"border-radius":"50%",top:0,left:0,border:"2px solid yellowgreen","background-color":"hsla(0,0%,0%, 0.05)",position:"absolute"}).appendTo(a("body"));return b}function e(a,b){var c=Math.max(0,Math.min(a.x1,b.x1)-Math.max(a.x0,b.x0)),d=Math.max(0,Math.min(a.y1,b.y1)-Math.max(a.y0,b.y0));return c*d/(s*s)}function f(b){var d=a(this);a.inArray(d,g)>-1||(g.push(d),c(d),d.data("aim-data").options=b)}var g=[],h={x:0,y:0,r:0,t:0},i={x:0,y:0},j=12,k=0,l=0,m=!1,n=null,o=50,p=50,q={x:0,y:0},r={x0:0,y0:0,x1:o,y1:o},s=1;a.fn.aim=function(a){return this.each(function(){f.call(this,a)}),this},a.aimDebug=b,a().ready(function(){document.addEventListener("mousemove",function(a){k=a.x,l=a.y},!1)});setInterval(function(){if(g.length){i.x&&i.y&&(h.x=.7*h.x+.3*(k-i.x),h.y=.7*h.y+.3*(l-i.y)),i.x=k,i.y=l;var b=Math.sqrt(h.x*h.x+h.y*h.y);.1>b&&(h.x=0,h.y=0),s=Math.sqrt(o*b+1),q.x=.7*q.x+.3*(i.x+h.x*j),q.x<0&&(q.x=0),q.x>a(window).width()-s&&(q.x=a(window).width()-s),r.x0=q.x-s,r.x1=q.x+s,q.y=.7*q.y+.3*(i.y+h.y*j),q.y<0&&(q.y=0),q.y>a(window).height()-s&&(q.y=a(window).height()-s),r.y0=q.y-s,r.y1=q.y+s,m&&n.css({"-webkit-transform":"translate("+q.x+"px,"+q.y+"px) scale("+s/p+")","-moz-transform":"translate("+q.x+"px,"+q.y+"px) scale("+s/p+")","-ms-transform":"translate("+q.x+"px,"+q.y+"px) scale("+s/p+")",transform:"translate("+q.x+"px,"+q.y+"px) scale("+s/p+")"});for(var c=0;c<g.length;c++){var d=g[c],f=d.data("aim-data"),t=e(f.rect,r);if(t&&0!==b){f.hover=f.hover+.2*t,f.hover>1&&f.hover<2?(f.options.className?d.addClass(f.options.className):f.options.aimEnter&&"function"==typeof f.options.aimEnter&&f.options.aimEnter.call(d,!0),f.hover>2&&(f.hover=2),m&&n.css("border-color","tomato")):f.hover>2&&(f.hover=2,m&&n.css("border-color","tomato"));break}m&&n.css("border-color","yellowgreen"),0!==f.hover&&(f.hover=f.hover-.05,f.hover<0&&(f.hover=0,f.options.className?d.removeClass(f.options.className):f.options.aimExit&&"function"==typeof f.options.aimExit&&f.options.aimExit.call(d,!0)))}}},16)}(jQuery);


/**
 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
 *
 * @version 0.6.11
 * @codingstandard ftlabs-jsv2
 * @copyright The Financial Times Limited [All Rights Reserved]
 * @license MIT License (see LICENSE.txt)
 */

/*jslint browser:true, node:true*/
/*global define, Event, Node*/


/**
 * Instantiate fast-clicking listeners on the specificed layer.
 *
 * @constructor
 * @param {Element} layer The layer to listen on
 */
function FastClick(layer) {
	var oldOnClick, self = this;


	/**
	 * Whether a click is currently being tracked.
	 *
	 * @type boolean
	 */
	this.trackingClick = false;


	/**
	 * Timestamp for when when click tracking started.
	 *
	 * @type number
	 */
	this.trackingClickStart = 0;


	/**
	 * The element being tracked for a click.
	 *
	 * @type EventTarget
	 */
	this.targetElement = null;


	/**
	 * X-coordinate of touch start event.
	 *
	 * @type number
	 */
	this.touchStartX = 0;


	/**
	 * Y-coordinate of touch start event.
	 *
	 * @type number
	 */
	this.touchStartY = 0;


	/**
	 * ID of the last touch, retrieved from Touch.identifier.
	 *
	 * @type number
	 */
	this.lastTouchIdentifier = 0;


	/**
	 * Touchmove boundary, beyond which a click will be cancelled.
	 *
	 * @type number
	 */
	this.touchBoundary = 10;


	/**
	 * The FastClick layer.
	 *
	 * @type Element
	 */
	this.layer = layer;

	if (!layer || !layer.nodeType) {
		throw new TypeError('Layer must be a document node');
	}

	/** @type function() */
	this.onClick = function() { return FastClick.prototype.onClick.apply(self, arguments); };

	/** @type function() */
	this.onMouse = function() { return FastClick.prototype.onMouse.apply(self, arguments); };

	/** @type function() */
	this.onTouchStart = function() { return FastClick.prototype.onTouchStart.apply(self, arguments); };

	/** @type function() */
	this.onTouchMove = function() { return FastClick.prototype.onTouchMove.apply(self, arguments); };

	/** @type function() */
	this.onTouchEnd = function() { return FastClick.prototype.onTouchEnd.apply(self, arguments); };

	/** @type function() */
	this.onTouchCancel = function() { return FastClick.prototype.onTouchCancel.apply(self, arguments); };

	if (FastClick.notNeeded(layer)) {
		return;
	}

	// Set up event handlers as required
	if (this.deviceIsAndroid) {
		layer.addEventListener('mouseover', this.onMouse, true);
		layer.addEventListener('mousedown', this.onMouse, true);
		layer.addEventListener('mouseup', this.onMouse, true);
	}

	layer.addEventListener('click', this.onClick, true);
	layer.addEventListener('touchstart', this.onTouchStart, false);
	layer.addEventListener('touchmove', this.onTouchMove, false);
	layer.addEventListener('touchend', this.onTouchEnd, false);
	layer.addEventListener('touchcancel', this.onTouchCancel, false);

	// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
	// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
	// layer when they are cancelled.
	if (!Event.prototype.stopImmediatePropagation) {
		layer.removeEventListener = function(type, callback, capture) {
			var rmv = Node.prototype.removeEventListener;
			if (type === 'click') {
				rmv.call(layer, type, callback.hijacked || callback, capture);
			} else {
				rmv.call(layer, type, callback, capture);
			}
		};

		layer.addEventListener = function(type, callback, capture) {
			var adv = Node.prototype.addEventListener;
			if (type === 'click') {
				adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
					if (!event.propagationStopped) {
						callback(event);
					}
				}), capture);
			} else {
				adv.call(layer, type, callback, capture);
			}
		};
	}

	// If a handler is already declared in the element's onclick attribute, it will be fired before
	// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
	// adding it as listener.
	if (typeof layer.onclick === 'function') {

		// Android browser on at least 3.2 requires a new reference to the function in layer.onclick
		// - the old one won't work if passed to addEventListener directly.
		oldOnClick = layer.onclick;
		layer.addEventListener('click', function(event) {
			oldOnClick(event);
		}, false);
		layer.onclick = null;
	}
}


/**
 * Android requires exceptions.
 *
 * @type boolean
 */
FastClick.prototype.deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0;


/**
 * iOS requires exceptions.
 *
 * @type boolean
 */
FastClick.prototype.deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent);


/**
 * iOS 4 requires an exception for select elements.
 *
 * @type boolean
 */
FastClick.prototype.deviceIsIOS4 = FastClick.prototype.deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


/**
 * iOS 6.0(+?) requires the target element to be manually derived
 *
 * @type boolean
 */
FastClick.prototype.deviceIsIOSWithBadTarget = FastClick.prototype.deviceIsIOS && (/OS ([6-9]|\d{2})_\d/).test(navigator.userAgent);


/**
 * Determine whether a given element requires a native click.
 *
 * @param {EventTarget|Element} target Target DOM element
 * @returns {boolean} Returns true if the element needs a native click
 */
FastClick.prototype.needsClick = function(target) {
	'use strict';
	switch (target.nodeName.toLowerCase()) {

	// Don't send a synthetic click to disabled inputs (issue #62)
	case 'button':
	case 'select':
	case 'textarea':
		if (target.disabled) {
			return true;
		}

		break;
	case 'input':

		// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
		if ((this.deviceIsIOS && target.type === 'file') || target.disabled) {
			return true;
		}

		break;
	case 'label':
	case 'video':
		return true;
	}

	return (/\bneedsclick\b/).test(target.className);
};


/**
 * Determine whether a given element requires a call to focus to simulate click into element.
 *
 * @param {EventTarget|Element} target Target DOM element
 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
 */
FastClick.prototype.needsFocus = function(target) {
	'use strict';
	switch (target.nodeName.toLowerCase()) {
	case 'textarea':
		return true;
	case 'select':
		return !this.deviceIsAndroid;
	case 'input':
		switch (target.type) {
		case 'button':
		case 'checkbox':
		case 'file':
		case 'image':
		case 'radio':
		case 'submit':
			return false;
		}

		// No point in attempting to focus disabled inputs
		return !target.disabled && !target.readOnly;
	default:
		return (/\bneedsfocus\b/).test(target.className);
	}
};


/**
 * Send a click event to the specified element.
 *
 * @param {EventTarget|Element} targetElement
 * @param {Event} event
 */
FastClick.prototype.sendClick = function(targetElement, event) {
	'use strict';
	var clickEvent, touch;

	// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
	if (document.activeElement && document.activeElement !== targetElement) {
		document.activeElement.blur();
	}

	touch = event.changedTouches[0];

	// Synthesise a click event, with an extra attribute so it can be tracked
	clickEvent = document.createEvent('MouseEvents');
	clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
	clickEvent.forwardedTouchEvent = true;
	targetElement.dispatchEvent(clickEvent);
};

FastClick.prototype.determineEventType = function(targetElement) {
	'use strict';

	//Issue #159: Android Chrome Select Box does not open with a synthetic click event
	if (this.deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
		return 'mousedown';
	}

	return 'click';
};


/**
 * @param {EventTarget|Element} targetElement
 */
FastClick.prototype.focus = function(targetElement) {
	'use strict';
	var length;

	// Issue #160: on iOS 7, some input elements (e.g. date datetime) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
	if (this.deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time') {
		length = targetElement.value.length;
		targetElement.setSelectionRange(length, length);
	} else {
		targetElement.focus();
	}
};


/**
 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
 *
 * @param {EventTarget|Element} targetElement
 */
FastClick.prototype.updateScrollParent = function(targetElement) {
	'use strict';
	var scrollParent, parentElement;

	scrollParent = targetElement.fastClickScrollParent;

	// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
	// target element was moved to another parent.
	if (!scrollParent || !scrollParent.contains(targetElement)) {
		parentElement = targetElement;
		do {
			if (parentElement.scrollHeight > parentElement.offsetHeight) {
				scrollParent = parentElement;
				targetElement.fastClickScrollParent = parentElement;
				break;
			}

			parentElement = parentElement.parentElement;
		} while (parentElement);
	}

	// Always update the scroll top tracker if possible.
	if (scrollParent) {
		scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
	}
};


/**
 * @param {EventTarget} targetElement
 * @returns {Element|EventTarget}
 */
FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {
	'use strict';

	// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
	if (eventTarget.nodeType === Node.TEXT_NODE) {
		return eventTarget.parentNode;
	}

	return eventTarget;
};


/**
 * On touch start, record the position and scroll offset.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchStart = function(event) {
	'use strict';
	var targetElement, touch, selection;

	// Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
	if (event.targetTouches.length > 1) {
		return true;
	}

	targetElement = this.getTargetElementFromEventTarget(event.target);
	touch = event.targetTouches[0];

	if (this.deviceIsIOS) {

		// Only trusted events will deselect text on iOS (issue #49)
		selection = window.getSelection();
		if (selection.rangeCount && !selection.isCollapsed) {
			return true;
		}

		if (!this.deviceIsIOS4) {

			// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
			// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
			// with the same identifier as the touch event that previously triggered the click that triggered the alert.
			// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
			// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
			if (touch.identifier === this.lastTouchIdentifier) {
				event.preventDefault();
				return false;
			}

			this.lastTouchIdentifier = touch.identifier;

			// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
			// 1) the user does a fling scroll on the scrollable layer
			// 2) the user stops the fling scroll with another tap
			// then the event.target of the last 'touchend' event will be the element that was under the user's finger
			// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
			// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
			this.updateScrollParent(targetElement);
		}
	}

	this.trackingClick = true;
	this.trackingClickStart = event.timeStamp;
	this.targetElement = targetElement;

	this.touchStartX = touch.pageX;
	this.touchStartY = touch.pageY;

	// Prevent phantom clicks on fast double-tap (issue #36)
	if ((event.timeStamp - this.lastClickTime) < 200) {
		event.preventDefault();
	}

	return true;
};


/**
 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.touchHasMoved = function(event) {
	'use strict';
	var touch = event.changedTouches[0], boundary = this.touchBoundary;

	if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
		return true;
	}

	return false;
};


/**
 * Update the last position.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchMove = function(event) {
	'use strict';
	if (!this.trackingClick) {
		return true;
	}

	// If the touch has moved, cancel the click tracking
	if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
		this.trackingClick = false;
		this.targetElement = null;
	}

	return true;
};


/**
 * Attempt to find the labelled control for the given label element.
 *
 * @param {EventTarget|HTMLLabelElement} labelElement
 * @returns {Element|null}
 */
FastClick.prototype.findControl = function(labelElement) {
	'use strict';

	// Fast path for newer browsers supporting the HTML5 control attribute
	if (labelElement.control !== undefined) {
		return labelElement.control;
	}

	// All browsers under test that support touch events also support the HTML5 htmlFor attribute
	if (labelElement.htmlFor) {
		return document.getElementById(labelElement.htmlFor);
	}

	// If no for attribute exists, attempt to retrieve the first labellable descendant element
	// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
	return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
};


/**
 * On touch end, determine whether to send a click event at once.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchEnd = function(event) {
	'use strict';
	var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

	if (!this.trackingClick) {
		return true;
	}

	// Prevent phantom clicks on fast double-tap (issue #36)
	if ((event.timeStamp - this.lastClickTime) < 200) {
		this.cancelNextClick = true;
		return true;
	}

	// Reset to prevent wrong click cancel on input (issue #156).
	this.cancelNextClick = false;

	this.lastClickTime = event.timeStamp;

	trackingClickStart = this.trackingClickStart;
	this.trackingClick = false;
	this.trackingClickStart = 0;

	// On some iOS devices, the targetElement supplied with the event is invalid if the layer
	// is performing a transition or scroll, and has to be re-detected manually. Note that
	// for this to function correctly, it must be called *after* the event target is checked!
	// See issue #57; also filed as rdar://13048589 .
	if (this.deviceIsIOSWithBadTarget) {
		touch = event.changedTouches[0];

		// In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
		targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
		targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
	}

	targetTagName = targetElement.tagName.toLowerCase();
	if (targetTagName === 'label') {
		forElement = this.findControl(targetElement);
		if (forElement) {
			this.focus(targetElement);
			if (this.deviceIsAndroid) {
				return false;
			}

			targetElement = forElement;
		}
	} else if (this.needsFocus(targetElement)) {

		// Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
		// Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
		if ((event.timeStamp - trackingClickStart) > 100 || (this.deviceIsIOS && window.top !== window && targetTagName === 'input')) {
			this.targetElement = null;
			return false;
		}

		this.focus(targetElement);

		// Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
		if (!this.deviceIsIOS4 || targetTagName !== 'select') {
			this.targetElement = null;
			event.preventDefault();
		}

		return false;
	}

	if (this.deviceIsIOS && !this.deviceIsIOS4) {

		// Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
		// and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
		scrollParent = targetElement.fastClickScrollParent;
		if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
			return true;
		}
	}

	// Prevent the actual click from going though - unless the target node is marked as requiring
	// real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
	if (!this.needsClick(targetElement)) {
		event.preventDefault();
		this.sendClick(targetElement, event);
	}

	return false;
};


/**
 * On touch cancel, stop tracking the click.
 *
 * @returns {void}
 */
FastClick.prototype.onTouchCancel = function() {
	'use strict';
	this.trackingClick = false;
	this.targetElement = null;
};


/**
 * Determine mouse events which should be permitted.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onMouse = function(event) {
	'use strict';

	// If a target element was never set (because a touch event was never fired) allow the event
	if (!this.targetElement) {
		return true;
	}

	if (event.forwardedTouchEvent) {
		return true;
	}

	// Programmatically generated events targeting a specific element should be permitted
	if (!event.cancelable) {
		return true;
	}

	// Derive and check the target element to see whether the mouse event needs to be permitted;
	// unless explicitly enabled, prevent non-touch click events from triggering actions,
	// to prevent ghost/doubleclicks.
	if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

		// Prevent any user-added listeners declared on FastClick element from being fired.
		if (event.stopImmediatePropagation) {
			event.stopImmediatePropagation();
		} else {

			// Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
			event.propagationStopped = true;
		}

		// Cancel the event
		event.stopPropagation();
		event.preventDefault();

		return false;
	}

	// If the mouse event is permitted, return true for the action to go through.
	return true;
};


/**
 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
 * an actual click which should be permitted.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onClick = function(event) {
	'use strict';
	var permitted;

	// It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
	if (this.trackingClick) {
		this.targetElement = null;
		this.trackingClick = false;
		return true;
	}

	// Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
	if (event.target.type === 'submit' && event.detail === 0) {
		return true;
	}

	permitted = this.onMouse(event);

	// Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
	if (!permitted) {
		this.targetElement = null;
	}

	// If clicks are permitted, return true for the action to go through.
	return permitted;
};


/**
 * Remove all FastClick's event listeners.
 *
 * @returns {void}
 */
FastClick.prototype.destroy = function() {
	'use strict';
	var layer = this.layer;

	if (this.deviceIsAndroid) {
		layer.removeEventListener('mouseover', this.onMouse, true);
		layer.removeEventListener('mousedown', this.onMouse, true);
		layer.removeEventListener('mouseup', this.onMouse, true);
	}

	layer.removeEventListener('click', this.onClick, true);
	layer.removeEventListener('touchstart', this.onTouchStart, false);
	layer.removeEventListener('touchmove', this.onTouchMove, false);
	layer.removeEventListener('touchend', this.onTouchEnd, false);
	layer.removeEventListener('touchcancel', this.onTouchCancel, false);
};


/**
 * Check whether FastClick is needed.
 *
 * @param {Element} layer The layer to listen on
 */
FastClick.notNeeded = function(layer) {
	'use strict';
	var metaViewport;
	var chromeVersion;

	// Devices that don't support touch don't need FastClick
	if (typeof window.ontouchstart === 'undefined') {
		return true;
	}

	// Chrome version - zero for other browsers
	chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

	if (chromeVersion) {

		if (FastClick.prototype.deviceIsAndroid) {
			metaViewport = document.querySelector('meta[name=viewport]');
			
			if (metaViewport) {
				// Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
				if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
					return true;
				}
				// Chrome 32 and above with width=device-width or less don't need FastClick
				if (chromeVersion > 31 && window.innerWidth <= window.screen.width) {
					return true;
				}
			}

		// Chrome desktop doesn't need FastClick (issue #15)
		} else {
			return true;
		}
	}

	// IE10 with -ms-touch-action: none, which disables double-tap-to-zoom (issue #97)
	if (layer.style.msTouchAction === 'none') {
		return true;
	}

	return false;
};


/**
 * Factory method for creating a FastClick object
 *
 * @param {Element} layer The layer to listen on
 */
FastClick.attach = function(layer) {
	'use strict';
	return new FastClick(layer);
};


if (typeof define !== 'undefined' && define.amd) {

	// AMD. Register as an anonymous module.
	define(function() {
		'use strict';
		return FastClick;
	});
} else if (typeof module !== 'undefined' && module.exports) {
	module.exports = FastClick.attach;
	module.exports.FastClick = FastClick;
} else {
	window.FastClick = FastClick;
}



// SLICK SLIDER (carousel)
/*
	 _ _		_			 _
 ___| (_) ___| | __	 (_)___
/ __| | |/ __| |/ /	 | / __|
\__ \ | | (__|	 < _ | \__ \
|___/_|_|\___|_|\_(_)/ |___/
				   |__/
 Version: 1.3.6
  Author: Ken Wheeler
 Website: http://kenwheeler.github.io
	Docs: http://kenwheeler.github.io/slick
	Repo: http://github.com/kenwheeler/slick
  Issues: http://github.com/kenwheeler/slick/issues
*/
/* global window, document, define, jQuery, setInterval, clearInterval
(function(factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else {
		factory(jQuery);
	}
}
(function($) {
	'use strict';
	var Slick = window.Slick || {};
	Slick = (function() {
		var instanceUid = 0;
		function Slick(element, settings) {
			var _ = this,
				responsiveSettings,
				breakpoint
			;
			_.defaults = {
				accessibility: true,
				arrows: true,
				autoplay: false,
				autoplaySpeed: 3000,
				centerMode: false,
				centerPadding: '50px',
				cssEase: 'ease',
				customPaging: function(slider, i) { return '<button type="button">' + (i + 1) + '</button>'; },
				dots: false,
				draggable: true,
				easing: 'linear',
				fade: false,
				infinite: true,
				lazyLoad: 'ondemand',
				onBeforeChange: null,
				onAfterChange: null,
				onInit: null,
				onReInit: null,
				pauseOnHover: true,
				responsive: null,
				slide: 'div',
				slidesToShow: 1,
				slidesToScroll: 1,
				speed: 300,
				swipe: true,
				touchMove: true,
				touchThreshold: 5,
				useCSS: true,
				vertical: false
			};
			_.initials = {
				animating: false,
				autoPlayTimer: null,
				currentSlide: 0,
				currentLeft: null,
				direction: 1,
				$dots: null,
				listWidth: null,
				listHeight: null,
				loadIndex: 0,
				$nextArrow: null,
				$prevArrow: null,
				slideCount: null,
				slideWidth: null,
				$slideTrack: null,
				$slides: null,
				sliding: false,
				slideOffset: 0,
				swipeLeft: null,
				$list: null,
				touchObject: {},
				transformsEnabled: false
			};
			$.extend(_, _.initials);
			_.activeBreakpoint = null;
			_.animType = null;
			_.animProp = null;
			_.breakpoints = [];
			_.breakpointSettings = [];
			_.cssTransitions = false;
			_.paused = false;
			_.positionProp = null;
			_.$slider = $(element);
			_.$slidesCache = null;
			_.transformType = null;
			_.transitionType = null;
			_.windowWidth = 0;
			_.windowTimer = null;
			_.options = $.extend({}, _.defaults, settings);
			_.originalSettings = _.options;
			responsiveSettings = _.options.responsive || null;
			if (responsiveSettings && responsiveSettings.length > -1) {
				for (breakpoint in responsiveSettings) {
					if (responsiveSettings.hasOwnProperty(breakpoint)) {
						_.breakpoints.push(responsiveSettings[breakpoint].breakpoint);
						_.breakpointSettings[responsiveSettings[breakpoint].breakpoint] = responsiveSettings[breakpoint].settings;
					}
				}
				_.breakpoints.sort(function(a, b) {
					return b - a;
				});
			}
			_.autoPlay = $.proxy(_.autoPlay, _);
			_.autoPlayClear = $.proxy(_.autoPlayClear, _);
			_.changeSlide = $.proxy(_.changeSlide, _);
			_.setPosition = $.proxy(_.setPosition, _);
			_.swipeHandler = $.proxy(_.swipeHandler, _);
			_.dragHandler = $.proxy(_.dragHandler, _);
			_.keyHandler = $.proxy(_.keyHandler, _);
			_.autoPlayIterator = $.proxy(_.autoPlayIterator, _);
			_.instanceUid = instanceUid++;
			_.init();
		}
		return Slick;
	}());
	Slick.prototype.addSlide = function(markup, index, addBefore) {
		var _ = this;
		if (typeof(index) === 'boolean') {
			addBefore = index;
			index = null;
		} else if (index < 0 || (index >= _.slideCount)) {
			return false;
		}
		_.unload();
		if (typeof(index) === 'number') {
			if (index === 0 && _.$slides.length === 0) {
				$(markup).appendTo(_.$slideTrack);
			} else if (addBefore) {
				$(markup).insertBefore(_.$slides.eq(index));
			} else {
				$(markup).insertAfter(_.$slides.eq(index));
			}
		} else {
			if (addBefore === true) {
				$(markup).prependTo(_.$slideTrack);
			} else {
				$(markup).appendTo(_.$slideTrack);
			}
		}
		_.$slides = _.$slideTrack.children(this.options.slide);
		_.$slideTrack.children(this.options.slide).remove();
		_.$slideTrack.append(_.$slides);
		_.$slidesCache = _.$slides;
		_.reinit();
	};
	Slick.prototype.animateSlide = function(targetLeft, callback) {
		var _ = this,
			animProps = {}
		;
		if (_.transformsEnabled === false) {
			if (_.options.vertical === false) {
				_.$slideTrack.animate({
					left: targetLeft
				}, _.options.speed, _.options.easing, callback);
			} else {
				_.$slideTrack.animate({
					top: targetLeft
				}, _.options.speed, _.options.easing, callback);
			}
		} else {
			if (_.cssTransitions === false) {
				$({ animStart: _.currentLeft }).animate({
					animStart: targetLeft
				}, {
					duration: _.options.speed,
					easing: _.options.easing,
					step: function(now) {
						if (_.options.vertical === false) {
							animProps[_.animType] = 'translate(' + now + 'px, 0px)';
							_.$slideTrack.css(animProps);
						} else {
							animProps[_.animType] = 'translate(0px,' + now + 'px)';
							_.$slideTrack.css(animProps);
						}
					},
					complete: function() {
						if (callback) {
							callback.call();
						}
					}
				});
			} else {
				_.applyTransition();
				if (_.options.vertical === false) {
					animProps[_.animType] = 'translate3d(' + targetLeft + 'px, 0px, 0px)';
				} else {
					animProps[_.animType] = 'translate3d(0px,' + targetLeft + 'px, 0px)';
				}
				_.$slideTrack.css(animProps);
				if (callback) {
					setTimeout(function() {
						_.disableTransition();
						callback.call();
					}, _.options.speed);
				}
			}
		}
	};
	Slick.prototype.applyTransition = function(slide) {
		var _ = this,
			transition = {}
		;
		if (_.options.fade === false) {
			transition[_.transitionType] = _.transformType + ' ' + _.options.speed + 'ms ' + _.options.cssEase;
		} else {
			transition[_.transitionType] = 'opacity ' + _.options.speed + 'ms ' + _.options.cssEase;
		}
		if (_.options.fade === false) {
			_.$slideTrack.css(transition);
		} else {
			_.$slides.eq(slide).css(transition);
		}
	};
	Slick.prototype.autoPlay = function() {
		var _ = this;
		if (_.autoPlayTimer) {
			clearInterval(_.autoPlayTimer);
		}
		if (_.slideCount > _.options.slidesToShow && _.paused !== true) {
			_.autoPlayTimer = setInterval(_.autoPlayIterator, _.options.autoplaySpeed);
		}
	};
	Slick.prototype.autoPlayClear = function() {
		var _ = this;
		if (_.autoPlayTimer) {
			clearInterval(_.autoPlayTimer);
		}
	};
	Slick.prototype.autoPlayIterator = function() {
		var _ = this;
		if (_.options.infinite === false) {
			if (_.direction === 1) {
				if ((_.currentSlide + 1) === _.slideCount - 1) {
					_.direction = 0;
				}
				_.slideHandler(_.currentSlide + _.options.slidesToScroll);
			} else {
				if ((_.currentSlide - 1 === 0)) {
					_.direction = 1;
				}
				_.slideHandler(_.currentSlide - _.options.slidesToScroll);
			}
		} else {
			_.slideHandler(_.currentSlide + _.options.slidesToScroll);
		}
	};
	Slick.prototype.buildArrows = function() {
		var _ = this;
		if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
			_.$prevArrow = $('<button type="button" class="slick-prev" title="Previous"></button>').appendTo(_.$slider);
			_.$nextArrow = $('<button type="button" class="slick-next" title="Next"></button>').appendTo(_.$slider);
			if (_.options.infinite !== true) {
				_.$prevArrow.addClass('slick-disabled');
			}
		}
	};
	Slick.prototype.buildDots = function() {
		var _ = this,
			i,
			dotString
		;
		if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
			dotString = '<ul class="slick-dots">';
			for (i = 0; i <= _.getDotCount(); i += 1) {
				dotString += '<li>' + _.options.customPaging.call(this, _, i) + '</li>';
			}
			dotString += '</ul>';
			_.$dots = $(dotString).appendTo(_.$slider);
			_.$dots.find('li').first().addClass('slick-active');
		}
	};
	Slick.prototype.buildOut = function() {
		var _ = this;
		_.$slides = _.$slider.children(_.options.slide + ':not(.slick-cloned)').addClass('slick-slide');
		_.slideCount = _.$slides.length;
		_.$slidesCache = _.$slides;
		_.$slider.addClass('slick-slider');
		_.$slideTrack = (_.slideCount === 0) ?
			$('<div class="slick-track"/>').appendTo(_.$slider) :
			_.$slides.wrapAll('<div class="slick-track"/>').parent();
		_.$list = _.$slideTrack.wrap('<div class="slick-list"/>').parent();
		_.$slideTrack.css('opacity', 0);
		if (_.options.centerMode === true) {
			_.options.infinite = true;
			_.options.slidesToScroll = 1;
			if (_.options.slidesToShow % 2 === 0) {
				_.options.slidesToShow = 3;
			}
		}
		$('img[data-lazy]', _.$slider).not('[src]').addClass('slick-loading');
		_.setupInfinite();
		_.buildArrows();
		_.buildDots();
		if (_.options.accessibility === true) {
			_.$list.prop('tabIndex', 0);
		}
		_.setSlideClasses(0);
		if (_.options.draggable === true) {
			_.$list.addClass('draggable');
		}
	};
	Slick.prototype.checkResponsive = function() {
		var _ = this,
			breakpoint,
			targetBreakpoint
		;
		if (_.originalSettings.responsive && _.originalSettings
			.responsive.length > -1 && _.originalSettings.responsive !== null) {
			targetBreakpoint = null;
			for (breakpoint in _.breakpoints) {
				if (_.breakpoints.hasOwnProperty(breakpoint)) {
					if ($(window).width() < _.breakpoints[
						breakpoint]) {
						targetBreakpoint = _.breakpoints[
							breakpoint];
					}
				}
			}
			if (targetBreakpoint !== null) {
				if (_.activeBreakpoint !== null) {
					if (targetBreakpoint !== _.activeBreakpoint) {
						_.activeBreakpoint =
							targetBreakpoint;
						_.options = $.extend({}, _.defaults,
							_.breakpointSettings[
								targetBreakpoint]);
						_.refresh();
					}
				} else {
					_.activeBreakpoint = targetBreakpoint;
					_.options = $.extend({}, _.defaults,
						_.breakpointSettings[
							targetBreakpoint]);
					_.refresh();
				}
			} else {
				if (_.activeBreakpoint !== null) {
					_.activeBreakpoint = null;
					_.options = $.extend({}, _.defaults,
						_.originalSettings);
					_.refresh();
				}
			}
		}
	};
	Slick.prototype.changeSlide = function(event) {
		var _ = this;
		switch (event.data.message) {
			case 'previous':
				_.slideHandler(_.currentSlide - _.options
					.slidesToScroll);
				break;
			case 'next':
				_.slideHandler(_.currentSlide + _.options
					.slidesToScroll);
				break;
			case 'index':
				_.slideHandler($(event.target).parent().index() * _.options.slidesToScroll);
				break;
			default:
				return false;
		}
	};
	Slick.prototype.destroy = function() {
		var _ = this;
		_.autoPlayClear();
		_.touchObject = {};
		$('.slick-cloned', _.$slider).remove();
		if (_.$dots) {
			_.$dots.remove();
		}
		if (_.$prevArrow) {
			_.$prevArrow.remove();
			_.$nextArrow.remove();
		}
		_.$slides.unwrap().unwrap();
		_.$slides.removeClass('slick-slide slick-active slick-visible').removeAttr('style');
		_.$slider.removeClass('slick-slider');
		_.$slider.removeClass('slick-initialized');
		_.$list.off('.slick');
		$(window).off('.slick-' + _.instanceUid);
	};
	Slick.prototype.disableTransition = function(slide) {
		var _ = this,
			transition = {}
		;
		transition[_.transitionType] = "";
		if (_.options.fade === false) {
			_.$slideTrack.css(transition);
		} else {
			_.$slides.eq(slide).css(transition);
		}
	};
	Slick.prototype.fadeSlide = function(slideIndex, callback) {
		var _ = this;
		if (_.cssTransitions === false) {
			_.$slides.eq(slideIndex).css({
				zIndex: 1000
			});
			_.$slides.eq(slideIndex).animate({
				opacity: 1
			}, _.options.speed, _.options.easing, callback);
		} else {
			_.applyTransition(slideIndex);
			_.$slides.eq(slideIndex).css({
				opacity: 1,
				zIndex: 1000
			});
			if (callback) {
				setTimeout(function() {
					_.disableTransition(slideIndex);
					callback.call();
				}, _.options.speed);
			}
		}
	};
	Slick.prototype.filterSlides = function(filter) {
		var _ = this;
		if (filter !== null) {
			_.unload();
			_.$slideTrack.children(this.options.slide).remove();
			_.$slidesCache.filter(filter).appendTo(_.$slideTrack);
			_.reinit();
		}
	};
	Slick.prototype.getCurrent = function() {
		var _ = this;
		return _.currentSlide;
	};
	Slick.prototype.getDotCount = function() {
		var _ = this,
			breaker = 0,
			dotCounter = 0,
			dotCount = 0,
			dotLimit
		;
		dotLimit = _.options.infinite === true ? _.slideCount + _.options.slidesToShow - _.options.slidesToScroll : _.slideCount;
		while (breaker < dotLimit) {
			dotCount++;
			dotCounter += _.options.slidesToScroll;
			breaker = dotCounter + _.options.slidesToShow;
		}
		return dotCount;
	};
	Slick.prototype.getLeft = function(slideIndex) {
		var _ = this,
			targetLeft,
			verticalHeight,
			verticalOffset = 0
		;
		_.slideOffset = 0;
		verticalHeight = _.$slides.first().outerHeight();
		if (_.options.infinite === true) {
			if (_.slideCount > _.options.slidesToShow) {
				_.slideOffset = (_.slideWidth * _.options.slidesToShow) * -1;
				verticalOffset = (verticalHeight * _.options.slidesToShow) * -1;
			}
			if (_.slideCount % _.options.slidesToScroll !== 0) {
				if (slideIndex + _.options.slidesToScroll > _.slideCount && _.slideCount > _.options.slidesToShow) {
					_.slideOffset = ((_.slideCount % _.options.slidesToShow) * _.slideWidth) * -1;
					verticalOffset = ((_.slideCount % _.options.slidesToShow) * verticalHeight) * -1;
				}
			}
		} else {
			if (_.slideCount % _.options.slidesToShow !== 0) {
				if (slideIndex + _.options.slidesToScroll > _.slideCount && _.slideCount > _.options.slidesToShow) {
					_.slideOffset = (_.options.slidesToShow * _.slideWidth) - ((_.slideCount % _.options.slidesToShow) * _.slideWidth);
					verticalOffset = ((_.slideCount % _.options.slidesToShow) * verticalHeight);
				}
			}
		}
		if (_.options.centerMode === true) {
			_.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2) - _.slideWidth;
		}
		if (_.options.vertical === false) {
			targetLeft = ((slideIndex * _.slideWidth) * -1) + _.slideOffset;
		} else {
			targetLeft = ((slideIndex * verticalHeight) * -1) + verticalOffset;
		}
		return targetLeft;
	};
	Slick.prototype.init = function() {
		var _ = this;
		if (!$(_.$slider).hasClass('slick-initialized')) {
			$(_.$slider).addClass('slick-initialized');
			_.buildOut();
			_.setProps();
			_.startLoad();
			_.loadSlider();
			_.initializeEvents();
			_.checkResponsive();
		}
		if (_.options.onInit !== null) {
			_.options.onInit.call(this, _);
		}
	};
	Slick.prototype.initArrowEvents = function() {
		var _ = this;
		if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
			_.$prevArrow.on('click.slick', {
				message: 'previous'
			}, _.changeSlide);
			_.$nextArrow.on('click.slick', {
				message: 'next'
			}, _.changeSlide);
		}
	};
	Slick.prototype.initDotEvents = function() {
		var _ = this;
		if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
			$('li', _.$dots).on('click.slick', {
				message: 'index'
			}, _.changeSlide);
		}
	};
	Slick.prototype.initializeEvents = function() {
		var _ = this;
		_.initArrowEvents();
		_.initDotEvents();
		_.$list.on('touchstart.slick mousedown.slick', {
			action: 'start'
		}, _.swipeHandler);
		_.$list.on('touchmove.slick mousemove.slick', {
			action: 'move'
		}, _.swipeHandler);
		_.$list.on('touchend.slick mouseup.slick', {
			action: 'end'
		}, _.swipeHandler);
		_.$list.on('touchcancel.slick mouseleave.slick', {
			action: 'end'
		}, _.swipeHandler);
		if (_.options.pauseOnHover === true && _.options.autoplay === true) {
			_.$list.on('mouseenter.slick', _.autoPlayClear);
			_.$list.on('mouseleave.slick', _.autoPlay);
		}
		if(_.options.accessibility === true) {
			_.$list.on('keydown.slick', _.keyHandler); 
		}
		$(window).on('orientationchange.slick.slick-' + _.instanceUid, function() {
			_.checkResponsive();
			_.setPosition();
		});
		$(window).on('resize.slick.slick-' + _.instanceUid, function() {
			if ($(window).width !== _.windowWidth) {
				clearTimeout(_.windowDelay);
				_.windowDelay = window.setTimeout(function() {
					_.windowWidth = $(window).width();
					_.checkResponsive();
					_.setPosition();
				}, 50);
			}
		});
		$(window).on('load.slick.slick-' + _.instanceUid, _.setPosition);
	};
	Slick.prototype.initUI = function() {
		var _ = this;
		if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
			_.$prevArrow.show();
			_.$nextArrow.show();
		}
		if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
			_.$dots.show();
		}
		if (_.options.autoplay === true) {
			_.autoPlay();
		}
	};
	Slick.prototype.keyHandler = function(event) {
		var _ = this;
		if (event.keyCode === 37) {
			_.changeSlide({
				data: { message: 'previous' }
			});
		} else if (event.keyCode === 39) {
			_.changeSlide({
				data: { message: 'next' }
			});
		}
	};
	Slick.prototype.lazyLoad = function() {
		var _ = this,
			loadRange,
			cloneRange,
			rangeStart,
			rangeEnd
		;
		if (_.options.centerMode === true) {
			rangeStart = _.options.slidesToShow + _.currentSlide - 1;
			rangeEnd = rangeStart + _.options.slidesToShow + 2;
		} else {
			rangeStart = _.options.infinite ? _.options.slidesToShow + _.currentSlide : _.currentSlide;
			rangeEnd = rangeStart + _.options.slidesToShow;
		}
		loadRange = _.$slider.find('.slick-slide').slice(rangeStart, rangeEnd);
		$('img[data-lazy]', loadRange).not('[src]').each(function() {
			$(this).css({opacity: 0}).attr('src', $(this).attr('data-lazy')).removeClass('slick-loading').load(function(){
				$(this).animate({ opacity: 1 }, 200);
			});
		});
		if (_.currentSlide >= _.slideCount - _.options.slidesToShow) {
			cloneRange = _.$slider.find('.slick-cloned').slice(0, _.options.slidesToShow);
			$('img[data-lazy]', cloneRange).not('[src]').each(function() {
				$(this).css({opacity: 0}).attr('src', $(this).attr('data-lazy')).removeClass('slick-loading').load(function(){
					$(this).animate({ opacity: 1 }, 200);
				});
			});
		} else if (_.currentSlide === 0) {
			cloneRange = _.$slider.find('.slick-cloned').slice(_.options.slidesToShow * -1);
			$('img[data-lazy]', cloneRange).not('[src]').each(function() {
				$(this).css({opacity: 0}).attr('src', $(this).attr('data-lazy')).removeClass('slick-loading').load(function(){
					$(this).animate({ opacity: 1 }, 200);
				});
			});
		}
	};
	Slick.prototype.loadSlider = function() {
		var _ = this;
		_.setPosition();
		_.$slideTrack.css({
			opacity: 1
		});
		_.$slider.removeClass('slick-loading');
		_.initUI();
		if (_.options.lazyLoad === 'progressive') {
			_.progressiveLazyLoad();
		}
	};
	Slick.prototype.postSlide = function(index) {
		var _ = this;
		if (_.options.onAfterChange !== null) {
			_.options.onAfterChange.call(this, _, index);
		}
		_.animating = false;
		_.setPosition();
		_.swipeLeft = null;
		if (_.options.autoplay === true && _.paused === false) {
			_.autoPlay();
		}
	};
	Slick.prototype.progressiveLazyLoad = function() {
		var _ = this,
			imgCount,
			targetImage
		;
		imgCount = $('img[data-lazy]').not('[src]').length;
		if (imgCount > 0) {
			targetImage = $($('img[data-lazy]', _.$slider).not('[src]').get(0));
			targetImage.attr('src', targetImage.attr('data-lazy')).removeClass('slick-loading').load(function() {
				_.progressiveLazyLoad();
			});
		}
	};
	Slick.prototype.refresh = function() {
		var _ = this;
		_.destroy();
		$.extend(_, _.initials);
		_.init();
	};
	Slick.prototype.reinit = function() {
		var _ = this;
		_.$slides = _.$slideTrack.children(_.options.slide).addClass('slick-slide');
		_.slideCount = _.$slides.length;
		if (_.currentSlide >= _.slideCount && _.currentSlide !== 0) {
			_.currentSlide = _.currentSlide - _.options.slidesToScroll;
		}
		_.setProps();
		_.setupInfinite();
		_.buildArrows();
		_.updateArrows();
		_.initArrowEvents();
		_.buildDots();
		_.updateDots();
		_.initDotEvents();
		_.setSlideClasses(0);
		_.setPosition();
		if (_.options.onReInit !== null) {
			_.options.onReInit.call(this, _);
		}
	};
	Slick.prototype.removeSlide = function(index, removeBefore) {
		var _ = this;
		if (typeof(index) === 'boolean') {
			removeBefore = index;
			index = removeBefore === true ? 0 : _.slideCount - 1;
		} else {
			index = removeBefore === true ? --index : index;
		}
		if (_.slideCount < 1 || index < 0 || index > _.slideCount - 1) {
			return false;
		}
		_.unload();
		_.$slideTrack.children(this.options.slide).eq(index).remove();
		_.$slides = _.$slideTrack.children(this.options.slide);
		_.$slideTrack.children(this.options.slide).remove();
		_.$slideTrack.append(_.$slides);
		_.$slidesCache = _.$slides;
		_.reinit();
	};
	Slick.prototype.setCSS = function(position) {
		var _ = this,
			positionProps = {},
			x, y
		;
		x = _.positionProp == 'left' ? position + 'px' : '0px';
		y = _.positionProp == 'top' ? position + 'px' : '0px';
		positionProps[_.positionProp] = position;
		if (_.transformsEnabled === false) {
			_.$slideTrack.css(positionProps);
		} else {
			positionProps = {};
			if (_.cssTransitions === false) {
				positionProps[_.animType] = 'translate(' + x + ', ' + y + ')';
				_.$slideTrack.css(positionProps);
			} else {
				positionProps[_.animType] = 'translate3d(' + x + ', ' + y + ', 0px)';
				_.$slideTrack.css(positionProps);
			}
		}
	};
	Slick.prototype.setDimensions = function() {
		var _ = this;
		if (_.options.centerMode === true) {
			_.$slideTrack.children('.slick-slide').width(_.slideWidth);
		} else {
			_.$slideTrack.children('.slick-slide').width(_.slideWidth);
		}
		if (_.options.vertical === false) {
			_.$slideTrack.width(Math.ceil((_.slideWidth * _
				.$slideTrack.children('.slick-slide').length)));
			if (_.options.centerMode === true) {
				_.$list.css({
					padding: ('0px ' + _.options.centerPadding)
				});
			}
		} else {
			_.$list.height(_.$slides.first().outerHeight() * _.options.slidesToShow);
			_.$slideTrack.height(Math.ceil((_.$slides.first().outerHeight() * _
				.$slideTrack.children('.slick-slide').length)));
			if (_.options.centerMode === true) {
				_.$list.css({
					padding: (_.options.centerPadding + ' 0px')
				});
			}
		}
	};
	Slick.prototype.setFade = function() {
		var _ = this,
			targetLeft
		;
		_.$slides.each(function(index, element) {
			targetLeft = (_.slideWidth * index) * -1;
			$(element).css({
				position: 'relative',
				left: targetLeft,
				top: 0,
				zIndex: 800,
				opacity: 0
			});
		});
		_.$slides.eq(_.currentSlide).css({
			zIndex: 900,
			opacity: 1
		});
	};
	Slick.prototype.setPosition = function() {
		var _ = this;
		_.setValues();
		_.setDimensions();
		if (_.options.fade === false) {
			_.setCSS(_.getLeft(_.currentSlide));
		} else {
			_.setFade();
		}
	};
	Slick.prototype.setProps = function() {
		var _ = this;
		_.positionProp = _.options.vertical === true ? 'top' : 'left';
		if (_.positionProp === 'top') {
			_.$slider.addClass('slick-vertical');
		} else {
			_.$slider.removeClass('slick-vertical');
		}
		if (document.body.style.WebkitTransition !== undefined ||
			document.body.style.MozTransition !== undefined ||
			document.body.style.msTransition !== undefined) {
			if(_.options.useCSS === true) {
				_.cssTransitions = true;
			}
		}
		if (document.body.style.MozTransform !== undefined) {
			_.animType = 'MozTransform';
			_.transformType = "-moz-transform";
			_.transitionType = 'MozTransition';
		}
		if (document.body.style.webkitTransform !== undefined) {
			_.animType = 'webkitTransform';
			_.transformType = "-webkit-transform";
			_.transitionType = 'webkitTransition';
		}
		if (document.body.style.msTransform !== undefined) {
			_.animType = 'transform';
			_.transformType = "transform";
			_.transitionType = 'transition';
		}
		if ( $(".ie9").length ) {
			_.transformsEnabled = false;
		} else {
			_.transformsEnabled = (_.animType !== null);
		}
	};
	Slick.prototype.setValues = function() {
		var _ = this;
		_.listWidth = _.$list.width();
		_.listHeight = _.$list.height();
		if(_.options.vertical === false) {
		_.slideWidth = Math.ceil(_.listWidth / _.options
			.slidesToShow);
		} else {
			_.slideWidth = Math.ceil(_.listWidth);
		}
	};
	Slick.prototype.setSlideClasses = function(index) {
		var _ = this,
			centerOffset,
			allSlides,
			indexOffset
		;
		_.$slider.find('.slick-slide').removeClass('slick-active').removeClass('slick-center');
		allSlides = _.$slider.find('.slick-slide');
		if (_.options.centerMode === true) {
			centerOffset = Math.floor(_.options.slidesToShow / 2);
			if (index >= centerOffset && index <= (_.slideCount - 1) - centerOffset) {
				_.$slides.slice(index - centerOffset, index + centerOffset + 1).addClass('slick-active');
			} else {
				indexOffset = _.options.slidesToShow + index;
				allSlides.slice(indexOffset - centerOffset + 1, indexOffset + centerOffset + 2).addClass('slick-active');
			}
			if (index === 0) {
				allSlides.eq(allSlides.length - 1 - _.options.slidesToShow).addClass('slick-center');
			} else if (index === _.slideCount - 1) {
				allSlides.eq(_.options.slidesToShow).addClass('slick-center');
			}
			_.$slides.eq(index).addClass('slick-center');
		} else {
			if (index > 0 && index < (_.slideCount - _.options.slidesToShow)) {
				_.$slides.slice(index, index + _.options.slidesToShow).addClass('slick-active');
			} else {
				indexOffset = _.options.infinite === true ? _.options.slidesToShow + index : index;
				allSlides.slice(indexOffset, indexOffset + _.options.slidesToShow).addClass('slick-active');
			}
		}
		if (_.options.lazyLoad === 'ondemand') {
			_.lazyLoad();
		}
	};
	Slick.prototype.setupInfinite = function() {
		var _ = this,
			i,
			slideIndex,
			infiniteCount
		;
		if (_.options.fade === true || _.options.vertical === true) {
			_.options.centerMode = false;
		}
		if (_.options.infinite === true && _.options.fade === false) {
			slideIndex = null;
			if (_.slideCount > _.options.slidesToShow) {
				if (_.options.centerMode === true) {
					infiniteCount = _.options.slidesToShow + 1;
				} else {
					infiniteCount = _.options.slidesToShow;
				}
				for (i = _.slideCount; i > (_.slideCount -
					infiniteCount); i -= 1) {
					slideIndex = i - 1;
					$(_.$slides[slideIndex]).clone().attr('id', '').prependTo(
						_.$slideTrack).addClass('slick-cloned');
				}
				for (i = 0; i < infiniteCount; i += 1) {
					slideIndex = i;
					$(_.$slides[slideIndex]).clone().attr('id', '').appendTo(
						_.$slideTrack).addClass('slick-cloned');
				}
				_.$slideTrack.find('.slick-cloned').find('[id]').each(function() {
					$(this).attr('id', '');
				});
			}
		}
	};
	Slick.prototype.slideHandler = function(index) {
		var _ = this,
			targetSlide,
			animSlide,
			slideLeft,
			unevenOffset,
			targetLeft = null
		;
		if (_.animating === true) {
			return false;
		}
		targetSlide = index;
		targetLeft = _.getLeft(targetSlide);
		slideLeft = _.getLeft(_.currentSlide);
		unevenOffset = _.slideCount % _.options.slidesToScroll !== 0 ? _.options.slidesToScroll : 0;
		_.currentLeft = _.swipeLeft === null ? slideLeft : _.swipeLeft;
		if (_.options.infinite === false && (index < 0 || index > (_.slideCount - _.options.slidesToShow + unevenOffset))) {
			if(_.options.fade === false) {
				targetSlide = _.currentSlide;
				_.animateSlide(slideLeft, function() {
					_.postSlide(targetSlide);
				});
			}
			return false;
		}
		if (_.options.autoplay === true) {
			clearInterval(_.autoPlayTimer);
		}
		if (targetSlide < 0) {
			if (_.slideCount % _.options.slidesToScroll !== 0) {
				animSlide = _.slideCount - (_.slideCount % _.options.slidesToScroll);
			} else {
				animSlide = _.slideCount - _.options.slidesToScroll;
			}
		} else if (targetSlide > (_.slideCount - 1)) {
			animSlide = 0;
		} else {
			animSlide = targetSlide;
		}
		_.animating = true;
		if (_.options.onBeforeChange !== null && index !== _.currentSlide) {
			_.options.onBeforeChange.call(this, _, _.currentSlide, animSlide);
		}
		_.currentSlide = animSlide;
		_.setSlideClasses(_.currentSlide);
		_.updateDots();
		_.updateArrows();
		if (_.options.fade === true) {
			_.fadeSlide(animSlide, function() {
				_.postSlide(animSlide);
			});
			return false;
		}
		_.animateSlide(targetLeft, function() {
			_.postSlide(animSlide);
		});
	};
	Slick.prototype.startLoad = function() {
		var _ = this;
		if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
			_.$prevArrow.hide();
			_.$nextArrow.hide();
		}
		if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
			_.$dots.hide();
		}
		_.$slider.addClass('slick-loading');
	};
	Slick.prototype.swipeDirection = function() {
		var _ = this,
			xDist,
			yDist,
			r,
			swipeAngle
		;
		xDist = _.touchObject.startX - _.touchObject.curX;
		yDist = _.touchObject.startY - _.touchObject.curY;
		r = Math.atan2(yDist, xDist);
		swipeAngle = Math.round(r * 180 / Math.PI);
		if (swipeAngle < 0) {
			swipeAngle = 360 - Math.abs(swipeAngle);
		}
		if ((swipeAngle <= 45) && (swipeAngle >= 0)) {
			return 'left';
		}
		if ((swipeAngle <= 360) && (swipeAngle >= 315)) {
			return 'left';
		}
		if ((swipeAngle >= 135) && (swipeAngle <= 225)) {
			return 'right';
		}
		return 'vertical';
	};
	Slick.prototype.swipeEnd = function(event) {
		var _ = this;
		_.$list.removeClass('dragging');
		if (_.touchObject.curX === undefined) {
			return false;
		}
		if (_.touchObject.swipeLength >= _.touchObject.minSwipe) {
			$(event.target).on('click.slick', function(event) {
				event.stopImmediatePropagation();
				event.stopPropagation();
				event.preventDefault();
				$(event.target).off('click.slick');
			});
			switch (_.swipeDirection()) {
				case 'left':
					_.slideHandler(_.currentSlide + _.options.slidesToScroll);
					_.touchObject = {};
					break;
				case 'right':
					_.slideHandler(_.currentSlide - _.options.slidesToScroll);
					_.touchObject = {};
					break;
			}
		} else {
			if(_.touchObject.startX !== _.touchObject.curX) {
				_.slideHandler(_.currentSlide);
				_.touchObject = {};
			}
		}
	};
	Slick.prototype.swipeHandler = function(event) {
		var _ = this;
		if ('ontouchend' in document && _.options.swipe === false) {
			return false;
		} else if (_.options.draggable === false && !event.originalEvent.touches) {
			return true;
		}
		_.touchObject.fingerCount = event.originalEvent && event.originalEvent.touches !== undefined ? event.originalEvent.touches.length : 1;
		_.touchObject.minSwipe = _.listWidth / _.options.touchThreshold;
		switch (event.data.action) {
			case 'start':
				_.swipeStart(event);
				break;
			case 'move':
				_.swipeMove(event);
				break;
			case 'end':
				_.swipeEnd(event);
				break;
		}
	};
	Slick.prototype.swipeMove = function(event) {
		var _ = this,
			curLeft,
			swipeDirection,
			positionOffset,
			touches
		;
		touches = event.originalEvent !== undefined ? event.originalEvent.touches : null;
		curLeft = _.getLeft(_.currentSlide);
		if (!_.$list.hasClass('dragging') || touches && touches.length !== 1) {
			return false;
		}
		_.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX;
		_.touchObject.curY = touches !== undefined ? touches[0].pageY : event.clientY;
		_.touchObject.swipeLength = Math.round(Math.sqrt( Math.pow(_.touchObject.curX - _.touchObject.startX, 2) ));
		swipeDirection = _.swipeDirection();
		if (swipeDirection === 'vertical') {
			return;
		}
		if (event.originalEvent !== undefined && _.touchObject.swipeLength > 4) {
			event.preventDefault();
		}
		positionOffset = _.touchObject.curX > _.touchObject.startX ? 1 : -1;
		if (_.options.vertical === false) {
			_.swipeLeft = curLeft + _.touchObject.swipeLength * positionOffset;
		} else {
			_.swipeLeft = curLeft + (_.touchObject.swipeLength * (_.$list.height() / _.listWidth)) * positionOffset;
		}
		if (_.options.fade === true || _.options.touchMove === false) {
			return false;
		}
		if (_.animating === true) {
			_.swipeLeft = null;
			return false;
		}
		_.setCSS(_.swipeLeft);
	};
	Slick.prototype.swipeStart = function(event) {
		var _ = this,
			touches
		;
		if (_.touchObject.fingerCount !== 1 || _.slideCount <= _.options.slidesToShow) {
			_.touchObject = {};
			return false;
		}
		if (event.originalEvent !== undefined && event.originalEvent.touches !== undefined) {
			touches = event.originalEvent.touches[0];
		}
		_.touchObject.startX = _.touchObject.curX = touches !== undefined ? touches.pageX : event.clientX;
		_.touchObject.startY = _.touchObject.curY = touches !== undefined ? touches.pageY : event.clientY;
		_.$list.addClass('dragging');
	};
	Slick.prototype.unfilterSlides = function() {
		var _ = this;
		if (_.$slidesCache !== null) {
			_.unload();
			_.$slideTrack.children(this.options.slide).remove();
			_.$slidesCache.appendTo(_.$slideTrack);
			_.reinit();
		}
	};
	Slick.prototype.unload = function() {
		var _ = this;
		$('.slick-cloned', _.$slider).remove();
		if (_.$dots) {
			_.$dots.remove();
		}
		if (_.$prevArrow) {
			_.$prevArrow.remove();
			_.$nextArrow.remove();
		}
		_.$slides.removeClass('slick-slide slick-active slick-visible').removeAttr('style');
	};
	Slick.prototype.updateArrows = function() {
		var _ = this;
		if (_.options.arrows === true && _.options.infinite !==
			true && _.slideCount > _.options.slidesToShow) {
			_.$prevArrow.removeClass('slick-disabled');
			_.$nextArrow.removeClass('slick-disabled');
			if (_.currentSlide === 0) {
				_.$prevArrow.addClass('slick-disabled');
				_.$nextArrow.removeClass('slick-disabled');
			} else if (_.currentSlide >= _.slideCount - _.options.slidesToShow) {
				_.$nextArrow.addClass('slick-disabled');
				_.$prevArrow.removeClass('slick-disabled');
			}
		}
	};
	Slick.prototype.updateDots = function() {
		var _ = this;
		if (_.$dots !== null) {
			_.$dots.find('li').removeClass('slick-active');
			_.$dots.find('li').eq(_.currentSlide / _.options.slidesToScroll).addClass('slick-active');
		}
	};
	$.fn.slick = function(options) {
		var _ = this;
		return _.each(function(index, element) {
			element.slick = new Slick(element, options);
		});
	};
	$.fn.slickAdd = function(slide, slideIndex, addBefore) {
		var _ = this;
		return _.each(function(index, element) {
			element.slick.addSlide(slide, slideIndex, addBefore);
		});
	};
	$.fn.slickCurrentSlide = function() {
		var _ = this;
		return _.get(0).slick.getCurrent();
	};
	$.fn.slickFilter = function(filter) {
		var _ = this;
		return _.each(function(index, element) {
			element.slick.filterSlides(filter);
		});
	};
	$.fn.slickGoTo = function(slide) {
		var _ = this;
		return _.each(function(index, element) {
			element.slick.slideHandler(slide);
		});
	};
	$.fn.slickNext = function() {
		var _ = this;
		return _.each(function(index, element) {
			element.slick.changeSlide({
				data: { message: 'next' }
			});
		});
	};
	$.fn.slickPause = function() {
		var _ = this;
		return _.each(function(index, element) {
			element.slick.autoPlayClear();
			element.slick.paused = true;
		});
	};
	$.fn.slickPlay = function() {
		var _ = this;
		return _.each(function(index, element) {
			element.slick.paused = false;
			element.slick.autoPlay();
		});
	};
	$.fn.slickPrev = function() {
		var _ = this;
		return _.each(function(index, element) {
			element.slick.changeSlide({
				data: { message: 'previous' }
			});
		});
	};
	$.fn.slickRemove = function(slideIndex, removeBefore) {
		var _ = this;
		return _.each(function(index, element) {
			element.slick.removeSlide(slideIndex, removeBefore);
		});
	};
	$.fn.slickSetOption = function(option, value, refresh) {
		var _ = this;
		return _.each(function(index, element) {
			element.slick.options[option] = value;
			if (refresh === true) {
				element.slick.unload();
				element.slick.reinit();
			}
		});
	};
	$.fn.slickUnfilter = function() {
		var _ = this;
		return _.each(function(index, element) {
			element.slick.unfilterSlides();
		});
	};
	$.fn.unslick = function() {
		var _ = this;
		return _.each(function(index, element) {
			element.slick.destroy();
		});
	};
}));
 */

/*!
 * jQuery blockUI plugin
 * Version 2.66.0-2013.10.09
 * Requires jQuery v1.7 or later
 *
 * Examples at: http://malsup.com/jquery/block/
 * Copyright (c) 2007-2013 M. Alsup
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Thanks to Amir-Hossein Sobhi for some excellent contributions!
 */(function(){"use strict";function e(e){function a(i,a){var l,h,m=i==window,g=a&&a.message!==undefined?a.message:undefined;a=e.extend({},e.blockUI.defaults,a||{});if(a.ignoreIfBlocked&&e(i).data("blockUI.isBlocked"))return;a.overlayCSS=e.extend({},e.blockUI.defaults.overlayCSS,a.overlayCSS||{});l=e.extend({},e.blockUI.defaults.css,a.css||{});a.onOverlayClick&&(a.overlayCSS.cursor="pointer");h=e.extend({},e.blockUI.defaults.themedCSS,a.themedCSS||{});g=g===undefined?a.message:g;m&&o&&f(window,{fadeOut:0});if(g&&typeof g!="string"&&(g.parentNode||g.jquery)){var y=g.jquery?g[0]:g,b={};e(i).data("blockUI.history",b);b.el=y;b.parent=y.parentNode;b.display=y.style.display;b.position=y.style.position;b.parent&&b.parent.removeChild(y)}e(i).data("blockUI.onUnblock",a.onUnblock);var w=a.baseZ,E,S,x,T;n||a.forceIframe?E=e('<iframe class="blockUI" style="z-index:'+w++ +';display:none;border:none;margin:0;padding:0;position:absolute;width:100%;height:100%;top:0;left:0" src="'+a.iframeSrc+'"></iframe>'):E=e('<div class="blockUI" style="display:none"></div>');a.theme?S=e('<div class="blockUI blockOverlay ui-widget-overlay" style="z-index:'+w++ +';display:none"></div>'):S=e('<div class="blockUI blockOverlay" style="z-index:'+w++ +';display:none;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0"></div>');if(a.theme&&m){T='<div class="blockUI '+a.blockMsgClass+' blockPage ui-dialog ui-widget ui-corner-all" style="z-index:'+(w+10)+';display:none;position:fixed">';a.title&&(T+='<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">'+(a.title||"&nbsp;")+"</div>");T+='<div class="ui-widget-content ui-dialog-content"></div>';T+="</div>"}else if(a.theme){T='<div class="blockUI '+a.blockMsgClass+' blockElement ui-dialog ui-widget ui-corner-all" style="z-index:'+(w+10)+';display:none;position:absolute">';a.title&&(T+='<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">'+(a.title||"&nbsp;")+"</div>");T+='<div class="ui-widget-content ui-dialog-content"></div>';T+="</div>"}else m?T='<div class="blockUI '+a.blockMsgClass+' blockPage" style="z-index:'+(w+10)+';display:none;position:fixed"></div>':T='<div class="blockUI '+a.blockMsgClass+' blockElement" style="z-index:'+(w+10)+';display:none;position:absolute"></div>';x=e(T);if(g)if(a.theme){x.css(h);x.addClass("ui-widget-content")}else x.css(l);a.theme||S.css(a.overlayCSS);S.css("position",m?"fixed":"absolute");(n||a.forceIframe)&&E.css("opacity",0);var N=[E,S,x],C=m?e("body"):e(i);e.each(N,function(){this.appendTo(C)});a.theme&&a.draggable&&e.fn.draggable&&x.draggable({handle:".ui-dialog-titlebar",cancel:"li"});var k=s&&(!e.support.boxModel||e("object,embed",m?null:i).length>0);if(r||k){m&&a.allowBodyStretch&&e.support.boxModel&&e("html,body").css("height","100%");if((r||!e.support.boxModel)&&!m)var L=v(i,"borderTopWidth"),A=v(i,"borderLeftWidth"),O=L?"(0 - "+L+")":0,M=A?"(0 - "+A+")":0;e.each(N,function(e,t){var n=t[0].style;n.position="absolute";if(e<2){m?n.setExpression("height","Math.max(document.body.scrollHeight, document.body.offsetHeight) - (jQuery.support.boxModel?0:"+a.quirksmodeOffsetHack+') + "px"'):n.setExpression("height",'this.parentNode.offsetHeight + "px"');m?n.setExpression("width",'jQuery.support.boxModel && document.documentElement.clientWidth || document.body.clientWidth + "px"'):n.setExpression("width",'this.parentNode.offsetWidth + "px"');M&&n.setExpression("left",M);O&&n.setExpression("top",O)}else if(a.centerY){m&&n.setExpression("top",'(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (blah = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"');n.marginTop=0}else if(!a.centerY&&m){var r=a.css&&a.css.top?parseInt(a.css.top,10):0,i="((document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "+r+') + "px"';n.setExpression("top",i)}})}if(g){a.theme?x.find(".ui-widget-content").append(g):x.append(g);(g.jquery||g.nodeType)&&e(g).show()}(n||a.forceIframe)&&a.showOverlay&&E.show();if(a.fadeIn){var _=a.onBlock?a.onBlock:t,D=a.showOverlay&&!g?_:t,P=g?_:t;a.showOverlay&&S._fadeIn(a.fadeIn,D);g&&x._fadeIn(a.fadeIn,P)}else{a.showOverlay&&S.show();g&&x.show();a.onBlock&&a.onBlock()}c(1,i,a);if(m){o=x[0];u=e(a.focusableElements,o);a.focusInput&&setTimeout(p,20)}else d(x[0],a.centerX,a.centerY);if(a.timeout){var H=setTimeout(function(){m?e.unblockUI(a):e(i).unblock(a)},a.timeout);e(i).data("blockUI.timeout",H)}}function f(t,n){var r,i=t==window,s=e(t),a=s.data("blockUI.history"),f=s.data("blockUI.timeout");if(f){clearTimeout(f);s.removeData("blockUI.timeout")}n=e.extend({},e.blockUI.defaults,n||{});c(0,t,n);if(n.onUnblock===null){n.onUnblock=s.data("blockUI.onUnblock");s.removeData("blockUI.onUnblock")}var h;i?h=e("body").children().filter(".blockUI").add("body > .blockUI"):h=s.find(">.blockUI");if(n.cursorReset){h.length>1&&(h[1].style.cursor=n.cursorReset);h.length>2&&(h[2].style.cursor=n.cursorReset)}i&&(o=u=null);if(n.fadeOut){r=h.length;h.stop().fadeOut(n.fadeOut,function(){--r===0&&l(h,a,n,t)})}else l(h,a,n,t)}function l(t,n,r,i){var s=e(i);if(s.data("blockUI.isBlocked"))return;t.each(function(e,t){this.parentNode&&this.parentNode.removeChild(this)});if(n&&n.el){n.el.style.display=n.display;n.el.style.position=n.position;n.parent&&n.parent.appendChild(n.el);s.removeData("blockUI.history")}s.data("blockUI.static")&&s.css("position","static");typeof r.onUnblock=="function"&&r.onUnblock(i,r);var o=e(document.body),u=o.width(),a=o[0].style.width;o.width(u-1).width(u);o[0].style.width=a}function c(t,n,r){var i=n==window,s=e(n);if(!t&&(i&&!o||!i&&!s.data("blockUI.isBlocked")))return;s.data("blockUI.isBlocked",t);if(!i||!r.bindEvents||t&&!r.showOverlay)return;var u="mousedown mouseup keydown keypress keyup touchstart touchend touchmove";t?e(document).bind(u,r,h):e(document).unbind(u,h)}function h(t){if(t.type==="keydown"&&t.keyCode&&t.keyCode==9&&o&&t.data.constrainTabKey){var n=u,r=!t.shiftKey&&t.target===n[n.length-1],i=t.shiftKey&&t.target===n[0];if(r||i){setTimeout(function(){p(i)},10);return!1}}var s=t.data,a=e(t.target);a.hasClass("blockOverlay")&&s.onOverlayClick&&s.onOverlayClick(t);return a.parents("div."+s.blockMsgClass).length>0?!0:a.parents().children().filter("div.blockUI").length===0}function p(e){if(!u)return;var t=u[e===!0?u.length-1:0];t&&t.focus()}function d(e,t,n){var r=e.parentNode,i=e.style,s=(r.offsetWidth-e.offsetWidth)/2-v(r,"borderLeftWidth"),o=(r.offsetHeight-e.offsetHeight)/2-v(r,"borderTopWidth");t&&(i.left=s>0?s+"px":"0");n&&(i.top=o>0?o+"px":"0")}function v(t,n){return parseInt(e.css(t,n),10)||0}e.fn._fadeIn=e.fn.fadeIn;var t=e.noop||function(){},n=/MSIE/.test(navigator.userAgent),r=/MSIE 6.0/.test(navigator.userAgent)&&!/MSIE 8.0/.test(navigator.userAgent),i=document.documentMode||0,s=e.isFunction(document.createElement("div").style.setExpression);e.blockUI=function(e){a(window,e)};e.unblockUI=function(e){f(window,e)};e.growlUI=function(t,n,r,i){var s=e('<div class="growlUI"></div>');t&&s.append("<h1>"+t+"</h1>");n&&s.append("<h2>"+n+"</h2>");r===undefined&&(r=3e3);var o=function(t){t=t||{};e.blockUI({message:s,fadeIn:typeof t.fadeIn!="undefined"?t.fadeIn:700,fadeOut:typeof t.fadeOut!="undefined"?t.fadeOut:1e3,timeout:typeof t.timeout!="undefined"?t.timeout:r,centerY:!1,showOverlay:!1,onUnblock:i,css:e.blockUI.defaults.growlCSS})};o();var u=s.css("opacity");s.mouseover(function(){o({fadeIn:0,timeout:3e4});var t=e(".blockMsg");t.stop();t.fadeTo(300,1)}).mouseout(function(){e(".blockMsg").fadeOut(1e3)})};e.fn.block=function(t){if(this[0]===window){e.blockUI(t);return this}var n=e.extend({},e.blockUI.defaults,t||{});this.each(function(){var t=e(this);if(n.ignoreIfBlocked&&t.data("blockUI.isBlocked"))return;t.unblock({fadeOut:0})});return this.each(function(){if(e.css(this,"position")=="static"){this.style.position="relative";e(this).data("blockUI.static",!0)}this.style.zoom=1;a(this,t)})};e.fn.unblock=function(t){if(this[0]===window){e.unblockUI(t);return this}return this.each(function(){f(this,t)})};e.blockUI.version=2.66;e.blockUI.defaults={message:"<h1>Please wait...</h1>",title:null,draggable:!0,theme:!1,css:{padding:0,margin:0,width:"30%",top:"40%",left:"35%",textAlign:"center",color:"#000",border:"3px solid #aaa",backgroundColor:"#fff",cursor:"wait"},themedCSS:{width:"30%",top:"40%",left:"35%"},overlayCSS:{backgroundColor:"#000",opacity:.6,cursor:"wait"},cursorReset:"default",growlCSS:{width:"350px",top:"10px",left:"",right:"10px",border:"none",padding:"5px",opacity:.6,cursor:"default",color:"#fff",backgroundColor:"#000","-webkit-border-radius":"10px","-moz-border-radius":"10px","border-radius":"10px"},iframeSrc:/^https/i.test(window.location.href||"")?"javascript:false":"about:blank",forceIframe:!1,baseZ:1e3,centerX:!0,centerY:!0,allowBodyStretch:!0,bindEvents:!0,constrainTabKey:!0,fadeIn:200,fadeOut:400,timeout:0,showOverlay:!0,focusInput:!0,focusableElements:":input:enabled:visible",onBlock:null,onUnblock:null,onOverlayClick:null,quirksmodeOffsetHack:4,blockMsgClass:"blockMsg",ignoreIfBlocked:!1};var o=null,u=[]}typeof define=="function"&&define.amd&&define.amd.jQuery?define(["jquery"],e):e(jQuery)})();

/**
 * Filter.js is a jQuery plugin that enables simple element filtering based on terms.
 * The functionality is similar to isotope, but without layouts and very bare bones.
 *
 * @name filter.js
 * @version 1.0.0
 * @requires jQuery v1.9.2+
 * @author Tom Maitland
 * @license Apache v2 License
 *
 * For docs, visit:
 * https://github.com/tommaitland/filter.js
 *
 * Copyright (c) 2013, Tom Maitland
 */

(function ($) {

    "use strict";
 
    $.fn.filter = function (options) {
 
        var defaults = {
            nav: '[data-filter]',
            showAny: false
        }

        var $this = this,
            settings = $.extend(defaults, options),
            $target = $(settings.target),
            selected = []
        ;

        return this.each( function() {
            
            var $element = $(this);

            $(settings.nav).each( function() {

                $(this).click( function(event) {

                    // add selected class
                    $(this).toggleClass('selected');

                    // manipulate selected terms array
                    if ($.inArray($(this).data('filter'), selected) < 0) {
                        selected.push($(this).data('filter'));
                    } else {
                        var index = $.inArray($(this).data('filter'), selected);
                        selected.splice(index, 1);
                    }
                    
                    // show/hide elements
                    $element.find('[data-filter-tags]').each( function() {

                        var terms = $(this).data('filter-tags').split(','),
                            show = null
                        ;

                        if (settings.showAny) {
                            for (var i=0;terms.length;i++) {
                                show = ($.inArray(terms[i], selected) >= 0 && show !== false);
                            }
                        } else {
                            for (var i=0;i<selected.length;i++) {
                                show = ($.inArray(selected[i], terms) >= 0 && show !== false);
                            }
                        }

                        if (show || selected.length == 0) {
                            $(this).fadeIn();
                        } else {
                            $(this).fadeOut();
                        }
                    });

                    event.preventDefault();

                });

            });

        });
 
    };
 
}(jQuery));


/**
* jquery.matchHeight.js v0.5.1
* http://brm.io/jquery-match-height/
* License: MIT

(function($) {
	$.fn.matchHeight = function(byRow) {
		// handle matchHeight('remove')
		if (byRow === 'remove') {
			var that = this;
			// remove fixed height from all selected elements
			this.css('height', '');
			// remove selected elements from all groups
			$.each($.fn.matchHeight._groups, function(key, group) {
				group.elements = group.elements.not(that);
			});
			// TODO: cleanup empty groups
			return this;
		}
		if (this.length <= 1)
			return this;
		// byRow default to true
		byRow = (typeof byRow !== 'undefined') ? byRow : true;
		// keep track of this group so we can re-apply later on load and resize events
		$.fn.matchHeight._groups.push({
			elements: this,
			byRow: byRow
		});
		// match each element's height to the tallest element in the selection
		$.fn.matchHeight._apply(this, byRow);
		return this;
	};
	$.fn.matchHeight._apply = function(elements, byRow) {
		var $elements = $(elements),
			rows = [$elements]
		;
		// get rows if using byRow, otherwise assume one row
		if (byRow) {
			// must first force an arbitrary equal height so floating elements break evenly
			$elements.css({
				'display': 'block',
				'padding-top': '0',
				'padding-bottom': '0',
				'border-top': '0',
				'border-bottom': '0',
				'height': '100px'
			});
			// get the array of rows (based on element top position)
			rows = _rows($elements);
			// revert the temporary forced style
			$elements.css({
				'display': '',
				'padding-top': '',
				'padding-bottom': '',
				'border-top': '',
				'border-bottom': '',
				'height': ''
			});
		}
		$.each(rows, function(key, row) {
			var $row = $(row),
				maxHeight = 0
			;
			// iterate the row and find the max height
			$row.each(function(){
				var $that = $(this);
				// ensure we get the correct actual height (and not a previously set height value)
				$that.css({ 'display': 'block', 'height': '' });
				// find the max height (including padding, but not margin)
				if ($that.outerHeight(false) > maxHeight)
					maxHeight = $that.outerHeight(false);
				// revert display block
				$that.css({ 'display': '' });
			});
			// iterate the row and apply the height to all elements
			$row.each(function(){
				var $that = $(this),
					verticalPadding = 0
				;
				// handle padding and border correctly (required when not using border-box)
				if ($that.css('box-sizing') !== 'border-box') {
					verticalPadding += _parse($that.css('border-top-width')) + _parse($that.css('border-bottom-width'));
					verticalPadding += _parse($that.css('padding-top')) + _parse($that.css('padding-bottom'));
				}
				// set the height (accounting for padding and border)
				$that.css('height', maxHeight - verticalPadding);
			});
		});
		return this;
	};*/
	/*
	*  _applyDataApi will apply matchHeight to all elements with a data-match-height attribute
	
	$.fn.matchHeight._applyDataApi = function() {
		var groups = {};
		// generate groups by their groupId set by elements using data-match-height
		$('[data-match-height], [data-mh]').each(function() {
			var $this = $(this),
				groupId = $this.attr('data-match-height');
			if (groupId in groups) {
				groups[groupId] = groups[groupId].add($this);
			} else {
				groups[groupId] = $this;
			}
		});
		// apply matchHeight to each group
		$.each(groups, function() {
			this.matchHeight(true);
		});
	};*/
	/* 
	*  _update function will re-apply matchHeight to all groups with the correct options
	
	$.fn.matchHeight._groups = [];
	$.fn.matchHeight._throttle = 80;
	var previousResizeWidth = -1,
		updateTimeout = -1;
	$.fn.matchHeight._update = function(event) {
		// prevent update if fired from a resize event 
		// where the viewport width hasn't actually changed
		// fixes an event looping bug in IE8
		if (event && event.type === 'resize') {
			var windowWidth = $(window).width();
			if (windowWidth === previousResizeWidth)
				return;
			previousResizeWidth = windowWidth;
		}
		// throttle updates
		if (updateTimeout === -1) {
			updateTimeout = setTimeout(function() {
				$.each($.fn.matchHeight._groups, function() {
					$.fn.matchHeight._apply(this.elements, this.byRow);
				});
				updateTimeout = -1;
			}, $.fn.matchHeight._throttle);
		}
	};*/
	/* 
	*  bind events
	
	// apply on DOM ready event
	$($.fn.matchHeight._applyDataApi);
	// update heights on load and resize events
	$(window).bind('load resize orientationchange', $.fn.matchHeight._update);*/
	/*
	*  rows utility function
	*  returns array of jQuery selections representing each row 
	*  (as displayed after float wrapping applied by browser)
	
	var _rows = function(elements) {
		var tolerance = 1,
			$elements = $(elements),
			lastTop = null,
			rows = []
		   ;
		// group elements by their top position
		$elements.each(function(){
			var $that = $(this),
				top = $that.offset().top - _parse($that.css('margin-top')),
				lastRow = rows.length > 0 ? rows[rows.length - 1] : null;

			if (lastRow === null) {
				// first item on the row, so just push it
				rows.push($that);
			} else {
				// if the row top is the same, add to the row group
				if (Math.floor(Math.abs(lastTop - top)) <= tolerance) {
					rows[rows.length - 1] = lastRow.add($that);
				} else {
					// otherwise start a new row group
					rows.push($that);
				}
			}
			// keep track of the last row top
			lastTop = top;
		});
		return rows;
	};
	var _parse = function(value) {
		// parse value and convert NaN to 0
		return parseFloat(value) || 0;
	};
})(jQuery);
*/
/*
(function($) {
    $.organicTabs = function(el, options) {
        var base = this;
        base.$el = $(el);
        base.$nav = base.$el.find(".nav-tabs");
        base.init = function() {
            base.options = $.extend({},$.organicTabs.defaultOptions, options);
            // Accessible hiding fix
            $(".hide").css({
                "position": "relative",
                "top": 0,
                "left": 0,
                "display": "none"
            });
            base.$nav.on("click", '[data-toggle="tab"]', function() {
                // Figure out current list via CSS class
                var curList = base.$el.find("a.current").attr("href").substring(1),
                // List moving to
                    $newList = $(this),
                // Figure out ID of new list
                    listID = $newList.attr("href").substring(1),
                // Set outer wrapper height to (static) height of current inner list
                    $allListWrap = base.$el.find(".list-wrap"),
                    curListHeight = $allListWrap.height();
                    $allListWrap.height(curListHeight);
                if ((listID != curList) && ( base.$el.find(":animated").length == 0)) {
                    // Fade out current list
                    base.$el.find("#"+curList).fadeOut(base.options.speed, function() {
                        // Fade in new list on callback
                        base.$el.find("#"+listID).fadeIn(base.options.speed);
                        // Adjust outer wrapper to fit new list snuggly
                        var newHeight = base.$el.find("#"+listID).height();
                        $allListWrap.animate({
                            height: newHeight
                        });
                        // Remove highlighting - Add to just-clicked tab
                        base.$el.find(".nav li a").removeClass("current");
                        $newList.addClass("current");
                    });
                    // Update URL bar, retain state
                    window.history.pushState({ 
                        'organictabsState': listID 
                        }, 
                    window.document.title, window.location.pathname + "#!" + listID);
                }
                // Don't behave like a regular link
                // Stop propegation and bubbling
                return false;
            });
        };
        base.init();
        // check for window.state, if exists then activate
        if(history.state && history.state.length !==0){
            if("organictabsState" in history.state){ // check for the organictabsState key
                // pull back in all of the var declarations so that they're accessible at start
                curList = base.$el.find("a.current").attr("href").substring(1);
                stateID = history.state.organictabsState;
                $allListWrap = base.$el.find(".list-wrap"),
                curListHeight = $allListWrap.height();
                $allListWrap.height(curListHeight);

                if (history.state.organictabsState != curList) {
                    // Fade out current list
                    base.$el.find("#"+curList).fadeOut("fast", function() {
                        // Fade in new list on callback
                        base.$el.find("#"+stateID).fadeIn("fast");
                        // Adjust outer wrapper to fit new list snuggly
                        var newHeight = base.$el.find("#"+stateID).height();
                        $allListWrap.animate({
                            height: newHeight
                        });
                        // Cycle through nav options, add class=current to organictabsState and remove from others
                        base.$el.find(".nav li a").each(function(){
                            $(this).attr("href") === "#" + stateID ? $(this).addClass("current") : $(this).removeClass("current");
                        });
                    });
                }
            }
        }
    };
    $.organicTabs.defaultOptions = {
        "speed": 300
    };
    $.fn.organicTabs = function(options) {
        return this.each(function() {
            (new $.organicTabs(this, options));
        });
    };
})(jQuery);
*/

function Steady(opts) {
  if ( !opts ) throw new Error('missing options');
  if ( !opts.handler ) throw new Error('missing handler parameter');


  this.scrollElement = opts.scrollElement || window;
  this.conditions = opts.conditions || {};
  this.handler   = opts.handler;
  this.values    = {};
  this.tracked   = {};
  this.success   = false;
  this.throttleVal = opts.throttle || 100;
  this.processing = false;
  this.stopped = false;


  this._parse();

  if ( 'pageYOffset' in this.scrollElement ) {
    this._addBottom();
    this._addTop();
  } else {
    this._addBottomEl();
    this._addTopEl();
    this._addScrollLeft();
  }

  this._addWidth();
  this._onScroll();

}


Steady.prototype.addCondition = function(name, value) {
  this.conditions[name] = value;
  this._parse();
};
Steady.prototype.removeCondition = function(name) {
  delete this.conditions[name];
  this._parse();
};
Steady.prototype.addTracker  = function(name, fn) {
  this.tracked[name] = { cb: fn, name: name};
};

Steady.prototype._addBottom = function() {
  this.addTracker('bottom', function(scrollable) {
    var height = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight, 
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );
    return height - (scrollable.pageYOffset + scrollable.innerHeight);
  });
};

Steady.prototype._addTop = function() {
  this.addTracker('top', function(scrollable) {
    return scrollable.pageYOffset;
  });
};

Steady.prototype._addBottomEl = function() {
  var self = this;
  this.addTracker('bottom', function(scrollable) {
    var height = Math.max(
      scrollable.scrollHeight,
      scrollable.offsetHeight
    );
    return height - ( scrollable.scrollTop + scrollable.offsetHeight);
  });
};

Steady.prototype._addTopEl = function() {
  this.addTracker('top', function(scrollable) {
    return scrollable.scrollTop;
  });
};

Steady.prototype._addScrollLeft = function() {
  var self = this;
  this.addTracker('scrollLeft', function(scrollable) {
    return scrollable.scrollLeft;
  });
};

Steady.prototype._addWidth = function() {
  this.addTracker('width', function(scrollable) {
    return scrollable.innerWidth;
  });
};


Steady.prototype._parse = function() {
  this._parsed = {};
  this._wantedTrackers = [];
  this._parsedMax = {};
  this._parsedMin = {};

  for ( var condition in this.conditions ) {
    if( !this.conditions.hasOwnProperty(condition) ) continue;
    
    var operator = condition.substr(0, 4);

    switch(operator) {
      case 'min-':
        this._wantedTrackers.push(condition.substr(4, condition.length));
        this._parsedMin[condition.substr(4, condition.length)] = this.conditions[condition];
        break;
      case 'max-':
        this._wantedTrackers.push(condition.substr(4, condition.length));
        this._parsedMax[condition.substr(4, condition.length)] = this.conditions[condition];
        break;
      default:
        this._wantedTrackers.push(condition);
        this._parsed[condition] = this.conditions[condition];
    }

  }
};

Steady.prototype._check = function() {
  var results = [];
  
  for( var name in this.values ) {
    if ( this._parsed.hasOwnProperty(name) ) {
      results.push( this._parsed[name] == this.values[name] );
    }
    if ( this._parsedMin.hasOwnProperty(name) ) {
      results.push( this._parsedMin[name] <= this.values[name] ); 
    }

    if ( this._parsedMax.hasOwnProperty(name) ) {
      results.push( this._parsedMax[name] >= this.values[name] );
    }
  }

  if ( results.length && results.indexOf(false) == -1 ) {
    this.processing = true;

    var cb = this._done.bind(this);
    window.requestAnimationFrame(this.handler.bind(this, this.values, cb));
  }
};

Steady.prototype._done = function() {
  this.processing = false;
};

Steady.prototype._onScroll = function() {
  this._onScrollHandler = this._throttledHandler();
  this.scrollElement.addEventListener('scroll', this._onScrollHandler, false);
};

Steady.prototype._throttledHandler = function() {
  var self = this;
  return this.throttle(function(e) {

    if ( !self._wantedTrackers.length || self.processing ) return;
    
    for (var i = 0; i < self._wantedTrackers.length; i++) {

      if ( !self.tracked[self._wantedTrackers[i]] ) continue;

      self.values[self._wantedTrackers[i]] = self.tracked[self._wantedTrackers[i]].cb(self.scrollElement || window);
    }
    
    window.requestAnimationFrame(self._check.bind(self));
  }, this.throttleVal);
};

Steady.prototype.stop = function() {
  if ( ! this.stopped  ) {
    this.scrollElement.removeEventListener('scroll', this._onScrollHandler, false);
    this.stopped = true;
  }
};

Steady.prototype.resume = function() {
  if ( this.stopped  ) 
    this._onScroll();
    this.stopped = false;
};


// i use it to avoid calling the onscroll function many times.
Steady.prototype.throttle = function(fn, delay) {
  var timer;

  return function () {
    var context = this;
    var args = arguments;

    if ( timer ) return;

    timer = true;
    setTimeout(function () {
      fn.apply(context, args);
      timer = false;
    }, delay);
  };
};


if (typeof module === 'object' && module.exports) {
  module.exports = Steady;
}

// TIPPER (tooltip)
;(function ($, window) {
	"use strict";
	var $body,
		$tipper
	;
	/**
	 * @options
	 * @param direction [string] <'top'> "Tooltip direction"
	 * @param follow [boolean] <false> "Flag to follow mouse"
	 * @param formatter [function] <$.noop> "Text format function"
	 * @param margin [int] <15> "Tooltip margin"
	 */
	var options = {
		direction: "top",
		follow: false,
		formatter: $.noop,
		margin: 15
	};
	var pub = {
		/**
		 * @method
		 * @name defaults
		 * @description Sets default plugin options
		 * @param opts [object] <{}> "Options object"
		 * @example $.tipper("defaults", opts);
		 */
		defaults: function(opts) {
			options = $.extend(options, opts || {});
			return $(this);
		},
		/**
		 * @method
		 * @name destroy
		 * @description Removes instance of plugin
		 * @example $(".target").tipper("destroy");
		 */
		destroy: function() {
			return $(this).trigger("mouseleave.tipper")
							.off(".tipper")
							.removeClass("tipper-attached");
		}
	};
	/**
	 * @method private
	 * @name _init
	 * @description Initializes plugin
	 * @param opts [object] "Initialization options"
	 */
	function _init(opts) {
		options.formatter = _format;
		return $(this).not(".tipper-attached")
					  .addClass("tipper-attached")
					  .on("mouseenter.tipper", $.extend({}, options, opts || {}), _build);
	}
	/**
	 * @method private
	 * @name _build
	 * @description Builds target instance
	 * @param e [object] "Event data"
	 */
	function _build(e) {
		$body = $("body");
		var $target = $(this),
			data = $.extend(true, {}, e.data, $target.data("tipper-options")),
			html = ''
		;
		html += '<div class="tipper ' + data.direction + '">';
		html += '<div class="tipper-content">';
		html += data.formatter.apply($body, [$target]);
		html += '<span class="tipper-caret"></span>';
		html += '</div>';
		html += '</div>';
		data.$target = $target;
		data.$tipper = $(html);
		$body.append(data.$tipper);
		data.$content = data.$tipper.find(".tipper-content");
		data.$caret = data.$tipper.find(".tipper-caret");
		data.offset = $target.offset();
		data.height = $target.outerHeight();
		data.width  = $target.outerWidth();
		data.tipperPos = {};
		data.caretPos = {};
		data.contentPos = {};
		var caretHeight	= data.$caret.outerHeight(true),
			caretWidth	 = data.$caret.outerWidth(true),
			contentHeight = data.$content.outerHeight(true),
			contentWidth	 = data.$content.outerWidth(true) + caretWidth
		;
		// position content
		if (data.direction === "right" || data.direction === "left") {
			data.caretPos.top = (contentHeight - caretHeight) / 2;
			data.contentPos.top = -contentHeight / 2;
			if (data.direction === "right") {
				data.contentPos.left = caretWidth + data.margin;
			} else if (data.direction === "left") {
				data.contentPos.left = -(contentWidth + data.margin);
			}
		} else {
			data.caretPos.left = (contentWidth - caretWidth) / 2;
			data.contentPos.left = -contentWidth / 2;
			if (data.direction === "bottom") {
				data.contentPos.top = data.margin;
			} else if (data.direction === "top") {
				data.contentPos.top = -(contentHeight + data.margin);
			}
		}
		// modify dom
		data.$content.css(data.contentPos);
		data.$caret.css(data.caretPos);
		// position tipper
		if (data.follow) {
			data.$target
				.on("mousemove.tipper", data, _onMouseMove)
				.trigger("mousemove")
			;
		} else {
			if (data.direction === "right" || data.direction === "left") {
				data.tipperPos.top = data.offset.top + (data.height / 2);
				if (data.direction === "right") {
					data.tipperPos.left = data.offset.left + data.width;
				} else if (data.direction === "left") {
					data.tipperPos.left = data.offset.left;
				}
			} else {
				data.tipperPos.left = data.offset.left + (data.width / 2);
				if (data.direction === "bottom") {
					data.tipperPos.top = data.offset.top + data.height;
				} else if (data.direction === "top") {
					data.tipperPos.top = data.offset.top;
				}
			}
			data.$tipper.css(data.tipperPos);
		}
		// bind events
		data.$target.one("mouseleave.tipper", data, _onMouseOut);
	}
	/**
	 * @method private
	 * @name _format
	 * @description Formats tooltip text
	 * @param $target [jQuery object] "Target element"
	 * @return [string] "Formatted text"
	 */
	function _format($target) {
		//return $target.data("title");
		return $target.attr("title");
	}
	/**
	 * @method private
	 * @name _onMouseMove
	 * @description Handles mousemove event
	 * @param e [object] "Event data"
	 */
	function _onMouseMove(e) {
		var data = e.data;
		data.$tipper.css({ left: e.pageX, top: e.pageY });
	}
	/**
	 * @method private
	 * @name _onMouseOut
	 * @description Handles mouseout event
	 * @param e [object] "Event data"
	 */
	function _onMouseOut(e) {
		var data = e.data;
		data.$tipper.remove();
		data.$target.off("mousemove.tipper mouseleave.tipper");
	}
	$.fn.tipper = function(method) {
		if (pub[method]) {
			return pub[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return _init.apply(this, arguments);
		}
		return this;
	};
	$.tipper = function(method) {
		if (method === "defaults") {
			pub.defaults.apply(this, Array.prototype.slice.call(arguments, 1));
		}
	};
})(jQuery);


/*!
* Velocity.js: Accelerated JavaScript animation.
* @version 0.10.1
* @docs http://VelocityJS.org
* @license Copyright 2014 Julian Shapiro. MIT License: http://en.wikipedia.org/wiki/MIT_License
*/
!function(e,t,r,a){function o(e){for(var t=-1,r=e?e.length:0,a=[];++t<r;){var o=e[t];o&&a.push(o)}return a}function i(e){var t=$.data(e,c);return null===t?a:t}function n(e){return function(t){return Math.round(t*e)*(1/e)}}function s(e,t){var r=e;return m.isString(e)?y.Easings[e]||(r=!1):r=m.isArray(e)&&1===e.length?n.apply(null,e):m.isArray(e)&&2===e.length?x.apply(null,e.concat([t])):m.isArray(e)&&4===e.length?v.apply(null,e):!1,r===!1&&(r=y.Easings[y.defaults.easing]?y.defaults.easing:g),r}function l(e){if(e)for(var t=(new Date).getTime(),r=0,o=y.State.calls.length;o>r;r++)if(y.State.calls[r]){var n=y.State.calls[r],s=n[0],c=n[2],p=n[3];p||(p=y.State.calls[r][3]=t-16);for(var g=Math.min((t-p)/c.duration,1),d=0,f=s.length;f>d;d++){var v=s[d],x=v.element;if(i(x)){var S=!1;c.display&&"none"!==c.display&&b.setPropertyValue(x,"display",c.display),c.visibility&&"hidden"!==c.visibility&&b.setPropertyValue(x,"visibility",c.visibility);for(var V in v)if("element"!==V){var P=v[V],w,T=m.isString(P.easing)?y.Easings[P.easing]:P.easing;if(w=1===g?P.endValue:P.startValue+(P.endValue-P.startValue)*T(g),P.currentValue=w,b.Hooks.registered[V]){var C=b.Hooks.getRoot(V),k=i(x).rootPropertyValueCache[C];k&&(P.rootPropertyValue=k)}var E=b.setPropertyValue(x,V,P.currentValue+(0===parseFloat(w)?"":P.unitType),P.rootPropertyValue,P.scrollData);b.Hooks.registered[V]&&(i(x).rootPropertyValueCache[C]=b.Normalizations.registered[C]?b.Normalizations.registered[C]("extract",null,E[1]):E[1]),"transform"===E[0]&&(S=!0)}c.mobileHA&&i(x).transformCache.translate3d===a&&(i(x).transformCache.translate3d="(0px, 0px, 0px)",S=!0),S&&b.flushTransformCache(x)}}c.display&&"none"!==c.display&&(y.State.calls[r][2].display=!1),c.visibility&&"hidden"!==c.visibility&&(y.State.calls[r][2].visibility=!1),c.progress&&c.progress.call(n[1],n[1],g,Math.max(0,p+c.duration-t),p),1===g&&u(r)}y.State.isTicking&&(y.mock?l(!0):h(l))}function u(e,t){if(!y.State.calls[e])return!1;for(var r=y.State.calls[e][0],o=y.State.calls[e][1],n=y.State.calls[e][2],s=y.State.calls[e][4],l=!1,u=0,c=r.length;c>u;u++){var p=r[u].element;if(t||n.loop||("none"===n.display&&b.setPropertyValue(p,"display",n.display),"hidden"===n.visibility&&b.setPropertyValue(p,"visibility",n.visibility)),($.queue(p)[1]===a||!/\.velocityQueueEntryFlag/i.test($.queue(p)[1]))&&i(p)){i(p).isAnimating=!1,i(p).rootPropertyValueCache={};var g=!1;$.each(i(p).transformCache,function(e,t){var r=/^scale/.test(e)?1:0;new RegExp("^\\("+r+"[^.]").test(t)&&(g=!0,delete i(p).transformCache[e])}),n.mobileHA&&(g=!0,delete i(p).transformCache.translate3d),g&&b.flushTransformCache(p),b.Values.removeClass(p,"velocity-animating")}if(!t&&n.complete&&!n.loop&&u===c-1)try{n.complete.call(o,o)}catch(d){setTimeout(function(){throw d},1)}s&&n.loop!==!0&&s(o),n.loop!==!0||t||y.animate(p,"reverse",{loop:!0,delay:n.delay}),n.queue!==!1&&$.dequeue(p,n.queue)}y.State.calls[e]=!1;for(var f=0,h=y.State.calls.length;h>f;f++)if(y.State.calls[f]!==!1){l=!0;break}l===!1&&(y.State.isTicking=!1,delete y.State.calls,y.State.calls=[])}var c="velocity",p=400,g="swing",d=function(){if(r.documentMode)return r.documentMode;for(var e=7;e>4;e--){var t=r.createElement("div");if(t.innerHTML="<!--[if IE "+e+"]><span></span><![endif]-->",t.getElementsByTagName("span").length)return t=null,e}return a}(),f=function(){var e=0;return t.webkitRequestAnimationFrame||t.mozRequestAnimationFrame||function(t){var r=(new Date).getTime(),a;return a=Math.max(0,16-(r-e)),e=r+a,setTimeout(function(){t(r+a)},a)}}(),h=t.requestAnimationFrame||f,m={isString:function(e){return"string"==typeof e},isArray:Array.isArray||function(e){return"[object Array]"===Object.prototype.toString.call(e)},isFunction:function(e){return"[object Function]"===Object.prototype.toString.call(e)},isNode:function(e){return e&&e.nodeType},isNodeList:function(e){return"object"==typeof e&&/^\[object (HTMLCollection|NodeList|Object)\]$/.test(Object.prototype.toString.call(e))&&e.length!==a&&(0===e.length||"object"==typeof e[0]&&e[0].nodeType>0)},isWrapped:function(e){return e&&(e.jquery||t.Zepto&&t.Zepto.zepto.isZ(e))},isSVG:function(e){return t.SVGElement&&e instanceof SVGElement},isEmptyObject:function(e){var t;for(t in e)return!1;return!0}},$=t.jQuery||e.Velocity&&e.Velocity.Utilities;if(!$)throw new Error("Velocity: Either jQuery or Velocity's jQuery shim must first be loaded.");if(e.Velocity!==a&&!e.Velocity.Utilities)throw new Error("Velocity: Namespace is occupied.");if(7>=d){if(t.jQuery)return void(t.jQuery.fn.velocity=t.jQuery.fn.animate);throw new Error("Velocity: For IE<=7, Velocity falls back to jQuery, which must first be loaded.")}if(8===d&&!t.jQuery)throw new Error("Velocity: For IE8, Velocity requires jQuery to be loaded. (Velocity's jQuery shim does not work with IE8.)");var y=e.Velocity=e.velocity=$.extend({State:{isMobile:/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),isAndroid:/Android/i.test(navigator.userAgent),isGingerbread:/Android 2\.3\.[3-7]/i.test(navigator.userAgent),isChrome:t.chrome,isFirefox:/Firefox/i.test(navigator.userAgent),prefixElement:r.createElement("div"),prefixMatches:{},scrollAnchor:null,scrollPropertyLeft:null,scrollPropertyTop:null,isTicking:!1,calls:[]},CSS:{},Utilities:t.jQuery,Sequences:{},Easings:{},Promise:t.Promise,defaults:{queue:"",duration:p,easing:g,begin:null,complete:null,progress:null,display:null,loop:!1,delay:!1,mobileHA:!0,_cacheValues:!0},animate:function(){},mock:!1,version:{major:0,minor:10,patch:1},debug:!1},t.Velocity);t.pageYOffset!==a?(y.State.scrollAnchor=t,y.State.scrollPropertyLeft="pageXOffset",y.State.scrollPropertyTop="pageYOffset"):(y.State.scrollAnchor=r.documentElement||r.body.parentNode||r.body,y.State.scrollPropertyLeft="scrollLeft",y.State.scrollPropertyTop="scrollTop"),y.State.isMobile||r.hidden===a||r.addEventListener("visibilitychange",function(){r.hidden?(h=function(e){return setTimeout(function(){e(!0)},16)},l()):h=t.requestAnimationFrame||f});var v=function(){function e(e,t){return 1-3*t+3*e}function t(e,t){return 3*t-6*e}function r(e){return 3*e}function a(a,o,i){return((e(o,i)*a+t(o,i))*a+r(o))*a}function o(a,o,i){return 3*e(o,i)*a*a+2*t(o,i)*a+r(o)}return function(e,t,r,i){function n(t){for(var i=t,n=0;8>n;++n){var s=o(i,e,r);if(0===s)return i;var l=a(i,e,r)-t;i-=l/s}return i}if(4!==arguments.length)return!1;for(var s=0;4>s;++s)if("number"!=typeof arguments[s]||isNaN(arguments[s])||!isFinite(arguments[s]))return!1;return e=Math.min(e,1),r=Math.min(r,1),e=Math.max(e,0),r=Math.max(r,0),function(o){return e===t&&r===i?o:a(n(o),t,i)}}}(),x=function(){function e(e){return-e.tension*e.x-e.friction*e.v}function t(t,r,a){var o={x:t.x+a.dx*r,v:t.v+a.dv*r,tension:t.tension,friction:t.friction};return{dx:o.v,dv:e(o)}}function r(r,a){var o={dx:r.v,dv:e(r)},i=t(r,.5*a,o),n=t(r,.5*a,i),s=t(r,a,n),l=1/6*(o.dx+2*(i.dx+n.dx)+s.dx),u=1/6*(o.dv+2*(i.dv+n.dv)+s.dv);return r.x=r.x+l*a,r.v=r.v+u*a,r}return function a(e,t,o){var i={x:-1,v:0,tension:null,friction:null},n=[0],s=0,l=1e-4,u=.016,c,p,g;for(e=parseFloat(e)||500,t=parseFloat(t)||20,o=o||null,i.tension=e,i.friction=t,c=null!==o,c?(s=a(e,t),p=s/o*u):p=u;;)if(g=r(g||i,p),n.push(1+g.x),s+=16,!(Math.abs(g.x)>l&&Math.abs(g.v)>l))break;return c?function(e){return n[e*(n.length-1)|0]}:s}}();!function(){y.Easings.linear=function(e){return e},y.Easings.swing=function(e){return.5-Math.cos(e*Math.PI)/2},y.Easings.spring=function(e){return 1-Math.cos(4.5*e*Math.PI)*Math.exp(6*-e)},y.Easings.ease=v(.25,.1,.25,1),y.Easings["ease-in"]=v(.42,0,1,1),y.Easings["ease-out"]=v(0,0,.58,1),y.Easings["ease-in-out"]=v(.42,0,.58,1);var e={};$.each(["Quad","Cubic","Quart","Quint","Expo"],function(t,r){e[r]=function(e){return Math.pow(e,t+2)}}),$.extend(e,{Sine:function(e){return 1-Math.cos(e*Math.PI/2)},Circ:function(e){return 1-Math.sqrt(1-e*e)},Elastic:function(e){return 0===e||1===e?e:-Math.pow(2,8*(e-1))*Math.sin((80*(e-1)-7.5)*Math.PI/15)},Back:function(e){return e*e*(3*e-2)},Bounce:function(e){for(var t,r=4;e<((t=Math.pow(2,--r))-1)/11;);return 1/Math.pow(4,3-r)-7.5625*Math.pow((3*t-2)/22-e,2)}}),$.each(e,function(e,t){y.Easings["easeIn"+e]=t,y.Easings["easeOut"+e]=function(e){return 1-t(1-e)},y.Easings["easeInOut"+e]=function(e){return.5>e?t(2*e)/2:1-t(-2*e+2)/2}})}();var b=y.CSS={RegEx:{isHex:/^#([A-f\d]{3}){1,2}$/i,valueUnwrap:/^[A-z]+\((.*)\)$/i,wrappedValueAlreadyExtracted:/[0-9.]+ [0-9.]+ [0-9.]+( [0-9.]+)?/,valueSplit:/([A-z]+\(.+\))|(([A-z0-9#-.]+?)(?=\s|$))/gi},Lists:{colors:["fill","stroke","stopColor","color","backgroundColor","borderColor","borderTopColor","borderRightColor","borderBottomColor","borderLeftColor","outlineColor"],transformsBase:["translateX","translateY","scale","scaleX","scaleY","skewX","skewY","rotateZ"],transforms3D:["transformPerspective","translateZ","scaleZ","rotateX","rotateY"]},Hooks:{templates:{textShadow:["Color X Y Blur","black 0px 0px 0px"],boxShadow:["Color X Y Blur Spread","black 0px 0px 0px 0px"],clip:["Top Right Bottom Left","0px 0px 0px 0px"],backgroundPosition:["X Y","0% 0%"],transformOrigin:["X Y Z","50% 50% 0px"],perspectiveOrigin:["X Y","50% 50%"]},registered:{},register:function(){for(var e=0;e<b.Lists.colors.length;e++)b.Hooks.templates[b.Lists.colors[e]]=["Red Green Blue Alpha","255 255 255 1"];var t,r,a;if(d)for(t in b.Hooks.templates){r=b.Hooks.templates[t],a=r[0].split(" ");var o=r[1].match(b.RegEx.valueSplit);"Color"===a[0]&&(a.push(a.shift()),o.push(o.shift()),b.Hooks.templates[t]=[a.join(" "),o.join(" ")])}for(t in b.Hooks.templates){r=b.Hooks.templates[t],a=r[0].split(" ");for(var e in a){var i=t+a[e],n=e;b.Hooks.registered[i]=[t,n]}}},getRoot:function(e){var t=b.Hooks.registered[e];return t?t[0]:e},cleanRootPropertyValue:function(e,t){return b.RegEx.valueUnwrap.test(t)&&(t=t.match(b.Hooks.RegEx.valueUnwrap)[1]),b.Values.isCSSNullValue(t)&&(t=b.Hooks.templates[e][1]),t},extractValue:function(e,t){var r=b.Hooks.registered[e];if(r){var a=r[0],o=r[1];return t=b.Hooks.cleanRootPropertyValue(a,t),t.toString().match(b.RegEx.valueSplit)[o]}return t},injectValue:function(e,t,r){var a=b.Hooks.registered[e];if(a){var o=a[0],i=a[1],n,s;return r=b.Hooks.cleanRootPropertyValue(o,r),n=r.toString().match(b.RegEx.valueSplit),n[i]=t,s=n.join(" ")}return r}},Normalizations:{registered:{clip:function(e,t,r){switch(e){case"name":return"clip";case"extract":var a;return b.RegEx.wrappedValueAlreadyExtracted.test(r)?a=r:(a=r.toString().match(b.RegEx.valueUnwrap),a=a?a[1].replace(/,(\s+)?/g," "):r),a;case"inject":return"rect("+r+")"}},opacity:function(e,t,r){if(8>=d)switch(e){case"name":return"filter";case"extract":var a=r.toString().match(/alpha\(opacity=(.*)\)/i);return r=a?a[1]/100:1;case"inject":return t.style.zoom=1,parseFloat(r)>=1?"":"alpha(opacity="+parseInt(100*parseFloat(r),10)+")"}else switch(e){case"name":return"opacity";case"extract":return r;case"inject":return r}}},register:function(){9>=d||y.State.isGingerbread||(b.Lists.transformsBase=b.Lists.transformsBase.concat(b.Lists.transforms3D));for(var e=0;e<b.Lists.transformsBase.length;e++)!function(){var t=b.Lists.transformsBase[e];b.Normalizations.registered[t]=function(e,r,o){switch(e){case"name":return"transform";case"extract":return i(r).transformCache[t]===a?/^scale/i.test(t)?1:0:i(r).transformCache[t].replace(/[()]/g,"");case"inject":var n=!1;switch(t.substr(0,t.length-1)){case"translate":n=!/(%|px|em|rem|vw|vh|\d)$/i.test(o);break;case"scal":case"scale":y.State.isAndroid&&i(r).transformCache[t]===a&&1>o&&(o=1),n=!/(\d)$/i.test(o);break;case"skew":n=!/(deg|\d)$/i.test(o);break;case"rotate":n=!/(deg|\d)$/i.test(o)}return n||(i(r).transformCache[t]="("+o+")"),i(r).transformCache[t]}}}();for(var e=0;e<b.Lists.colors.length;e++)!function(){var t=b.Lists.colors[e];b.Normalizations.registered[t]=function(e,r,o){switch(e){case"name":return t;case"extract":var i;if(b.RegEx.wrappedValueAlreadyExtracted.test(o))i=o;else{var n,s={black:"rgb(0, 0, 0)",blue:"rgb(0, 0, 255)",gray:"rgb(128, 128, 128)",green:"rgb(0, 128, 0)",red:"rgb(255, 0, 0)",white:"rgb(255, 255, 255)"};/^[A-z]+$/i.test(o)?n=s[o]!==a?s[o]:s.black:b.RegEx.isHex.test(o)?n="rgb("+b.Values.hexToRgb(o).join(" ")+")":/^rgba?\(/i.test(o)||(n=s.black),i=(n||o).toString().match(b.RegEx.valueUnwrap)[1].replace(/,(\s+)?/g," ")}return 8>=d||3!==i.split(" ").length||(i+=" 1"),i;case"inject":return 8>=d?4===o.split(" ").length&&(o=o.split(/\s+/).slice(0,3).join(" ")):3===o.split(" ").length&&(o+=" 1"),(8>=d?"rgb":"rgba")+"("+o.replace(/\s+/g,",").replace(/\.(\d)+(?=,)/g,"")+")"}}}()}},Names:{camelCase:function(e){return e.replace(/-(\w)/g,function(e,t){return t.toUpperCase()})},SVGAttribute:function(e){var t="width|height|x|y|cx|cy|r|rx|ry|x1|x2|y1|y2";return(d||y.State.isAndroid&&!y.State.isChrome)&&(t+="|transform"),new RegExp("^("+t+")$","i").test(e)},prefixCheck:function(e){if(y.State.prefixMatches[e])return[y.State.prefixMatches[e],!0];for(var t=["","Webkit","Moz","ms","O"],r=0,a=t.length;a>r;r++){var o;if(o=0===r?e:t[r]+e.replace(/^\w/,function(e){return e.toUpperCase()}),m.isString(y.State.prefixElement.style[o]))return y.State.prefixMatches[e]=o,[o,!0]}return[e,!1]}},Values:{hexToRgb:function(e){var t=/^#?([a-f\d])([a-f\d])([a-f\d])$/i,r=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i,a;return e=e.replace(t,function(e,t,r,a){return t+t+r+r+a+a}),a=r.exec(e),a?[parseInt(a[1],16),parseInt(a[2],16),parseInt(a[3],16)]:[0,0,0]},isCSSNullValue:function(e){return 0==e||/^(none|auto|transparent|(rgba\(0, ?0, ?0, ?0\)))$/i.test(e)},getUnitType:function(e){return/^(rotate|skew)/i.test(e)?"deg":/(^(scale|scaleX|scaleY|scaleZ|alpha|flexGrow|flexHeight|zIndex|fontWeight)$)|((opacity|red|green|blue|alpha)$)/i.test(e)?"":"px"},getDisplayType:function(e){var t=e.tagName.toString().toLowerCase();return/^(b|big|i|small|tt|abbr|acronym|cite|code|dfn|em|kbd|strong|samp|var|a|bdo|br|img|map|object|q|script|span|sub|sup|button|input|label|select|textarea)$/i.test(t)?"inline":/^(li)$/i.test(t)?"list-item":/^(tr)$/i.test(t)?"table-row":"block"},addClass:function(e,t){e.classList?e.classList.add(t):e.className+=(e.className.length?" ":"")+t},removeClass:function(e,t){e.classList?e.classList.remove(t):e.className=e.className.toString().replace(new RegExp("(^|\\s)"+t.split(" ").join("|")+"(\\s|$)","gi")," ")}},getPropertyValue:function(e,r,o,n){function s(e,r){function o(){u&&b.setPropertyValue(e,"display","none")}var l=0;if(8>=d)l=$.css(e,r);else{var u=!1;if(/^(width|height)$/.test(r)&&0===b.getPropertyValue(e,"display")&&(u=!0,b.setPropertyValue(e,"display",b.Values.getDisplayType(e))),!n){if("height"===r&&"border-box"!==b.getPropertyValue(e,"boxSizing").toString().toLowerCase()){var c=e.offsetHeight-(parseFloat(b.getPropertyValue(e,"borderTopWidth"))||0)-(parseFloat(b.getPropertyValue(e,"borderBottomWidth"))||0)-(parseFloat(b.getPropertyValue(e,"paddingTop"))||0)-(parseFloat(b.getPropertyValue(e,"paddingBottom"))||0);return o(),c}if("width"===r&&"border-box"!==b.getPropertyValue(e,"boxSizing").toString().toLowerCase()){var p=e.offsetWidth-(parseFloat(b.getPropertyValue(e,"borderLeftWidth"))||0)-(parseFloat(b.getPropertyValue(e,"borderRightWidth"))||0)-(parseFloat(b.getPropertyValue(e,"paddingLeft"))||0)-(parseFloat(b.getPropertyValue(e,"paddingRight"))||0);return o(),p}}var g;g=i(e)===a?t.getComputedStyle(e,null):i(e).computedStyle?i(e).computedStyle:i(e).computedStyle=t.getComputedStyle(e,null),(d||y.State.isFirefox)&&"borderColor"===r&&(r="borderTopColor"),l=9===d&&"filter"===r?g.getPropertyValue(r):g[r],(""===l||null===l)&&(l=e.style[r]),o()}if("auto"===l&&/^(top|right|bottom|left)$/i.test(r)){var f=s(e,"position");("fixed"===f||"absolute"===f&&/top|left/i.test(r))&&(l=$(e).position()[r]+"px")}return l}var l;if(b.Hooks.registered[r]){var u=r,c=b.Hooks.getRoot(u);o===a&&(o=b.getPropertyValue(e,b.Names.prefixCheck(c)[0])),b.Normalizations.registered[c]&&(o=b.Normalizations.registered[c]("extract",e,o)),l=b.Hooks.extractValue(u,o)}else if(b.Normalizations.registered[r]){var p,g;p=b.Normalizations.registered[r]("name",e),"transform"!==p&&(g=s(e,b.Names.prefixCheck(p)[0]),b.Values.isCSSNullValue(g)&&b.Hooks.templates[r]&&(g=b.Hooks.templates[r][1])),l=b.Normalizations.registered[r]("extract",e,g)}return/^[\d-]/.test(l)||(l=i(e)&&i(e).isSVG&&b.Names.SVGAttribute(r)?/^(height|width)$/i.test(r)?e.getBBox()[r]:e.getAttribute(r):s(e,b.Names.prefixCheck(r)[0])),b.Values.isCSSNullValue(l)&&(l=0),y.debug>=2&&console.log("Get "+r+": "+l),l},setPropertyValue:function(e,r,a,o,n){var s=r;if("scroll"===r)n.container?n.container["scroll"+n.direction]=a:"Left"===n.direction?t.scrollTo(a,n.alternateValue):t.scrollTo(n.alternateValue,a);else if(b.Normalizations.registered[r]&&"transform"===b.Normalizations.registered[r]("name",e))b.Normalizations.registered[r]("inject",e,a),s="transform",a=i(e).transformCache[r];else{if(b.Hooks.registered[r]){var l=r,u=b.Hooks.getRoot(r);o=o||b.getPropertyValue(e,u),a=b.Hooks.injectValue(l,a,o),r=u}if(b.Normalizations.registered[r]&&(a=b.Normalizations.registered[r]("inject",e,a),r=b.Normalizations.registered[r]("name",e)),s=b.Names.prefixCheck(r)[0],8>=d)try{e.style[s]=a}catch(c){y.debug&&console.log("Browser does not support ["+a+"] for ["+s+"]")}else i(e)&&i(e).isSVG&&b.Names.SVGAttribute(r)?e.setAttribute(r,a):e.style[s]=a;y.debug>=2&&console.log("Set "+r+" ("+s+"): "+a)}return[s,a]},flushTransformCache:function(e){function t(t){return parseFloat(b.getPropertyValue(e,t))}var r="";if((d||y.State.isAndroid&&!y.State.isChrome)&&i(e).isSVG){var a={translate:[t("translateX"),t("translateY")],skewX:[t("skewX")],skewY:[t("skewY")],scale:1!==t("scale")?[t("scale"),t("scale")]:[t("scaleX"),t("scaleY")],rotate:[t("rotateZ"),0,0]};$.each(i(e).transformCache,function(e){/^translate/i.test(e)?e="translate":/^scale/i.test(e)?e="scale":/^rotate/i.test(e)&&(e="rotate"),a[e]&&(r+=e+"("+a[e].join(" ")+") ",delete a[e])})}else{var o,n;$.each(i(e).transformCache,function(t){return o=i(e).transformCache[t],"transformPerspective"===t?(n=o,!0):(9===d&&"rotateZ"===t&&(t="rotate"),void(r+=t+o+" "))}),n&&(r="perspective"+n+" "+r)}b.setPropertyValue(e,"transform",r)}};b.Hooks.register(),b.Normalizations.register(),y.animate=function(){function e(){return f?k.promise||null:h}function n(){function e(e){function c(e,t){var r=a,o=a,i=a;return m.isArray(e)?(r=e[0],!m.isArray(e[1])&&/^[\d-]/.test(e[1])||m.isFunction(e[1])||b.RegEx.isHex.test(e[1])?i=e[1]:(m.isString(e[1])&&!b.RegEx.isHex.test(e[1])||m.isArray(e[1]))&&(o=t?e[1]:s(e[1],u.duration),e[2]!==a&&(i=e[2]))):r=e,t||(o=o||u.easing),m.isFunction(r)&&(r=r.call(n,w,P)),m.isFunction(i)&&(i=i.call(n,w,P)),[r||0,o,i]}function p(e,t){var r,a;return a=(t||0).toString().toLowerCase().replace(/[%A-z]+$/,function(e){return r=e,""}),r||(r=b.Values.getUnitType(e)),[a,r]}function f(){var e={parent:n.parentNode,position:b.getPropertyValue(n,"position"),fontSize:b.getPropertyValue(n,"fontSize")},a=e.position===j.lastPosition&&e.parent===j.lastParent,o=e.fontSize===j.lastFontSize&&e.parent===j.lastParent;j.lastParent=e.parent,j.lastPosition=e.position,j.lastFontSize=e.fontSize,null===j.remToPx&&(j.remToPx=parseFloat(b.getPropertyValue(r.body,"fontSize"))||16),null===j.vwToPx&&(j.vwToPx=parseFloat(t.innerWidth)/100,j.vhToPx=parseFloat(t.innerHeight)/100);var s={overflowX:null,overflowY:null,boxSizing:null,width:null,minWidth:null,maxWidth:null,height:null,minHeight:null,maxHeight:null,paddingLeft:null},l={},u=10;if(l.remToPx=j.remToPx,l.vwToPx=j.vwToPx,l.vhToPx=j.vhToPx,d&&!i(n).isSVG)var c=/^auto$/i.test(n.currentStyle.width),p=/^auto$/i.test(n.currentStyle.height);a&&o||(i(n).isSVG||(s.overflowX=b.getPropertyValue(n,"overflowX"),s.overflowY=b.getPropertyValue(n,"overflowY"),s.boxSizing=b.getPropertyValue(n,"boxSizing"),s.minWidth=b.getPropertyValue(n,"minWidth"),s.maxWidth=b.getPropertyValue(n,"maxWidth")||"none",s.minHeight=b.getPropertyValue(n,"minHeight"),s.maxHeight=b.getPropertyValue(n,"maxHeight")||"none",s.paddingLeft=b.getPropertyValue(n,"paddingLeft")),s.width=b.getPropertyValue(n,"width",null,!0),s.height=b.getPropertyValue(n,"height",null,!0)),a?(l.percentToPxRatioWidth=j.lastPercentToPxWidth,l.percentToPxRatioHeight=j.lastPercentToPxHeight):(i(n).isSVG||(b.setPropertyValue(n,"overflowX","hidden"),b.setPropertyValue(n,"overflowY","hidden"),b.setPropertyValue(n,"boxSizing","content-box"),b.setPropertyValue(n,"minWidth",u+"%"),b.setPropertyValue(n,"maxWidth",u+"%"),b.setPropertyValue(n,"minHeight",u+"%"),b.setPropertyValue(n,"maxHeight",u+"%")),b.setPropertyValue(n,"width",u+"%"),b.setPropertyValue(n,"height",u+"%")),o?l.emToPx=j.lastEmToPx:i(n).isSVG||b.setPropertyValue(n,"paddingLeft",u+"em"),a||(l.percentToPxRatioWidth=j.lastPercentToPxWidth=(parseFloat(b.getPropertyValue(n,"width",null,!0))||1)/u,l.percentToPxRatioHeight=j.lastPercentToPxHeight=(parseFloat(b.getPropertyValue(n,"height",null,!0))||1)/u),o||(l.emToPx=j.lastEmToPx=(parseFloat(b.getPropertyValue(n,"paddingLeft"))||1)/u);for(var g in s)null!==s[g]&&b.setPropertyValue(n,g,s[g]);return i(n).isSVG||(d?(c&&b.setPropertyValue(n,"width","auto"),p&&b.setPropertyValue(n,"height","auto")):(b.setPropertyValue(n,"height","auto"),s.height!==b.getPropertyValue(n,"height",null,!0)&&b.setPropertyValue(n,"height",s.height),b.setPropertyValue(n,"width","auto"),s.width!==b.getPropertyValue(n,"width",null,!0)&&b.setPropertyValue(n,"width",s.width))),y.debug>=1&&console.log("Unit ratios: "+JSON.stringify(l),n),l}if(u.begin&&0===w)try{u.begin.call(x,x)}catch(h){setTimeout(function(){throw h},1)}if("scroll"===E){var v=/^x$/i.test(u.axis)?"Left":"Top",T=parseFloat(u.offset)||0,C,F,H;u.container?u.container.jquery||m.isNode(u.container)?(u.container=u.container[0]||u.container,C=u.container["scroll"+v],H=C+$(n).position()[v.toLowerCase()]+T):u.container=null:(C=y.State.scrollAnchor[y.State["scrollProperty"+v]],F=y.State.scrollAnchor[y.State["scrollProperty"+("Left"===v?"Top":"Left")]],H=$(n).offset()[v.toLowerCase()]+T),g={scroll:{rootPropertyValue:!1,startValue:C,currentValue:C,endValue:H,unitType:"",easing:u.easing,scrollData:{container:u.container,direction:v,alternateValue:F}},element:n},y.debug&&console.log("tweensContainer (scroll): ",g.scroll,n)}else if("reverse"===E){if(!i(n).tweensContainer)return void $.dequeue(n,u.queue);"none"===i(n).opts.display&&(i(n).opts.display="block"),"hidden"===i(n).opts.visibility&&(i(n).opts.visibility="visible"),i(n).opts.loop=!1,i(n).opts.begin=null,i(n).opts.complete=null,V.easing||delete u.easing,V.duration||delete u.duration,u=$.extend({},i(n).opts,u);var A=$.extend(!0,{},i(n).tweensContainer);for(var N in A)if("element"!==N){var R=A[N].startValue;A[N].startValue=A[N].currentValue=A[N].endValue,A[N].endValue=R,m.isEmptyObject(V)||(A[N].easing=u.easing),y.debug&&console.log("reverse tweensContainer ("+N+"): "+JSON.stringify(A[N]),n)}g=A}else if("start"===E){var A;i(n).tweensContainer&&i(n).isAnimating===!0&&(A=i(n).tweensContainer),$.each(S,function(e,t){if(RegExp("^"+b.Lists.colors.join("$|^")+"$").test(e)){var r=c(t,!0),o=r[0],i=r[1],n=r[2];if(b.RegEx.isHex.test(o)){for(var s=["Red","Green","Blue"],l=b.Values.hexToRgb(o),u=n?b.Values.hexToRgb(n):a,p=0;p<s.length;p++)S[e+s[p]]=[l[p],i,u?u[p]:u];delete S[e]}}});for(var z in S){var M=c(S[z]),q=M[0],W=M[1],G=M[2];z=b.Names.camelCase(z);var X=b.Hooks.getRoot(z),Y=!1;if(i(n).isSVG||b.Names.prefixCheck(X)[1]!==!1||b.Normalizations.registered[X]!==a){(u.display&&"none"!==u.display||u.visibility&&"hidden"!==u.visibility)&&/opacity|filter/.test(z)&&!G&&0!==q&&(G=0),u._cacheValues&&A&&A[z]?(G===a&&(G=A[z].endValue+A[z].unitType),Y=i(n).rootPropertyValueCache[X]):b.Hooks.registered[z]?G===a?(Y=b.getPropertyValue(n,X),G=b.getPropertyValue(n,z,Y)):Y=b.Hooks.templates[X][1]:G===a&&(G=b.getPropertyValue(n,z));var B,O,I,Q=!1;B=p(z,G),G=B[0],I=B[1],B=p(z,q),q=B[0].replace(/^([+-\/*])=/,function(e,t){return Q=t,""}),O=B[1],G=parseFloat(G)||0,q=parseFloat(q)||0;var U;if("%"===O&&(/^(fontSize|lineHeight)$/.test(z)?(q/=100,O="em"):/^scale/.test(z)?(q/=100,O=""):/(Red|Green|Blue)$/i.test(z)&&(q=q/100*255,O="")),/[\/*]/.test(Q))O=I;else if(I!==O&&0!==G)if(0===q)O=I;else{U=U||f();var D=/margin|padding|left|right|width|text|word|letter/i.test(z)||/X$/.test(z)?"x":"y";switch(I){case"%":G*="x"===D?U.percentToPxRatioWidth:U.percentToPxRatioHeight;break;case"px":break;default:G*=U[I+"ToPx"]}switch(O){case"%":G*=1/("x"===D?U.percentToPxRatioWidth:U.percentToPxRatioHeight);break;case"px":break;default:G*=1/U[O+"ToPx"]}}switch(Q){case"+":q=G+q;break;case"-":q=G-q;break;case"*":q=G*q;break;case"/":q=G/q}g[z]={rootPropertyValue:Y,startValue:G,currentValue:G,endValue:q,unitType:O,easing:W},y.debug&&console.log("tweensContainer ("+z+"): "+JSON.stringify(g[z]),n)}else y.debug&&console.log("Skipping ["+X+"] due to a lack of browser support.")}g.element=n}g.element&&(b.Values.addClass(n,"velocity-animating"),L.push(g),i(n).tweensContainer=g,i(n).opts=u,i(n).isAnimating=!0,w===P-1?(y.State.calls.length>1e4&&(y.State.calls=o(y.State.calls)),y.State.calls.push([L,x,u,null,k.resolver]),y.State.isTicking===!1&&(y.State.isTicking=!0,l())):w++)}var n=this,u=$.extend({},y.defaults,V),g={};if(i(n)===a&&$.data(n,c,{isSVG:m.isSVG(n),isAnimating:!1,computedStyle:null,tweensContainer:null,rootPropertyValueCache:{},transformCache:{}}),parseFloat(u.delay)&&u.queue!==!1&&$.queue(n,u.queue,function(e){y.velocityQueueEntryFlag=!0,i(n).delayTimer={setTimeout:setTimeout(e,parseFloat(u.delay)),next:e}}),y.mock===!0)u.duration=1;else switch(u.duration.toString().toLowerCase()){case"fast":u.duration=200;break;case"normal":u.duration=p;break;case"slow":u.duration=600;break;default:u.duration=parseFloat(u.duration)||1}u.easing=s(u.easing,u.duration),u.begin&&!m.isFunction(u.begin)&&(u.begin=null),u.progress&&!m.isFunction(u.progress)&&(u.progress=null),u.complete&&!m.isFunction(u.complete)&&(u.complete=null),u.display&&(u.display=u.display.toString().toLowerCase(),"auto"===u.display&&(u.display=y.CSS.Values.getDisplayType(n))),u.visibility&&(u.visibility=u.visibility.toString().toLowerCase()),u.mobileHA=u.mobileHA&&y.State.isMobile&&!y.State.isGingerbread,u.queue===!1?u.delay?setTimeout(e,u.delay):e():$.queue(n,u.queue,function(t,r){return r===!0?(k.promise&&k.resolver(x),!0):(y.velocityQueueEntryFlag=!0,void e(t))}),""!==u.queue&&"fx"!==u.queue||"inprogress"===$.queue(n)[0]||$.dequeue(n)}var g=arguments[0]&&($.isPlainObject(arguments[0].properties)&&!arguments[0].properties.names||m.isString(arguments[0].properties)),f,h,v,x,S,V;if(m.isWrapped(this)?(f=!1,v=0,x=this,h=this):(f=!0,v=1,x=g?arguments[0].elements:arguments[0]),x=m.isWrapped(x)?[].slice.call(x):x){g?(S=arguments[0].properties,V=arguments[0].options):(S=arguments[v],V=arguments[v+1]);var P=m.isArray(x)||m.isNodeList(x)?x.length:1,w=0;if("stop"!==S&&!$.isPlainObject(V)){var T=v+1;V={};for(var C=T;C<arguments.length;C++)!m.isArray(arguments[C])&&/^\d/.test(arguments[C])?V.duration=parseFloat(arguments[C]):m.isString(arguments[C])||m.isArray(arguments[C])?V.easing=arguments[C]:m.isFunction(arguments[C])&&(V.complete=arguments[C])}var k={promise:null,resolver:null,rejecter:null};f&&y.Promise&&(k.promise=new y.Promise(function(e,t){k.resolver=e,k.rejecter=t}));var E;switch(S){case"scroll":E="scroll";break;case"reverse":E="reverse";break;case"stop":$.each(m.isNode(x)?[x]:x,function(e,t){i(t)&&i(t).delayTimer&&(clearTimeout(i(t).delayTimer.setTimeout),i(t).delayTimer.next&&i(t).delayTimer.next(),delete i(t).delayTimer)});var F=[];return $.each(y.State.calls,function(e,t){t&&$.each(m.isNode(t[1])?[t[1]]:t[1],function(t,r){$.each(m.isNode(x)?[x]:x,function(t,a){if(a===r){if(i(a)&&$.each(i(a).tweensContainer,function(e,t){t.endValue=t.currentValue}),V===!0||m.isString(V)){var o=m.isString(V)?V:"";$.each($.queue(a,o),function(e,t){m.isFunction(t)&&t(null,!0)}),$.queue(a,o,[])}F.push(e)}})})}),$.each(F,function(e,t){u(t,!0)}),k.promise&&k.resolver(x),e();default:if(!$.isPlainObject(S)||m.isEmptyObject(S)){if(m.isString(S)&&y.Sequences[S]){var H=V.duration,A=V.delay||0;return V.backwards===!0&&(x=(x.jquery?[].slice.call(x):x).reverse()),$.each(x,function(e,t){parseFloat(V.stagger)?V.delay=A+parseFloat(V.stagger)*e:m.isFunction(V.stagger)&&(V.delay=A+V.stagger.call(t,e,P)),V.drag&&(V.duration=parseFloat(H)||(/^(callout|transition)/.test(S)?1e3:p),V.duration=Math.max(V.duration*(V.backwards?1-e/P:(e+1)/P),.75*V.duration,200)),y.Sequences[S].call(t,t,V||{},e,P,x,k.promise?k:a)}),e()}var N="Velocity: First argument ("+S+") was not a property map, a known action, or a registered sequence. Aborting.";return k.promise?k.rejecter(new Error(N)):console.log(N),e()}E="start"}var j={lastParent:null,lastPosition:null,lastFontSize:null,lastPercentToPxWidth:null,lastPercentToPxHeight:null,lastEmToPx:null,remToPx:null,vwToPx:null,vhToPx:null},L=[];$.each(m.isNode(x)?[x]:x,function(e,t){m.isNode(t)&&n.call(t)});var R=$.extend({},y.defaults,V),z;if(R.loop=parseInt(R.loop),z=2*R.loop-1,R.loop)for(var M=0;z>M;M++){var q={delay:R.delay};M===z-1&&(q.display=R.display,q.visibility=R.visibility,q.complete=R.complete),y.animate(x,"reverse",q)}return e()}};var S=t.jQuery||t.Zepto;S&&(S.fn.velocity=y.animate,S.fn.velocity.defaults=y.defaults),"undefined"!=typeof define&&define.amd?define(function(){return y}):"undefined"!=typeof module&&module.exports&&(module.exports=y),$.each(["Down","Up"],function(e,t){y.Sequences["slide"+t]=function(e,r,a,o,i,n){var s=$.extend({},r),l={height:null,marginTop:null,marginBottom:null,paddingTop:null,paddingBottom:null,overflow:null,overflowX:null,overflowY:null},u=s.begin,c=s.complete,p=!1;null!==s.display&&(s.display="Down"===t?s.display||"auto":s.display||"none"),s.begin=function(){function r(){l.height=parseFloat(y.CSS.getPropertyValue(e,"height")),e.style.height="auto",parseFloat(y.CSS.getPropertyValue(e,"height"))===l.height&&(p=!0),y.CSS.setPropertyValue(e,"height",l.height+"px")}if("Down"===t){l.overflow=[y.CSS.getPropertyValue(e,"overflow"),0],l.overflowX=[y.CSS.getPropertyValue(e,"overflowX"),0],l.overflowY=[y.CSS.getPropertyValue(e,"overflowY"),0],e.style.overflow="hidden",e.style.overflowX="visible",e.style.overflowY="hidden",r();for(var a in l)if(!/^overflow/.test(a)){var o=y.CSS.getPropertyValue(e,a);"height"===a&&(o=parseFloat(o)),l[a]=[o,0]}}else{r();for(var a in l){var o=y.CSS.getPropertyValue(e,a);"height"===a&&(o=parseFloat(o)),l[a]=[0,o]}e.style.overflow="hidden",e.style.overflowX="visible",e.style.overflowY="hidden"}u&&u.call(e,e)},s.complete=function(e){var r="Down"===t?0:1;p===!0?l.height[r]="auto":l.height[r]+="px";for(var a in l)e.style[a]=l[a][r];c&&c.call(e,e),n&&n.resolver(i||e)},y.animate(e,l,s)}}),$.each(["In","Out"],function(e,t){y.Sequences["fade"+t]=function(e,r,a,o,i,n){var s=$.extend({},r),l={opacity:"In"===t?1:0};if(a!==o-1)s.complete=s.begin=null;else{var u=s.complete;s.complete=function(){u&&u.call(e,e),n&&n.resolver(i||e)}}null!==s.display&&(s.display=s.display||("In"===t?"auto":"none")),y.animate(this,l,s)}})}(window.jQuery||window.Zepto||window,window,document);

/**
 * TransParentUI.js v1.0.0
 * http://www.keithparent.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright (C) 2014, A Parent Design
 * http://www.keithparent.com
 */
 
(function (factory) {

	"use strict";

	if (typeof define === 'function' && define.amd)
	{
		define(['jquery'], factory);
	} else {
		factory(jQuery);
	}

}(function($, window, document, undefined){
	
	"use strict";
	
	// GLOBAL VARS INIT
	// Cache document for fast access
	var win = window,
		doc = document,
		html = $(html),
		$doc = $(document),
		$win = $(window)
	;
	
	
	// UTILITY FUNCTIONS
	
	function getStyle(el, property) {
		var value = null,
			computed = doc.defaultView.getComputedStyle(el, '')
		;
		computed && (value = computed[property])
		return el.style[property] || value
	}	
		
	function isNode(node) {
		return node && node.nodeName && (node.nodeType == 1 || node.nodeType == 11);
	}
		
	function normalize(node, host, clone) {
		var i, l, ret;
		if (typeof node == 'string'){ return bonzo.create(node); }
		if (isNode(node)){ node = [ node ]; }
		if (clone) {
			ret = []; // don't change original array
			for (i = 0, l = node.length; i < l; i++){ ret[i] = cloneNode(host, node[i]); }
			return ret;
		}
		return node;
	}
		
	/**
	* @param {string} c a class name to test
	* @return {boolean}
	*/
	function classReg(c) {
		return new RegExp('(^|\\s+)' + c + '(\\s+|$)');
	}
	
	/**
	* @param {string} s
	* @return {string}
	*/
	function camelize(s) {
		return s.replace(/-(.)/g, function (m, m1) {
			return m1.toUpperCase();
		});
	}
	
	/**
	* @param {string} s
	* @return {string}
	*/
	function decamelize(s) {
		return s ? s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() : s;
	}
	
	/**
	* sets an element to an explicit x/y position on the page
	* @param {Element} el
	* @param {?number} x
	* @param {?number} y
	*/
	function xy(el, x, y) {
		var $el = bonzo(el),
			style = $el.css('position'),
			offset = $el.offset(),
			rel = 'relative',
			isRel = style == rel,
			delta = [parseInt($el.css('left'), 10), parseInt($el.css('top'), 10)]
		;
		if (style == 'static') {
			$el.css('position', rel);
			style = rel;
		}
		isNaN(delta[0]) && (delta[0] = isRel ? 0 : el.offsetLeft);
		isNaN(delta[1]) && (delta[1] = isRel ? 0 : el.offsetTop);
		x != null && (el.style.left = x - offset.left + delta[0] + px);
		y != null && (el.style.top = y - offset.top + delta[1] + px);
	}
	
	
	// TOUCH-ENABLED HANDLER SUPPORT
	var hasTouch = function(){ return !!('ontouchstart' in window) || !!('onmsgesturechange' in window); };
	
	// HANDLER UTILS
	var handlers = {},
		addHandler = function(name, fn) {
			$win.on(name, fn);
			handlers[name] = fn;
		},
		removeHandler = function(name, fn) {
			$win.off(name, handlers[name]);
			delete handlers[name];
		},
		removeHandlers = function() {
			for (var name in handlers) {
				removeHandler(name);
			}
		}
	;
	
	
	$win.watchResize = function( callback ){
		var resizing;
		function done(){
			clearTimeout( resizing );
			resizing = null;
			callback();
		}
		$win.resize(function(){
			if ( resizing ) {
				clearTimeout( resizing );
				resizing = null;
			}
			resizing = setTimeout( done, 50 );
		});
		callback();
	};
	
	
	// CSS ANIMATION SUPPORT
	var support = { animations : Modernizr.cssanimations },
		animEndEventNames = {
			'WebkitAnimation' : 'webkitAnimationEnd',
			'OAnimation' : 'oAnimationEnd',
			'msAnimation' : 'MSAnimationEnd',
			'animation' : 'animationend'
		}//,
		// animation end event name
		//animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ]
	;

	
	// VIEWPORT UTILS
	
	// Get Viewport Height
	function getViewportH() {
		var client = docElem['clientHeight'],
			inner = $win['innerHeight']
		;
		if( client < inner ) { return inner; }
		else { return client; }
	}

	// 
	function scrollY() {
		return window.pageYOffset || docElem.scrollTop;
	}

	// http://stackoverflow.com/a/5598797/989439
	function getOffset( el ) {
		var offsetTop = 0, offsetLeft = 0;
		do {
			if ( !isNaN( el.offsetTop ) ) {
				offsetTop += el.offsetTop;
			}
			if ( !isNaN( el.offsetLeft ) ) {
				offsetLeft += el.offsetLeft;
			}
		} while( el = el.offsetParent )

		return {
			top : offsetTop,
			left : offsetLeft
		}
	}

	function inViewport( el, h ) {
		var elH = el.offsetHeight,
			scrolled = scrollY(),
			viewed = scrolled + getViewportH(),
			elTop = getOffset(el).top,
			elBottom = elTop + elH,
			// if 0, the element is considered in the viewport as soon as it enters.
			// if 1, the element is considered in the viewport only when it's fully inside
			// value in percentage (1 >= h >= 0)
			h = h || 0;

		return (elTop + elH * h) <= viewed && (elBottom - elH * h) >= scrolled;
	}

	function extend( a, b ) {
		for( var key in b ) { 
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	}

	
	// UI NAMESPACE
	var ui = $.ui || {};
	
	if (ui.fn) {
		return;
	}
	
	$.ui = {

		// Initialize Components
		init: function() {
			var self = this,
				obj
			;
			for (obj in self) {
				if ( self.hasOwnProperty(obj)) {
					var _method =  self[obj];
					if ( _method.selector !== undefined && _method.init !== undefined ) {
						if ( $(_method.selector).length > 0 ) {
							if ( _method.dependencies !== undefined ) {
								(function(_async) {
									Modernizr.load([
									{
										load: _async.dependencies,
										complete: function () {
											_async.init();
										}
									}]);
								})(_method);             
							} else {
								_method.init();
							}
						}
					}
				}
			}
		},
		
		accordion: function(){
		
			var $accordion = $('[data-init="accordion"]');
			
			$accordion.click(function(event){
				event.preventDefault();
				$(this).closest().find().not(':animated').slideToggle();
			});
			
		},
		
		aim: function(){
		
			var $target = $('.navbar-fixed-top').filter('a');
			$target.aim({
		        aimEnter: function() {
		            $target.trigger('mouseover');
		        }, 
		        aimExit:function(){
		            $target.trigger('mouseout');
		        }
		    });
		    //$.aimDebug(true);
		    
		},
		
		easing: function(){

			// t: current time, b: begInnIng value, c: change In value, d: duration

			if ( !$.easing['easeIn'] || !$.easing['easeInExpo'] ){
				$.easing['easeIn'] = $.easing['easeInExpo'] = function (x, t, b, c, d) { return c*(t/=d)*t*t*t*t + b; };
			}

			if ( !$.easing['easeOut'] || !$.easing['easeOutExpo'] ){
				$.easing['easeOut'] = $.easing['easeOutExpo'] = function(x, t, b, c, d) { return c*((t=t/d-1)*t*t*t*t + 1) + b; };
			}

			if ( !$.easing['easeInOut'] || !$.easing['easeInOutExpo'] ){
				$.easing['easeInOut'] = $.easing['easeInOutExpo'] = function (x, t, b, c, d) {
					if ((t/=d/2) < 1) { return c/2*t*t*t*t*t + b; }
					return c/2*((t-=2)*t*t*t*t + 2) + b;
				};
			}

		},
		
		// Equalize Column Heights
		equalizeColumnHeights: function(){
			
			var rows = $('[data-eqcolheights');
			$(rows)
				.each(function(){
					var cols = $(this).children( "[class^='col-']" ),
						tallestColumn = 0
					;
					$(cols)
						.each(function(){
							var colH = $(this).outerHeight();
							if( colH > tallestColumn ){
								tallestColumn = colH;
							}
						})
						.css({
							"height" : tallestColumn,
							"min-height" : tallestColumn,
							"max-height" : tallestColumn
						})
					;
				})
			;
			
		},
		
		placeholder: function(){
			
			// jQuery Placeholder Polyfill
			function addPlaceholder() {
				if( $(this).val() === '' ){
					$(this).val($(this).attr('placeholder')).addClass('placeholder');
				}
			}
			function removePlaceholder() {
				if( $(this).val() === $(this).attr('placeholder') ){
					$(this).val('').removeClass('placeholder');
				}
			}
			
			// Create dummy element for feature detection
			if ( !('placeholder' in $('<input>')[0]) )
			{
				var placeholderFields = $('input[placeholder], textarea[placeholder]'),
					placeholderForms = placeholderFields.parents('form')
				;
				// Set elements w/placeholder attr
				placeholderFields
					.blur(addPlaceholder)
					.focus(removePlaceholder)
					.each(addPlaceholder)
				;
				// Remove placeholder text before form is submitted
				placeholderForms.submit(function(){
					placeholderFields.each(removePlaceholder);
				});
			}
			
		},
		
		smoothScroll: function(){
		
			var $overflowContainer = $('html, body'),
				easingMethod = 'easeInOutExpo',
				$btt = $('[data-trigger="top"]'),
				$smoothScrolled = $('a[href*=#]:not([href=#]), .smoothscroll, [data-scroll]'),
				$notSmoothScrolled = $('.no-smoothscroll, .tab'),
				$nav = $('.navbar').filter('a')
			;
			
			if( $btt.length ){
				// INIT SCROLL ANIMATION VARS
				var offset = 220,
					btnOffset = $btt.offset(),
					duration = Math.abs( btnOffset.top ),
					easing = easingMethod
				;
				// CLICK EVENT TO SCROLL TO TOP
				$btt.on('click', function(event) {
					$overflowContainer.stop().animate({scrollTop: 0}, duration, easing);
					event.preventDefault();
				});
			}

			// CLICK EVENT TO SCROLL TO ANY JUMP LINK
			$smoothScrolled
				.not($notSmoothScrolled)
				.on('click', function(event) {
					if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') || location.hostname == this.hostname) {
						var target = $(this.hash);
						target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
						if (target.length) {
							var targetOffset = target.offset();
							$overflowContainer.stop().animate({ scrollTop: targetOffset.top }, targetOffset.top, easingMethod);
							event.preventDefault();
						}
					}
				})
			;
			
		},
		
		tabs: function(){
			
			var $tabs = $('[data-init="tabs"]'),
				tabIDprefix = 'tab-'
			;
			return $tabs.each(function(){
				// Toggles the ui state of the tab param & associated panel
				// param: object
				function selectTab( tab ){
					// Init vars: set tab and get/set correlating panel
					var $tabActive = tab,
						$paneActive = $( $tabActive.attr('href') ),
						$tabsInactive = $tabActive.parent().siblings(),
						$panesInactive = $paneActive.siblings()
					;
					// Activate tab / deactivate others
					$tabsInactive
						.removeClass('active')
						.children()
							.attr('tabindex','-1')
					;
					$tabActive
						.attr('tabindex','0')
						.parent()
							.addClass('active')
					;
					// Active tab panel / deactivate others
					$panesInactive
						.removeClass('active')
						.attr('aria-hidden', true)
					;
					$paneActive
						.addClass('active')
						.attr('aria-hidden', false)
					;
					// Update url in address bar
					//history.pushState("", document.title, window.location.pathname);
				};
				
				// Set aria-role for tab nav
				var $tabnav = $(this).find('.nav-tabs').attr('role','tablist');
				
				// For each set of tabs, keep track of which
				// tab is active and its associated content
				var $tab = $(this).find('[data-toggle="tab"]');
				$tab.attr('tabindex','-1');
				
				// Set aria-roles for tab panels
				$(this).find('.tab-pane').each(function(){
					$(this)
						.attr('role','tabpanel')
						.attr('aria-hidden', true)
						.attr('aria-labelledby', tabIDprefix + $(this).attr('id'))
					;
				});
				
				// If location.hash matches a tab link, set as active tab
				// If no match is found, use first link as initial active tab
				var $tabActive = $( $tab.filter('[href="'+location.hash+'"]')[0] || $tab[0] );
				
				// Onload to activate tab
				selectTab( $tabActive );
				
				// click event for tab buttons
				$tab.on("click", function( event ){
					// Activate this tab
					selectTab( $(this) );
					event.preventDefault();
				});
				
			});

		}
			
	};
	
	// init onload
	$(function($){
		
		// TOOLTIP
		$(".tip").tipper();
		
		// INIT UI
		$.ui.aim();
		$.ui.easing();
		$.ui.equalizeColumnHeights();
		$.ui.placeholder();
		$.ui.smoothScroll();
		$.ui.tabs();
		
	});

}));


/* Remove the 300ms tap delay on mobile devices. */
$(window).load(function () {
	FastClick.attach(document.body);
});


/* EOF */

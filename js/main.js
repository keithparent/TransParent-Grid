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
 
// UIUX MODULE
(function (factory) {

	//'use strict';

	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else {
		factory(jQuery);
	}

}(function($, window, document, undefined){
	
	//'use strict';
	
	// UI Top-level namespace
	var uiux = $.uiux || {};
	
	if (uiux.fn) {
		return;
	}
	
	$.extend( true, uiux, {
		utils: {
			
			
			
		}
	});
	
	$.uiux = {

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
		
		backtotop: function( options ) {

			var settings = {
				selector: ".btn-to-top",
				easing: "easeOutExpo",
				preventDefault: true
			};
			if (typeof options == "string") { settings.selector = options; }
			var options = $.extend(settings, options);
			
			return $(options.selector).each(function() {
				// init vars
				var $offset = $(this).offset(),				// distance of button from top
					duration = Math.abs( $offset.top ), 	// duration of the scrolling to top animation (in ms),
					// Some browsers apply the "overall" scroll to document.documentElement (<html> element)
					// and others to document.body (<body> element). For compatibility, apply scrolling to both.
					$scrollContainer = $('html, body'),
					// callback to remove class that disables `pointer-events` (applied while scrolling for performance reasons)
					reenablePointerEvents = _.debounce( function(){ $scrollContainer.removeClass('disable-pointer'); }, 100 )
				;
				// back-to-top button click event listener
				$(this)
					.off( 'click.backtotop' )
					.on( 'click.backtotop', function( event ){
						$scrollContainer
							.stop()
							.addClass('disable-pointer')
							.animate(
								{ scrollTop: 0 },
							 	duration,
							 	options.easing,
							 	reenablePointerEvents
							)
						;
						if( options.preventDefault ){
							event.preventDefault();
						}
					})
				;
			});

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
		
		smoothscroll: function( options ){

			// config options/settings
			var settings = {
				selector: $('a[href^=#]:not([href=#]), .smoothscroll'),
				ignore: $('ul.nav-tabs > li > a, .no-smoothscroll, .tab'),
				easing: 'easeOutExpo',
				preventDefault: true,
				topOffset: 0
			};
			if (typeof options == "string") { settings.selector = options; }
			var options = $.extend(settings, options);
			
			if( $('.navbar-fixed-top').length ){
				options.topOffset = $('.navbar-top-fixed').outerHeight() + 50;
			}

			return $(options.selector).not( $(options.ignore) ).each(function(){

				$(this)
					.off( 'click.smoothscroll' )
					.on( 'click.smoothscroll', function( event ) {
						if ( location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') || location.hostname == this.hostname ) {
							var target = $(this.hash);
							target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
							if (target.length) {
								var targetOffset = target.offset(),
									// Some browsers apply the "overall" scroll to document.documentElement (<html> element)
									// and others to document.body (<body> element). For compatibility, apply scrolling to both.
									$scrollContainer = $('html, body'),
									// callback to remove class that disables `pointer-events` (applied while scrolling for performance reasons)
									reenablePointerEvents = _.debounce( function(){ $scrollContainer.removeClass('disable-pointer'); }, 100 )
								;
								$scrollContainer
									.stop()
									.addClass('disable-pointer')
									.animate(
										{ scrollTop: targetOffset.top - options.topOffset },
										targetOffset.top - options.topOffset,
										options.easing,
									 	reenablePointerEvents
									)
								;
							}
						}
						if( options.preventDefault ){
							event.preventDefault();
						}
					})
				;
			});

		}
			
	};
	
	// onDOMReady
	$(function(){
		
		// TOOLTIPS
		$(".tip").tipper();
		
		// INIT UI
		$.uiux.backtotop();
		$.uiux.placeholder();
		$.uiux.smoothscroll();
		
	});

}));


/***************** Slide-In Nav ******************/
$(window).load(function() {

	$('.nav_slide_button').on('click', function(e) {
		e.preventDefault();
		$('.nav-collapse').slideToggle();
		$('body').toggleClass('nav-open');
	});

});

/***************** Nav Transformicon ******************/
document.querySelector("#nav-toggle").addEventListener("click", function() {
	this.classList.toggle("active");
});

/***************** Overlays ******************/
$(document).ready(function(){

	if (Modernizr.touch) {
		// show the close overlay button
		$(".close-overlay").removeClass("hidden");
		// handle the adding of hover class when clicked
		$(".img").click(function(e){
			if (!$(this).hasClass("hover")) {
				$(this).addClass("hover");
			}
		});
		// handle the closing of the overlay
		$(".close-overlay").click(function(e){
			e.preventDefault();
			e.stopPropagation();
			if ($(this).closest(".img").hasClass("hover")) {
				$(this).closest(".img").removeClass("hover");
			}
		});
	} else {
		// handle the mouseenter functionality
		$(".img").mouseenter(function(){
			$(this).addClass("hover");
		})
		// handle the mouseleave functionality
		.mouseleave(function(){
			$(this).removeClass("hover");
		});
	}
	
	// TOGGLE GRID BUTTON
	var $btg = $('[data-toggle="grid"]');
	if( $btg.length ){
		$btg.on("click", function(event){
			$(this).find('i').toggle();
			$('body').toggleClass('aparent');
			event.preventDefault();
		});
	}
	
});


/* EOF */

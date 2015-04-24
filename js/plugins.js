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

/**
* jquery.matchHeight.js v0.5.2
* http://brm.io/jquery-match-height/
* License: MIT
*/

;(function($) {
    /*
    *  internal
    */

    var _previousResizeWidth = -1,
        _updateTimeout = -1;

    /*
    *  _rows
    *  utility function returns array of jQuery selections representing each row
    *  (as displayed after float wrapping applied by browser)
    */

    var _rows = function(elements) {
        var tolerance = 1,
            $elements = $(elements),
            lastTop = null,
            rows = [];

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

    /*
    *  _parse
    *  value parse utility function
    */

    var _parse = function(value) {
        // parse value and convert NaN to 0
        return parseFloat(value) || 0;
    };

    /*
    *  _parseOptions
    *  handle plugin options
    */

    var _parseOptions = function(options) {
        var opts = {
            byRow: true,
            remove: false,
            property: 'height'
        };

        if (typeof options === 'object') {
            opts = $.extend(opts, options);
        }

        if (typeof options === 'boolean') {
            opts.byRow = options;
        }

        if (options === 'remove') {
            opts.remove = true;
        }

        return opts;
    };

    /*
    *  matchHeight
    *  plugin definition
    */

    var matchHeight = $.fn.matchHeight = function(options) {
        var opts = _parseOptions(options);

        // handle remove
        if (opts.remove) {
            var that = this;

            // remove fixed height from all selected elements
            this.css(opts.property, '');

            // remove selected elements from all groups
            $.each(matchHeight._groups, function(key, group) {
                group.elements = group.elements.not(that);
            });

            // TODO: cleanup empty groups

            return this;
        }

        if (this.length <= 1)
            return this;

        // keep track of this group so we can re-apply later on load and resize events
        matchHeight._groups.push({
            elements: this,
            options: opts
        });

        // match each element's height to the tallest element in the selection
        matchHeight._apply(this, opts);

        return this;
    };

    /*
    *  plugin global options
    */

    matchHeight._groups = [];
    matchHeight._throttle = 80;
    matchHeight._maintainScroll = false;
    matchHeight._beforeUpdate = null;
    matchHeight._afterUpdate = null;

    /*
    *  matchHeight._apply
    *  apply matchHeight to given elements
    */

    matchHeight._apply = function(elements, options) {
        var opts = _parseOptions(options),
            $elements = $(elements),
            rows = [$elements];

        // take note of scroll position
        var scrollTop = $(window).scrollTop(),
            htmlHeight = $('html').outerHeight(true);

        // temporarily must force hidden parents visible
        var $hiddenParents = $elements.parents().filter(':hidden');
        $hiddenParents.css('display', 'block');

        // get rows if using byRow, otherwise assume one row
        if (opts.byRow) {

            // must first force an arbitrary equal height so floating elements break evenly
            $elements.each(function() {
                var $that = $(this),
                    display = $that.css('display') === 'inline-block' ? 'inline-block' : 'block';

                // cache the original inline style
                $that.data('style-cache', $that.attr('style'));

                $that.css({
                    'display': display,
                    'padding-top': '0',
                    'padding-bottom': '0',
                    'margin-top': '0',
                    'margin-bottom': '0',
                    'border-top-width': '0',
                    'border-bottom-width': '0',
                    'height': '100px'
                });
            });

            // get the array of rows (based on element top position)
            rows = _rows($elements);

            // revert original inline styles
            $elements.each(function() {
                var $that = $(this);

                $that.attr('style', $that.data('style-cache') || '')
                     .css('height', '');
            });
        }

        $.each(rows, function(key, row) {
            var $row = $(row),
                maxHeight = 0;

            // skip apply to rows with only one item
            if (opts.byRow && $row.length <= 1)
                return;

            // iterate the row and find the max height
            $row.each(function(){
                var $that = $(this),
                    display = $that.css('display') === 'inline-block' ? 'inline-block' : 'block';

                // ensure we get the correct actual height (and not a previously set height value)
                var css = { 'display': display };
                css[opts.property] = '';
                $that.css(css);

                // find the max height (including padding, but not margin)
                if ($that.outerHeight(false) > maxHeight)
                    maxHeight = $that.outerHeight(false);

                // revert display block
                $that.css('display', '');
            });

            // iterate the row and apply the height to all elements
            $row.each(function(){
                var $that = $(this),
                    verticalPadding = 0;

                // handle padding and border correctly (required when not using border-box)
                if ($that.css('box-sizing') !== 'border-box') {
                    verticalPadding += _parse($that.css('border-top-width')) + _parse($that.css('border-bottom-width'));
                    verticalPadding += _parse($that.css('padding-top')) + _parse($that.css('padding-bottom'));
                }

                // set the height (accounting for padding and border)
                $that.css(opts.property, maxHeight - verticalPadding);
            });
        });

        // revert hidden parents
        $hiddenParents.css('display', '');

        // restore scroll position if enabled
        if (matchHeight._maintainScroll)
            $(window).scrollTop((scrollTop / htmlHeight) * $('html').outerHeight(true));

        return this;
    };

    /*
    *  matchHeight._applyDataApi
    *  applies matchHeight to all elements with a data-match-height attribute
    */

    matchHeight._applyDataApi = function() {
        var groups = {};

        // generate groups by their groupId set by elements using data-match-height
        $('[data-match-height], [data-mh]').each(function() {
            var $this = $(this),
                groupId = $this.attr('data-match-height') || $this.attr('data-mh');
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
    };

    /*
    *  matchHeight._update
    *  updates matchHeight on all current groups with their correct options
    */

    var _update = function(event) {
        if (matchHeight._beforeUpdate)
            matchHeight._beforeUpdate(event, matchHeight._groups);

        $.each(matchHeight._groups, function() {
            matchHeight._apply(this.elements, this.options);
        });

        if (matchHeight._afterUpdate)
            matchHeight._afterUpdate(event, matchHeight._groups);
    };

    matchHeight._update = function(throttle, event) {
        // prevent update if fired from a resize event
        // where the viewport width hasn't actually changed
        // fixes an event looping bug in IE8
        if (event && event.type === 'resize') {
            var windowWidth = $(window).width();
            if (windowWidth === _previousResizeWidth)
                return;
            _previousResizeWidth = windowWidth;
        }

        // throttle updates
        if (!throttle) {
            _update(event);
        } else if (_updateTimeout === -1) {
            _updateTimeout = setTimeout(function() {
                _update(event);
                _updateTimeout = -1;
            }, matchHeight._throttle);
        }
    };

    /*
    *  bind events
    */

    // apply on DOM ready event
    $(matchHeight._applyDataApi);

    // update heights on load and resize events
    $(window).bind('load', function(event) {
        matchHeight._update(false, event);
    });

    // throttled update heights on resize events
    $(window).bind('resize orientationchange', function(event) {
        matchHeight._update(true, event);
    });

})(jQuery);


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


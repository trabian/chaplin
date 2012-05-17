// Generated by CoffeeScript 1.3.3
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(['jquery', 'underscore', 'chaplin/mediator', 'chaplin/lib/utils', 'chaplin/lib/subscriber'], function($, _, mediator, utils, Subscriber) {
  'use strict';

  var Layout;
  return Layout = (function() {

    _(Layout.prototype).extend(Subscriber);

    Layout.prototype.title = '';

    function Layout() {
      this.openLink = __bind(this.openLink, this);
      this.initialize.apply(this, arguments);
    }

    Layout.prototype.initialize = function(options) {
      if (options == null) {
        options = {};
      }
      /*console.debug 'Layout#initialize', options
      */

      this.title = options.title;
      _(options).defaults({
        loginClasses: true,
        routeLinks: true
      });
      this.subscribeEvent('beforeControllerDispose', this.hideOldView);
      this.subscribeEvent('startupController', this.showNewView);
      this.subscribeEvent('startupController', this.adjustTitle);
      if (options.loginClasses) {
        this.subscribeEvent('loginStatus', this.updateLoginClasses);
        this.updateLoginClasses();
      }
      if (options.routeLinks) {
        return this.initLinkRouting();
      }
    };

    Layout.prototype.hideOldView = function(controller) {
      var view;
      scrollTo(0, 0);
      view = controller.view;
      if (view) {
        return view.$el.css('display', 'none');
      }
    };

    Layout.prototype.showNewView = function(context) {
      var view;
      view = context.controller.view;
      if (view) {
        return view.$el.css({
          display: 'block',
          opacity: 1,
          visibility: 'visible'
        });
      }
    };

    Layout.prototype.adjustTitle = function(context) {
      var subtitle, title;
      title = this.title;
      subtitle = context.controller.title;
      if (subtitle) {
        title = "" + subtitle + " \u2013 " + title;
      }
      return setTimeout((function() {
        return document.title = title;
      }), 50);
    };

    Layout.prototype.updateLoginClasses = function(loggedIn) {
      return $(document.body).toggleClass('logged-out', !loggedIn).toggleClass('logged-in', loggedIn);
    };

    Layout.prototype.initLinkRouting = function() {
      return $(document).on('click', '.go-to', this.goToHandler).on('click', 'a', this.openLink);
    };

    Layout.prototype.stopLinkRouting = function() {
      return $(document).off('click', '.go-to', this.goToHandler).off('click', 'a', this.openLink);
    };

    Layout.prototype.openLink = function(event) {
      var currentHostname, el, external, href, path;
      if (utils.modifierKeyPressed(event)) {
        return;
      }
      el = event.currentTarget;
      href = el.getAttribute('href');
      if (href === null || href === '' || href.charAt(0) === '#' || $(el).hasClass('noscript')) {
        return;
      }
      currentHostname = location.hostname.replace('.', '\\.');
      external = !RegExp("" + currentHostname + "$", "i").test(el.hostname);
      if (external) {
        return;
      }
      path = el.pathname + el.search;
      if (path.charAt(0) !== '/') {
        path = "/" + path;
      }
      return mediator.publish('!router:route', path, function(routed) {
        if (routed) {
          return event.preventDefault();
        }
      });
    };

    Layout.prototype.goToHandler = function(event) {
      var el, path;
      el = event.currentTarget;
      if (event.nodeName === 'A') {
        return;
      }
      path = $(el).data('href');
      if (!path) {
        return;
      }
      return mediator.publish('!router:route', path, function(routed) {
        if (routed) {
          return event.preventDefault();
        } else {
          return location.href = path;
        }
      });
    };

    Layout.prototype.disposed = false;

    Layout.prototype.dispose = function() {
      /*console.debug 'Layout#dispose'
      */
      if (this.disposed) {
        return;
      }
      this.stopLinkRouting();
      this.unsubscribeAllEvents();
      delete this.title;
      this.disposed = true;
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    return Layout;

  })();
});
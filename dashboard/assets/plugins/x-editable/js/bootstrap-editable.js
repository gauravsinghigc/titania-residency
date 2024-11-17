/*! X-editable - v1.5.1 
 * In-place editing with Twitter Bootstrap, jQuery UI or pure jQuery
 * http://github.com/vitalets/x-editable
 * Copyright (c) 2013 Vitaliy Potapov; Licensed MIT */
! function(a) {
    "use strict";
    var b = function(b, c) {
        this.options = a.extend({}, a.fn.editableform.defaults, c), this.$div = a(b), this.options.scope || (this.options.scope = this)
    };
    b.prototype = {
        constructor: b,
        initInput: function() {
            this.input = this.options.input, this.value = this.input.str2value(this.options.value), this.input.prerender()
        },
        initTemplate: function() {
            this.$form = a(a.fn.editableform.template)
        },
        initButtons: function() {
            var b = this.$form.find(".editable-buttons");
            b.append(a.fn.editableform.buttons), "bottom" === this.options.showbuttons && b.addClass("editable-buttons-bottom")
        },
        render: function() {
            this.$loading = a(a.fn.editableform.loading), this.$div.empty().append(this.$loading), this.initTemplate(), this.options.showbuttons ? this.initButtons() : this.$form.find(".editable-buttons").remove(), this.showLoading(), this.isSaving = !1, this.$div.triggerHandler("rendering"), this.initInput(), this.$form.find("div.editable-input").append(this.input.$tpl), this.$div.append(this.$form), a.when(this.input.render()).then(a.proxy(function() {
                if (this.options.showbuttons || this.input.autosubmit(), this.$form.find(".editable-cancel").click(a.proxy(this.cancel, this)), this.input.error) this.error(this.input.error), this.$form.find(".editable-submit").attr("disabled", !0), this.input.$input.attr("disabled", !0), this.$form.submit(function(a) {
                    a.preventDefault()
                });
                else {
                    this.error(!1), this.input.$input.removeAttr("disabled"), this.$form.find(".editable-submit").removeAttr("disabled");
                    var b = null === this.value || void 0 === this.value || "" === this.value ? this.options.defaultValue : this.value;
                    this.input.value2input(b), this.$form.submit(a.proxy(this.submit, this))
                }
                this.$div.triggerHandler("rendered"), this.showForm(), this.input.postrender && this.input.postrender()
            }, this))
        },
        cancel: function() {
            this.$div.triggerHandler("cancel")
        },
        showLoading: function() {
            var a, b;
            this.$form ? (a = this.$form.outerWidth(), b = this.$form.outerHeight(), a && this.$loading.width(a), b && this.$loading.height(b), this.$form.hide()) : (a = this.$loading.parent().width(), a && this.$loading.width(a)), this.$loading.show()
        },
        showForm: function(a) {
            this.$loading.hide(), this.$form.show(), a !== !1 && this.input.activate(), this.$div.triggerHandler("show")
        },
        error: function(b) {
            var c, d = this.$form.find(".control-group"),
                e = this.$form.find(".editable-error-block");
            if (b === !1) d.removeClass(a.fn.editableform.errorGroupClass), e.removeClass(a.fn.editableform.errorBlockClass).empty().hide();
            else {
                if (b) {
                    c = ("" + b).split("\n");
                    for (var f = 0; f < c.length; f++) c[f] = a("<div>").text(c[f]).html();
                    b = c.join("<br>")
                }
                d.addClass(a.fn.editableform.errorGroupClass), e.addClass(a.fn.editableform.errorBlockClass).html(b).show()
            }
        },
        submit: function(b) {
            b.stopPropagation(), b.preventDefault();
            var c = this.input.input2value(),
                d = this.validate(c);
            if ("object" === a.type(d) && void 0 !== d.newValue) {
                if (c = d.newValue, this.input.value2input(c), "string" == typeof d.msg) return this.error(d.msg), this.showForm(), void 0
            } else if (d) return this.error(d), this.showForm(), void 0;
            if (!this.options.savenochange && this.input.value2str(c) == this.input.value2str(this.value)) return this.$div.triggerHandler("nochange"), void 0;
            var e = this.input.value2submit(c);
            this.isSaving = !0, a.when(this.save(e)).done(a.proxy(function(a) {
                this.isSaving = !1;
                var b = "function" == typeof this.options.success ? this.options.success.call(this.options.scope, a, c) : null;
                return b === !1 ? (this.error(!1), this.showForm(!1), void 0) : "string" == typeof b ? (this.error(b), this.showForm(), void 0) : (b && "object" == typeof b && b.hasOwnProperty("newValue") && (c = b.newValue), this.error(!1), this.value = c, this.$div.triggerHandler("save", {
                    newValue: c,
                    submitValue: e,
                    response: a
                }), void 0)
            }, this)).fail(a.proxy(function(a) {
                this.isSaving = !1;
                var b;
                b = "function" == typeof this.options.error ? this.options.error.call(this.options.scope, a, c) : "string" == typeof a ? a : a.responseText || a.statusText || "Unknown error!", this.error(b), this.showForm()
            }, this))
        },
        save: function(b) {
            this.options.pk = a.fn.editableutils.tryParseJson(this.options.pk, !0);
            var c, d = "function" == typeof this.options.pk ? this.options.pk.call(this.options.scope) : this.options.pk,
                e = !!("function" == typeof this.options.url || this.options.url && ("always" === this.options.send || "auto" === this.options.send && null !== d && void 0 !== d));
            return e ? (this.showLoading(), c = {
                name: this.options.name || "",
                value: b,
                pk: d
            }, "function" == typeof this.options.params ? c = this.options.params.call(this.options.scope, c) : (this.options.params = a.fn.editableutils.tryParseJson(this.options.params, !0), a.extend(c, this.options.params)), "function" == typeof this.options.url ? this.options.url.call(this.options.scope, c) : a.ajax(a.extend({
                url: this.options.url,
                data: c,
                type: "POST"
            }, this.options.ajaxOptions))) : void 0
        },
        validate: function(a) {
            return void 0 === a && (a = this.value), "function" == typeof this.options.validate ? this.options.validate.call(this.options.scope, a) : void 0
        },
        option: function(a, b) {
            a in this.options && (this.options[a] = b), "value" === a && this.setValue(b)
        },
        setValue: function(a, b) {
            this.value = b ? this.input.str2value(a) : a, this.$form && this.$form.is(":visible") && this.input.value2input(this.value)
        }
    }, a.fn.editableform = function(c) {
        var d = arguments;
        return this.each(function() {
            var e = a(this),
                f = e.data("editableform"),
                g = "object" == typeof c && c;
            f || e.data("editableform", f = new b(this, g)), "string" == typeof c && f[c].apply(f, Array.prototype.slice.call(d, 1))
        })
    }, a.fn.editableform.Constructor = b, a.fn.editableform.defaults = {
        type: "text",
        url: null,
        params: null,
        name: null,
        pk: null,
        value: null,
        defaultValue: null,
        send: "auto",
        validate: null,
        success: null,
        error: null,
        ajaxOptions: null,
        showbuttons: !0,
        scope: null,
        savenochange: !1
    }, a.fn.editableform.template = '<form class="form-inline editableform"><div class="control-group"><div><div class="editable-input"></div><div class="editable-buttons"></div></div><div class="editable-error-block"></div></div></form>', a.fn.editableform.loading = '<div class="editableform-loading"></div>', a.fn.editableform.buttons = '<button type="submit" class="editable-submit">ok</button><button type="button" class="editable-cancel">cancel</button>', a.fn.editableform.errorGroupClass = null, a.fn.editableform.errorBlockClass = "editable-error", a.fn.editableform.engine = "jquery"
}(window.jQuery),
function(a) {
    "use strict";
    a.fn.editableutils = {
        inherit: function(a, b) {
            var c = function() {};
            c.prototype = b.prototype, a.prototype = new c, a.prototype.constructor = a, a.superclass = b.prototype
        },
        setCursorPosition: function(a, b) {
            if (a.setSelectionRange) a.setSelectionRange(b, b);
            else if (a.createTextRange) {
                var c = a.createTextRange();
                c.collapse(!0), c.moveEnd("character", b), c.moveStart("character", b), c.select()
            }
        },
        tryParseJson: function(a, b) {
            if ("string" == typeof a && a.length && a.match(/^[\{\[].*[\}\]]$/))
                if (b) try {
                    a = new Function("return " + a)()
                } catch (c) {} finally {
                    return a
                } else a = new Function("return " + a)();
            return a
        },
        sliceObj: function(b, c, d) {
            var e, f, g = {};
            if (!a.isArray(c) || !c.length) return g;
            for (var h = 0; h < c.length; h++) e = c[h], b.hasOwnProperty(e) && (g[e] = b[e]), d !== !0 && (f = e.toLowerCase(), b.hasOwnProperty(f) && (g[e] = b[f]));
            return g
        },
        getConfigData: function(b) {
            var c = {};
            return a.each(b.data(), function(a, b) {
                ("object" != typeof b || b && "object" == typeof b && (b.constructor === Object || b.constructor === Array)) && (c[a] = b)
            }), c
        },
        objectKeys: function(a) {
            if (Object.keys) return Object.keys(a);
            if (a !== Object(a)) throw new TypeError("Object.keys called on a non-object");
            var b, c = [];
            for (b in a) Object.prototype.hasOwnProperty.call(a, b) && c.push(b);
            return c
        },
        escape: function(b) {
            return a("<div>").text(b).html()
        },
        itemsByValue: function(b, c, d) {
            if (!c || null === b) return [];
            if ("function" != typeof d) {
                var e = d || "value";
                d = function(a) {
                    return a[e]
                }
            }
            var f = a.isArray(b),
                g = [],
                h = this;
            return a.each(c, function(c, e) {
                if (e.children) g = g.concat(h.itemsByValue(b, e.children, d));
                else if (f) a.grep(b, function(a) {
                    return a == (e && "object" == typeof e ? d(e) : e)
                }).length && g.push(e);
                else {
                    var i = e && "object" == typeof e ? d(e) : e;
                    b == i && g.push(e)
                }
            }), g
        },
        createInput: function(b) {
            var c, d, e, f = b.type;
            return "date" === f && ("inline" === b.mode ? a.fn.editabletypes.datefield ? f = "datefield" : a.fn.editabletypes.dateuifield && (f = "dateuifield") : a.fn.editabletypes.date ? f = "date" : a.fn.editabletypes.dateui && (f = "dateui"), "date" !== f || a.fn.editabletypes.date || (f = "combodate")), "datetime" === f && "inline" === b.mode && (f = "datetimefield"), "wysihtml5" !== f || a.fn.editabletypes[f] || (f = "textarea"), "function" == typeof a.fn.editabletypes[f] ? (c = a.fn.editabletypes[f], d = this.sliceObj(b, this.objectKeys(c.defaults)), e = new c(d)) : (a.error("Unknown type: " + f), !1)
        },
        supportsTransitions: function() {
            var a = document.body || document.documentElement,
                b = a.style,
                c = "transition",
                d = ["Moz", "Webkit", "Khtml", "O", "ms"];
            if ("string" == typeof b[c]) return !0;
            c = c.charAt(0).toUpperCase() + c.substr(1);
            for (var e = 0; e < d.length; e++)
                if ("string" == typeof b[d[e] + c]) return !0;
            return !1
        }
    }
}(window.jQuery),
function(a) {
    "use strict";
    var b = function(a, b) {
            this.init(a, b)
        },
        c = function(a, b) {
            this.init(a, b)
        };
    b.prototype = {
        containerName: null,
        containerDataName: null,
        innerCss: null,
        containerClass: "editable-container editable-popup",
        defaults: {},
        init: function(c, d) {
            this.$element = a(c), this.options = a.extend({}, a.fn.editableContainer.defaults, d), this.splitOptions(), this.formOptions.scope = this.$element[0], this.initContainer(), this.delayedHide = !1, this.$element.on("destroyed", a.proxy(function() {
                this.destroy()
            }, this)), a(document).data("editable-handlers-attached") || (a(document).on("keyup.editable", function(b) {
                27 === b.which && a(".editable-open").editableContainer("hide")
            }), a(document).on("click.editable", function(c) {
                var d, e = a(c.target),
                    f = [".editable-container", ".ui-datepicker-header", ".datepicker", ".modal-backdrop", ".bootstrap-wysihtml5-insert-image-modal", ".bootstrap-wysihtml5-insert-link-modal"];
                if (a.contains(document.documentElement, c.target) && !e.is(document)) {
                    for (d = 0; d < f.length; d++)
                        if (e.is(f[d]) || e.parents(f[d]).length) return;
                    b.prototype.closeOthers(c.target)
                }
            }), a(document).data("editable-handlers-attached", !0))
        },
        splitOptions: function() {
            if (this.containerOptions = {}, this.formOptions = {}, !a.fn[this.containerName]) throw new Error(this.containerName + " not found. Have you included corresponding js file?");
            for (var b in this.options) b in this.defaults ? this.containerOptions[b] = this.options[b] : this.formOptions[b] = this.options[b]
        },
        tip: function() {
            return this.container() ? this.container().$tip : null
        },
        container: function() {
            var a;
            return this.containerDataName && (a = this.$element.data(this.containerDataName)) ? a : a = this.$element.data(this.containerName)
        },
        call: function() {
            this.$element[this.containerName].apply(this.$element, arguments)
        },
        initContainer: function() {
            this.call(this.containerOptions)
        },
        renderForm: function() {
            this.$form.editableform(this.formOptions).on({
                save: a.proxy(this.save, this),
                nochange: a.proxy(function() {
                    this.hide("nochange")
                }, this),
                cancel: a.proxy(function() {
                    this.hide("cancel")
                }, this),
                show: a.proxy(function() {
                    this.delayedHide ? (this.hide(this.delayedHide.reason), this.delayedHide = !1) : this.setPosition()
                }, this),
                rendering: a.proxy(this.setPosition, this),
                resize: a.proxy(this.setPosition, this),
                rendered: a.proxy(function() {
                    this.$element.triggerHandler("shown", a(this.options.scope).data("editable"))
                }, this)
            }).editableform("render")
        },
        show: function(b) {
            this.$element.addClass("editable-open"), b !== !1 && this.closeOthers(this.$element[0]), this.innerShow(), this.tip().addClass(this.containerClass), this.$form, this.$form = a("<div>"), this.tip().is(this.innerCss) ? this.tip().append(this.$form) : this.tip().find(this.innerCss).append(this.$form), this.renderForm()
        },
        hide: function(a) {
            if (this.tip() && this.tip().is(":visible") && this.$element.hasClass("editable-open")) {
                if (this.$form.data("editableform").isSaving) return this.delayedHide = {
                    reason: a
                }, void 0;
                this.delayedHide = !1, this.$element.removeClass("editable-open"), this.innerHide(), this.$element.triggerHandler("hidden", a || "manual")
            }
        },
        innerShow: function() {},
        innerHide: function() {},
        toggle: function(a) {
            this.container() && this.tip() && this.tip().is(":visible") ? this.hide() : this.show(a)
        },
        setPosition: function() {},
        save: function(a, b) {
            this.$element.triggerHandler("save", b), this.hide("save")
        },
        option: function(a, b) {
            this.options[a] = b, a in this.containerOptions ? (this.containerOptions[a] = b, this.setContainerOption(a, b)) : (this.formOptions[a] = b, this.$form && this.$form.editableform("option", a, b))
        },
        setContainerOption: function(a, b) {
            this.call("option", a, b)
        },
        destroy: function() {
            this.hide(), this.innerDestroy(), this.$element.off("destroyed"), this.$element.removeData("editableContainer")
        },
        innerDestroy: function() {},
        closeOthers: function(b) {
            a(".editable-open").each(function(c, d) {
                if (d !== b && !a(d).find(b).length) {
                    var e = a(d),
                        f = e.data("editableContainer");
                    f && ("cancel" === f.options.onblur ? e.data("editableContainer").hide("onblur") : "submit" === f.options.onblur && e.data("editableContainer").tip().find("form").submit())
                }
            })
        },
        activate: function() {
            this.tip && this.tip().is(":visible") && this.$form && this.$form.data("editableform").input.activate()
        }
    }, a.fn.editableContainer = function(d) {
        var e = arguments;
        return this.each(function() {
            var f = a(this),
                g = "editableContainer",
                h = f.data(g),
                i = "object" == typeof d && d,
                j = "inline" === i.mode ? c : b;
            h || f.data(g, h = new j(this, i)), "string" == typeof d && h[d].apply(h, Array.prototype.slice.call(e, 1))
        })
    }, a.fn.editableContainer.Popup = b, a.fn.editableContainer.Inline = c, a.fn.editableContainer.defaults = {
        value: null,
        placement: "top",
        autohide: !0,
        onblur: "cancel",
        anim: !1,
        mode: "popup"
    }, jQuery.event.special.destroyed = {
        remove: function(a) {
            a.handler && a.handler()
        }
    }
}(window.jQuery),
function(a) {
    "use strict";
    a.extend(a.fn.editableContainer.Inline.prototype, a.fn.editableContainer.Popup.prototype, {
        containerName: "editableform",
        innerCss: ".editable-inline",
        containerClass: "editable-container editable-inline",
        initContainer: function() {
            this.$tip = a("<span></span>"), this.options.anim || (this.options.anim = 0)
        },
        splitOptions: function() {
            this.containerOptions = {}, this.formOptions = this.options
        },
        tip: function() {
            return this.$tip
        },
        innerShow: function() {
            this.$element.hide(), this.tip().insertAfter(this.$element).show()
        },
        innerHide: function() {
            this.$tip.hide(this.options.anim, a.proxy(function() {
                this.$element.show(), this.innerDestroy()
            }, this))
        },
        innerDestroy: function() {
            this.tip() && this.tip().empty().remove()
        }
    })
}(window.jQuery),
function(a) {
    "use strict";
    var b = function(b, c) {
        this.$element = a(b), this.options = a.extend({}, a.fn.editable.defaults, c, a.fn.editableutils.getConfigData(this.$element)), this.options.selector ? this.initLive() : this.init(), this.options.highlight && !a.fn.editableutils.supportsTransitions() && (this.options.highlight = !1)
    };
    b.prototype = {
        constructor: b,
        init: function() {
            var b, c = !1;
            if (this.options.name = this.options.name || this.$element.attr("id"), this.options.scope = this.$element[0], this.input = a.fn.editableutils.createInput(this.options), this.input) {
                switch (void 0 === this.options.value || null === this.options.value ? (this.value = this.input.html2value(a.trim(this.$element.html())), c = !0) : (this.options.value = a.fn.editableutils.tryParseJson(this.options.value, !0), this.value = "string" == typeof this.options.value ? this.input.str2value(this.options.value) : this.options.value), this.$element.addClass("editable"), "textarea" === this.input.type && this.$element.addClass("editable-pre-wrapped"), "manual" !== this.options.toggle ? (this.$element.addClass("editable-click"), this.$element.on(this.options.toggle + ".editable", a.proxy(function(a) {
                    if (this.options.disabled || a.preventDefault(), "mouseenter" === this.options.toggle) this.show();
                    else {
                        var b = "click" !== this.options.toggle;
                        this.toggle(b)
                    }
                }, this))) : this.$element.attr("tabindex", -1), "function" == typeof this.options.display && (this.options.autotext = "always"), this.options.autotext) {
                    case "always":
                        b = !0;
                        break;
                    case "auto":
                        b = !a.trim(this.$element.text()).length && null !== this.value && void 0 !== this.value && !c;
                        break;
                    default:
                        b = !1
                }
                a.when(b ? this.render() : !0).then(a.proxy(function() {
                    this.options.disabled ? this.disable() : this.enable(), this.$element.triggerHandler("init", this)
                }, this))
            }
        },
        initLive: function() {
            var b = this.options.selector;
            this.options.selector = !1, this.options.autotext = "never", this.$element.on(this.options.toggle + ".editable", b, a.proxy(function(b) {
                var c = a(b.target);
                c.data("editable") || (c.hasClass(this.options.emptyclass) && c.empty(), c.editable(this.options).trigger(b))
            }, this))
        },
        render: function(a) {
            return this.options.display !== !1 ? this.input.value2htmlFinal ? this.input.value2html(this.value, this.$element[0], this.options.display, a) : "function" == typeof this.options.display ? this.options.display.call(this.$element[0], this.value, a) : this.input.value2html(this.value, this.$element[0]) : void 0
        },
        enable: function() {
            this.options.disabled = !1, this.$element.removeClass("editable-disabled"), this.handleEmpty(this.isEmpty), "manual" !== this.options.toggle && "-1" === this.$element.attr("tabindex") && this.$element.removeAttr("tabindex")
        },
        disable: function() {
            this.options.disabled = !0, this.hide(), this.$element.addClass("editable-disabled"), this.handleEmpty(this.isEmpty), this.$element.attr("tabindex", -1)
        },
        toggleDisabled: function() {
            this.options.disabled ? this.enable() : this.disable()
        },
        option: function(b, c) {
            return b && "object" == typeof b ? (a.each(b, a.proxy(function(b, c) {
                this.option(a.trim(b), c)
            }, this)), void 0) : (this.options[b] = c, "disabled" === b ? c ? this.disable() : this.enable() : ("value" === b && this.setValue(c), this.container && this.container.option(b, c), this.input.option && this.input.option(b, c), void 0))
        },
        handleEmpty: function(b) {
            this.options.display !== !1 && (this.isEmpty = void 0 !== b ? b : "function" == typeof this.input.isEmpty ? this.input.isEmpty(this.$element) : "" === a.trim(this.$element.html()), this.options.disabled ? this.isEmpty && (this.$element.empty(), this.options.emptyclass && this.$element.removeClass(this.options.emptyclass)) : this.isEmpty ? (this.$element.html(this.options.emptytext), this.options.emptyclass && this.$element.addClass(this.options.emptyclass)) : this.options.emptyclass && this.$element.removeClass(this.options.emptyclass))
        },
        show: function(b) {
            if (!this.options.disabled) {
                if (this.container) {
                    if (this.container.tip().is(":visible")) return
                } else {
                    var c = a.extend({}, this.options, {
                        value: this.value,
                        input: this.input
                    });
                    this.$element.editableContainer(c), this.$element.on("save.internal", a.proxy(this.save, this)), this.container = this.$element.data("editableContainer")
                }
                this.container.show(b)
            }
        },
        hide: function() {
            this.container && this.container.hide()
        },
        toggle: function(a) {
            this.container && this.container.tip().is(":visible") ? this.hide() : this.show(a)
        },
        save: function(a, b) {
            if (this.options.unsavedclass) {
                var c = !1;
                c = c || "function" == typeof this.options.url, c = c || this.options.display === !1, c = c || void 0 !== b.response, c = c || this.options.savenochange && this.input.value2str(this.value) !== this.input.value2str(b.newValue), c ? this.$element.removeClass(this.options.unsavedclass) : this.$element.addClass(this.options.unsavedclass)
            }
            if (this.options.highlight) {
                var d = this.$element,
                    e = d.css("background-color");
                d.css("background-color", this.options.highlight), setTimeout(function() {
                    "transparent" === e && (e = ""), d.css("background-color", e), d.addClass("editable-bg-transition"), setTimeout(function() {
                        d.removeClass("editable-bg-transition")
                    }, 1700)
                }, 10)
            }
            this.setValue(b.newValue, !1, b.response)
        },
        validate: function() {
            return "function" == typeof this.options.validate ? this.options.validate.call(this, this.value) : void 0
        },
        setValue: function(b, c, d) {
            this.value = c ? this.input.str2value(b) : b, this.container && this.container.option("value", this.value), a.when(this.render(d)).then(a.proxy(function() {
                this.handleEmpty()
            }, this))
        },
        activate: function() {
            this.container && this.container.activate()
        },
        destroy: function() {
            this.disable(), this.container && this.container.destroy(), this.input.destroy(), "manual" !== this.options.toggle && (this.$element.removeClass("editable-click"), this.$element.off(this.options.toggle + ".editable")), this.$element.off("save.internal"), this.$element.removeClass("editable editable-open editable-disabled"), this.$element.removeData("editable")
        }
    }, a.fn.editable = function(c) {
        var d = {},
            e = arguments,
            f = "editable";
        switch (c) {
            case "validate":
                return this.each(function() {
                    var b, c = a(this),
                        e = c.data(f);
                    e && (b = e.validate()) && (d[e.options.name] = b)
                }), d;
            case "getValue":
                return 2 === arguments.length && arguments[1] === !0 ? d = this.eq(0).data(f).value : this.each(function() {
                    var b = a(this),
                        c = b.data(f);
                    c && void 0 !== c.value && null !== c.value && (d[c.options.name] = c.input.value2submit(c.value))
                }), d;
            case "submit":
                var g = arguments[1] || {},
                    h = this,
                    i = this.editable("validate");
                if (a.isEmptyObject(i)) {
                    var j = {};
                    if (1 === h.length) {
                        var k = h.data("editable"),
                            l = {
                                name: k.options.name || "",
                                value: k.input.value2submit(k.value),
                                pk: "function" == typeof k.options.pk ? k.options.pk.call(k.options.scope) : k.options.pk
                            };
                        "function" == typeof k.options.params ? l = k.options.params.call(k.options.scope, l) : (k.options.params = a.fn.editableutils.tryParseJson(k.options.params, !0), a.extend(l, k.options.params)), j = {
                            url: k.options.url,
                            data: l,
                            type: "POST"
                        }, g.success = g.success || k.options.success, g.error = g.error || k.options.error
                    } else {
                        var m = this.editable("getValue");
                        j = {
                            url: g.url,
                            data: m,
                            type: "POST"
                        }
                    }
                    j.success = "function" == typeof g.success ? function(a) {
                        g.success.call(h, a, g)
                    } : a.noop, j.error = "function" == typeof g.error ? function() {
                        g.error.apply(h, arguments)
                    } : a.noop, g.ajaxOptions && a.extend(j, g.ajaxOptions), g.data && a.extend(j.data, g.data), a.ajax(j)
                } else "function" == typeof g.error && g.error.call(h, i);
                return this
        }
        return this.each(function() {
            var d = a(this),
                g = d.data(f),
                h = "object" == typeof c && c;
            return h && h.selector ? (g = new b(this, h), void 0) : (g || d.data(f, g = new b(this, h)), "string" == typeof c && g[c].apply(g, Array.prototype.slice.call(e, 1)), void 0)
        })
    }, a.fn.editable.defaults = {
        type: "text",
        disabled: !1,
        toggle: "click",
        emptytext: "Empty",
        autotext: "auto",
        value: null,
        display: null,
        emptyclass: "editable-empty",
        unsavedclass: "editable-unsaved",
        selector: null,
        highlight: "#FFFF80"
    }
}(window.jQuery),
function(a) {
    "use strict";
    a.fn.editabletypes = {};
    var b = function() {};
    b.prototype = {
        init: function(b, c, d) {
            this.type = b, this.options = a.extend({}, d, c)
        },
        prerender: function() {
            this.$tpl = a(this.options.tpl), this.$input = this.$tpl, this.$clear = null, this.error = null
        },
        render: function() {},
        value2html: function(b, c) {
            a(c)[this.options.escape ? "text" : "html"](a.trim(b))
        },
        html2value: function(b) {
            return a("<div>").html(b).text()
        },
        value2str: function(a) {
            return a
        },
        str2value: function(a) {
            return a
        },
        value2submit: function(a) {
            return a
        },
        value2input: function(a) {
            this.$input.val(a)
        },
        input2value: function() {
            return this.$input.val()
        },
        activate: function() {
            this.$input.is(":visible") && this.$input.focus()
        },
        clear: function() {
            this.$input.val(null)
        },
        escape: function(b) {
            return a("<div>").text(b).html()
        },
        autosubmit: function() {},
        destroy: function() {},
        setClass: function() {
            this.options.inputclass && this.$input.addClass(this.options.inputclass)
        },
        setAttr: function(a) {
            void 0 !== this.options[a] && null !== this.options[a] && this.$input.attr(a, this.options[a])
        },
        option: function(a, b) {
            this.options[a] = b
        }
    }, b.defaults = {
        tpl: "",
        inputclass: null,
        escape: !0,
        scope: null,
        showbuttons: !0
    }, a.extend(a.fn.editabletypes, {
        abstractinput: b
    })
}(window.jQuery),
function(a) {
    "use strict";
    var b = function() {};
    a.fn.editableutils.inherit(b, a.fn.editabletypes.abstractinput), a.extend(b.prototype, {
        render: function() {
            var b = a.Deferred();
            return this.error = null, this.onSourceReady(function() {
                this.renderList(), b.resolve()
            }, function() {
                this.error = this.options.sourceError, b.resolve()
            }), b.promise()
        },
        html2value: function() {
            return null
        },
        value2html: function(b, c, d, e) {
            var f = a.Deferred(),
                g = function() {
                    "function" == typeof d ? d.call(c, b, this.sourceData, e) : this.value2htmlFinal(b, c), f.resolve()
                };
            return null === b ? g.call(this) : this.onSourceReady(g, function() {
                f.resolve()
            }), f.promise()
        },
        onSourceReady: function(b, c) {
            var d;
            if (a.isFunction(this.options.source) ? (d = this.options.source.call(this.options.scope), this.sourceData = null) : d = this.options.source, this.options.sourceCache && a.isArray(this.sourceData)) return b.call(this), void 0;
            try {
                d = a.fn.editableutils.tryParseJson(d, !1)
            } catch (e) {
                return c.call(this), void 0
            }
            if ("string" == typeof d) {
                if (this.options.sourceCache) {
                    var f, g = d;
                    if (a(document).data(g) || a(document).data(g, {}), f = a(document).data(g), f.loading === !1 && f.sourceData) return this.sourceData = f.sourceData, this.doPrepend(), b.call(this), void 0;
                    if (f.loading === !0) return f.callbacks.push(a.proxy(function() {
                        this.sourceData = f.sourceData, this.doPrepend(), b.call(this)
                    }, this)), f.err_callbacks.push(a.proxy(c, this)), void 0;
                    f.loading = !0, f.callbacks = [], f.err_callbacks = []
                }
                var h = a.extend({
                    url: d,
                    type: "get",
                    cache: !1,
                    dataType: "json",
                    success: a.proxy(function(d) {
                        f && (f.loading = !1), this.sourceData = this.makeArray(d), a.isArray(this.sourceData) ? (f && (f.sourceData = this.sourceData, a.each(f.callbacks, function() {
                            this.call()
                        })), this.doPrepend(), b.call(this)) : (c.call(this), f && a.each(f.err_callbacks, function() {
                            this.call()
                        }))
                    }, this),
                    error: a.proxy(function() {
                        c.call(this), f && (f.loading = !1, a.each(f.err_callbacks, function() {
                            this.call()
                        }))
                    }, this)
                }, this.options.sourceOptions);
                a.ajax(h)
            } else this.sourceData = this.makeArray(d), a.isArray(this.sourceData) ? (this.doPrepend(), b.call(this)) : c.call(this)
        },
        doPrepend: function() {
            null !== this.options.prepend && void 0 !== this.options.prepend && (a.isArray(this.prependData) || (a.isFunction(this.options.prepend) && (this.options.prepend = this.options.prepend.call(this.options.scope)), this.options.prepend = a.fn.editableutils.tryParseJson(this.options.prepend, !0), "string" == typeof this.options.prepend && (this.options.prepend = {
                "": this.options.prepend
            }), this.prependData = this.makeArray(this.options.prepend)), a.isArray(this.prependData) && a.isArray(this.sourceData) && (this.sourceData = this.prependData.concat(this.sourceData)))
        },
        renderList: function() {},
        value2htmlFinal: function() {},
        makeArray: function(b) {
            var c, d, e, f, g = [];
            if (!b || "string" == typeof b) return null;
            if (a.isArray(b)) {
                f = function(a, b) {
                    return d = {
                        value: a,
                        text: b
                    }, c++ >= 2 ? !1 : void 0
                };
                for (var h = 0; h < b.length; h++) e = b[h], "object" == typeof e ? (c = 0, a.each(e, f), 1 === c ? g.push(d) : c > 1 && (e.children && (e.children = this.makeArray(e.children)), g.push(e))) : g.push({
                    value: e,
                    text: e
                })
            } else a.each(b, function(a, b) {
                g.push({
                    value: a,
                    text: b
                })
            });
            return g
        },
        option: function(a, b) {
            this.options[a] = b, "source" === a && (this.sourceData = null), "prepend" === a && (this.prependData = null)
        }
    }), b.defaults = a.extend({}, a.fn.editabletypes.abstractinput.defaults, {
        source: null,
        prepend: !1,
        sourceError: "Error when loading list",
        sourceCache: !0,
        sourceOptions: null
    }), a.fn.editabletypes.list = b
}(window.jQuery),
function(a) {
    "use strict";
    var b = function(a) {
        this.init("text", a, b.defaults)
    };
    a.fn.editableutils.inherit(b, a.fn.editabletypes.abstractinput), a.extend(b.prototype, {
        render: function() {
            this.renderClear(), this.setClass(), this.setAttr("placeholder")
        },
        activate: function() {
            this.$input.is(":visible") && (this.$input.focus(), a.fn.editableutils.setCursorPosition(this.$input.get(0), this.$input.val().length), this.toggleClear && this.toggleClear())
        },
        renderClear: function() {
            this.options.clear && (this.$clear = a('<span class="editable-clear-x"></span>'), this.$input.after(this.$clear).css("padding-right", 24).keyup(a.proxy(function(b) {
                if (!~a.inArray(b.keyCode, [40, 38, 9, 13, 27])) {
                    clearTimeout(this.t);
                    var c = this;
                    this.t = setTimeout(function() {
                        c.toggleClear(b)
                    }, 100)
                }
            }, this)).parent().css("position", "relative"), this.$clear.click(a.proxy(this.clear, this)))
        },
        postrender: function() {},
        toggleClear: function() {
            if (this.$clear) {
                var a = this.$input.val().length,
                    b = this.$clear.is(":visible");
                a && !b && this.$clear.show(), !a && b && this.$clear.hide()
            }
        },
        clear: function() {
            this.$clear.hide(), this.$input.val("").focus()
        }
    }), b.defaults = a.extend({}, a.fn.editabletypes.abstractinput.defaults, {
        tpl: '<input type="text">',
        placeholder: null,
        clear: !0
    }), a.fn.editabletypes.text = b
}(window.jQuery),
function(a) {
    "use strict";
    var b = function(a) {
        this.init("textarea", a, b.defaults)
    };
    a.fn.editableutils.inherit(b, a.fn.editabletypes.abstractinput), a.extend(b.prototype, {
        render: function() {
            this.setClass(), this.setAttr("placeholder"), this.setAttr("rows"), this.$input.keydown(function(b) {
                b.ctrlKey && 13 === b.which && a(this).closest("form").submit()
            })
        },
        activate: function() {
            a.fn.editabletypes.text.prototype.activate.call(this)
        }
    }), b.defaults = a.extend({}, a.fn.editabletypes.abstractinput.defaults, {
        tpl: "<textarea></textarea>",
        inputclass: "input-large",
        placeholder: null,
        rows: 7
    }), a.fn.editabletypes.textarea = b
}(window.jQuery),
function(a) {
    "use strict";
    var b = function(a) {
        this.init("select", a, b.defaults)
    };
    a.fn.editableutils.inherit(b, a.fn.editabletypes.list), a.extend(b.prototype, {
        renderList: function() {
            this.$input.empty();
            var b = function(c, d) {
                var e;
                if (a.isArray(d))
                    for (var f = 0; f < d.length; f++) e = {}, d[f].children ? (e.label = d[f].text, c.append(b(a("<optgroup>", e), d[f].children))) : (e.value = d[f].value, d[f].disabled && (e.disabled = !0), c.append(a("<option>", e).text(d[f].text)));
                return c
            };
            b(this.$input, this.sourceData), this.setClass(), this.$input.on("keydown.editable", function(b) {
                13 === b.which && a(this).closest("form").submit()
            })
        },
        value2htmlFinal: function(b, c) {
            var d = "",
                e = a.fn.editableutils.itemsByValue(b, this.sourceData);
            e.length && (d = e[0].text), a.fn.editabletypes.abstractinput.prototype.value2html.call(this, d, c)
        },
        autosubmit: function() {
            this.$input.off("keydown.editable").on("change.editable", function() {
                a(this).closest("form").submit()
            })
        }
    }), b.defaults = a.extend({}, a.fn.editabletypes.list.defaults, {
        tpl: "<select></select>"
    }), a.fn.editabletypes.select = b
}(window.jQuery),
function(a) {
    "use strict";
    var b = function(a) {
        this.init("checklist", a, b.defaults)
    };
    a.fn.editableutils.inherit(b, a.fn.editabletypes.list), a.extend(b.prototype, {
        renderList: function() {
            var b;
            if (this.$tpl.empty(), a.isArray(this.sourceData)) {
                for (var c = 0; c < this.sourceData.length; c++) b = a("<label>").append(a("<input>", {
                    type: "checkbox",
                    value: this.sourceData[c].value
                })).append(a("<span>").text(" " + this.sourceData[c].text)), a("<div>").append(b).appendTo(this.$tpl);
                this.$input = this.$tpl.find('input[type="checkbox"]'), this.setClass()
            }
        },
        value2str: function(b) {
            return a.isArray(b) ? b.sort().join(a.trim(this.options.separator)) : ""
        },
        str2value: function(b) {
            var c, d = null;
            return "string" == typeof b && b.length ? (c = new RegExp("\\s*" + a.trim(this.options.separator) + "\\s*"), d = b.split(c)) : d = a.isArray(b) ? b : [b], d
        },
        value2input: function(b) {
            this.$input.prop("checked", !1), a.isArray(b) && b.length && this.$input.each(function(c, d) {
                var e = a(d);
                a.each(b, function(a, b) {
                    e.val() == b && e.prop("checked", !0)
                })
            })
        },
        input2value: function() {
            var b = [];
            return this.$input.filter(":checked").each(function(c, d) {
                b.push(a(d).val())
            }), b
        },
        value2htmlFinal: function(b, c) {
            var d = [],
                e = a.fn.editableutils.itemsByValue(b, this.sourceData),
                f = this.options.escape;
            e.length ? (a.each(e, function(b, c) {
                var e = f ? a.fn.editableutils.escape(c.text) : c.text;
                d.push(e)
            }), a(c).html(d.join("<br>"))) : a(c).empty()
        },
        activate: function() {
            this.$input.first().focus()
        },
        autosubmit: function() {
            this.$input.on("keydown", function(b) {
                13 === b.which && a(this).closest("form").submit()
            })
        }
    }), b.defaults = a.extend({}, a.fn.editabletypes.list.defaults, {
        tpl: '<div class="editable-checklist"></div>',
        inputclass: null,
        separator: ","
    }), a.fn.editabletypes.checklist = b
}(window.jQuery),
function(a) {
    "use strict";
    var b = function(a) {
        this.init("password", a, b.defaults)
    };
    a.fn.editableutils.inherit(b, a.fn.editabletypes.text), a.extend(b.prototype, {
        value2html: function(b, c) {
            b ? a(c).text("[hidden]") : a(c).empty()
        },
        html2value: function() {
            return null
        }
    }), b.defaults = a.extend({}, a.fn.editabletypes.text.defaults, {
        tpl: '<input type="password">'
    }), a.fn.editabletypes.password = b
}(window.jQuery),
function(a) {
    "use strict";
    var b = function(a) {
        this.init("email", a, b.defaults)
    };
    a.fn.editableutils.inherit(b, a.fn.editabletypes.text), b.defaults = a.extend({}, a.fn.editabletypes.text.defaults, {
        tpl: '<input type="email">'
    }), a.fn.editabletypes.email = b
}(window.jQuery),
function(a) {
    "use strict";
    var b = function(a) {
        this.init("url", a, b.defaults)
    };
    a.fn.editableutils.inherit(b, a.fn.editabletypes.text), b.defaults = a.extend({}, a.fn.editabletypes.text.defaults, {
        tpl: '<input type="url">'
    }), a.fn.editabletypes.url = b
}(window.jQuery),
function(a) {
    "use strict";
    var b = function(a) {
        this.init("tel", a, b.defaults)
    };
    a.fn.editableutils.inherit(b, a.fn.editabletypes.text), b.defaults = a.extend({}, a.fn.editabletypes.text.defaults, {
        tpl: '<input type="tel">'
    }), a.fn.editabletypes.tel = b
}(window.jQuery),
function(a) {
    "use strict";
    var b = function(a) {
        this.init("number", a, b.defaults)
    };
    a.fn.editableutils.inherit(b, a.fn.editabletypes.text), a.extend(b.prototype, {
        render: function() {
            b.superclass.render.call(this), this.setAttr("min"), this.setAttr("max"), this.setAttr("step")
        },
        postrender: function() {
            this.$clear && this.$clear.css({
                right: 24
            })
        }
    }), b.defaults = a.extend({}, a.fn.editabletypes.text.defaults, {
        tpl: '<input type="number">',
        inputclass: "input-mini",
        min: null,
        max: null,
        step: null
    }), a.fn.editabletypes.number = b
}(window.jQuery),
function(a) {
    "use strict";
    var b = function(a) {
        this.init("range", a, b.defaults)
    };
    a.fn.editableutils.inherit(b, a.fn.editabletypes.number), a.extend(b.prototype, {
        render: function() {
            this.$input = this.$tpl.filter("input"), this.setClass(), this.setAttr("min"), this.setAttr("max"), this.setAttr("step"), this.$input.on("input", function() {
                a(this).siblings("output").text(a(this).val())
            })
        },
        activate: function() {
            this.$input.focus()
        }
    }), b.defaults = a.extend({}, a.fn.editabletypes.number.defaults, {
        tpl: '<input type="range"><output style="width: 30px; display: inline-block"></output>',
        inputclass: "input-medium"
    }), a.fn.editabletypes.range = b
}(window.jQuery),
function(a) {
    "use strict";
    var b = function(a) {
        this.init("time", a, b.defaults)
    };
    a.fn.editableutils.inherit(b, a.fn.editabletypes.abstractinput), a.extend(b.prototype, {
        render: function() {
            this.setClass()
        }
    }), b.defaults = a.extend({}, a.fn.editabletypes.abstractinput.defaults, {
        tpl: '<input type="time">'
    }), a.fn.editabletypes.time = b
}(window.jQuery),
function(a) {
    "use strict";
    var b = function(c) {
        if (this.init("select2", c, b.defaults), c.select2 = c.select2 || {}, this.sourceData = null, c.placeholder && (c.select2.placeholder = c.placeholder), !c.select2.tags && c.source) {
            var d = c.source;
            a.isFunction(c.source) && (d = c.source.call(c.scope)), "string" == typeof d ? (c.select2.ajax = c.select2.ajax || {}, c.select2.ajax.data || (c.select2.ajax.data = function(a) {
                return {
                    query: a
                }
            }), c.select2.ajax.results || (c.select2.ajax.results = function(a) {
                return {
                    results: a
                }
            }), c.select2.ajax.url = d) : (this.sourceData = this.convertSource(d), c.select2.data = this.sourceData)
        }
        if (this.options.select2 = a.extend({}, b.defaults.select2, c.select2), this.isMultiple = this.options.select2.tags || this.options.select2.multiple, this.isRemote = "ajax" in this.options.select2, this.idFunc = this.options.select2.id, "function" != typeof this.idFunc) {
            var e = this.idFunc || "id";
            this.idFunc = function(a) {
                return a[e]
            }
        }
        this.formatSelection = this.options.select2.formatSelection, "function" != typeof this.formatSelection && (this.formatSelection = function(a) {
            return a.text
        })
    };
    a.fn.editableutils.inherit(b, a.fn.editabletypes.abstractinput), a.extend(b.prototype, {
        render: function() {
            this.setClass(), this.isRemote && this.$input.on("select2-loaded", a.proxy(function(a) {
                this.sourceData = a.items.results
            }, this)), this.isMultiple && this.$input.on("change", function() {
                a(this).closest("form").parent().triggerHandler("resize")
            })
        },
        value2html: function(c, d) {
            var e, f = "",
                g = this;
            this.options.select2.tags ? e = c : this.sourceData && (e = a.fn.editableutils.itemsByValue(c, this.sourceData, this.idFunc)), a.isArray(e) ? (f = [], a.each(e, function(a, b) {
                f.push(b && "object" == typeof b ? g.formatSelection(b) : b)
            })) : e && (f = g.formatSelection(e)), f = a.isArray(f) ? f.join(this.options.viewseparator) : f, b.superclass.value2html.call(this, f, d)
        },
        html2value: function(a) {
            return this.options.select2.tags ? this.str2value(a, this.options.viewseparator) : null
        },
        value2input: function(b) {
            if (a.isArray(b) && (b = b.join(this.getSeparator())), this.$input.data("select2") ? this.$input.val(b).trigger("change", !0) : (this.$input.val(b), this.$input.select2(this.options.select2)), this.isRemote && !this.isMultiple && !this.options.select2.initSelection) {
                var c = this.options.select2.id,
                    d = this.options.select2.formatSelection;
                if (!c && !d) {
                    var e = a(this.options.scope);
                    if (!e.data("editable").isEmpty) {
                        var f = {
                            id: b,
                            text: e.text()
                        };
                        this.$input.select2("data", f)
                    }
                }
            }
        },
        input2value: function() {
            return this.$input.select2("val")
        },
        str2value: function(b, c) {
            if ("string" != typeof b || !this.isMultiple) return b;
            c = c || this.getSeparator();
            var d, e, f;
            if (null === b || b.length < 1) return null;
            for (d = b.split(c), e = 0, f = d.length; f > e; e += 1) d[e] = a.trim(d[e]);
            return d
        },
        autosubmit: function() {
            this.$input.on("change", function(b, c) {
                c || a(this).closest("form").submit()
            })
        },
        getSeparator: function() {
            return this.options.select2.separator || a.fn.select2.defaults.separator
        },
        convertSource: function(b) {
            if (a.isArray(b) && b.length && void 0 !== b[0].value)
                for (var c = 0; c < b.length; c++) void 0 !== b[c].value && (b[c].id = b[c].value, delete b[c].value);
            return b
        },
        destroy: function() {
            this.$input.data("select2") && this.$input.select2("destroy")
        }
    }), b.defaults = a.extend({}, a.fn.editabletypes.abstractinput.defaults, {
        tpl: '<input type="hidden">',
        select2: null,
        placeholder: null,
        source: null,
        viewseparator: ", "
    }), a.fn.editabletypes.select2 = b
}(window.jQuery),
function(a) {
    var b = function(b, c) {
        return this.$element = a(b), this.$element.is("input") ? (this.options = a.extend({}, a.fn.combodate.defaults, c, this.$element.data()), this.init(), void 0) : (a.error("Combodate should be applied to INPUT element"), void 0)
    };
    b.prototype = {
        constructor: b,
        init: function() {
            this.map = {
                day: ["D", "date"],
                month: ["M", "month"],
                year: ["Y", "year"],
                hour: ["[Hh]", "hours"],
                minute: ["m", "minutes"],
                second: ["s", "seconds"],
                ampm: ["[Aa]", ""]
            }, this.$widget = a('<span class="combodate"></span>').html(this.getTemplate()), this.initCombos(), this.$widget.on("change", "select", a.proxy(function(b) {
                this.$element.val(this.getValue()).change(), this.options.smartDays && (a(b.target).is(".month") || a(b.target).is(".year")) && this.fillCombo("day")
            }, this)), this.$widget.find("select").css("width", "auto"), this.$element.hide().after(this.$widget), this.setValue(this.$element.val() || this.options.value)
        },
        getTemplate: function() {
            var b = this.options.template;
            return a.each(this.map, function(a, c) {
                c = c[0];
                var d = new RegExp(c + "+"),
                    e = c.length > 1 ? c.substring(1, 2) : c;
                b = b.replace(d, "{" + e + "}")
            }), b = b.replace(/ /g, "&nbsp;"), a.each(this.map, function(a, c) {
                c = c[0];
                var d = c.length > 1 ? c.substring(1, 2) : c;
                b = b.replace("{" + d + "}", '<select class="' + a + '"></select>')
            }), b
        },
        initCombos: function() {
            for (var a in this.map) {
                var b = this.$widget.find("." + a);
                this["$" + a] = b.length ? b : null, this.fillCombo(a)
            }
        },
        fillCombo: function(a) {
            var b = this["$" + a];
            if (b) {
                var c = "fill" + a.charAt(0).toUpperCase() + a.slice(1),
                    d = this[c](),
                    e = b.val();
                b.empty();
                for (var f = 0; f < d.length; f++) b.append('<option value="' + d[f][0] + '">' + d[f][1] + "</option>");
                b.val(e)
            }
        },
        fillCommon: function(a) {
            var b, c = [];
            if ("name" === this.options.firstItem) {
                b = moment.relativeTime || moment.langData()._relativeTime;
                var d = "function" == typeof b[a] ? b[a](1, !0, a, !1) : b[a];
                d = d.split(" ").reverse()[0], c.push(["", d])
            } else "empty" === this.options.firstItem && c.push(["", ""]);
            return c
        },
        fillDay: function() {
            var a, b, c = this.fillCommon("d"),
                d = -1 !== this.options.template.indexOf("DD"),
                e = 31;
            if (this.options.smartDays && this.$month && this.$year) {
                var f = parseInt(this.$month.val(), 10),
                    g = parseInt(this.$year.val(), 10);
                isNaN(f) || isNaN(g) || (e = moment([g, f]).daysInMonth())
            }
            for (b = 1; e >= b; b++) a = d ? this.leadZero(b) : b, c.push([b, a]);
            return c
        },
        fillMonth: function() {
            var a, b, c = this.fillCommon("M"),
                d = -1 !== this.options.template.indexOf("MMMM"),
                e = -1 !== this.options.template.indexOf("MMM"),
                f = -1 !== this.options.template.indexOf("MM");
            for (b = 0; 11 >= b; b++) a = d ? moment().date(1).month(b).format("MMMM") : e ? moment().date(1).month(b).format("MMM") : f ? this.leadZero(b + 1) : b + 1, c.push([b, a]);
            return c
        },
        fillYear: function() {
            var a, b, c = [],
                d = -1 !== this.options.template.indexOf("YYYY");
            for (b = this.options.maxYear; b >= this.options.minYear; b--) a = d ? b : (b + "").substring(2), c[this.options.yearDescending ? "push" : "unshift"]([b, a]);
            return c = this.fillCommon("y").concat(c)
        },
        fillHour: function() {
            var a, b, c = this.fillCommon("h"),
                d = -1 !== this.options.template.indexOf("h"),
                e = (-1 !== this.options.template.indexOf("H"), -1 !== this.options.template.toLowerCase().indexOf("hh")),
                f = d ? 1 : 0,
                g = d ? 12 : 23;
            for (b = f; g >= b; b++) a = e ? this.leadZero(b) : b, c.push([b, a]);
            return c
        },
        fillMinute: function() {
            var a, b, c = this.fillCommon("m"),
                d = -1 !== this.options.template.indexOf("mm");
            for (b = 0; 59 >= b; b += this.options.minuteStep) a = d ? this.leadZero(b) : b, c.push([b, a]);
            return c
        },
        fillSecond: function() {
            var a, b, c = this.fillCommon("s"),
                d = -1 !== this.options.template.indexOf("ss");
            for (b = 0; 59 >= b; b += this.options.secondStep) a = d ? this.leadZero(b) : b, c.push([b, a]);
            return c
        },
        fillAmpm: function() {
            var a = -1 !== this.options.template.indexOf("a"),
                b = (-1 !== this.options.template.indexOf("A"), [
                    ["am", a ? "am" : "AM"],
                    ["pm", a ? "pm" : "PM"]
                ]);
            return b
        },
        getValue: function(b) {
            var c, d = {},
                e = this,
                f = !1;
            return a.each(this.map, function(a) {
                if ("ampm" !== a) {
                    var b = "day" === a ? 1 : 0;
                    return d[a] = e["$" + a] ? parseInt(e["$" + a].val(), 10) : b, isNaN(d[a]) ? (f = !0, !1) : void 0
                }
            }), f ? "" : (this.$ampm && (d.hour = 12 === d.hour ? "am" === this.$ampm.val() ? 0 : 12 : "am" === this.$ampm.val() ? d.hour : d.hour + 12), c = moment([d.year, d.month, d.day, d.hour, d.minute, d.second]), this.highlight(c), b = void 0 === b ? this.options.format : b, null === b ? c.isValid() ? c : null : c.isValid() ? c.format(b) : "")
        },
        setValue: function(b) {
            function c(b, c) {
                var d = {};
                return b.children("option").each(function(b, e) {
                    var f, g = a(e).attr("value");
                    "" !== g && (f = Math.abs(g - c), ("undefined" == typeof d.distance || f < d.distance) && (d = {
                        value: g,
                        distance: f
                    }))
                }), d.value
            }
            if (b) {
                var d = "string" == typeof b ? moment(b, this.options.format) : moment(b),
                    e = this,
                    f = {};
                d.isValid() && (a.each(this.map, function(a, b) {
                    "ampm" !== a && (f[a] = d[b[1]]())
                }), this.$ampm && (f.hour >= 12 ? (f.ampm = "pm", f.hour > 12 && (f.hour -= 12)) : (f.ampm = "am", 0 === f.hour && (f.hour = 12))), a.each(f, function(a, b) {
                    e["$" + a] && ("minute" === a && e.options.minuteStep > 1 && e.options.roundTime && (b = c(e["$" + a], b)), "second" === a && e.options.secondStep > 1 && e.options.roundTime && (b = c(e["$" + a], b)), e["$" + a].val(b))
                }), this.options.smartDays && this.fillCombo("day"), this.$element.val(d.format(this.options.format)).change())
            }
        },
        highlight: function(a) {
            a.isValid() ? this.options.errorClass ? this.$widget.removeClass(this.options.errorClass) : this.$widget.find("select").css("border-color", this.borderColor) : this.options.errorClass ? this.$widget.addClass(this.options.errorClass) : (this.borderColor || (this.borderColor = this.$widget.find("select").css("border-color")), this.$widget.find("select").css("border-color", "red"))
        },
        leadZero: function(a) {
            return 9 >= a ? "0" + a : a
        },
        destroy: function() {
            this.$widget.remove(), this.$element.removeData("combodate").show()
        }
    }, a.fn.combodate = function(c) {
        var d, e = Array.apply(null, arguments);
        return e.shift(), "getValue" === c && this.length && (d = this.eq(0).data("combodate")) ? d.getValue.apply(d, e) : this.each(function() {
            var d = a(this),
                f = d.data("combodate"),
                g = "object" == typeof c && c;
            f || d.data("combodate", f = new b(this, g)), "string" == typeof c && "function" == typeof f[c] && f[c].apply(f, e)
        })
    }, a.fn.combodate.defaults = {
        format: "DD-MM-YYYY HH:mm",
        template: "D / MMM / YYYY   H : mm",
        value: null,
        minYear: 1970,
        maxYear: 2015,
        yearDescending: !0,
        minuteStep: 5,
        secondStep: 1,
        firstItem: "empty",
        errorClass: null,
        roundTime: !0,
        smartDays: !1
    }
}(window.jQuery),
function(a) {
    "use strict";
    var b = function(c) {
        this.init("combodate", c, b.defaults), this.options.viewformat || (this.options.viewformat = this.options.format), c.combodate = a.fn.editableutils.tryParseJson(c.combodate, !0), this.options.combodate = a.extend({}, b.defaults.combodate, c.combodate, {
            format: this.options.format,
            template: this.options.template
        })
    };
    a.fn.editableutils.inherit(b, a.fn.editabletypes.abstractinput), a.extend(b.prototype, {
        render: function() {
            this.$input.combodate(this.options.combodate), "bs3" === a.fn.editableform.engine && this.$input.siblings().find("select").addClass("form-control"), this.options.inputclass && this.$input.siblings().find("select").addClass(this.options.inputclass)
        },
        value2html: function(a, c) {
            var d = a ? a.format(this.options.viewformat) : "";
            b.superclass.value2html.call(this, d, c)
        },
        html2value: function(a) {
            return a ? moment(a, this.options.viewformat) : null
        },
        value2str: function(a) {
            return a ? a.format(this.options.format) : ""
        },
        str2value: function(a) {
            return a ? moment(a, this.options.format) : null
        },
        value2submit: function(a) {
            return this.value2str(a)
        },
        value2input: function(a) {
            this.$input.combodate("setValue", a)
        },
        input2value: function() {
            return this.$input.combodate("getValue", null)
        },
        activate: function() {
            this.$input.siblings(".combodate").find("select").eq(0).focus()
        },
        autosubmit: function() {}
    }), b.defaults = a.extend({}, a.fn.editabletypes.abstractinput.defaults, {
        tpl: '<input type="text">',
        inputclass: null,
        format: "YYYY-MM-DD",
        viewformat: null,
        template: "D / MMM / YYYY",
        combodate: null
    }), a.fn.editabletypes.combodate = b
}(window.jQuery),
function(a) {
    "use strict";
    var b = a.fn.editableform.Constructor.prototype.initInput;
    a.extend(a.fn.editableform.Constructor.prototype, {
        initTemplate: function() {
            this.$form = a(a.fn.editableform.template), this.$form.find(".control-group").addClass("form-group"), this.$form.find(".editable-error-block").addClass("help-block")
        },
        initInput: function() {
            b.apply(this);
            var c = null === this.input.options.inputclass || this.input.options.inputclass === !1,
                d = "input-sm",
                e = "text,select,textarea,password,email,url,tel,number,range,time,typeaheadjs".split(",");
            ~a.inArray(this.input.type, e) && (this.input.$input.addClass("form-control"), c && (this.input.options.inputclass = d, this.input.$input.addClass(d)));
            for (var f = this.$form.find(".editable-buttons"), g = c ? [d] : this.input.options.inputclass.split(" "), h = 0; h < g.length; h++) "input-lg" === g[h].toLowerCase() && f.find("button").removeClass("btn-sm").addClass("btn-lg")
        }
    }), a.fn.editableform.buttons = '<button type="submit" class="btn btn-primary btn-sm editable-submit"><i class="glyphicon glyphicon-ok"></i></button><button type="button" class="btn btn-default btn-sm editable-cancel"><i class="glyphicon glyphicon-remove"></i></button>', a.fn.editableform.errorGroupClass = "has-error", a.fn.editableform.errorBlockClass = null, a.fn.editableform.engine = "bs3"
}(window.jQuery),
function(a) {
    "use strict";
    a.extend(a.fn.editableContainer.Popup.prototype, {
        containerName: "popover",
        containerDataName: "bs.popover",
        innerCss: ".popover-content",
        defaults: a.fn.popover.Constructor.DEFAULTS,
        initContainer: function() {
            a.extend(this.containerOptions, {
                trigger: "manual",
                selector: !1,
                content: " ",
                template: this.defaults.template
            });
            var b;
            this.$element.data("template") && (b = this.$element.data("template"), this.$element.removeData("template")), this.call(this.containerOptions), b && this.$element.data("template", b)
        },
        innerShow: function() {
            this.call("show")
        },
        innerHide: function() {
            this.call("hide")
        },
        innerDestroy: function() {
            this.call("destroy")
        },
        setContainerOption: function(a, b) {
            this.container().options[a] = b
        },
        setPosition: function() {
            ! function() {
                var a = this.tip(),
                    b = "function" == typeof this.options.placement ? this.options.placement.call(this, a[0], this.$element[0]) : this.options.placement,
                    c = /\s?auto?\s?/i,
                    d = c.test(b);
                d && (b = b.replace(c, "") || "top");
                var e = this.getPosition(),
                    f = a[0].offsetWidth,
                    g = a[0].offsetHeight;
                if (d) {
                    var h = this.$element.parent(),
                        i = b,
                        j = document.documentElement.scrollTop || document.body.scrollTop,
                        k = "body" == this.options.container ? window.innerWidth : h.outerWidth(),
                        l = "body" == this.options.container ? window.innerHeight : h.outerHeight(),
                        m = "body" == this.options.container ? 0 : h.offset().left;
                    b = "bottom" == b && e.top + e.height + g - j > l ? "top" : "top" == b && e.top - j - g < 0 ? "bottom" : "right" == b && e.right + f > k ? "left" : "left" == b && e.left - f < m ? "right" : b, a.removeClass(i).addClass(b)
                }
                var n = this.getCalculatedOffset(b, e, f, g);
                this.applyPlacement(n, b)
            }.call(this.container())
        }
    })
}(window.jQuery),
function(a) {
    function b() {
        return new Date(Date.UTC.apply(Date, arguments))
    }

    function c(b, c) {
        var d, e = a(b).data(),
            f = {},
            g = new RegExp("^" + c.toLowerCase() + "([A-Z])"),
            c = new RegExp("^" + c.toLowerCase());
        for (var h in e) c.test(h) && (d = h.replace(g, function(a, b) {
            return b.toLowerCase()
        }), f[d] = e[h]);
        return f
    }

    function d(b) {
        var c = {};
        if (k[b] || (b = b.split("-")[0], k[b])) {
            var d = k[b];
            return a.each(j, function(a, b) {
                b in d && (c[b] = d[b])
            }), c
        }
    }
    var e = function(b, c) {
        this._process_options(c), this.element = a(b), this.isInline = !1, this.isInput = this.element.is("input"), this.component = this.element.is(".date") ? this.element.find(".add-on, .btn") : !1, this.hasInput = this.component && this.element.find("input").length, this.component && 0 === this.component.length && (this.component = !1), this.picker = a(l.template), this._buildEvents(), this._attachEvents(), this.isInline ? this.picker.addClass("datepicker-inline").appendTo(this.element) : this.picker.addClass("datepicker-dropdown dropdown-menu"), this.o.rtl && (this.picker.addClass("datepicker-rtl"), this.picker.find(".prev i, .next i").toggleClass("icon-arrow-left icon-arrow-right")), this.viewMode = this.o.startView, this.o.calendarWeeks && this.picker.find("tfoot th.today").attr("colspan", function(a, b) {
            return parseInt(b) + 1
        }), this._allow_update = !1, this.setStartDate(this.o.startDate), this.setEndDate(this.o.endDate), this.setDaysOfWeekDisabled(this.o.daysOfWeekDisabled), this.fillDow(), this.fillMonths(), this._allow_update = !0, this.update(), this.showMode(), this.isInline && this.show()
    };
    e.prototype = {
        constructor: e,
        _process_options: function(b) {
            this._o = a.extend({}, this._o, b);
            var c = this.o = a.extend({}, this._o),
                d = c.language;
            switch (k[d] || (d = d.split("-")[0], k[d] || (d = i.language)), c.language = d, c.startView) {
                case 2:
                case "decade":
                    c.startView = 2;
                    break;
                case 1:
                case "year":
                    c.startView = 1;
                    break;
                default:
                    c.startView = 0
            }
            switch (c.minViewMode) {
                case 1:
                case "months":
                    c.minViewMode = 1;
                    break;
                case 2:
                case "years":
                    c.minViewMode = 2;
                    break;
                default:
                    c.minViewMode = 0
            }
            c.startView = Math.max(c.startView, c.minViewMode), c.weekStart %= 7, c.weekEnd = (c.weekStart + 6) % 7;
            var e = l.parseFormat(c.format);
            c.startDate !== -1 / 0 && (c.startDate = l.parseDate(c.startDate, e, c.language)), 1 / 0 !== c.endDate && (c.endDate = l.parseDate(c.endDate, e, c.language)), c.daysOfWeekDisabled = c.daysOfWeekDisabled || [], a.isArray(c.daysOfWeekDisabled) || (c.daysOfWeekDisabled = c.daysOfWeekDisabled.split(/[,\s]*/)), c.daysOfWeekDisabled = a.map(c.daysOfWeekDisabled, function(a) {
                return parseInt(a, 10)
            })
        },
        _events: [],
        _secondaryEvents: [],
        _applyEvents: function(a) {
            for (var b, c, d = 0; d < a.length; d++) b = a[d][0], c = a[d][1], b.on(c)
        },
        _unapplyEvents: function(a) {
            for (var b, c, d = 0; d < a.length; d++) b = a[d][0], c = a[d][1], b.off(c)
        },
        _buildEvents: function() {
            this.isInput ? this._events = [
                [this.element, {
                    focus: a.proxy(this.show, this),
                    keyup: a.proxy(this.update, this),
                    keydown: a.proxy(this.keydown, this)
                }]
            ] : this.component && this.hasInput ? this._events = [
                [this.element.find("input"), {
                    focus: a.proxy(this.show, this),
                    keyup: a.proxy(this.update, this),
                    keydown: a.proxy(this.keydown, this)
                }],
                [this.component, {
                    click: a.proxy(this.show, this)
                }]
            ] : this.element.is("div") ? this.isInline = !0 : this._events = [
                [this.element, {
                    click: a.proxy(this.show, this)
                }]
            ], this._secondaryEvents = [
                [this.picker, {
                    click: a.proxy(this.click, this)
                }],
                [a(window), {
                    resize: a.proxy(this.place, this)
                }],
                [a(document), {
                    mousedown: a.proxy(function(a) {
                        this.element.is(a.target) || this.element.find(a.target).size() || this.picker.is(a.target) || this.picker.find(a.target).size() || this.hide()
                    }, this)
                }]
            ]
        },
        _attachEvents: function() {
            this._detachEvents(), this._applyEvents(this._events)
        },
        _detachEvents: function() {
            this._unapplyEvents(this._events)
        },
        _attachSecondaryEvents: function() {
            this._detachSecondaryEvents(), this._applyEvents(this._secondaryEvents)
        },
        _detachSecondaryEvents: function() {
            this._unapplyEvents(this._secondaryEvents)
        },
        _trigger: function(b, c) {
            var d = c || this.date,
                e = new Date(d.getTime() + 6e4 * d.getTimezoneOffset());
            this.element.trigger({
                type: b,
                date: e,
                format: a.proxy(function(a) {
                    var b = a || this.o.format;
                    return l.formatDate(d, b, this.o.language)
                }, this)
            })
        },
        show: function(a) {
            this.isInline || this.picker.appendTo("body"), this.picker.show(), this.height = this.component ? this.component.outerHeight() : this.element.outerHeight(), this.place(), this._attachSecondaryEvents(), a && a.preventDefault(), this._trigger("show")
        },
        hide: function() {
            this.isInline || this.picker.is(":visible") && (this.picker.hide().detach(), this._detachSecondaryEvents(), this.viewMode = this.o.startView, this.showMode(), this.o.forceParse && (this.isInput && this.element.val() || this.hasInput && this.element.find("input").val()) && this.setValue(), this._trigger("hide"))
        },
        remove: function() {
            this.hide(), this._detachEvents(), this._detachSecondaryEvents(), this.picker.remove(), delete this.element.data().datepicker, this.isInput || delete this.element.data().date
        },
        getDate: function() {
            var a = this.getUTCDate();
            return new Date(a.getTime() + 6e4 * a.getTimezoneOffset())
        },
        getUTCDate: function() {
            return this.date
        },
        setDate: function(a) {
            this.setUTCDate(new Date(a.getTime() - 6e4 * a.getTimezoneOffset()))
        },
        setUTCDate: function(a) {
            this.date = a, this.setValue()
        },
        setValue: function() {
            var a = this.getFormattedDate();
            this.isInput ? this.element.val(a) : this.component && this.element.find("input").val(a)
        },
        getFormattedDate: function(a) {
            return void 0 === a && (a = this.o.format), l.formatDate(this.date, a, this.o.language)
        },
        setStartDate: function(a) {
            this._process_options({
                startDate: a
            }), this.update(), this.updateNavArrows()
        },
        setEndDate: function(a) {
            this._process_options({
                endDate: a
            }), this.update(), this.updateNavArrows()
        },
        setDaysOfWeekDisabled: function(a) {
            this._process_options({
                daysOfWeekDisabled: a
            }), this.update(), this.updateNavArrows()
        },
        place: function() {
            if (!this.isInline) {
                var b = parseInt(this.element.parents().filter(function() {
                        return "auto" != a(this).css("z-index")
                    }).first().css("z-index")) + 10,
                    c = this.component ? this.component.parent().offset() : this.element.offset(),
                    d = this.component ? this.component.outerHeight(!0) : this.element.outerHeight(!0);
                this.picker.css({
                    top: c.top + d,
                    left: c.left,
                    zIndex: b
                })
            }
        },
        _allow_update: !0,
        update: function() {
            if (this._allow_update) {
                var a, b = !1;
                arguments && arguments.length && ("string" == typeof arguments[0] || arguments[0] instanceof Date) ? (a = arguments[0], b = !0) : (a = this.isInput ? this.element.val() : this.element.data("date") || this.element.find("input").val(), delete this.element.data().date), this.date = l.parseDate(a, this.o.format, this.o.language), b && this.setValue(), this.viewDate = this.date < this.o.startDate ? new Date(this.o.startDate) : this.date > this.o.endDate ? new Date(this.o.endDate) : new Date(this.date), this.fill()
            }
        },
        fillDow: function() {
            var a = this.o.weekStart,
                b = "<tr>";
            if (this.o.calendarWeeks) {
                var c = '<th class="cw">&nbsp;</th>';
                b += c, this.picker.find(".datepicker-days thead tr:first-child").prepend(c)
            }
            for (; a < this.o.weekStart + 7;) b += '<th class="dow">' + k[this.o.language].daysMin[a++ % 7] + "</th>";
            b += "</tr>", this.picker.find(".datepicker-days thead").append(b)
        },
        fillMonths: function() {
            for (var a = "", b = 0; 12 > b;) a += '<span class="month">' + k[this.o.language].monthsShort[b++] + "</span>";
            this.picker.find(".datepicker-months td").html(a)
        },
        setRange: function(b) {
            b && b.length ? this.range = a.map(b, function(a) {
                return a.valueOf()
            }) : delete this.range, this.fill()
        },
        getClassNames: function(b) {
            var c = [],
                d = this.viewDate.getUTCFullYear(),
                e = this.viewDate.getUTCMonth(),
                f = this.date.valueOf(),
                g = new Date;
            return b.getUTCFullYear() < d || b.getUTCFullYear() == d && b.getUTCMonth() < e ? c.push("old") : (b.getUTCFullYear() > d || b.getUTCFullYear() == d && b.getUTCMonth() > e) && c.push("new"), this.o.todayHighlight && b.getUTCFullYear() == g.getFullYear() && b.getUTCMonth() == g.getMonth() && b.getUTCDate() == g.getDate() && c.push("today"), f && b.valueOf() == f && c.push("active"), (b.valueOf() < this.o.startDate || b.valueOf() > this.o.endDate || -1 !== a.inArray(b.getUTCDay(), this.o.daysOfWeekDisabled)) && c.push("disabled"), this.range && (b > this.range[0] && b < this.range[this.range.length - 1] && c.push("range"), -1 != a.inArray(b.valueOf(), this.range) && c.push("selected")), c
        },
        fill: function() {
            var c, d = new Date(this.viewDate),
                e = d.getUTCFullYear(),
                f = d.getUTCMonth(),
                g = this.o.startDate !== -1 / 0 ? this.o.startDate.getUTCFullYear() : -1 / 0,
                h = this.o.startDate !== -1 / 0 ? this.o.startDate.getUTCMonth() : -1 / 0,
                i = 1 / 0 !== this.o.endDate ? this.o.endDate.getUTCFullYear() : 1 / 0,
                j = 1 / 0 !== this.o.endDate ? this.o.endDate.getUTCMonth() : 1 / 0;
            this.date && this.date.valueOf(), this.picker.find(".datepicker-days thead th.datepicker-switch").text(k[this.o.language].months[f] + " " + e), this.picker.find("tfoot th.today").text(k[this.o.language].today).toggle(this.o.todayBtn !== !1), this.picker.find("tfoot th.clear").text(k[this.o.language].clear).toggle(this.o.clearBtn !== !1), this.updateNavArrows(), this.fillMonths();
            var m = b(e, f - 1, 28, 0, 0, 0, 0),
                n = l.getDaysInMonth(m.getUTCFullYear(), m.getUTCMonth());
            m.setUTCDate(n), m.setUTCDate(n - (m.getUTCDay() - this.o.weekStart + 7) % 7);
            var o = new Date(m);
            o.setUTCDate(o.getUTCDate() + 42), o = o.valueOf();
            for (var p, q = []; m.valueOf() < o;) {
                if (m.getUTCDay() == this.o.weekStart && (q.push("<tr>"), this.o.calendarWeeks)) {
                    var r = new Date(+m + 864e5 * ((this.o.weekStart - m.getUTCDay() - 7) % 7)),
                        s = new Date(+r + 864e5 * ((11 - r.getUTCDay()) % 7)),
                        t = new Date(+(t = b(s.getUTCFullYear(), 0, 1)) + 864e5 * ((11 - t.getUTCDay()) % 7)),
                        u = (s - t) / 864e5 / 7 + 1;
                    q.push('<td class="cw">' + u + "</td>")
                }
                p = this.getClassNames(m), p.push("day");
                var v = this.o.beforeShowDay(m);
                void 0 === v ? v = {} : "boolean" == typeof v ? v = {
                    enabled: v
                } : "string" == typeof v && (v = {
                    classes: v
                }), v.enabled === !1 && p.push("disabled"), v.classes && (p = p.concat(v.classes.split(/\s+/))), v.tooltip && (c = v.tooltip), p = a.unique(p), q.push('<td class="' + p.join(" ") + '"' + (c ? ' title="' + c + '"' : "") + ">" + m.getUTCDate() + "</td>"), m.getUTCDay() == this.o.weekEnd && q.push("</tr>"), m.setUTCDate(m.getUTCDate() + 1)
            }
            this.picker.find(".datepicker-days tbody").empty().append(q.join(""));
            var w = this.date && this.date.getUTCFullYear(),
                x = this.picker.find(".datepicker-months").find("th:eq(1)").text(e).end().find("span").removeClass("active");
            w && w == e && x.eq(this.date.getUTCMonth()).addClass("active"), (g > e || e > i) && x.addClass("disabled"), e == g && x.slice(0, h).addClass("disabled"), e == i && x.slice(j + 1).addClass("disabled"), q = "", e = 10 * parseInt(e / 10, 10);
            var y = this.picker.find(".datepicker-years").find("th:eq(1)").text(e + "-" + (e + 9)).end().find("td");
            e -= 1;
            for (var z = -1; 11 > z; z++) q += '<span class="year' + (-1 == z ? " old" : 10 == z ? " new" : "") + (w == e ? " active" : "") + (g > e || e > i ? " disabled" : "") + '">' + e + "</span>", e += 1;
            y.html(q)
        },
        updateNavArrows: function() {
            if (this._allow_update) {
                var a = new Date(this.viewDate),
                    b = a.getUTCFullYear(),
                    c = a.getUTCMonth();
                switch (this.viewMode) {
                    case 0:
                        this.o.startDate !== -1 / 0 && b <= this.o.startDate.getUTCFullYear() && c <= this.o.startDate.getUTCMonth() ? this.picker.find(".prev").css({
                            visibility: "hidden"
                        }) : this.picker.find(".prev").css({
                            visibility: "visible"
                        }), 1 / 0 !== this.o.endDate && b >= this.o.endDate.getUTCFullYear() && c >= this.o.endDate.getUTCMonth() ? this.picker.find(".next").css({
                            visibility: "hidden"
                        }) : this.picker.find(".next").css({
                            visibility: "visible"
                        });
                        break;
                    case 1:
                    case 2:
                        this.o.startDate !== -1 / 0 && b <= this.o.startDate.getUTCFullYear() ? this.picker.find(".prev").css({
                            visibility: "hidden"
                        }) : this.picker.find(".prev").css({
                            visibility: "visible"
                        }), 1 / 0 !== this.o.endDate && b >= this.o.endDate.getUTCFullYear() ? this.picker.find(".next").css({
                            visibility: "hidden"
                        }) : this.picker.find(".next").css({
                            visibility: "visible"
                        })
                }
            }
        },
        click: function(c) {
            c.preventDefault();
            var d = a(c.target).closest("span, td, th");
            if (1 == d.length) switch (d[0].nodeName.toLowerCase()) {
                case "th":
                    switch (d[0].className) {
                        case "datepicker-switch":
                            this.showMode(1);
                            break;
                        case "prev":
                        case "next":
                            var e = l.modes[this.viewMode].navStep * ("prev" == d[0].className ? -1 : 1);
                            switch (this.viewMode) {
                                case 0:
                                    this.viewDate = this.moveMonth(this.viewDate, e);
                                    break;
                                case 1:
                                case 2:
                                    this.viewDate = this.moveYear(this.viewDate, e)
                            }
                            this.fill();
                            break;
                        case "today":
                            var f = new Date;
                            f = b(f.getFullYear(), f.getMonth(), f.getDate(), 0, 0, 0), this.showMode(-2);
                            var g = "linked" == this.o.todayBtn ? null : "view";
                            this._setDate(f, g);
                            break;
                        case "clear":
                            var h;
                            this.isInput ? h = this.element : this.component && (h = this.element.find("input")), h && h.val("").change(), this._trigger("changeDate"), this.update(), this.o.autoclose && this.hide()
                    }
                    break;
                case "span":
                    if (!d.is(".disabled")) {
                        if (this.viewDate.setUTCDate(1), d.is(".month")) {
                            var i = 1,
                                j = d.parent().find("span").index(d),
                                k = this.viewDate.getUTCFullYear();
                            this.viewDate.setUTCMonth(j), this._trigger("changeMonth", this.viewDate), 1 === this.o.minViewMode && this._setDate(b(k, j, i, 0, 0, 0, 0))
                        } else {
                            var k = parseInt(d.text(), 10) || 0,
                                i = 1,
                                j = 0;
                            this.viewDate.setUTCFullYear(k), this._trigger("changeYear", this.viewDate), 2 === this.o.minViewMode && this._setDate(b(k, j, i, 0, 0, 0, 0))
                        }
                        this.showMode(-1), this.fill()
                    }
                    break;
                case "td":
                    if (d.is(".day") && !d.is(".disabled")) {
                        var i = parseInt(d.text(), 10) || 1,
                            k = this.viewDate.getUTCFullYear(),
                            j = this.viewDate.getUTCMonth();
                        d.is(".old") ? 0 === j ? (j = 11, k -= 1) : j -= 1 : d.is(".new") && (11 == j ? (j = 0, k += 1) : j += 1), this._setDate(b(k, j, i, 0, 0, 0, 0))
                    }
            }
        },
        _setDate: function(a, b) {
            b && "date" != b || (this.date = new Date(a)), b && "view" != b || (this.viewDate = new Date(a)), this.fill(), this.setValue(), this._trigger("changeDate");
            var c;
            this.isInput ? c = this.element : this.component && (c = this.element.find("input")), c && (c.change(), !this.o.autoclose || b && "date" != b || this.hide())
        },
        moveMonth: function(a, b) {
            if (!b) return a;
            var c, d, e = new Date(a.valueOf()),
                f = e.getUTCDate(),
                g = e.getUTCMonth(),
                h = Math.abs(b);
            if (b = b > 0 ? 1 : -1, 1 == h) d = -1 == b ? function() {
                return e.getUTCMonth() == g
            } : function() {
                return e.getUTCMonth() != c
            }, c = g + b, e.setUTCMonth(c), (0 > c || c > 11) && (c = (c + 12) % 12);
            else {
                for (var i = 0; h > i; i++) e = this.moveMonth(e, b);
                c = e.getUTCMonth(), e.setUTCDate(f), d = function() {
                    return c != e.getUTCMonth()
                }
            }
            for (; d();) e.setUTCDate(--f), e.setUTCMonth(c);
            return e
        },
        moveYear: function(a, b) {
            return this.moveMonth(a, 12 * b)
        },
        dateWithinRange: function(a) {
            return a >= this.o.startDate && a <= this.o.endDate
        },
        keydown: function(a) {
            if (this.picker.is(":not(:visible)")) return 27 == a.keyCode && this.show(), void 0;
            var b, c, d, e = !1;
            switch (a.keyCode) {
                case 27:
                    this.hide(), a.preventDefault();
                    break;
                case 37:
                case 39:
                    if (!this.o.keyboardNavigation) break;
                    b = 37 == a.keyCode ? -1 : 1, a.ctrlKey ? (c = this.moveYear(this.date, b), d = this.moveYear(this.viewDate, b)) : a.shiftKey ? (c = this.moveMonth(this.date, b), d = this.moveMonth(this.viewDate, b)) : (c = new Date(this.date), c.setUTCDate(this.date.getUTCDate() + b), d = new Date(this.viewDate), d.setUTCDate(this.viewDate.getUTCDate() + b)), this.dateWithinRange(c) && (this.date = c, this.viewDate = d, this.setValue(), this.update(), a.preventDefault(), e = !0);
                    break;
                case 38:
                case 40:
                    if (!this.o.keyboardNavigation) break;
                    b = 38 == a.keyCode ? -1 : 1, a.ctrlKey ? (c = this.moveYear(this.date, b), d = this.moveYear(this.viewDate, b)) : a.shiftKey ? (c = this.moveMonth(this.date, b), d = this.moveMonth(this.viewDate, b)) : (c = new Date(this.date), c.setUTCDate(this.date.getUTCDate() + 7 * b), d = new Date(this.viewDate), d.setUTCDate(this.viewDate.getUTCDate() + 7 * b)), this.dateWithinRange(c) && (this.date = c, this.viewDate = d, this.setValue(), this.update(), a.preventDefault(), e = !0);
                    break;
                case 13:
                    this.hide(), a.preventDefault();
                    break;
                case 9:
                    this.hide()
            }
            if (e) {
                this._trigger("changeDate");
                var f;
                this.isInput ? f = this.element : this.component && (f = this.element.find("input")), f && f.change()
            }
        },
        showMode: function(a) {
            a && (this.viewMode = Math.max(this.o.minViewMode, Math.min(2, this.viewMode + a))), this.picker.find(">div").hide().filter(".datepicker-" + l.modes[this.viewMode].clsName).css("display", "block"), this.updateNavArrows()
        }
    };
    var f = function(b, c) {
        this.element = a(b), this.inputs = a.map(c.inputs, function(a) {
            return a.jquery ? a[0] : a
        }), delete c.inputs, a(this.inputs).datepicker(c).bind("changeDate", a.proxy(this.dateUpdated, this)), this.pickers = a.map(this.inputs, function(b) {
            return a(b).data("datepicker")
        }), this.updateDates()
    };
    f.prototype = {
        updateDates: function() {
            this.dates = a.map(this.pickers, function(a) {
                return a.date
            }), this.updateRanges()
        },
        updateRanges: function() {
            var b = a.map(this.dates, function(a) {
                return a.valueOf()
            });
            a.each(this.pickers, function(a, c) {
                c.setRange(b)
            })
        },
        dateUpdated: function(b) {
            var c = a(b.target).data("datepicker"),
                d = c.getUTCDate(),
                e = a.inArray(b.target, this.inputs),
                f = this.inputs.length;
            if (-1 != e) {
                if (d < this.dates[e])
                    for (; e >= 0 && d < this.dates[e];) this.pickers[e--].setUTCDate(d);
                else if (d > this.dates[e])
                    for (; f > e && d > this.dates[e];) this.pickers[e++].setUTCDate(d);
                this.updateDates()
            }
        },
        remove: function() {
            a.map(this.pickers, function(a) {
                a.remove()
            }), delete this.element.data().datepicker
        }
    };
    var g = a.fn.datepicker,
        h = a.fn.datepicker = function(b) {
            var g = Array.apply(null, arguments);
            g.shift();
            var h;
            return this.each(function() {
                var j = a(this),
                    k = j.data("datepicker"),
                    l = "object" == typeof b && b;
                if (!k) {
                    var m = c(this, "date"),
                        n = a.extend({}, i, m, l),
                        o = d(n.language),
                        p = a.extend({}, i, o, m, l);
                    if (j.is(".input-daterange") || p.inputs) {
                        var q = {
                            inputs: p.inputs || j.find("input").toArray()
                        };
                        j.data("datepicker", k = new f(this, a.extend(p, q)))
                    } else j.data("datepicker", k = new e(this, p))
                }
                return "string" == typeof b && "function" == typeof k[b] && (h = k[b].apply(k, g), void 0 !== h) ? !1 : void 0
            }), void 0 !== h ? h : this
        },
        i = a.fn.datepicker.defaults = {
            autoclose: !1,
            beforeShowDay: a.noop,
            calendarWeeks: !1,
            clearBtn: !1,
            daysOfWeekDisabled: [],
            endDate: 1 / 0,
            forceParse: !0,
            format: "mm/dd/yyyy",
            keyboardNavigation: !0,
            language: "en",
            minViewMode: 0,
            rtl: !1,
            startDate: -1 / 0,
            startView: 0,
            todayBtn: !1,
            todayHighlight: !1,
            weekStart: 0
        },
        j = a.fn.datepicker.locale_opts = ["format", "rtl", "weekStart"];
    a.fn.datepicker.Constructor = e;
    var k = a.fn.datepicker.dates = {
            en: {
                days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
                months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                today: "Today",
                clear: "Clear"
            }
        },
        l = {
            modes: [{
                clsName: "days",
                navFnc: "Month",
                navStep: 1
            }, {
                clsName: "months",
                navFnc: "FullYear",
                navStep: 1
            }, {
                clsName: "years",
                navFnc: "FullYear",
                navStep: 10
            }],
            isLeapYear: function(a) {
                return 0 === a % 4 && 0 !== a % 100 || 0 === a % 400
            },
            getDaysInMonth: function(a, b) {
                return [31, l.isLeapYear(a) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][b]
            },
            validParts: /dd?|DD?|mm?|MM?|yy(?:yy)?/g,
            nonpunctuation: /[^ -\/:-@\[\u3400-\u9fff-`{-~\t\n\r]+/g,
            parseFormat: function(a) {
                var b = a.replace(this.validParts, "\0").split("\0"),
                    c = a.match(this.validParts);
                if (!b || !b.length || !c || 0 === c.length) throw new Error("Invalid date format.");
                return {
                    separators: b,
                    parts: c
                }
            },
            parseDate: function(c, d, f) {
                if (c instanceof Date) return c;
                if ("string" == typeof d && (d = l.parseFormat(d)), /^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/.test(c)) {
                    var g, h, i = /([\-+]\d+)([dmwy])/,
                        j = c.match(/([\-+]\d+)([dmwy])/g);
                    c = new Date;
                    for (var m = 0; m < j.length; m++) switch (g = i.exec(j[m]), h = parseInt(g[1]), g[2]) {
                        case "d":
                            c.setUTCDate(c.getUTCDate() + h);
                            break;
                        case "m":
                            c = e.prototype.moveMonth.call(e.prototype, c, h);
                            break;
                        case "w":
                            c.setUTCDate(c.getUTCDate() + 7 * h);
                            break;
                        case "y":
                            c = e.prototype.moveYear.call(e.prototype, c, h)
                    }
                    return b(c.getUTCFullYear(), c.getUTCMonth(), c.getUTCDate(), 0, 0, 0)
                }
                var n, o, g, j = c && c.match(this.nonpunctuation) || [],
                    c = new Date,
                    p = {},
                    q = ["yyyy", "yy", "M", "MM", "m", "mm", "d", "dd"],
                    r = {
                        yyyy: function(a, b) {
                            return a.setUTCFullYear(b)
                        },
                        yy: function(a, b) {
                            return a.setUTCFullYear(2e3 + b)
                        },
                        m: function(a, b) {
                            for (b -= 1; 0 > b;) b += 12;
                            for (b %= 12, a.setUTCMonth(b); a.getUTCMonth() != b;) a.setUTCDate(a.getUTCDate() - 1);
                            return a
                        },
                        d: function(a, b) {
                            return a.setUTCDate(b)
                        }
                    };
                r.M = r.MM = r.mm = r.m, r.dd = r.d, c = b(c.getFullYear(), c.getMonth(), c.getDate(), 0, 0, 0);
                var s = d.parts.slice();
                if (j.length != s.length && (s = a(s).filter(function(b, c) {
                        return -1 !== a.inArray(c, q)
                    }).toArray()), j.length == s.length) {
                    for (var m = 0, t = s.length; t > m; m++) {
                        if (n = parseInt(j[m], 10), g = s[m], isNaN(n)) switch (g) {
                            case "MM":
                                o = a(k[f].months).filter(function() {
                                    var a = this.slice(0, j[m].length),
                                        b = j[m].slice(0, a.length);
                                    return a == b
                                }), n = a.inArray(o[0], k[f].months) + 1;
                                break;
                            case "M":
                                o = a(k[f].monthsShort).filter(function() {
                                    var a = this.slice(0, j[m].length),
                                        b = j[m].slice(0, a.length);
                                    return a == b
                                }), n = a.inArray(o[0], k[f].monthsShort) + 1
                        }
                        p[g] = n
                    }
                    for (var u, m = 0; m < q.length; m++) u = q[m], u in p && !isNaN(p[u]) && r[u](c, p[u])
                }
                return c
            },
            formatDate: function(b, c, d) {
                "string" == typeof c && (c = l.parseFormat(c));
                var e = {
                    d: b.getUTCDate(),
                    D: k[d].daysShort[b.getUTCDay()],
                    DD: k[d].days[b.getUTCDay()],
                    m: b.getUTCMonth() + 1,
                    M: k[d].monthsShort[b.getUTCMonth()],
                    MM: k[d].months[b.getUTCMonth()],
                    yy: b.getUTCFullYear().toString().substring(2),
                    yyyy: b.getUTCFullYear()
                };
                e.dd = (e.d < 10 ? "0" : "") + e.d, e.mm = (e.m < 10 ? "0" : "") + e.m;
                for (var b = [], f = a.extend([], c.separators), g = 0, h = c.parts.length; h >= g; g++) f.length && b.push(f.shift()), b.push(e[c.parts[g]]);
                return b.join("")
            },
            headTemplate: '<thead><tr><th class="prev"><i class="icon-arrow-left"/></th><th colspan="5" class="datepicker-switch"></th><th class="next"><i class="icon-arrow-right"/></th></tr></thead>',
            contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>',
            footTemplate: '<tfoot><tr><th colspan="7" class="today"></th></tr><tr><th colspan="7" class="clear"></th></tr></tfoot>'
        };
    l.template = '<div class="datepicker"><div class="datepicker-days"><table class=" table-condensed">' + l.headTemplate + "<tbody></tbody>" + l.footTemplate + "</table>" + "</div>" + '<div class="datepicker-months">' + '<table class="table-condensed">' + l.headTemplate + l.contTemplate + l.footTemplate + "</table>" + "</div>" + '<div class="datepicker-years">' + '<table class="table-condensed">' + l.headTemplate + l.contTemplate + l.footTemplate + "</table>" + "</div>" + "</div>", a.fn.datepicker.DPGlobal = l, a.fn.datepicker.noConflict = function() {
        return a.fn.datepicker = g, this
    }, a(document).on("focus.datepicker.data-api click.datepicker.data-api", '[data-provide="datepicker"]', function(b) {
        var c = a(this);
        c.data("datepicker") || (b.preventDefault(), h.call(c, "show"))
    }), a(function() {
        h.call(a('[data-provide="datepicker-inline"]'))
    })
}(window.jQuery),
function(a) {
    "use strict";
    a.fn.bdatepicker = a.fn.datepicker.noConflict(), a.fn.datepicker || (a.fn.datepicker = a.fn.bdatepicker);
    var b = function(a) {
        this.init("date", a, b.defaults), this.initPicker(a, b.defaults)
    };
    a.fn.editableutils.inherit(b, a.fn.editabletypes.abstractinput), a.extend(b.prototype, {
        initPicker: function(b, c) {
            this.options.viewformat || (this.options.viewformat = this.options.format), b.datepicker = a.fn.editableutils.tryParseJson(b.datepicker, !0), this.options.datepicker = a.extend({}, c.datepicker, b.datepicker, {
                format: this.options.viewformat
            }), this.options.datepicker.language = this.options.datepicker.language || "en", this.dpg = a.fn.bdatepicker.DPGlobal, this.parsedFormat = this.dpg.parseFormat(this.options.format), this.parsedViewFormat = this.dpg.parseFormat(this.options.viewformat)
        },
        render: function() {
            this.$input.bdatepicker(this.options.datepicker), this.options.clear && (this.$clear = a('<a href="#"></a>').html(this.options.clear).click(a.proxy(function(a) {
                a.preventDefault(), a.stopPropagation(), this.clear()
            }, this)), this.$tpl.parent().append(a('<div class="editable-clear">').append(this.$clear)))
        },
        value2html: function(a, c) {
            var d = a ? this.dpg.formatDate(a, this.parsedViewFormat, this.options.datepicker.language) : "";
            b.superclass.value2html.call(this, d, c)
        },
        html2value: function(a) {
            return this.parseDate(a, this.parsedViewFormat)
        },
        value2str: function(a) {
            return a ? this.dpg.formatDate(a, this.parsedFormat, this.options.datepicker.language) : ""
        },
        str2value: function(a) {
            return this.parseDate(a, this.parsedFormat)
        },
        value2submit: function(a) {
            return this.value2str(a)
        },
        value2input: function(a) {
            this.$input.bdatepicker("update", a)
        },
        input2value: function() {
            return this.$input.data("datepicker").date
        },
        activate: function() {},
        clear: function() {
            this.$input.data("datepicker").date = null, this.$input.find(".active").removeClass("active"), this.options.showbuttons || this.$input.closest("form").submit()
        },
        autosubmit: function() {
            this.$input.on("mouseup", ".day", function(b) {
                if (!a(b.currentTarget).is(".old") && !a(b.currentTarget).is(".new")) {
                    var c = a(this).closest("form");
                    setTimeout(function() {
                        c.submit()
                    }, 200)
                }
            })
        },
        parseDate: function(a, b) {
            var c, d = null;
            return a && (d = this.dpg.parseDate(a, b, this.options.datepicker.language), "string" == typeof a && (c = this.dpg.formatDate(d, b, this.options.datepicker.language), a !== c && (d = null))), d
        }
    }), b.defaults = a.extend({}, a.fn.editabletypes.abstractinput.defaults, {
        tpl: '<div class="editable-date well"></div>',
        inputclass: null,
        format: "yyyy-mm-dd",
        viewformat: null,
        datepicker: {
            weekStart: 0,
            startView: 0,
            minViewMode: 0,
            autoclose: !1
        },
        clear: "&times; clear"
    }), a.fn.editabletypes.date = b
}(window.jQuery),
function(a) {
    "use strict";
    var b = function(a) {
        this.init("datefield", a, b.defaults), this.initPicker(a, b.defaults)
    };
    a.fn.editableutils.inherit(b, a.fn.editabletypes.date), a.extend(b.prototype, {
        render: function() {
            this.$input = this.$tpl.find("input"), this.setClass(), this.setAttr("placeholder"), this.$tpl.bdatepicker(this.options.datepicker), this.$input.off("focus keydown"), this.$input.keyup(a.proxy(function() {
                this.$tpl.removeData("date"), this.$tpl.bdatepicker("update")
            }, this))
        },
        value2input: function(a) {
            this.$input.val(a ? this.dpg.formatDate(a, this.parsedViewFormat, this.options.datepicker.language) : ""), this.$tpl.bdatepicker("update")
        },
        input2value: function() {
            return this.html2value(this.$input.val())
        },
        activate: function() {
            a.fn.editabletypes.text.prototype.activate.call(this)
        },
        autosubmit: function() {}
    }), b.defaults = a.extend({}, a.fn.editabletypes.date.defaults, {
        tpl: '<div class="input-append date"><input type="text"/><span class="add-on"><i class="icon-th"></i></span></div>',
        inputclass: "input-small",
        datepicker: {
            weekStart: 0,
            startView: 0,
            minViewMode: 0,
            autoclose: !0
        }
    }), a.fn.editabletypes.datefield = b
}(window.jQuery),
function(a) {
    "use strict";
    var b = function(a) {
        this.init("datetime", a, b.defaults), this.initPicker(a, b.defaults)
    };
    a.fn.editableutils.inherit(b, a.fn.editabletypes.abstractinput), a.extend(b.prototype, {
        initPicker: function(b, c) {
            this.options.viewformat || (this.options.viewformat = this.options.format), b.datetimepicker = a.fn.editableutils.tryParseJson(b.datetimepicker, !0), this.options.datetimepicker = a.extend({}, c.datetimepicker, b.datetimepicker, {
                format: this.options.viewformat
            }), this.options.datetimepicker.language = this.options.datetimepicker.language || "en", this.dpg = a.fn.datetimepicker.DPGlobal, this.parsedFormat = this.dpg.parseFormat(this.options.format, this.options.formatType), this.parsedViewFormat = this.dpg.parseFormat(this.options.viewformat, this.options.formatType)
        },
        render: function() {
            this.$input.datetimepicker(this.options.datetimepicker), this.$input.on("changeMode", function() {
                var b = a(this).closest("form").parent();
                setTimeout(function() {
                    b.triggerHandler("resize")
                }, 0)
            }), this.options.clear && (this.$clear = a('<a href="#"></a>').html(this.options.clear).click(a.proxy(function(a) {
                a.preventDefault(), a.stopPropagation(), this.clear()
            }, this)), this.$tpl.parent().append(a('<div class="editable-clear">').append(this.$clear)))
        },
        value2html: function(a, c) {
            var d = a ? this.dpg.formatDate(this.toUTC(a), this.parsedViewFormat, this.options.datetimepicker.language, this.options.formatType) : "";
            return c ? (b.superclass.value2html.call(this, d, c), void 0) : d
        },
        html2value: function(a) {
            var b = this.parseDate(a, this.parsedViewFormat);
            return b ? this.fromUTC(b) : null
        },
        value2str: function(a) {
            return a ? this.dpg.formatDate(this.toUTC(a), this.parsedFormat, this.options.datetimepicker.language, this.options.formatType) : ""
        },
        str2value: function(a) {
            var b = this.parseDate(a, this.parsedFormat);
            return b ? this.fromUTC(b) : null
        },
        value2submit: function(a) {
            return this.value2str(a)
        },
        value2input: function(a) {
            a && this.$input.data("datetimepicker").setDate(a)
        },
        input2value: function() {
            var a = this.$input.data("datetimepicker");
            return a.date ? a.getDate() : null
        },
        activate: function() {},
        clear: function() {
            this.$input.data("datetimepicker").date = null, this.$input.find(".active").removeClass("active"), this.options.showbuttons || this.$input.closest("form").submit()
        },
        autosubmit: function() {
            this.$input.on("mouseup", ".minute", function() {
                var b = a(this).closest("form");
                setTimeout(function() {
                    b.submit()
                }, 200)
            })
        },
        toUTC: function(a) {
            return a ? new Date(a.valueOf() - 6e4 * a.getTimezoneOffset()) : a
        },
        fromUTC: function(a) {
            return a ? new Date(a.valueOf() + 6e4 * a.getTimezoneOffset()) : a
        },
        parseDate: function(a, b) {
            var c, d = null;
            return a && (d = this.dpg.parseDate(a, b, this.options.datetimepicker.language, this.options.formatType), "string" == typeof a && (c = this.dpg.formatDate(d, b, this.options.datetimepicker.language, this.options.formatType), a !== c && (d = null))), d
        }
    }), b.defaults = a.extend({}, a.fn.editabletypes.abstractinput.defaults, {
        tpl: '<div class="editable-date well"></div>',
        inputclass: null,
        format: "yyyy-mm-dd hh:ii",
        formatType: "standard",
        viewformat: null,
        datetimepicker: {
            todayHighlight: !1,
            autoclose: !1
        },
        clear: "&times; clear"
    }), a.fn.editabletypes.datetime = b
}(window.jQuery),
function(a) {
    "use strict";
    var b = function(a) {
        this.init("datetimefield", a, b.defaults), this.initPicker(a, b.defaults)
    };
    a.fn.editableutils.inherit(b, a.fn.editabletypes.datetime), a.extend(b.prototype, {
        render: function() {
            this.$input = this.$tpl.find("input"), this.setClass(), this.setAttr("placeholder"), this.$tpl.datetimepicker(this.options.datetimepicker), this.$input.off("focus keydown"), this.$input.keyup(a.proxy(function() {
                this.$tpl.removeData("date"), this.$tpl.datetimepicker("update")
            }, this))
        },
        value2input: function(a) {
            this.$input.val(this.value2html(a)), this.$tpl.datetimepicker("update")
        },
        input2value: function() {
            return this.html2value(this.$input.val())
        },
        activate: function() {
            a.fn.editabletypes.text.prototype.activate.call(this)
        },
        autosubmit: function() {}
    }), b.defaults = a.extend({}, a.fn.editabletypes.datetime.defaults, {
        tpl: '<div class="input-append date"><input type="text"/><span class="add-on"><i class="icon-th"></i></span></div>',
        inputclass: "input-medium",
        datetimepicker: {
            todayHighlight: !1,
            autoclose: !0
        }
    }), a.fn.editabletypes.datetimefield = b
}(window.jQuery);
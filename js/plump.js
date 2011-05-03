var plump = (function (Raphael) {
    var plump = {};

    /****************/
    // Helper functions
    Object.size = function (obj) {
        var size = 0;
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };
    Object.extend = function (obj2, obj) {
        // Keeps obj's values, if they exist
        for (var key in obj2) {
            if (obj2.hasOwnProperty(key)) {
                obj[key] = obj[key] || obj2[key];
            }
        }
        return obj;
    };
    /****************/


    var id = 0;
    var icon = plump.icon = function(name, attrs) {
        var attrs = attrs || {},
            none = {fill: "#000", opacity: 0},
            x = attrs.x || 0,
            y = attrs.y || 0;
        attrs.stroke = attrs.stroke || 'none';
        attrs.fill = attrs.fill || '#333';

        // Non-standard attributes
        attrs.size = attrs.size || 24;
        attrs.glow = attrs.glow || 'transparent';
        attrs['glow-width'] = attrs['glow-width'] || 2;
        if (attrs.hover) {
            attrs.hover.duration = attrs.hover.duration || 0;
        }
        var r = Raphael(x-2, y-2, attrs.size + 400, attrs.size + 400),
            s = r.path(ADicons[name]).translate(2, 2).attr({fill: 'none', stroke: attrs.glow, 'stroke-width': attrs['glow-width']}),
        icon = r.path(ADicons[name]).translate(2, 2).attr(attrs),
        target = r.rect(0, 0, 32, 32).attr({stroke:'none'})
              .click(function () {
                  if (attrs.click) {
                    icon.animate(attrs.click, attrs.click.duration);
                  } 
              }).hover(function () {
                  if (attrs.hover) {
                      icon.animate(attrs.hover, attrs.hover.duration);
                  }
                }, function () {
                  icon.stop().attr(attrs);
                });
      return { id: id++
               , icon: icon
               , target: target
               , attrs: attrs
               , name: name
               , setSize: function(width, height) {
                              r.setSize(width, height);
                              return this; 
                          }
               , attr: function(attrs) {
                           icon.attr(attrs);
                           return this;
                       }
               , translate: function(x, y) {
                          target.translate(x,y);
                          s.translate(x,y);
                          icon.translate(x,y);
                          return this;
                       }
               , hover: function(f) {
                          target.hover(f);
                          return this;
                      }
		, rotate: function(degree) {
			icon.rotate(degree);
			return this;
			}
               , draggable: function() { return draggable(this);}
               }

    };

    var row = plump.row = function(icons, attrs) {
        for (var name in icons) {
            if (icons.hasOwnProperty(name)) {
                window[name] = icon(name, Object.extend(attrs, icons[name]));
                attrs.x += 37;
            }
        }
    };

    var column = plump.column = function(icons, attrs) {
        for (var name in icons) {
            if (icons.hasOwnProperty(name)) {
                icon(name, Object.extend(attrs, icons[name]));
                attrs.y += 37;
            }
        }
    };

    var radial = plump.radial = function(icons, attrs) {
        spokes = Object.size(icons);
        angle = 2*Math.PI / spokes;
        orig = {x: attrs.x, y: attrs.x};
        start = 0;
        for (var name in icons) {
            if (icons.hasOwnProperty(name)) {
                attrs.y = orig.y + attrs.r*Math.cos(start)/2;
                attrs.x = orig.x + attrs.r*Math.sin(start)/2;
                icon(name, Object.extend(attrs, icons[name]));
                start += angle;
            }
        }
    };

    var rowList = plump.rowList = function(iconList, attrs) {
      for (var i=0;i<iconList.length;i++) {
        for (var name in iconList[i]) {
          if (iconList[i].hasOwnProperty(name)) {
            icon(name, Object.extend(attrs, iconList[i][name]));
            attrs.x += 37;
          }
        }
      }
    };

    var draggable = plump.draggable = function(icon) {
        var ox = oy = 0;
        var start = function () {
            ox = oy = 0;
        },
        move = function (dx, dy) {
            var trans_x = dx - ox;
            var trans_y = dy - oy;
            icon.translate(trans_x, trans_y);
            ox = dx;
            oy = dy;
        },
        up = function () {
        };
        icon.target.drag(move, start, up);
        return icon;
    };

    /*
    // Display all icons
    for (var name in paths) {
        icon(name, x, y);
        x += 37;
        if (x > 407) {
            x = 0;
            y += 37;
        }
    }
    */

    return plump;
}(Raphael));

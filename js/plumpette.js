var plumpette = (function (Raphael) {
	//Plumpette is a bite-sized version of plump, an icon management library
	var plumpette = {};

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
    var icon = plumpette.icon = function(name, className, parentTarget, attrs) {
        var attrs = attrs || {},
            none = {fill: "#000", opacity: 0},
            x = attrs.x || 0,
            y = attrs.y || 0;
        attrs.stroke = attrs.stroke || 'none';
        attrs.fill = attrs.fill || '#333';

		//Target drawing
		var canvas = $('.'+className)[0];

        // Non-standard attributes
        attrs.size = attrs.size || 24;
		attrs.sizeW = attrs.size || canvas.width();
		attrs.sizeH = attrs.size || canvas.height();
        attrs.glow = attrs.glow || 'transparent';
        attrs['glow-width'] = attrs['glow-width'] || 2;
        if (attrs.hover) {
            attrs.hover.duration = attrs.hover.duration || 0;
        }	
        var r = Raphael(canvas, attrs.sizeW, attrs.sizeH),
            s = r.path(ADicons[name]).translate(2, 2).attr({fill: 'none', stroke: attrs.glow, 'stroke-width': attrs['glow-width']}),
        	icon = r.path(ADicons[name]).translate(2, 2).attr(attrs);
        var target = parentTarget || r.rect(0, 0, attrs.sizeW, attrs.sizeH).attr({stroke:'none'});
        target.click(function () {
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

	var single = plumpette.single = function(icons, className, target, attrs) {
		for (var name in icons) {
			if (icons.hasOwnProperty(name)) {
				icon(name, className, target, Object.extend(attrs, icons[name]));
			}
		}
	};

	return plumpette;
}(Raphael));

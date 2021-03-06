/* 
 * Plumpette is a bite-sized version of plump, an icon management library
 * Created by Kai Chang and Mary Becica, 2011
 * plumpjs.com
 * 
 * */

var plumpette = (function (Raphael) {
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

    var iconSet = plumpette.iconSet = {};

    var id = 0;
    var icon = plumpette.icon = function(name, element, parentTarget, attrs) {
        var attrs = attrs || {},
            none = {fill: "#000", opacity: 0},
            x = attrs.x || 0,
            y = attrs.y || 0;
        attrs.stroke = attrs.stroke || 'none';
        attrs.fill = attrs.fill || '#333';

	//Target drawing
	var paper = element[0],
        offsetX = -(element.outerWidth()-element.width())/2,
        offsetY = -(element.outerHeight()-element.height())/2;

    // Non-standard attributes
    attrs.size = attrs.size || 20;
	attrs.sizeW = attrs.size || paper.width;
	attrs.sizeH = attrs.size || paper.height;
	attrs.offset = [offsetX, offsetY];

    if (attrs.hover) {
        attrs.hover.duration = attrs.hover.duration || 0;
    }	
    // Draw the icons
	var r = Raphael(paper, attrs.sizeW, attrs.sizeH);
        var icon = r.path(plumpette.iconSet[name])
		    .translate(attrs.offset)
		    .attr(attrs)
		    .translate(attrs.translation)
		    .scale(attrs.scale)
		    .rotate(attrs.rotation);
        if (attrs.glow) {
		    icon.glow(attrs.glow);
        }
        
	// Pass along Events
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
		      icon.stop().attr({fill:attrs.fill, stroke:attrs.stroke, opacity:attrs.opacity});
		    });

        // Return object
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
                          icon.translate(x,y);
                          if (s) {
                        	  s.translate(x,y);
                          }
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
               };

        };

	// Make
	var single = plumpette.single = function(icons, element, target, attrs) {
		for (var name in icons) {
			if (icons.hasOwnProperty(name)) {
				icon(name, element, target, Object.extend(attrs, icons[name]));
			}
		}
	};
  
	var starRow = plumpette.starRow = function(icons, element, target, attrs) {
	    var attrs = attrs || {};
	    for (var i=0;i<icons.length;i++) {  
		for (var name in icons[i]) {
		    if (icons[i].hasOwnProperty(name)) {
			element.append("<span class='iconSvg' id='pos"+i+"'></span>");
			icon(name, element.find('#pos'+i), target, Object.extend(attrs, icons[i][name]));
			attrs.x += 12;
		    }
		}
	      }
	};
    
	return plumpette;
}(Raphael));

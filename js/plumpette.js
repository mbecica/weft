/* 
 * Plumpette is a bite-sized version of plump, an icon management library
 * Customized for AppDirect
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

	var id = 0;
    var icon = plumpette.icon = function(name, className, parentTarget, attrs) {
        var attrs = attrs || {},
            none = {fill: "#000", opacity: 0},
            x = attrs.x || 0,
            y = attrs.y || 0;
        attrs.stroke = attrs.stroke || 'none';
        attrs.fill = attrs.fill || '#333';

		//Target drawing
		var paper = className[0],
        offsetX = -(className.outerWidth()-className.width())/2,
        offsetY = -(className.outerHeight()-className.height())/2;

        // Non-standard attributes
        attrs.size = attrs.size || 20;
		    attrs.sizeW = attrs.size || paper.width;
		    attrs.sizeH = attrs.size || paper.height;
        attrs.transW = offsetX;
        attrs.transH = offsetY;
        if (attrs.hover) {
            attrs.hover.duration = attrs.hover.duration || 0;
        }	
        var r = Raphael(paper, attrs.sizeW, attrs.sizeH);
        if (attrs.blur) {
        	var s = r.path(ADicons[name]).attr(attrs).attr({fill:'#ccc'}).scale(.9, .9).blur(attrs.blur);
        }
        var icon = r.path(ADicons[name]).translate(attrs.transW, attrs.transH).attr(attrs);
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

	var single = plumpette.single = function(icons, className, target, attrs) {
		for (var name in icons) {
			if (icons.hasOwnProperty(name)) {
				icon(name, className, target, Object.extend(attrs, icons[name]));
			}
		}
	};
  
  var starRow = plumpette.starRow = function(icons, className, target, attrs) {
    var attrs = attrs || {};
    for (var i=0;i<icons.length;i++) {  
        for (var name in icons[i]) {
            if (icons[i].hasOwnProperty(name)) {
            	className.append("<span class='iconSvg' id='pos"+i+"'></span>");
                icon(name, className.find('#pos'+i), target, Object.extend(attrs, icons[i][name]));
                attrs.x += 12;
            }
        }
      }
    };
    
	return plumpette;
}(Raphael));

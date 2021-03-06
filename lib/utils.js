var __slice = [].slice;
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;

var Utils = {
  getCookie: function(cookies, name) {
    var value = "; " + cookies;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
  },
  functionName: function(fun) {
    var ret = fun.toString();
    ret = ret.substr('function '.length);
    ret = ret.substr(0, ret.indexOf('('));
    return ret.toLowerCase();
  },
  argNamesFun: function(fun) {
    var fnStr = fun.toString().replace(STRIP_COMMENTS, '')
    var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES)
    if (result === null) {
      result = [];
    }
    return result;
  },  
  createFun: function(fun, argArray, target) {
    var args = [target || null].concat(argArray);
    var factoryFunction = fun.bind.apply(fun, args);
    return new factoryFunction();
  },
  toArray: function(args) {
      return Array.prototype.slice.call(args);
  },
  withArray: function(arg) {
    if(!arg) {
      return [];
    }
    return Array.isArray(arg) ? arg : [arg];
  },
  capitalizeFirstLetter: function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
  lowercaseFirstLetter: function(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
  },
  extend: function () {
    var consumer = arguments[0],
        providers = __slice.call(arguments, 1),
        key,
        i,
        provider;

    for (i = 0; i < providers.length; ++i) {
      provider = providers[i];
      for (key in provider) {
        if (provider.hasOwnProperty(key)) {
          consumer[key] = provider[key];
        };
      };
    };
    return consumer;
  },
  clone: function(obj) {
    return JSON.parse(JSON.stringify(obj));
  },
  rstring: function() { 
    return Math.random().toString().slice(2,8); 
  },
  addUrlParams: function (url, params)
  {
    Object.keys(params).forEach(function(key){
      value = params[key];
      var sep = (url.indexOf('?') > -1) ? '&' : '?';
      var keyValue = key + '=' + encodeURIComponent(value);
      if(Array.isArray(value)) {
        keyValue = value.map(function(val){
          return key + '=' + encodeURIComponent(val);
        }).join('&');
      }

      url = url + sep + keyValue;
    });
    return url;
  },
  dataURItoBlob: function(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], {type: mimeString});
    return blob;
  },

  decamelize: function (str) {
    return str.replace(/([a-z](?=[A-Z]))/g, '$1 ');
  },

  camelize: function (str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
      if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
      return index == 0 ? match.toLowerCase() : match.toUpperCase();
    });
  },

  format: function(seconds)
  {
    var hrs = Math.floor(seconds / 3600);
    seconds %= 3600;
    var mns = Math.floor(seconds / 60);
    seconds %= 60;
    var formatedDuration = (hrs < 10 ? "0" : "") + hrs + ":" + (mns < 10 ? "0" : "") + mns + ":" + (seconds < 10 ? "0" : "") + seconds;
    return(formatedDuration);
  },
  /* format date and time for call history */
  formatDateTime: function (dateStr){
    var date = new Date(dateStr);
    var strDate =  (date.getMonth() + 1) + "/" + date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strDate + " - " + strTime;
  },
  getUrlParams: function(url){
    var search = decodeURIComponent(url.substring(url.indexOf('?')+1));
    return search.split("&").reduce(function(obj, keyval){
      var pair = keyval.split('=');
      var key = pair[0];
      var value = pair[1];
      if(value === 'true') {
        value = true;
      } else if(value === 'false') {
        value = false;
      }
      obj[key] = value;
      return obj;
    }, {});
  },
  contains: function(srcObject, dstObject) {
    return Object.keys(this.pick(srcObject, Object.keys(dstObject))).length;
  },

  isValidUsPstn: function(pstn){
    pstn = pstn.replace(/-/g, '').replace(/\(/g, '').replace(/\)/g, '');
    return pstn.match(/^1?\d{10}$/) !== null;
  },

  pick: function(sourceObject, keys) {
    var newObject = {};
    keys.forEach(function(key) {
      if (typeof sourceObject[key] !== 'undefined') {
        newObject[key] = sourceObject[key];
      }
    });
    return newObject;
  },

  getSearchVariables: function(){
    if(typeof window.location === 'undefined') {
      return;
    }
    return this.getUrlParams(window.location.search)
  },
  getSearchVariable: function(variable)
  {
    var searchVars = this.getSearchVariables();
    return searchVars[variable];
  },

  colorNameToHex: function(color){
    if(!color) {
      return false;
    }
    var colors = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
      "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
      "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
      "darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
      "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
      "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
      "firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
      "gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
      "honeydew":"#f0fff0","hotpink":"#ff69b4",
      "indianred ":"#cd5c5c","indigo ":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
      "lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
      "lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
      "lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
      "magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
      "mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
      "navajowhite":"#ffdead","navy":"#000080",
      "oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
      "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
      "red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
      "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
      "tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
      "violet":"#ee82ee",
      "wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
      "yellow":"#ffff00","yellowgreen":"#9acd32","transparent":"transparent"};

    if (typeof colors[color.toLowerCase()] !== 'undefined') {
      return colors[color.toLowerCase()];
    }

    return this.isHexColor(color) ? (color.indexOf("#") !== -1 ? color : "#"+color) : false;
  },

  isHexColor: function(color) {
    return (/(^#?[0-9A-F]{6}$)|(^#?[0-9A-F]{3}$)/i.test(color));
  }

};

module.exports = Utils;
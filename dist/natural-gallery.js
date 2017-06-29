<<<<<<< 0c732c7b9d18ff6790e73c275714b3bcc1897be4
(function(e,t){'object'==typeof exports&&'object'==typeof module?module.exports=t():'function'==typeof define&&define.amd?define('NaturalGallery',[],t):'object'==typeof exports?exports.NaturalGallery=t():e.NaturalGallery=t()})(this,function(){var t=Math.round,e=Math.floor;return function(e){function t(a){if(n[a])return n[a].exports;var i=n[a]={i:a,l:!1,exports:{}};return e[a].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,a){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:a})},t.n=function(e){var n=e&&e.__esModule?function(){return e['default']}:function(){return e};return t.d(n,'a',n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p='',t(t.s=2)}([function(e,t,n){'use strict';n.d(t,'a',function(){return a});var a;(function(e){e.getIcon=function(e){const t=document.createElementNS('http://www.w3.org/2000/svg','svg');return t.setAttribute('viewBox','0 0 100 100'),t.innerHTML='<use xlink:href="#'+e+'"></use>',t},e.debounce=function(e,t=250,n=!1){let a;return function(){let i=this,l=arguments,o=n&&!a;clearTimeout(a),a=setTimeout(function(){a=null,n||e.apply(i,l)},t),o&&e.apply(i,l)}},e.toggleClass=function(e,t){e&&t&&(this.hasClass(e,t)?this.removeClass(e,t):this.addClass(e,t))},e.removeClass=function(e,t){const n=new RegExp('(\\s|^)'+t+'(\\s|$)');e.className=e.className.replace(n,' ').replace(/^\s\s*/,'').replace(/\s\s*$/,'')},e.addClass=function(e,t){this.hasClass(t)||(e.className+=(e.className?' ':'')+t),e.className=e.className.replace(/  +/g,' ').trim()},e.hasClass=function(e,t){return e.className&&new RegExp('(^|\\s)'+t+'(\\s|$)').test(e.className)},e.removeDiacritics=function(e){for(var n=0;n<t.length;n++)e=e.replace(t[n].letters,t[n].base);return e},e.uniqBy=function(e,t){const n=[];return e.forEach(function(e){const a=n.some(function(n){return e[t]==n[t]});a||n.push(e)}),n},e.differenceBy=function(e,t,n){const a=[];return e.forEach(function(e){const i=t.some(function(t){return e[n]==t[n]});i||a.push(e)}),a},e.intersectionBy=function(e,t,n){const a=[];return e.forEach(function(e){const i=t.some(function(t){return e[n]==t[n]});i&&a.push(e)}),a};const t=[{base:'A',letters:/[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g},{base:'AA',letters:/[\uA732]/g},{base:'AE',letters:/[\u00C6\u01FC\u01E2]/g},{base:'AO',letters:/[\uA734]/g},{base:'AU',letters:/[\uA736]/g},{base:'AV',letters:/[\uA738\uA73A]/g},{base:'AY',letters:/[\uA73C]/g},{base:'B',letters:/[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g},{base:'C',letters:/[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g},{base:'D',letters:/[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g},{base:'DZ',letters:/[\u01F1\u01C4]/g},{base:'Dz',letters:/[\u01F2\u01C5]/g},{base:'E',letters:/[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g},{base:'F',letters:/[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g},{base:'G',letters:/[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g},{base:'H',letters:/[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g},{base:'I',letters:/[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g},{base:'J',letters:/[\u004A\u24BF\uFF2A\u0134\u0248]/g},{base:'K',letters:/[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g},{base:'L',letters:/[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g},{base:'LJ',letters:/[\u01C7]/g},{base:'Lj',letters:/[\u01C8]/g},{base:'M',letters:/[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g},{base:'N',letters:/[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g},{base:'NJ',letters:/[\u01CA]/g},{base:'Nj',letters:/[\u01CB]/g},{base:'O',letters:/[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g},{base:'OI',letters:/[\u01A2]/g},{base:'OO',letters:/[\uA74E]/g},{base:'OU',letters:/[\u0222]/g},{base:'P',letters:/[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g},{base:'Q',letters:/[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g},{base:'R',letters:/[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g},{base:'S',letters:/[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g},{base:'T',letters:/[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g},{base:'TZ',letters:/[\uA728]/g},{base:'U',letters:/[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g},{base:'V',letters:/[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g},{base:'VY',letters:/[\uA760]/g},{base:'W',letters:/[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g},{base:'X',letters:/[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g},{base:'Y',letters:/[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g},{base:'Z',letters:/[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g},{base:'a',letters:/[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g},{base:'aa',letters:/[\uA733]/g},{base:'ae',letters:/[\u00E6\u01FD\u01E3]/g},{base:'ao',letters:/[\uA735]/g},{base:'au',letters:/[\uA737]/g},{base:'av',letters:/[\uA739\uA73B]/g},{base:'ay',letters:/[\uA73D]/g},{base:'b',letters:/[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g},{base:'c',letters:/[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g},{base:'d',letters:/[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g},{base:'dz',letters:/[\u01F3\u01C6]/g},{base:'e',letters:/[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g},{base:'f',letters:/[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g},{base:'g',letters:/[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g},{base:'h',letters:/[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g},{base:'hv',letters:/[\u0195]/g},{base:'i',letters:/[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g},{base:'j',letters:/[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g},{base:'k',letters:/[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g},{base:'l',letters:/[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g},{base:'lj',letters:/[\u01C9]/g},{base:'m',letters:/[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g},{base:'n',letters:/[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g},{base:'nj',letters:/[\u01CC]/g},{base:'o',letters:/[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g},{base:'oi',letters:/[\u01A3]/g},{base:'ou',letters:/[\u0223]/g},{base:'oo',letters:/[\uA74F]/g},{base:'p',letters:/[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g},{base:'q',letters:/[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g},{base:'r',letters:/[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g},{base:'s',letters:/[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g},{base:'t',letters:/[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g},{base:'tz',letters:/[\uA729]/g},{base:'u',letters:/[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g},{base:'v',letters:/[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g},{base:'vy',letters:/[\uA761]/g},{base:'w',letters:/[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g},{base:'x',letters:/[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g},{base:'y',letters:/[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g},{base:'z',letters:/[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g}]})(a||(a={}))},function(e,t){'use strict';class n{constructor(e){this.header=e,this._collection=null}isActive(){return null!==this.collection}get collection(){return this._collection}set collection(e){this._collection=e}}t.a=n},function(e,t,n){e.exports=n(3)},function(e,t,n){'use strict';Object.defineProperty(t,'__esModule',{value:!0}),t.add=function(e){return a.a.getInstance().addGallery(e)},t.getById=function(e){a.a.getInstance().getById(e)};var a=n(4),i=n(14),l=n.n(i),o=n(15),s=n.n(o);'undefined'!=typeof naturalGalleries&&naturalGalleries.constructor===Array&&a.a.getInstance().addGalleries(naturalGalleries)},function(e,t,n){'use strict';var a=n(5);class i{constructor(){this.old_scroll_top=0,this.galleries=[],this.bindEvents(),this.pswp=document.getElementsByClassName('pswp')[0]}addGalleries(e=null){e.forEach(function(t,n){e[n]=this.addGallery(t)},this)}addGallery(e){if(e)return e=new a.a(e,this.pswp),this.galleries.push(e),e}static getInstance(){return i.instance?i.instance:new i}getById(e){let t=null;return this.galleries.forEach(function(n){n.id==e&&(t=n)}),t}resize(){this.galleries.forEach(function(e){e.resize()})}bindEvents(){let e=this;document.addEventListener('scroll',function(){if(1==e.galleries.length&&0===e.galleries[0].options.limit){let t=e.galleries[0],n=t.rootElement.offsetTop+t.rootElement.offsetHeight+60,a=(window.pageYOffset||document.documentElement.scrollTop)-(document.documentElement.clientTop||0),i=window.innerHeight,l=a-e.old_scroll_top;e.old_scroll_top=a,0<l&&a+i>n&&e.galleries[0].addElements(1)}})}}t.a=i,i.instance=null},function(t,n,a){'use strict';var i=a(6),l=a(9),o=a(10),s=a(11),r=a(0),d=a(13);class p{constructor(t,n){for(var a in this._options={rowHeight:350,format:'natural',round:3,imagesPerRow:4,margin:3,limit:0,showLabels:'hover',lightbox:!0,minRowsAtStart:2,showCount:!1,searchFilter:!1,categoriesFilter:!1,showNone:!1,showOthers:!1},this._pswpContainer=[],this._collection=[],this._categories=[],this.pswpElement=n,this.options)'undefined'==typeof t.options[a]&&(t.options[a]=this.options[a]);this.options=t.options,this.categories=t.categories?t.categories:[],this.rootElement=document.getElementById(t.id),r.a.addClass(this.rootElement,'natural-gallery'),t.images&&(this.collection=t.images),(this.options.searchFilter||this.options.categoriesFilter||this.options.showCount)&&(this.header=new l.a(this),this.options.searchFilter&&this.header.addFilter(new o.a(this.header)),this.options.categoriesFilter&&this.header.addFilter(new s.a(this.header))),this.render(),this.bodyWidth=e(this.bodyElement.getBoundingClientRect().width)}render(){const t=this;let e=document.createElement('div');r.a.addClass(e,'natural-gallery-noresults'),e.appendChild(r.a.getIcon('icon-noresults'));let n=document.createElement('div');r.a.addClass(n,'natural-gallery-next'),n.appendChild(r.a.getIcon('icon-next')),n.addEventListener('click',function(n){n.preventDefault(),t.addElements()});let a=document.createElement('iframe');a.addEventListener('load',function(){let e=null;this.contentWindow.addEventListener('resize',function(){clearTimeout(e),e=setTimeout(function(){t.resize()},100)})}),this.bodyElement=document.createElement('div'),r.a.addClass(this.bodyElement,'natural-gallery-body'),this.bodyElement.appendChild(e),this.header&&this.rootElement.appendChild(this.header.render()),this.rootElement.appendChild(this.bodyElement),this.rootElement.appendChild(n),this.rootElement.appendChild(a)}appendItems(e){let t=!1;0===this.collection.length&&(t=!0),e.forEach(function(e){this._collection.push(new i.a(e,this))},this),d.a.organize(this),this.header&&this.header.refresh(),t&&this.addElements()}style(){this.collection.forEach(function(e){e.style()})}addElements(e=null){let t=this.collection,n=this.rootElement.getElementsByClassName('natural-gallery-next')[0];if(n.style.display='block',this.pswpContainer.length===t.length)return n.style.display='none',void(0===t.length&&(this.rootElement.getElementsByClassName('natural-gallery-noresults')[0].style.display='block',this.rootElement.getElementsByClassName('natural-gallery-images')[0].style.display='none'));e||(e=this.getRowsPerPage(this));let a=this.pswpContainer.length,l=this.pswpContainer.length?t[a].row+e:e;for(let o,s=a;s<t.length;s++)o=t[s],o.row<l&&(this.pswpContainer.push(o.getPswpItem()),this.bodyElement.appendChild(o.loadElement()),o.bindClick(),o.flash()),this.pswpContainer.length===t.length&&(n.style.display='none');let i=this.rootElement.getElementsByClassName('natural-gallery-noresults')[0];i&&(i.style.display='none');let o=this.rootElement.getElementsByClassName('natural-gallery-images')[0];o&&(o.style.display='block');let s=this.rootElement.getElementsByClassName('natural-gallery-visible')[0];s&&(s.textContent=this.pswpContainer.length+'');let r=this.rootElement.getElementsByClassName('natural-gallery-total')[0];r&&(r.textContent=t.length+'')}getRowsPerPage(t){if(this.options.limit)return this.options.limit;let n=window.outerHeight,a=n-t.bodyElement.offsetTop,i=e(a/(0.7*this.options.rowHeight));return i<this.options.minRowsAtStart?this.options.minRowsAtStart:i}resize(){let t=e(this.bodyElement.getBoundingClientRect().width);if(t!=this.bodyWidth){this.bodyWidth=t,d.a.organize(this);let e=this.collection[this.pswpContainer.length-1].row+1;this.reset(),this.addElements(e)}}refresh(){this.reset(),d.a.organize(this),this.addElements()}reset(){this.pswpContainer=[],this._collection.forEach(function(e){e.remove()});let e=this.rootElement.getElementsByClassName('natural-gallery-noresults')[0];e&&(e.style.display='none')}set images(e){this.collection=e}get id(){return this._id}set id(e){this._id=e}get pswpContainer(){return this._pswpContainer}set pswpContainer(e){this._pswpContainer=e}get collection(){let e=this.header&&this.header.isFiltered()?this.header.collection:this._collection;return this.cleanCollection(e)}getOriginalCollection(){return this.cleanCollection(this._collection)}set collection(e){this._collection=[],this.appendItems(e)}get bodyWidth(){return this._bodyWidth}set bodyWidth(e){this._bodyWidth=e}get bodyElement(){return this._bodyElement}set bodyElement(e){this._bodyElement=e}get rootElement(){return this._rootElement}set rootElement(e){this._rootElement=e}get pswpApi(){return this._pswpApi}set pswpApi(e){this._pswpApi=e}get pswpElement(){return this._pswpElement}set pswpElement(e){this._pswpElement=e}get options(){return this._options}set options(e){this._options=e}get header(){return this._header}set header(e){this._header=e}get categories(){return this._categories}set categories(e){this._categories=e}}n.a=p},function(e,t,n){'use strict';var a=n(0),i=n(7),l=n.n(i),o=n(8),s=n.n(o);class r{constructor(e,t){this.fields=e,this.gallery=t,this._binded=!1,this._excluded=!1,this.id=e.id,this.thumbnail=e.thumbnail,this.enlarged=e.enlarged,this.title=this.getTitle(e),this.link=this.getLink(e),this.linkTarget=this.getLinkTarget(e),this.tWidth=e.tWidth,this.tHeight=e.tHeight,this.eWidth=e.eWidth,this.eHeight=e.eHeight,this.categories=e.categories,this.last=e.last,this.createElement()}getTitle(e){return e.title?this.getTitleDetails(e.title).title:null}getLink(e){return e.link?e.link:this.getTitleDetails(e.title).link}getLinkTarget(e){return e.linkTarget?e.linkTarget:this.getTitleDetails(e.title).linkTarget}getTitleDetails(e){let t=document.createElement('div');t.innerHTML=e;let n=t.getElementsByTagName('a'),a={title:t.textContent,link:null,linkTarget:null};return n[0]&&(a.link=n[0].getAttribute('href'),a.linkTarget=n[0].getAttribute('target')),a}createElement(){let e=this.gallery.options,t=null;this.title&&-1<['true','hover'].indexOf(e.showLabels)&&(t=!0);let n=document.createElement('div'),i=document.createElement('div'),l=this.getLinkElement();if(e.lightbox&&t&&l?(t=l,a.a.addClass(t,'button'),a.a.addClass(i,'zoomable')):e.lightbox&&t&&!l?(t=document.createElement('div'),a.a.addClass(n,'zoomable')):e.lightbox&&!t?a.a.addClass(n,'zoomable'):!e.lightbox&&t&&l?(n=l,t=document.createElement('div')):e.lightbox||!t||l?!e.lightbox&&!t&&l&&(n=l):t=document.createElement('div'),a.a.addClass(i,'image'),a.a.addClass(n,'figure loading visible'),i.style.backgroundImage='url('+this.thumbnail+')',n.appendChild(i),e.round){let t=e.round+'px';n.style.borderRadius=t,i.style.borderRadius=t}this.element=n,this.image=i,t&&(t.textContent=this.title,a.a.addClass(t,'title'),'hover'==e.showLabels&&a.a.addClass(t,'hover'),n.appendChild(t))}getLinkElement(){let e=null;return this.link&&(e=document.createElement('a'),e.setAttribute('href',this.link),a.a.addClass(e,'link'),this.linkTarget&&e.setAttribute('target',this.linkTarget)),e}style(){a.a.removeClass(this.element,'visible'),this.element.style.width=this.width+'px',this.element.style.height=this.height+'px',this.element.style.marginRight=this.gallery.options.margin+'px',this.element.style.marginBottom=this.gallery.options.margin+'px',this.last&&(this.element.style.marginRight='0'),this.image.style.width=this.width+'px',this.image.style.height=this.height+'px';const e=this;window.setTimeout(function(){a.a.addClass(e.element,'visible')},0)}flash(){const e=this;a.a.removeClass(this.element,'visible'),window.setTimeout(function(){a.a.addClass(e.element,'visible')},0)}bindClick(){if(!this.gallery.options.lightbox)return;let t=this;if(this.binded)return;this.binded=!0;let e=null;e=this.link?this.image:this.element,e.addEventListener('click',function(n){t.openPhotoSwipe.call(t,n,t.element)})}openPhotoSwipe(t,e){if(t.preventDefault(),!this.gallery.options.lightbox)return;let n=Array.prototype.slice.call(e.parentNode.children),a=n.indexOf(e)-1,l=new i(this.gallery.pswpElement,o,this.gallery.pswpContainer,{index:a,bgOpacity:0.85,showHideOpacity:!0,loop:!1});this.gallery.pswpApi=l,l.init();let s=null;l.listen('beforeChange',function(e){0<e&&l.getCurrentIndex()==l.items.length-1?this.gallery.addElements():e===-1*(l.items.length-1)&&(s=l.items.length,this.gallery.addElements())}),l.listen('afterChange',function(){s&&(l.goTo(s),s=null)})}getPswpItem(){return{src:this._enlarged,w:this._eWidth,h:this._eHeight,title:this._title}}getElement(){return this.element}loadElement(){let e=this,t=document.createElement('img');return t.setAttribute('src',this.thumbnail),t.addEventListener('load',function(){a.a.removeClass(e.element,'loading'),a.a.addClass(e.element,'loaded')}),t.addEventListener('error',function(){a.a.addClass(e.element,'errored')}),this.element}remove(){this.getElement().parentNode&&this.getElement().parentNode.removeChild(this.getElement())}get id(){return this._id}set id(e){this._id=e}get thumbnail(){return this._thumbnail}set thumbnail(e){this._thumbnail=e}get enlarged(){return this._enlarged}set enlarged(e){this._enlarged=e}get title(){return this._title}set title(e){this._title=e}get tWidth(){return this._tWidth}set tWidth(e){this._tWidth=e}get tHeight(){return this._tHeight}set tHeight(e){this._tHeight=e}get eWidth(){return this._eWidth}set eWidth(e){this._eWidth=e}get eHeight(){return this._eHeight}set eHeight(e){this._eHeight=e}get last(){return this._last}set last(e){this._last=e}get categories(){return this._categories}set categories(e){this._categories=e}get row(){return this._row}set row(e){this._row=e}get height(){return this._height}set height(e){this._height=e}get width(){return this._width}set width(e){this._width=e}get description(){return this._description}set description(e){this._description=e}get binded(){return this._binded}set binded(e){this._binded=e}get link(){return this._link}set link(e){this._link=e}get linkTarget(){return this._linkTarget}set linkTarget(e){this._linkTarget=e}get excluded(){return this._excluded}set excluded(e){this._excluded=e}}t.a=r},function(e,n,a){var i,l;(function(t,o){i=o,l='function'==typeof i?i.call(n,a,n,e):i,!(l!==void 0&&(e.exports=l))})(this,function(){'use strict';return function(e,n,a,i){var l=Math.min,o=Math.abs,s=Math.max,r=Math.PI,d={features:null,bind:function(e,t,n,a){var l=(a?'remove':'add')+'EventListener';t=t.split(' ');for(var o=0;o<t.length;o++)t[o]&&e[l](t[o],n,!1)},isArray:function(e){return e instanceof Array},createEl:function(e,t){var n=document.createElement(t||'div');return e&&(n.className=e),n},getScrollY:function(){var e=window.pageYOffset;return void 0===e?document.documentElement.scrollTop:e},unbind:function(e,t,n){d.bind(e,t,n,!0)},removeClass:function(e,t){var n=new RegExp('(\\s|^)'+t+'(\\s|$)');e.className=e.className.replace(n,' ').replace(/^\s\s*/,'').replace(/\s\s*$/,'')},addClass:function(e,t){d.hasClass(e,t)||(e.className+=(e.className?' ':'')+t)},hasClass:function(e,t){return e.className&&new RegExp('(^|\\s)'+t+'(\\s|$)').test(e.className)},getChildByClass:function(e,t){for(var n=e.firstChild;n;){if(d.hasClass(n,t))return n;n=n.nextSibling}},arraySearch:function(e,t,n){for(var a=e.length;a--;)if(e[a][n]===t)return a;return-1},extend:function(e,t,n){for(var a in t)if(t.hasOwnProperty(a)){if(n&&e.hasOwnProperty(a))continue;e[a]=t[a]}},easing:{sine:{out:function(e){return Math.sin(e*(r/2))},inOut:function(e){return-(Math.cos(r*e)-1)/2}},cubic:{out:function(e){return--e*e*e+1}}},detectFeatures:function(){if(d.features)return d.features;var e=d.createEl(),t=e.style,n='',l={};if(l.oldIE=document.all&&!document.addEventListener,l.touch='ontouchstart'in window,window.requestAnimationFrame&&(l.raf=window.requestAnimationFrame,l.caf=window.cancelAnimationFrame),l.pointerEvent=navigator.pointerEnabled||navigator.msPointerEnabled,!l.pointerEvent){var o=navigator.userAgent;if(/iP(hone|od)/.test(navigator.platform)){var r=navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);r&&0<r.length&&(r=parseInt(r[1],10),1<=r&&8>r&&(l.isOldIOSPhone=!0))}var p=o.match(/Android\s([0-9\.]*)/),c=p?p[1]:0;c=parseFloat(c),1<=c&&(4.4>c&&(l.isOldAndroid=!0),l.androidVersion=c),l.isMobileOpera=/opera mini|opera mobi/i.test(o)}for(var m,u,h=['transform','perspective','animationName'],g=['','webkit','Moz','ms','O'],x=0;4>x;x++){n=g[x];for(var i=0;3>i;i++)m=h[i],u=n+(n?m.charAt(0).toUpperCase()+m.slice(1):m),!l[m]&&u in t&&(l[m]=u);n&&!l.raf&&(n=n.toLowerCase(),l.raf=window[n+'RequestAnimationFrame'],l.raf&&(l.caf=window[n+'CancelAnimationFrame']||window[n+'CancelRequestAnimationFrame']))}if(!l.raf){var a=0;l.raf=function(e){var t=new Date().getTime(),n=s(0,16-(t-a)),i=window.setTimeout(function(){e(t+n)},n);return a=t+n,i},l.caf=function(e){clearTimeout(e)}}return l.svg=!!document.createElementNS&&!!document.createElementNS('http://www.w3.org/2000/svg','svg').createSVGRect,d.features=l,l}};d.detectFeatures(),d.features.oldIE&&(d.bind=function(e,t,n,a){t=t.split(' ');for(var l,o=(a?'detach':'attach')+'Event',s=function(){n.handleEvent.call(n)},r=0;r<t.length;r++)if(l=t[r],l)if('object'==typeof n&&n.handleEvent){if(!a)n['oldIE'+l]=s;else if(!n['oldIE'+l])return!1;e[o]('on'+l,n['oldIE'+l])}else e[o]('on'+l,n)});var c=this,m=25,u=3,h={allowPanToNext:!0,spacing:0.12,bgOpacity:1,mouseUsed:!1,loop:!0,pinchToClose:!0,closeOnScroll:!0,closeOnVerticalDrag:!0,verticalDragRange:0.75,hideAnimationDuration:333,showAnimationDuration:333,showHideOpacity:!1,focus:!0,escKey:!0,arrowKeys:!0,mainScrollEndFriction:0.35,panEndFriction:0.35,isClickableElement:function(e){return'A'===e.tagName},getDoubleTapZoom:function(e,t){return e?1:0.7>t.initialZoomLevel?1:1.33},maxSpreadZoom:1.33,modal:!0,scaleMode:'fit'};d.extend(h,i);var g,x,y,f,b,w,C,E,v,_,I,T,k,D,S,A,O,F,R,L,N,z,P,Z,B,M,H,W,K,U,G,Y,q,V,X,j,$,J,Q,ee,te,ne,ae,ie,le,oe,se,re,de,pe,ce,me,ue,he,ge,xe,ye,fe=function(){return{x:0,y:0}},be=fe(),we=fe(),Ce=fe(),Ee={},ve=0,_e={},Ie=fe(),Te=0,ke=!0,De=[],Se={},Ae=!1,Oe=function(e,t){d.extend(c,t.publicMethods),De.push(e)},Fe=function(e){var t=ln();if(e>t-1)return e-t;return 0>e?t+e:e},Re={},Le=function(e,t){return Re[e]||(Re[e]=[]),Re[e].push(t)},Ne=function(e){var t=Re[e];if(t){var n=Array.prototype.slice.call(arguments);n.shift();for(var a=0;a<t.length;a++)t[a].apply(c,n)}},ze=function(){return new Date().getTime()},Pe=function(e){ge=e,c.bg.style.opacity=e*h.bgOpacity},Ze=function(e,t,n,a,i){(!Ae||i&&i!==c.currItem)&&(a/=i?i.fitRatio:c.currItem.fitRatio),e[z]=T+t+'px, '+n+'px'+k+' scale('+a+')'},Be=function(e){pe&&(e&&(_>c.currItem.fitRatio?!Ae&&(yn(c.currItem,!1,!0),Ae=!0):Ae&&(yn(c.currItem),Ae=!1)),Ze(pe,Ce.x,Ce.y,_))},Me=function(e){e.container&&Ze(e.container.style,e.initialPosition.x,e.initialPosition.y,e.initialZoomLevel,e)},He=function(e,t){t[z]=T+e+'px, 0px'+k},We=function(e,n){if(!h.loop&&n){var a=f+(Ie.x*ve-e)/Ie.x,i=t(e-vt.x);(0>a&&0<i||a>=ln()-1&&0>i)&&(e=vt.x+i*h.mainScrollEndFriction)}vt.x=e,He(e,b)},Ke=function(e,t){var n=_t[e]-_e[e];return we[e]+be[e]+n-n*(t/I)},Ue=function(e,t){e.x=t.x,e.y=t.y,t.id&&(e.id=t.id)},Ge=function(e){e.x=t(e.x),e.y=t(e.y)},Ye=null,qe=function(){Ye&&(d.unbind(document,'mousemove',qe),d.addClass(e,'pswp--has_mouse'),h.mouseUsed=!0,Ne('mouseUsed')),Ye=setTimeout(function(){Ye=null},100)},Ve=function(){d.bind(document,'keydown',c),G.transform&&d.bind(c.scrollWrap,'click',c),h.mouseUsed||d.bind(document,'mousemove',qe),d.bind(window,'resize scroll orientationchange',c),Ne('bindEvents')},Xe=function(){d.unbind(window,'resize scroll orientationchange',c),d.unbind(window,'scroll',v.scroll),d.unbind(document,'keydown',c),d.unbind(document,'mousemove',qe),G.transform&&d.unbind(c.scrollWrap,'click',c),Q&&d.unbind(window,C,c),clearTimeout(Y),Ne('unbindEvents')},je=function(e,t){var n=un(c.currItem,Ee,e);return t&&(de=n),n},$e=function(e){return e||(e=c.currItem),e.initialZoomLevel},Je=function(e){return e||(e=c.currItem),0<e.w?h.maxSpreadZoom:1},Qe=function(e,t,n,a){return a===c.currItem.initialZoomLevel?(n[e]=c.currItem.initialPosition[e],!0):(n[e]=Ke(e,a),n[e]>t.min[e])?(n[e]=t.min[e],!0):!!(n[e]<t.max[e])&&(n[e]=t.max[e],!0)},et=function(){if(z){var t=G.perspective&&!Z;return T='translate'+(t?'3d(':'('),void(k=G.perspective?', 0px)':')')}z='left',d.addClass(e,'pswp--ie'),He=function(e,t){t.left=e+'px'},Me=function(e){var t=1<e.fitRatio?1:e.fitRatio,n=e.container.style,a=t*e.w,i=t*e.h;n.width=a+'px',n.height=i+'px',n.left=e.initialPosition.x+'px',n.top=e.initialPosition.y+'px'},Be=function(){if(pe){var e=pe,t=c.currItem,n=1<t.fitRatio?1:t.fitRatio,a=n*t.w,i=n*t.h;e.width=a+'px',e.height=i+'px',e.left=Ce.x+'px',e.top=Ce.y+'px'}}},tt=function(t){var e='';h.escKey&&27===t.keyCode?e='close':h.arrowKeys&&(37===t.keyCode?e='prev':39===t.keyCode&&(e='next')),!e||t.ctrlKey||t.altKey||t.shiftKey||t.metaKey||(t.preventDefault?t.preventDefault():t.returnValue=!1,c[e]())},nt=function(t){!t||(ne||te||ce||$)&&(t.preventDefault(),t.stopPropagation())},at=function(){c.setScrollOffset(0,d.getScrollY())},it={},lt=0,ot=function(e){it[e]&&(it[e].raf&&M(it[e].raf),lt--,delete it[e])},st=function(e){it[e]&&ot(e),it[e]||(lt++,it[e]={})},rt=function(){for(var e in it)it.hasOwnProperty(e)&&ot(e)},dt=function(e,n,a,i,l,o,s){var r,t=ze();st(e);var d=function(){if(it[e]){if(r=ze()-t,r>=i)return ot(e),o(a),void(s&&s());o((a-n)*l(r/i)+n),it[e].raf=B(d)}};d()},pt=30,ct=10,mt={},p={},ut={},ht={},gt={},xt=[],yt={},ft=[],bt={},wt=0,Ct=fe(),Et=0,vt=fe(),_t=fe(),It=fe(),Tt=function(e,t){return e.x===t.x&&e.y===t.y},kt=function(e,t){return o(e.x-t.x)<m&&o(e.y-t.y)<m},Dt=function(e,t){return bt.x=o(e.x-t.x),bt.y=o(e.y-t.y),Math.sqrt(bt.x*bt.x+bt.y*bt.y)},St=function(){ae&&(M(ae),ae=null)},At=function(){Q&&(ae=B(At),Yt())},Ot=function(){return'fit'!==h.scaleMode||_!==c.currItem.initialZoomLevel},Ft=function(e,t){return e&&e!==document&&(e.getAttribute('class')&&-1<e.getAttribute('class').indexOf('pswp__scroll-wrap')?!1:t(e)?e:Ft(e.parentNode,t))},Rt={},Lt=function(t,e){return Rt.prevent=!Ft(t.target,h.isClickableElement),Ne('preventDragEvent',t,e,Rt),Rt.prevent},Nt=function(e,t){return t.x=e.pageX,t.y=e.pageY,t.id=e.identifier,t},zt=function(e,t,n){n.x=0.5*(e.x+t.x),n.y=0.5*(e.y+t.y)},Pt=function(e,t,n){if(50<e-V){var a=2<ft.length?ft.shift():{};a.x=t,a.y=n,ft.push(a),V=e}},Zt=function(){var e=Ce.y-c.currItem.initialPosition.y;return 1-o(e/(Ee.y/2))},Bt={},Mt={},Ht=[],Wt=function(t){for(;0<Ht.length;)Ht.pop();return P?(ye=0,xt.forEach(function(e){0===ye?Ht[0]=e:1===ye&&(Ht[1]=e),ye++})):-1<t.type.indexOf('touch')?t.touches&&0<t.touches.length&&(Ht[0]=Nt(t.touches[0],Bt),1<t.touches.length&&(Ht[1]=Nt(t.touches[1],Mt))):(Bt.x=t.pageX,Bt.y=t.pageY,Bt.id='',Ht[0]=Bt),Ht},Kt=function(e,t){var n,a,i,l,o=0,s=Ce[e]+t[e],r=0<t[e],d=vt.x+t.x,p=vt.x-yt.x;return n=s>de.min[e]||s<de.max[e]?h.panEndFriction:1,s=Ce[e]+t[e]*n,(h.allowPanToNext||_===c.currItem.initialZoomLevel)&&(pe?'h'===me&&'x'===e&&!te&&(r?(s>de.min[e]&&(n=h.panEndFriction,o=de.min[e]-s,a=de.min[e]-we[e]),(0>=a||0>p)&&1<ln()?(l=d,0>p&&d>yt.x&&(l=yt.x)):de.min.x!==de.max.x&&(i=s)):(s<de.max[e]&&(n=h.panEndFriction,o=s-de.max[e],a=we[e]-de.max[e]),(0>=a||0<p)&&1<ln()?(l=d,0<p&&d<yt.x&&(l=yt.x)):de.min.x!==de.max.x&&(i=s))):l=d,'x'===e)?(void 0!==l&&(We(l,!0),ie=l!==yt.x),de.min.x!==de.max.x&&(void 0===i?!ie&&(Ce.x+=t.x*n):Ce.x=i),void 0!==l):void(!ce&&!ie&&_>c.currItem.fitRatio&&(Ce[e]+=t[e]*n))},Ut=function(t){if(!('mousedown'===t.type&&0<t.button)){if(nn)return void t.preventDefault();if(!(J&&'mousedown'===t.type)){if(Lt(t,!0)&&t.preventDefault(),Ne('pointerDown'),P){var e=d.arraySearch(xt,t.pointerId,'id');0>e&&(e=xt.length),xt[e]={x:t.pageX,y:t.pageY,id:t.pointerId}}var n=Wt(t),a=n.length;le=null,rt(),Q&&1!==a||(Q=ue=!0,d.bind(window,C,c),j=xe=he=$=ie=ne=ee=te=!1,me=null,Ne('firstTouchStart',n),Ue(we,Ce),be.x=be.y=0,Ue(ht,n[0]),Ue(gt,ht),yt.x=Ie.x*ve,ft=[{x:ht.x,y:ht.y}],V=q=ze(),je(_,!0),St(),At()),oe||!(1<a)||ce||ie||(I=_,te=!1,oe=ee=!0,be.y=be.x=0,Ue(we,Ce),Ue(mt,n[0]),Ue(p,n[1]),zt(mt,p,It),_t.x=o(It.x)-Ce.x,_t.y=o(It.y)-Ce.y,se=re=Dt(mt,p))}}},Gt=function(t){if(t.preventDefault(),P){var e=d.arraySearch(xt,t.pointerId,'id');if(-1<e){var n=xt[e];n.x=t.pageX,n.y=t.pageY}}if(Q){var a=Wt(t);if(me||ne||oe)le=a;else if(vt.x!==Ie.x*ve)me='h';else{var i=o(a[0].x-ht.x)-o(a[0].y-ht.y);o(i)>=ct&&(me=0<i?'h':'v',le=a)}}},Yt=function(){if(le){var e=le.length;if(0!==e)if(Ue(mt,le[0]),ut.x=mt.x-ht.x,ut.y=mt.y-ht.y,oe&&1<e){if(ht.x=mt.x,ht.y=mt.y,!ut.x&&!ut.y&&Tt(le[1],p))return;Ue(p,le[1]),te||(te=!0,Ne('zoomGestureStarted'));var t=Dt(mt,p),n=$t(t);n>c.currItem.initialZoomLevel+c.currItem.initialZoomLevel/15&&(xe=!0);var a=1,i=$e(),l=Je();if(!(n<i))n>l&&(a=(n-l)/(6*i),1<a&&(a=1),n=l+a*i);else if(h.pinchToClose&&!xe&&I<=c.currItem.initialZoomLevel){var s=i-n,r=1-s/(i/1.2);Pe(r),Ne('onPinchClose',r),he=!0}else a=(i-n)/i,1<a&&(a=1),n=i-a*(i/3);0>a&&(a=0),se=t,zt(mt,p,Ct),be.x+=Ct.x-It.x,be.y+=Ct.y-It.y,Ue(It,Ct),Ce.x=Ke('x',n),Ce.y=Ke('y',n),j=n>_,_=n,Be()}else{if(!me)return;if(ue&&(ue=!1,o(ut.x)>=ct&&(ut.x-=le[0].x-gt.x),o(ut.y)>=ct&&(ut.y-=le[0].y-gt.y)),ht.x=mt.x,ht.y=mt.y,0===ut.x&&0===ut.y)return;if('v'===me&&h.closeOnVerticalDrag&&!Ot()){be.y+=ut.y,Ce.y+=ut.y;var d=Zt();return $=!0,Ne('onVerticalDrag',d),Pe(d),void Be()}Pt(ze(),mt.x,mt.y),ne=!0,de=c.currItem.bounds;var m=Kt('x',ut);m||(Kt('y',ut),Ge(Ce),Be())}}},qt=function(t){if(G.isOldAndroid){if(J&&'mouseup'===t.type)return;-1<t.type.indexOf('touch')&&(clearTimeout(J),J=setTimeout(function(){J=0},600))}Ne('pointerUp'),Lt(t,!1)&&t.preventDefault();var e;if(P){var n=d.arraySearch(xt,t.pointerId,'id');if(-1<n)if(e=xt.splice(n,1)[0],navigator.pointerEnabled)e.type=t.pointerType||'mouse';else{e.type={2:'touch',3:'pen',4:'mouse'}[t.pointerType],e.type||(e.type=t.pointerType||'mouse')}}var a,i=Wt(t),l=i.length;if('mouseup'===t.type&&(l=0),2===l)return le=null,!0;1===l&&Ue(gt,i[0]),0!==l||me||ce||(!e&&('mouseup'===t.type?e={x:t.pageX,y:t.pageY,type:'mouse'}:t.changedTouches&&t.changedTouches[0]&&(e={x:t.changedTouches[0].pageX,y:t.changedTouches[0].pageY,type:'touch'})),Ne('touchRelease',t,e));var o=-1;if(0===l&&(Q=!1,d.unbind(window,C,c),St(),oe?o=0:-1!=Et&&(o=ze()-Et)),Et=1===l?ze():-1,a=-1!=o&&150>o?'zoom':'swipe',oe&&2>l&&(oe=!1,1===l&&(a='zoomPointerUp'),Ne('zoomGestureEnded')),le=null,ne||te||ce||$){if(rt(),X||(X=Vt()),X.calculateSwipeSpeed('x'),$){var s=Zt();if(s<h.verticalDragRange)c.close();else{var r=Ce.y,p=ge;dt('verticalDrag',0,1,300,d.easing.cubic.out,function(e){Ce.y=(c.currItem.initialPosition.y-r)*e+r,Pe((1-p)*e+p),Be()}),Ne('onVerticalDrag',1)}return}if((ie||ce)&&0===l){var m=jt(a,X);if(m)return;a='zoomPointerUp'}return ce?void 0:'swipe'===a?void(!ie&&_>c.currItem.fitRatio&&Xt(X)):void Jt()}},Vt=function(){var e,n,a={lastFlickOffset:{},lastFlickDist:{},lastFlickSpeed:{},slowDownRatio:{},slowDownRatioReverse:{},speedDecelerationRatio:{},speedDecelerationRatioAbs:{},distanceOffset:{},backAnimDestination:{},backAnimStarted:{},calculateSwipeSpeed:function(t){1<ft.length?(e=ze()-V+50,n=ft[ft.length-2][t]):(e=ze()-q,n=gt[t]),a.lastFlickOffset[t]=ht[t]-n,a.lastFlickDist[t]=o(a.lastFlickOffset[t]),a.lastFlickSpeed[t]=20<a.lastFlickDist[t]?a.lastFlickOffset[t]/e:0,0.1>o(a.lastFlickSpeed[t])&&(a.lastFlickSpeed[t]=0),a.slowDownRatio[t]=0.95,a.slowDownRatioReverse[t]=1-a.slowDownRatio[t],a.speedDecelerationRatio[t]=1},calculateOverBoundsAnimOffset:function(e,t){a.backAnimStarted[e]||(Ce[e]>de.min[e]?a.backAnimDestination[e]=de.min[e]:Ce[e]<de.max[e]&&(a.backAnimDestination[e]=de.max[e]),a.backAnimDestination[e]!==void 0&&(a.slowDownRatio[e]=0.7,a.slowDownRatioReverse[e]=1-a.slowDownRatio[e],0.05>a.speedDecelerationRatioAbs[e]&&(a.lastFlickSpeed[e]=0,a.backAnimStarted[e]=!0,dt('bounceZoomPan'+e,Ce[e],a.backAnimDestination[e],t||300,d.easing.sine.out,function(t){Ce[e]=t,Be()}))))},calculateAnimOffset:function(e){a.backAnimStarted[e]||(a.speedDecelerationRatio[e]*=a.slowDownRatio[e]+a.slowDownRatioReverse[e]-a.slowDownRatioReverse[e]*a.timeDiff/10,a.speedDecelerationRatioAbs[e]=o(a.lastFlickSpeed[e]*a.speedDecelerationRatio[e]),a.distanceOffset[e]=a.lastFlickSpeed[e]*a.speedDecelerationRatio[e]*a.timeDiff,Ce[e]+=a.distanceOffset[e])},panAnimLoop:function(){if(it.zoomPan&&(it.zoomPan.raf=B(a.panAnimLoop),a.now=ze(),a.timeDiff=a.now-a.lastNow,a.lastNow=a.now,a.calculateAnimOffset('x'),a.calculateAnimOffset('y'),Be(),a.calculateOverBoundsAnimOffset('x'),a.calculateOverBoundsAnimOffset('y'),0.05>a.speedDecelerationRatioAbs.x&&0.05>a.speedDecelerationRatioAbs.y))return Ce.x=t(Ce.x),Ce.y=t(Ce.y),Be(),void ot('zoomPan')}};return a},Xt=function(e){return e.calculateSwipeSpeed('y'),de=c.currItem.bounds,e.backAnimDestination={},e.backAnimStarted={},0.05>=o(e.lastFlickSpeed.x)&&0.05>=o(e.lastFlickSpeed.y)?(e.speedDecelerationRatioAbs.x=e.speedDecelerationRatioAbs.y=0,e.calculateOverBoundsAnimOffset('x'),e.calculateOverBoundsAnimOffset('y'),!0):void(st('zoomPan'),e.lastNow=ze(),e.panAnimLoop())},jt=function(e,t){var n;ce||(wt=f);var a;if('swipe'===e){var i=ht.x-gt.x,r=10>t.lastFlickDist.x;i>pt&&(r||20<t.lastFlickOffset.x)?a=-1:i<-pt&&(r||-20>t.lastFlickOffset.x)&&(a=1)}var p;a&&(f+=a,0>f?(f=h.loop?ln()-1:0,p=!0):f>=ln()&&(f=h.loop?0:ln()-1,p=!0),(!p||h.loop)&&(Te+=a,ve-=a,n=!0));var m,u=Ie.x*ve,g=o(u-vt.x);return n||u>vt.x==0<t.lastFlickSpeed.x?(m=0<o(t.lastFlickSpeed.x)?g/o(t.lastFlickSpeed.x):333,m=l(m,400),m=s(m,250)):m=333,wt===f&&(n=!1),ce=!0,Ne('mainScrollAnimStart'),dt('mainScroll',vt.x,u,m,d.easing.cubic.out,We,function(){rt(),ce=!1,wt=-1,(n||wt!==f)&&c.updateCurrItem(),Ne('mainScrollAnimComplete')}),n&&c.updateCurrItem(!0),n},$t=function(e){return 1/re*e*I},Jt=function(){var e=_,t=$e(),n=Je();_<t?e=t:_>n&&(e=n);var a,i=ge;return he&&!j&&!xe&&_<t?(c.close(),!0):(he&&(a=function(e){Pe((1-i)*e+i)}),c.zoomTo(e,0,200,d.easing.cubic.out,a),!0)};Oe('Gestures',{publicMethods:{initGestures:function(){var e=function(e,t,n,a,i){F=e+t,R=e+n,L=e+a,N=i?e+i:''};P=G.pointerEvent,P&&G.touch&&(G.touch=!1),P?navigator.pointerEnabled?e('pointer','down','move','up','cancel'):e('MSPointer','Down','Move','Up','Cancel'):G.touch?(e('touch','start','move','end','cancel'),Z=!0):e('mouse','down','move','up'),C=R+' '+L+' '+N,E=F,P&&!Z&&(Z=1<navigator.maxTouchPoints||1<navigator.msMaxTouchPoints),c.likelyTouchDevice=Z,v[F]=Ut,v[R]=Gt,v[L]=qt,N&&(v[N]=v[L]),G.touch&&(E+=' mousedown',C+=' mousemove mouseup',v.mousedown=v[F],v.mousemove=v[R],v.mouseup=v[L]),Z||(h.allowPanToNext=!1)}}});var Qt,en,tn,nn,an,ln,on,sn=function(t,n,a,i){Qt&&clearTimeout(Qt),nn=!0,tn=!0;var l;t.initialLayout?(l=t.initialLayout,t.initialLayout=null):l=h.getThumbBoundsFn&&h.getThumbBoundsFn(f);var o=a?h.hideAnimationDuration:h.showAnimationDuration,s=function(){ot('initialZoom'),a?(c.template.removeAttribute('style'),c.bg.removeAttribute('style')):(Pe(1),n&&(n.style.display='block'),d.addClass(e,'pswp--animated-in'),Ne('initialZoom'+(a?'OutEnd':'InEnd'))),i&&i(),nn=!1};if(!o||!l||void 0===l.x)return Ne('initialZoom'+(a?'Out':'In')),_=t.initialZoomLevel,Ue(Ce,t.initialPosition),Be(),e.style.opacity=a?0:1,Pe(1),void(o?setTimeout(function(){s()},o):s());(function(){var n=y,i=!c.currItem.src||c.currItem.loadError||h.showHideOpacity;t.miniImg&&(t.miniImg.style.webkitBackfaceVisibility='hidden'),a||(_=l.w/t.w,Ce.x=l.x,Ce.y=l.y-W,c[i?'template':'bg'].style.opacity=1e-3,Be()),st('initialZoom'),a&&!n&&d.removeClass(e,'pswp--animated-in'),i&&(a?d[(n?'remove':'add')+'Class'](e,'pswp--animate_opacity'):setTimeout(function(){d.addClass(e,'pswp--animate_opacity')},30)),Qt=setTimeout(function(){if(Ne('initialZoom'+(a?'Out':'In')),!a)_=t.initialZoomLevel,Ue(Ce,t.initialPosition),Be(),Pe(1),i?e.style.opacity=1:Pe(1),Qt=setTimeout(s,o+20);else{var r=l.w/t.w,p={x:Ce.x,y:Ce.y},c=_,m=ge,u=function(t){1===t?(_=r,Ce.x=l.x,Ce.y=l.y-U):(_=(r-c)*t+c,Ce.x=(l.x-p.x)*t+p.x,Ce.y=(l.y-U-p.y)*t+p.y),Be(),i?e.style.opacity=1-t:Pe(m-t*m)};n?dt('initialZoom',0,1,o,d.easing.cubic.out,u,s):(u(1),Qt=setTimeout(s,o+20))}},a?25:90)})()},rn={},dn=[],pn={index:0,errorMsg:'<div class="pswp__error-msg"><a href="%url%" target="_blank">The image</a> could not be loaded.</div>',forceProgressiveLoading:!1,preload:[1,1],getNumItemsFn:function(){return en.length}},cn=function(){return{center:{x:0,y:0},max:{x:0,y:0},min:{x:0,y:0}}},mn=function(e,n,a){var i=e.bounds;i.center.x=t((rn.x-n)/2),i.center.y=t((rn.y-a)/2)+e.vGap.top,i.max.x=n>rn.x?t(rn.x-n):i.center.x,i.max.y=a>rn.y?t(rn.y-a)+e.vGap.top:i.center.y,i.min.x=n>rn.x?0:i.center.x,i.min.y=a>rn.y?e.vGap.top:i.center.y},un=function(e,t,n){if(e.src&&!e.loadError){var a=!n;if(a&&(!e.vGap&&(e.vGap={top:0,bottom:0}),Ne('parseVerticalMargin',e)),rn.x=t.x,rn.y=t.y-e.vGap.top-e.vGap.bottom,a){var i=rn.x/e.w,l=rn.y/e.h;e.fitRatio=i<l?i:l;var o=h.scaleMode;'orig'===o?n=1:'fit'===o&&(n=e.fitRatio),1<n&&(n=1),e.initialZoomLevel=n,e.bounds||(e.bounds=cn())}return n?(mn(e,e.w*n,e.h*n),a&&n===e.initialZoomLevel&&(e.initialPosition=e.bounds.center),e.bounds):void 0}return e.w=e.h=0,e.initialZoomLevel=e.fitRatio=1,e.bounds=cn(),e.initialPosition=e.bounds.center,e.bounds},hn=function(e,t,n,a,i,l){t.loadError||a&&(t.imageAppended=!0,yn(t,a,t===c.currItem&&Ae),n.appendChild(a),l&&setTimeout(function(){t&&t.loaded&&t.placeholder&&(t.placeholder.style.display='none',t.placeholder=null)},500))},gn=function(e){e.loading=!0,e.loaded=!1;var t=e.img=d.createEl('pswp__img','img'),n=function(){e.loading=!1,e.loaded=!0,e.loadComplete?e.loadComplete(e):e.img=null,t.onload=t.onerror=null,t=null};return t.onload=n,t.onerror=function(){e.loadError=!0,n()},t.src=e.src,t},xn=function(e,t){if(e.src&&e.loadError&&e.container)return t&&(e.container.innerHTML=''),e.container.innerHTML=h.errorMsg.replace('%url%',e.src),!0},yn=function(e,n,a){if(e.src){n||(n=e.container.lastChild);var i=a?e.w:t(e.w*e.fitRatio),l=a?e.h:t(e.h*e.fitRatio);e.placeholder&&!e.loaded&&(e.placeholder.style.width=i+'px',e.placeholder.style.height=l+'px'),n.style.width=i+'px',n.style.height=l+'px'}},fn=function(){if(dn.length){for(var e,t=0;t<dn.length;t++)e=dn[t],e.holder.index===e.index&&hn(e.index,e.item,e.baseDiv,e.img,!1,e.clearPlaceholder);dn=[]}};Oe('Controller',{publicMethods:{lazyLoadItem:function(e){e=Fe(e);var t=an(e);t&&(!t.loaded&&!t.loading||S)&&(Ne('gettingData',e,t),t.src&&gn(t))},initController:function(){d.extend(h,pn,!0),c.items=en=a,an=c.getItemAt,ln=h.getNumItemsFn,on=h.loop,3>ln()&&(h.loop=!1),Le('beforeChange',function(e){var t,n=h.preload,a=!(null!==e)||0<=e,i=l(n[0],ln()),o=l(n[1],ln());for(t=1;t<=(a?o:i);t++)c.lazyLoadItem(f+t);for(t=1;t<=(a?i:o);t++)c.lazyLoadItem(f-t)}),Le('initialLayout',function(){c.currItem.initialLayout=h.getThumbBoundsFn&&h.getThumbBoundsFn(f)}),Le('mainScrollAnimComplete',fn),Le('initialZoomInEnd',fn),Le('destroy',function(){for(var e,t=0;t<en.length;t++)e=en[t],e.container&&(e.container=null),e.placeholder&&(e.placeholder=null),e.img&&(e.img=null),e.preloader&&(e.preloader=null),e.loadError&&(e.loaded=e.loadError=!1);dn=null})},getItemAt:function(e){return!!(0<=e)&&void 0!==en[e]&&en[e]},allowProgressiveImg:function(){return h.forceProgressiveLoading||!Z||h.mouseUsed||1200<screen.width},setContent:function(e,t){h.loop&&(t=Fe(t));var n=c.getItemAt(e.index);n&&(n.container=null);var a,i=c.getItemAt(t);if(!i)return void(e.el.innerHTML='');Ne('gettingData',t,i),e.index=t,e.item=i;var l=i.container=d.createEl('pswp__zoom-wrap');if(!i.src&&i.html&&(i.html.tagName?l.appendChild(i.html):l.innerHTML=i.html),xn(i),un(i,Ee),i.src&&!i.loadError&&!i.loaded){if(i.loadComplete=function(n){if(g){if(e&&e.index===t){if(xn(n,!0))return n.loadComplete=n.img=null,un(n,Ee),Me(n),void(e.index===f&&c.updateCurrZoomItem());n.imageAppended?!nn&&n.placeholder&&(n.placeholder.style.display='none',n.placeholder=null):G.transform&&(ce||nn)?dn.push({item:n,baseDiv:l,img:n.img,index:t,holder:e,clearPlaceholder:!0}):hn(t,n,l,n.img,ce||nn,!0)}n.loadComplete=null,n.img=null,Ne('imageLoadComplete',t,n)}},d.features.transform){var o='pswp__img pswp__img--placeholder';o+=i.msrc?'':' pswp__img--placeholder--blank';var s=d.createEl(o,i.msrc?'img':'');i.msrc&&(s.src=i.msrc),yn(i,s),l.appendChild(s),i.placeholder=s}i.loading||gn(i),c.allowProgressiveImg()&&(!tn&&G.transform?dn.push({item:i,baseDiv:l,img:i.img,index:t,holder:e}):hn(t,i,l,i.img,!0,!0))}else i.src&&!i.loadError&&(a=d.createEl('pswp__img','img'),a.style.opacity=1,a.src=i.src,yn(i,a),hn(t,i,l,a,!0));tn||t!==f?Me(i):(pe=l.style,sn(i,a||i.img)),e.el.innerHTML='',e.el.appendChild(l)},cleanSlide:function(e){e.img&&(e.img.onload=e.img.onerror=null),e.loaded=e.loading=e.img=e.imageAppended=!1}}});var bn,wn={},Cn=function(t,n,a){var i=document.createEvent('CustomEvent'),e={origEvent:t,target:t.target,releasePoint:n,pointerType:a||'touch'};i.initCustomEvent('pswpTap',!0,!0,e),t.target.dispatchEvent(i)};Oe('Tap',{publicMethods:{initTap:function(){Le('firstTouchStart',c.onTapStart),Le('touchRelease',c.onTapRelease),Le('destroy',function(){wn={},bn=null})},onTapStart:function(e){1<e.length&&(clearTimeout(bn),bn=null)},onTapRelease:function(t,e){if(e&&!ne&&!ee&&!lt){var n=e;if(bn&&(clearTimeout(bn),bn=null,kt(n,wn)))return void Ne('doubleTap',n);if('mouse'===e.type)return void Cn(t,e,'mouse');var a=t.target.tagName.toUpperCase();if('BUTTON'===a||d.hasClass(t.target,'pswp__single-tap'))return void Cn(t,e);Ue(wn,n),bn=setTimeout(function(){Cn(t,e),bn=null},300)}}}});var En;Oe('DesktopZoom',{publicMethods:{initDesktopZoom:function(){K||(Z?Le('mouseUsed',function(){c.setupDesktopZoom()}):c.setupDesktopZoom(!0))},setupDesktopZoom:function(t){En={};var n='wheel mousewheel DOMMouseScroll';Le('bindEvents',function(){d.bind(e,n,c.handleMouseWheel)}),Le('unbindEvents',function(){En&&d.unbind(e,n,c.handleMouseWheel)}),c.mouseZoomedIn=!1;var a,i=function(){c.mouseZoomedIn&&(d.removeClass(e,'pswp--zoomed-in'),c.mouseZoomedIn=!1),1>_?d.addClass(e,'pswp--zoom-allowed'):d.removeClass(e,'pswp--zoom-allowed'),l()},l=function(){a&&(d.removeClass(e,'pswp--dragging'),a=!1)};Le('resize',i),Le('afterChange',i),Le('pointerDown',function(){c.mouseZoomedIn&&(a=!0,d.addClass(e,'pswp--dragging'))}),Le('pointerUp',l),t||i()},handleMouseWheel:function(t){if(_<=c.currItem.fitRatio)return h.modal&&(!h.closeOnScroll||lt||Q?t.preventDefault():z&&2<o(t.deltaY)&&(y=!0,c.close())),!0;if(t.stopPropagation(),En.x=0,'deltaX'in t)1===t.deltaMode?(En.x=18*t.deltaX,En.y=18*t.deltaY):(En.x=t.deltaX,En.y=t.deltaY);else if('wheelDelta'in t)t.wheelDeltaX&&(En.x=-0.16*t.wheelDeltaX),En.y=t.wheelDeltaY?-0.16*t.wheelDeltaY:-0.16*t.wheelDelta;else if('detail'in t)En.y=t.detail;else return;je(_,!0);var e=Ce.x-En.x,n=Ce.y-En.y;(h.modal||e<=de.min.x&&e>=de.max.x&&n<=de.min.y&&n>=de.max.y)&&t.preventDefault(),c.panTo(e,n)},toggleDesktopZoom:function(t){t=t||{x:Ee.x/2+_e.x,y:Ee.y/2+_e.y};var n=h.getDoubleTapZoom(!0,c.currItem),a=_===n;c.mouseZoomedIn=!a,c.zoomTo(a?c.currItem.initialZoomLevel:n,t,333),d[(a?'remove':'add')+'Class'](e,'pswp--zoomed-in')}}});var vn,_n,In,Tn,kn,Dn,Sn,An,On,Fn,Rn,Ln,Nn={history:!0,galleryUID:1},zn=function(){return Rn.hash.substring(1)},Pn=function(){vn&&clearTimeout(vn),In&&clearTimeout(In)},Zn=function(){var e=zn(),t={};if(5>e.length)return t;var n,a=e.split('&');for(n=0;n<a.length;n++)if(a[n]){var i=a[n].split('=');2>i.length||(t[i[0]]=i[1])}if(h.galleryPIDs){var l=t.pid;for(t.pid=0,n=0;n<en.length;n++)if(en[n].pid===l){t.pid=n;break}}else t.pid=parseInt(t.pid,10)-1;return 0>t.pid&&(t.pid=0),t},Bn=function(){if(In&&clearTimeout(In),lt||Q)return void(In=setTimeout(Bn,500));Tn?clearTimeout(_n):Tn=!0;var e=f+1,t=an(f);t.hasOwnProperty('pid')&&(e=t.pid);var n=Sn+'&gid='+h.galleryUID+'&pid='+e;An||-1!==Rn.hash.indexOf(n)||(Fn=!0);var a=Rn.href.split('#')[0]+'#'+n;Ln?'#'+n!==window.location.hash&&history[An?'replaceState':'pushState']('',document.title,a):An?Rn.replace(a):Rn.hash=n,An=!0,_n=setTimeout(function(){Tn=!1},60)};Oe('History',{publicMethods:{initHistory:function(){if(d.extend(h,Nn,!0),!!h.history){Rn=window.location,Fn=!1,On=!1,An=!1,Sn=zn(),Ln='pushState'in history,-1<Sn.indexOf('gid=')&&(Sn=Sn.split('&gid=')[0],Sn=Sn.split('?gid=')[0]),Le('afterChange',c.updateURL),Le('unbindEvents',function(){d.unbind(window,'hashchange',c.onHashChange)});var e=function(){Dn=!0,On||(Fn?history.back():Sn?Rn.hash=Sn:Ln?history.pushState('',document.title,Rn.pathname+Rn.search):Rn.hash=''),Pn()};Le('unbindEvents',function(){y&&e()}),Le('destroy',function(){Dn||e()}),Le('firstUpdate',function(){f=Zn().pid});var t=Sn.indexOf('pid=');-1<t&&(Sn=Sn.substring(0,t),'&'===Sn.slice(-1)&&(Sn=Sn.slice(0,-1))),setTimeout(function(){g&&d.bind(window,'hashchange',c.onHashChange)},40)}},onHashChange:function(){return zn()===Sn?(On=!0,void c.close()):void(!Tn&&(kn=!0,c.goTo(Zn().pid),kn=!1))},updateURL:function(){Pn();kn||(An?vn=setTimeout(Bn,800):Bn())}}}),d.extend(c,{shout:Ne,listen:Le,viewportSize:Ee,options:h,isMainScrollAnimating:function(){return ce},getZoomLevel:function(){return _},getCurrentIndex:function(){return f},isDragging:function(){return Q},isZooming:function(){return oe},setScrollOffset:function(e,t){_e.x=e,U=_e.y=t,Ne('updateScrollOffset',_e)},applyZoomPan:function(e,t,n,a){Ce.x=t,Ce.y=n,_=e,Be(a)},init:function(){if(!(g||x)){var t;c.framework=d,c.template=e,c.bg=d.getChildByClass(e,'pswp__bg'),H=e.className,g=!0,G=d.detectFeatures(),B=G.raf,M=G.caf,z=G.transform,K=G.oldIE,c.scrollWrap=d.getChildByClass(e,'pswp__scroll-wrap'),c.container=d.getChildByClass(c.scrollWrap,'pswp__container'),b=c.container.style,c.itemHolders=A=[{el:c.container.children[0],wrap:0,index:-1},{el:c.container.children[1],wrap:0,index:-1},{el:c.container.children[2],wrap:0,index:-1}],A[0].el.style.display=A[2].el.style.display='none',et(),v={resize:c.updateSize,orientationchange:function(){clearTimeout(Y),Y=setTimeout(function(){Ee.x!==c.scrollWrap.clientWidth&&c.updateSize()},500)},scroll:at,keydown:tt,click:nt};var a=G.isOldIOSPhone||G.isOldAndroid||G.isMobileOpera;for(G.animationName&&G.transform&&!a||(h.showAnimationDuration=h.hideAnimationDuration=0),t=0;t<De.length;t++)c['init'+De[t]]();if(n){var i=c.ui=new n(c,d);i.init()}Ne('firstUpdate'),f=f||h.index||0,(isNaN(f)||0>f||f>=ln())&&(f=0),c.currItem=an(f),(G.isOldIOSPhone||G.isOldAndroid)&&(ke=!1),e.setAttribute('aria-hidden','false'),h.modal&&(ke?e.style.position='fixed':(e.style.position='absolute',e.style.top=d.getScrollY()+'px')),void 0===U&&(Ne('initialLayout'),U=W=d.getScrollY());var l='pswp--open ';for(h.mainClass&&(l+=h.mainClass+' '),h.showHideOpacity&&(l+='pswp--animate_opacity '),l+=Z?'pswp--touch':'pswp--notouch',l+=G.animationName?' pswp--css_animation':'',l+=G.svg?' pswp--svg':'',d.addClass(e,l),c.updateSize(),w=-1,Te=null,t=0;t<u;t++)He((t+w)*Ie.x,A[t].el.style);K||d.bind(c.scrollWrap,E,c),Le('initialZoomInEnd',function(){c.setContent(A[0],f-1),c.setContent(A[2],f+1),A[0].el.style.display=A[2].el.style.display='block',h.focus&&e.focus(),Ve()}),c.setContent(A[1],f),c.updateCurrItem(),Ne('afterInit'),ke||(D=setInterval(function(){lt||Q||oe||_!==c.currItem.initialZoomLevel||c.updateSize()},1e3)),d.addClass(e,'pswp--visible')}},close:function(){g&&(g=!1,x=!0,Ne('close'),Xe(),sn(c.currItem,null,!0,c.destroy))},destroy:function(){Ne('destroy'),Qt&&clearTimeout(Qt),e.setAttribute('aria-hidden','true'),e.className=H,D&&clearInterval(D),d.unbind(c.scrollWrap,E,c),d.unbind(window,'scroll',c),St(),rt(),Re=null},panTo:function(e,t,n){n||(e>de.min.x?e=de.min.x:e<de.max.x&&(e=de.max.x),t>de.min.y?t=de.min.y:t<de.max.y&&(t=de.max.y)),Ce.x=e,Ce.y=t,Be()},handleEvent:function(t){t=t||window.event,v[t.type]&&v[t.type](t)},goTo:function(e){e=Fe(e);var t=e-f;Te=t,f=e,c.currItem=an(f),ve-=t,We(Ie.x*ve),rt(),ce=!1,c.updateCurrItem()},next:function(){c.goTo(f+1)},prev:function(){c.goTo(f-1)},updateCurrZoomItem:function(e){if(e&&Ne('beforeChange',0),A[1].el.children.length){var t=A[1].el.children[0];pe=d.hasClass(t,'pswp__zoom-wrap')?t.style:null}else pe=null;de=c.currItem.bounds,I=_=c.currItem.initialZoomLevel,Ce.x=de.center.x,Ce.y=de.center.y,e&&Ne('afterChange')},invalidateCurrItems:function(){S=!0;for(var e=0;e<u;e++)A[e].item&&(A[e].item.needsUpdate=!0)},updateCurrItem:function(e){if(0!==Te){var t,n=o(Te);if(!(e&&2>n)){c.currItem=an(f),Ae=!1,Ne('beforeChange',Te),n>=u&&(w+=Te+(0<Te?-u:u),n=u);for(var a=0;a<n;a++)0<Te?(t=A.shift(),A[u-1]=t,w++,He((w+2)*Ie.x,t.el.style),c.setContent(t,f-n+a+1+1)):(t=A.pop(),A.unshift(t),w--,He(w*Ie.x,t.el.style),c.setContent(t,f+n-a-1-1));if(pe&&1===o(Te)){var i=an(O);i.initialZoomLevel!==_&&(un(i,Ee),yn(i),Me(i))}Te=0,c.updateCurrZoomItem(),O=f,Ne('afterChange')}}},updateSize:function(n){if(!ke&&h.modal){var a=d.getScrollY();if(U!==a&&(e.style.top=a+'px',U=a),!n&&Se.x===window.innerWidth&&Se.y===window.innerHeight)return;Se.x=window.innerWidth,Se.y=window.innerHeight,e.style.height=Se.y+'px'}if(Ee.x=c.scrollWrap.clientWidth,Ee.y=c.scrollWrap.clientHeight,at(),Ie.x=Ee.x+t(Ee.x*h.spacing),Ie.y=Ee.y,We(Ie.x*ve),Ne('beforeResize'),void 0!==w){for(var l,o,s,r=0;r<u;r++)l=A[r],He((r+w)*Ie.x,l.el.style),s=f+r-1,h.loop&&2<ln()&&(s=Fe(s)),o=an(s),o&&(S||o.needsUpdate||!o.bounds)?(c.cleanSlide(o),c.setContent(l,s),1===r&&(c.currItem=o,c.updateCurrZoomItem(!0)),o.needsUpdate=!1):-1===l.index&&0<=s&&c.setContent(l,s),o&&o.container&&(un(o,Ee),yn(o),Me(o));S=!1}I=_=c.currItem.initialZoomLevel,de=c.currItem.bounds,de&&(Ce.x=de.center.x,Ce.y=de.center.y,Be(!0)),Ne('resize')},zoomTo:function(e,t,n,a,i){t&&(I=_,_t.x=o(t.x)-Ce.x,_t.y=o(t.y)-Ce.y,Ue(we,Ce));var l=je(e,!1),s={};Qe('x',l,s,e),Qe('y',l,s,e);var r=_,p={x:Ce.x,y:Ce.y};Ge(s);var c=function(t){1===t?(_=e,Ce.x=s.x,Ce.y=s.y):(_=(e-r)*t+r,Ce.x=(s.x-p.x)*t+p.x,Ce.y=(s.y-p.y)*t+p.y),i&&i(t),Be(1===t)};n?dt('customZoomTo',0,1,n,a||d.easing.sine.inOut,c):c(1)}})}})},function(e,n,a){var i,l;(function(t,o){i=o,l='function'==typeof i?i.call(n,a,n,e):i,!(l!==void 0&&(e.exports=l))})(this,function(){'use strict';return function(n,l){var a,i,e,o,s,r,d,p,c,m,u,h,g,x,y,f,b,w,C=this,E=!1,v=!0,_=!0,I={barsSize:{top:44,bottom:'auto'},closeElClasses:['item','caption','zoom-wrap','ui','top-bar'],timeToIdle:4e3,timeToIdleOutside:1e3,loadingIndicatorDelay:1e3,addCaptionHTMLFn:function(e,t){return e.title?(t.children[0].innerHTML=e.title,!0):(t.children[0].innerHTML='',!1)},closeEl:!0,captionEl:!0,fullscreenEl:!0,zoomEl:!0,shareEl:!0,counterEl:!0,arrowEl:!0,preloaderEl:!0,tapToClose:!1,tapToToggleControls:!0,clickToCloseNonZoomable:!0,shareButtons:[{id:'facebook',label:'Share on Facebook',url:'https://www.facebook.com/sharer/sharer.php?u={{url}}'},{id:'twitter',label:'Tweet',url:'https://twitter.com/intent/tweet?text={{text}}&url={{url}}'},{id:'pinterest',label:'Pin it',url:'http://www.pinterest.com/pin/create/button/?url={{url}}&media={{image_url}}&description={{text}}'},{id:'download',label:'Download image',url:'{{raw_image_url}}',download:!0}],getImageURLForShare:function(){return n.currItem.src||''},getPageURLForShare:function(){return window.location.href},getTextForShare:function(){return n.currItem.title||''},indexIndicatorSep:' / ',fitControlsWidth:1200},T=function(t){if(f)return!0;t=t||window.event,y.timeToIdle&&y.mouseUsed&&!c&&z();for(var e,n,a=t.target||t.srcElement,o=a.getAttribute('class')||'',s=0;s<U.length;s++)e=U[s],e.onTap&&-1<o.indexOf('pswp__'+e.name)&&(e.onTap(),n=!0);if(n){t.stopPropagation&&t.stopPropagation(),f=!0;var i=l.features.isOldAndroid?600:30;setTimeout(function(){f=!1},i)}},k=function(){return!n.likelyTouchDevice||y.mouseUsed||screen.width>y.fitControlsWidth},D=function(e,t,n){l[(n?'add':'remove')+'Class'](e,'pswp__'+t)},S=function(){var e=1===y.getNumItemsFn();e!==x&&(D(i,'ui--one-slide',e),x=e)},A=function(){D(d,'share-modal--hidden',_)},O=function(){return _=!_,_?(l.removeClass(d,'pswp__share-modal--fade-in'),setTimeout(function(){_&&A()},300)):(A(),setTimeout(function(){_||l.addClass(d,'pswp__share-modal--fade-in')},30)),_||R(),!1},F=function(a){a=a||window.event;var e=a.target||a.srcElement;return(n.shout('shareLinkClick',a,e),!!e.href)&&(!!e.hasAttribute('download')||(window.open(e.href,'pswp_share','scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=550,height=420,top=100,left='+(window.screen?t(screen.width/2-275):100)),_||O(),!1))},R=function(){for(var e,t,n,a,l,o='',s=0;s<y.shareButtons.length;s++)e=y.shareButtons[s],n=y.getImageURLForShare(e),a=y.getPageURLForShare(e),l=y.getTextForShare(e),t=e.url.replace('{{url}}',encodeURIComponent(a)).replace('{{image_url}}',encodeURIComponent(n)).replace('{{raw_image_url}}',n).replace('{{text}}',encodeURIComponent(l)),o+='<a href="'+t+'" target="_blank" class="pswp__share--'+e.id+'"'+(e.download?'download':'')+'>'+e.label+'</a>',y.parseShareButtonOut&&(o=y.parseShareButtonOut(e,o));d.children[0].innerHTML=o,d.children[0].onclick=F},L=function(e){for(var t=0;t<y.closeElClasses.length;t++)if(l.hasClass(e,'pswp__'+y.closeElClasses[t]))return!0},N=0,z=function(){clearTimeout(w),N=0,c&&C.setIdle(!1)},P=function(t){t=t?t:window.event;var e=t.relatedTarget||t.toElement;e&&'HTML'!==e.nodeName||(clearTimeout(w),w=setTimeout(function(){C.setIdle(!0)},y.timeToIdleOutside))},Z=function(){y.fullscreenEl&&!l.features.isOldAndroid&&(!a&&(a=C.getFullscreenAPI()),a?(l.bind(document,a.eventK,C.updateFullscreen),C.updateFullscreen(),l.addClass(n.template,'pswp--supports-fs')):l.removeClass(n.template,'pswp--supports-fs'))},B=function(){y.preloaderEl&&(M(!0),m('beforeChange',function(){clearTimeout(g),g=setTimeout(function(){n.currItem&&n.currItem.loading?(!n.allowProgressiveImg()||n.currItem.img&&!n.currItem.img.naturalWidth)&&M(!1):M(!0)},y.loadingIndicatorDelay)}),m('imageLoadComplete',function(e,t){n.currItem===t&&M(!0)}))},M=function(e){h!==e&&(D(u,'preloader--active',!e),h=e)},H=function(t){var n=t.vGap;if(k()){var a=y.barsSize;if(!(y.captionEl&&'auto'===a.bottom))n.bottom='auto'===a.bottom?0:a.bottom;else if(o||(o=l.createEl('pswp__caption pswp__caption--fake'),o.appendChild(l.createEl('pswp__caption__center')),i.insertBefore(o,e),l.addClass(i,'pswp__ui--fit')),y.addCaptionHTMLFn(t,o,!0)){var s=o.clientHeight;n.bottom=parseInt(s,10)||44}else n.bottom=a.top;n.top=a.top}else n.top=n.bottom=0},W=function(){y.timeToIdle&&m('mouseUsed',function(){l.bind(document,'mousemove',z),l.bind(document,'mouseout',P),b=setInterval(function(){N++,2==N&&C.setIdle(!0)},y.timeToIdle/2)})},K=function(){m('onVerticalDrag',function(e){v&&0.95>e?C.hideControls():!v&&0.95<=e&&C.showControls()});var e;m('onPinchClose',function(t){v&&0.9>t?(C.hideControls(),e=!0):e&&!v&&0.9<t&&C.showControls()}),m('zoomGestureEnded',function(){e=!1,e&&!v&&C.showControls()})},U=[{name:'caption',option:'captionEl',onInit:function(t){e=t}},{name:'share-modal',option:'shareEl',onInit:function(e){d=e},onTap:function(){O()}},{name:'button--share',option:'shareEl',onInit:function(e){r=e},onTap:function(){O()}},{name:'button--zoom',option:'zoomEl',onTap:n.toggleDesktopZoom},{name:'counter',option:'counterEl',onInit:function(e){s=e}},{name:'button--close',option:'closeEl',onTap:n.close},{name:'button--arrow--left',option:'arrowEl',onTap:n.prev},{name:'button--arrow--right',option:'arrowEl',onTap:n.next},{name:'button--fs',option:'fullscreenEl',onTap:function(){a.isFullscreen()?a.exit():a.enter()}},{name:'preloader',option:'preloaderEl',onInit:function(e){u=e}}],G=function(){var e,t,n,a=function(o){if(o)for(var s=o.length,r=0;r<s;r++){e=o[r],t=e.className;for(var i=0;i<U.length;i++)n=U[i],-1<t.indexOf('pswp__'+n.name)&&(y[n.option]?(l.removeClass(e,'pswp__element--disabled'),n.onInit&&n.onInit(e)):l.addClass(e,'pswp__element--disabled'))}};a(i.children);var o=l.getChildByClass(i,'pswp__top-bar');o&&a(o.children)};C.init=function(){l.extend(n.options,I,!0),y=n.options,i=l.getChildByClass(n.scrollWrap,'pswp__ui'),m=n.listen,K(),m('beforeChange',C.update),m('doubleTap',function(e){var t=n.currItem.initialZoomLevel;n.getZoomLevel()===t?n.zoomTo(y.getDoubleTapZoom(!1,n.currItem),e,333):n.zoomTo(t,e,333)}),m('preventDragEvent',function(n,e,a){var i=n.target||n.srcElement;i&&i.getAttribute('class')&&-1<n.type.indexOf('mouse')&&(0<i.getAttribute('class').indexOf('__caption')||/(SMALL|STRONG|EM)/i.test(i.tagName))&&(a.prevent=!1)}),m('bindEvents',function(){l.bind(i,'pswpTap click',T),l.bind(n.scrollWrap,'pswpTap',C.onGlobalTap),n.likelyTouchDevice||l.bind(n.scrollWrap,'mouseover',C.onMouseOver)}),m('unbindEvents',function(){_||O(),b&&clearInterval(b),l.unbind(document,'mouseout',P),l.unbind(document,'mousemove',z),l.unbind(i,'pswpTap click',T),l.unbind(n.scrollWrap,'pswpTap',C.onGlobalTap),l.unbind(n.scrollWrap,'mouseover',C.onMouseOver),a&&(l.unbind(document,a.eventK,C.updateFullscreen),a.isFullscreen()&&(y.hideAnimationDuration=0,a.exit()),a=null)}),m('destroy',function(){y.captionEl&&(o&&i.removeChild(o),l.removeClass(e,'pswp__caption--empty')),d&&(d.children[0].onclick=null),l.removeClass(i,'pswp__ui--over-close'),l.addClass(i,'pswp__ui--hidden'),C.setIdle(!1)}),y.showAnimationDuration||l.removeClass(i,'pswp__ui--hidden'),m('initialZoomIn',function(){y.showAnimationDuration&&l.removeClass(i,'pswp__ui--hidden')}),m('initialZoomOut',function(){l.addClass(i,'pswp__ui--hidden')}),m('parseVerticalMargin',H),G(),y.shareEl&&r&&d&&(_=!0),S(),W(),Z(),B()},C.setIdle=function(e){c=e,D(i,'ui--idle',e)},C.update=function(){v&&n.currItem?(C.updateIndexIndicator(),y.captionEl&&(y.addCaptionHTMLFn(n.currItem,e),D(e,'caption--empty',!n.currItem.title)),E=!0):E=!1,_||O(),S()},C.updateFullscreen=function(t){t&&setTimeout(function(){n.setScrollOffset(0,l.getScrollY())},50),l[(a.isFullscreen()?'add':'remove')+'Class'](n.template,'pswp--fs')},C.updateIndexIndicator=function(){y.counterEl&&(s.innerHTML=n.getCurrentIndex()+1+y.indexIndicatorSep+y.getNumItemsFn())},C.onGlobalTap=function(t){t=t||window.event;var e=t.target||t.srcElement;if(!f)if(t.detail&&'mouse'===t.detail.pointerType){if(L(e))return void n.close();l.hasClass(e,'pswp__img')&&(1===n.getZoomLevel()&&n.getZoomLevel()<=n.currItem.fitRatio?y.clickToCloseNonZoomable&&n.close():n.toggleDesktopZoom(t.detail.releasePoint))}else if(y.tapToToggleControls&&(v?C.hideControls():C.showControls()),y.tapToClose&&(l.hasClass(e,'pswp__img')||L(e)))return void n.close()},C.onMouseOver=function(t){t=t||window.event;var e=t.target||t.srcElement;D(i,'ui--over-close',L(e))},C.hideControls=function(){l.addClass(i,'pswp__ui--hidden'),v=!1},C.showControls=function(){v=!0,E||C.update(),l.removeClass(i,'pswp__ui--hidden')},C.supportsFullscreen=function(){var e=document;return!!(e.exitFullscreen||e.mozCancelFullScreen||e.webkitExitFullscreen||e.msExitFullscreen)},C.getFullscreenAPI=function(){var e,t=document.documentElement,a='fullscreenchange';return t.requestFullscreen?e={enterK:'requestFullscreen',exitK:'exitFullscreen',elementK:'fullscreenElement',eventK:a}:t.mozRequestFullScreen?e={enterK:'mozRequestFullScreen',exitK:'mozCancelFullScreen',elementK:'mozFullScreenElement',eventK:'moz'+a}:t.webkitRequestFullscreen?e={enterK:'webkitRequestFullscreen',exitK:'webkitExitFullscreen',elementK:'webkitFullscreenElement',eventK:'webkit'+a}:t.msRequestFullscreen&&(e={enterK:'msRequestFullscreen',exitK:'msExitFullscreen',elementK:'msFullscreenElement',eventK:'MSFullscreenChange'}),e&&(e.enter=function(){return p=y.closeOnScroll,y.closeOnScroll=!1,'webkitRequestFullscreen'===this.enterK?void n.template[this.enterK](Element.ALLOW_KEYBOARD_INPUT):n.template[this.enterK]()},e.exit=function(){return y.closeOnScroll=p,document[this.exitK]()},e.isFullscreen=function(){return document[this.elementK]}),e}}})},function(e,t,n){'use strict';var a=n(0);class i{constructor(e){this._collection=null,this._filters=[],this.gallery=e}addFilter(e){this.filters.push(e)}refresh(){this.filters.forEach(function(e){e.render()})}render(){let e=document.createElement('div');a.a.addClass(e,'natural-gallery-images sectionContainer'),e.appendChild(a.a.getIcon('icon-pict'));let t=document.createElement('div');a.a.addClass(t,'sectionName'),t.textContent='Images',e.appendChild(t);let n=document.createElement('span');e.appendChild(n),a.a.addClass(n,'natural-gallery-visible');let i=document.createElement('span');i.textContent='/',e.appendChild(i);let l=document.createElement('span');return a.a.addClass(l,'natural-gallery-total'),e.appendChild(l),this.element=document.createElement('div'),this.filters.forEach(function(e){this.element.appendChild(e.render())},this),a.a.addClass(this.element,'natural-gallery-header'),this.element.appendChild(e),this.element}isFiltered(){return null!==this.collection}filter(){let e=null;this.filters.forEach(function(t){t.isActive()&&(null==e?e=t.collection:e=a.a.intersectionBy(e,t.collection,'id'))}),this.collection=e,this.gallery.refresh()}get collection(){return this._collection}set collection(e){this._collection=e}get element(){return this._element}set element(e){this._element=e}get gallery(){return this._gallery}set gallery(e){this._gallery=e}get filters(){return this._filters}set filters(e){this._filters=e}}t.a=i},function(e,t,n){'use strict';var a=n(0),i=n(1);class l extends i.a{render(){let e=document.createElement('div');a.a.addClass(e,'natural-gallery-searchTerm sectionContainer'),e.appendChild(a.a.getIcon('icon-search')),e.appendChild(this.getInput());let t=document.createElement('label');a.a.addClass(t,'sectionName'),t.textContent='Search',e.appendChild(t);let n=document.createElement('span');return a.a.addClass(n,'bar'),e.appendChild(n),e}getInput(){const e=this;let t=document.createElement('input');return t.setAttribute('required',''),t.addEventListener('keyup',function(t){let n=this;27==t.keyCode&&(n.value=''),e.filter(n.value)}),t}filter(e){this.collection=null;let t=a.a.removeDiacritics(e).toLowerCase();0<t.length&&(this.collection=[],this.header.gallery.getOriginalCollection().forEach(function(e){let n=a.a.removeDiacritics(e.title+' '+(e.description?e.description:'')).toLowerCase();-1!=n.search(t)&&this.collection.push(e)},this)),this.header.filter()}}t.a=l},function(e,t,n){'use strict';var a=n(1),i=n(12),l=n(0);class o extends a.a{constructor(e){super(e),this.header=e,this._categories=[]}set element(e){this._element=e}render(){if(this.prepare(),!this.element){this.element=document.createElement('div'),l.a.addClass(this.element,'natural-gallery-categories sectionContainer');let e=document.createElement('div');l.a.addClass(e,'sectionName'),e.textContent='Categories',this.element.appendChild(e)}let e=this.element.getElementsByTagName('label')[0];return e&&e.parentNode.removeChild(e),this.categories.forEach(function(e){this.element.appendChild(e.render())},this),this.element}prepare(){let e=[];this.header.gallery.categories.forEach(function(t){e.push(new i.a(t.id,t.title,this))},this),this.none=new i.a(-1,'None',this),this.others=new i.a(-2,'Others',this),this.header.gallery.options.showNone&&e.length&&e.push(this.none),this.header.gallery.options.showOthers&&e.length&&e.push(this.others);let t=[];this.header.gallery.getOriginalCollection().forEach(function(n){(!n.categories||n.categories&&0===n.categories.length&&this.header.gallery.options.showNone)&&(n.categories=[this.none]),e.length&&l.a.differenceBy(n.categories,e,'id').length===n.categories.length&&this.header.gallery.options.showOthers&&(n.categories=[this.others]),n.categories.forEach(function(e){t.push(new i.a(e.id,e.title,this))},this)},this),e=l.a.uniqBy(e,'id'),t=l.a.uniqBy(t,'id'),this.categories=e.length?l.a.intersectionBy(e,t,'id'):t}filter(){let e=this.categories.filter(function(e){return e.isActive});if(e.length===this.categories.length)this.collection=null;else if(0===e.length)this.collection=[];else{let t=[];this.header.gallery.getOriginalCollection().forEach(function(n){!n.categories||n.categories&&0===n.categories.length?this.none&&t.push(n):n.categories.some(function(a){let i=e.some(function(e){return a.id===e.id});if(i)return t.push(n),!0})},this),this.collection=t}this.header.filter()}get categories(){return this._categories}set categories(e){this._categories=e}get others(){return this._others}set others(e){this._others=e}get none(){return this._none}set none(e){this._none=e}get element(){return this._element}}t.a=o},function(e,t,n){'use strict';var a=n(0);class i{constructor(e,t,n){this.filter=n,this._isActive=!0,this.id=e,this.title=t}render(){const e=this;this.element=document.createElement('label');let t=document.createElement('input');t.setAttribute('type','checkbox'),t.setAttribute('checked','checked'),t.addEventListener('change',function(){e.isActive=!e.isActive,e.filter.filter()}),this.element.appendChild(t);let n=document.createElement('span');n.textContent=this.title;let i=document.createElement('span');a.a.addClass(i,'label'),i.appendChild(a.a.getIcon('icon-category')),i.appendChild(n),this.element.appendChild(i);let l=document.createElement('span');return a.a.addClass(l,'bar'),this.element.appendChild(l),this.element}get id(){return this._id}set id(e){this._id=e}get title(){return this._title}set title(e){this._title=e}get isActive(){return this._isActive}set isActive(e){this._isActive=e}get element(){return this._element}set element(e){this._element=e}}t.a=i},function(n,a,i){'use strict';i.d(a,'a',function(){return l});var l;(function(n){n.organize=function(e){'natural'==e.options.format?this.organizeNatural(e.collection,e.bodyWidth,e.options.rowHeight,e.options.margin):'square'==e.options.format&&this.organizeSquare(e.collection,e.bodyWidth,e.options.imagesPerRow,e.options.margin),e.style()},n.organizeSquare=function(t,n,a,i){i||(i=0),a||(a=4);let l=(n-(a-1)*i)/a;for(let o,s=0;s<t.length;s++)o=t[s],o.width=e(l),o.height=e(l),o.last=s%a==a-1,o.row=e(s/a)},n.organizeNatural=function(e,t,n,a,i=null){i||(i=0),a||(a=0),n||(n=300);for(let l=1;l<=e.length;l++){let o=e.slice(0,l),s=this.getRowWidth(n,a,o);if(s>=t){this.computeSizes(o,t,a,i),this.organizeNatural(e.slice(l),t,n,a,i+1);break}else if(l==e.length){this.computeSizes(o,null,a,i,n);break}}},n.computeSizes=function(n,a,i,l,o=null){let s=a?this.getRowHeight(a,i,n):o,r=this.getRowWidth(s,i,n),d=a?this.apportionExcess(n,a,r):0,p=0;for(let r=0;r<n.length;r++){let a=n[r],i=this.getImageRatio(a)*s-d;p+=i-e(i),i=e(i),(1<=p||r===n.length-1&&1===t(p))&&(i++,p--),a.width=i,a.height=e(s),a.row=l,a.last=r==n.length-1}},n.getRowWidth=function(e,t,n){return t*(n.length-1)+this.getRatios(n)*e},n.getRowHeight=function(e,t,n){return e/this.getRatios(n)+t*(n.length-1)},n.getRatios=function(e){const t=this;let n=0;for(let a=0;a<e.length;a++)n+=t.getImageRatio(e[a]);return n},n.getImageRatio=function(e){return+e.tWidth/+e.tHeight},n.apportionExcess=function(e,t,n){let a=(n-t)/e.length;return a}})(l||(l={}))},function(){},function(){}])});
=======
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("NaturalGallery", [], factory);
	else if(typeof exports === 'object')
		exports["NaturalGallery"] = factory();
	else
		root["NaturalGallery"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Utility; });
var Utility;
(function (Utility) {
    function getIcon(name) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.innerHTML = '<use xlink:href="#' + name + '"></use>';
        return svg;
    }
    Utility.getIcon = getIcon;
    function debounce(func, wait = 250, immediate = false) {
        let timeout;
        return function () {
            let context = this, args = arguments;
            let later = function () {
                timeout = null;
                if (!immediate)
                    func.apply(context, args);
            };
            let callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow)
                func.apply(context, args);
        };
    }
    Utility.debounce = debounce;
    function toggleClass(element, className) {
        if (!element || !className) {
            return;
        }
        if (!this.hasClass(element, className)) {
            this.addClass(element, className);
        }
        else {
            this.removeClass(element, className);
        }
    }
    Utility.toggleClass = toggleClass;
    function removeClass(element, className) {
        const reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
        element.className = element.className.replace(reg, ' ').replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    }
    Utility.removeClass = removeClass;
    function addClass(element, className) {
        if (!this.hasClass(className)) {
            element.className += (element.className ? ' ' : '') + className;
        }
    }
    Utility.addClass = addClass;
    function hasClass(el, className) {
        return el.className && new RegExp('(^|\\s)' + className + '(\\s|$)').test(el.className);
    }
    Utility.hasClass = hasClass;
    function removeDiacritics(str) {
        for (var i = 0; i < defaultDiacriticsRemovalMap.length; i++) {
            str = str.replace(defaultDiacriticsRemovalMap[i].letters, defaultDiacriticsRemovalMap[i].base);
        }
        return str;
    }
    Utility.removeDiacritics = removeDiacritics;
    function uniqBy(collection, attr) {
        const newCollection = [];
        collection.forEach(function (item) {
            const found = newCollection.some(function (el) {
                return item[attr] == el[attr];
            });
            if (!found) {
                newCollection.push(item);
            }
        });
        return newCollection;
    }
    Utility.uniqBy = uniqBy;
    function differenceBy(col1, col2, attr) {
        const collection = [];
        col1.forEach(function (el1) {
            const found = col2.some(function (el2) {
                return el1[attr] == el2[attr];
            });
            if (!found) {
                collection.push(el1);
            }
        });
        return collection;
    }
    Utility.differenceBy = differenceBy;
    function intersectionBy(col1, col2, attr) {
        const collection = [];
        col1.forEach(function (el1) {
            const found = col2.some(function (el2) {
                return el1[attr] == el2[attr];
            });
            if (found) {
                collection.push(el1);
            }
        });
        return collection;
    }
    Utility.intersectionBy = intersectionBy;
    // @off
    // Source = http://web.archive.org/web/20120918093154/http://lehelk.com/2011/05/06/script-to-remove-diacritics/
    const defaultDiacriticsRemovalMap = [
        { 'base': 'A', 'letters': /[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g },
        { 'base': 'AA', 'letters': /[\uA732]/g },
        { 'base': 'AE', 'letters': /[\u00C6\u01FC\u01E2]/g },
        { 'base': 'AO', 'letters': /[\uA734]/g },
        { 'base': 'AU', 'letters': /[\uA736]/g },
        { 'base': 'AV', 'letters': /[\uA738\uA73A]/g },
        { 'base': 'AY', 'letters': /[\uA73C]/g },
        { 'base': 'B', 'letters': /[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g },
        { 'base': 'C', 'letters': /[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g },
        { 'base': 'D', 'letters': /[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g },
        { 'base': 'DZ', 'letters': /[\u01F1\u01C4]/g },
        { 'base': 'Dz', 'letters': /[\u01F2\u01C5]/g },
        { 'base': 'E', 'letters': /[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g },
        { 'base': 'F', 'letters': /[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g },
        { 'base': 'G', 'letters': /[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g },
        { 'base': 'H', 'letters': /[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g },
        { 'base': 'I', 'letters': /[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g },
        { 'base': 'J', 'letters': /[\u004A\u24BF\uFF2A\u0134\u0248]/g },
        { 'base': 'K', 'letters': /[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g },
        { 'base': 'L', 'letters': /[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g },
        { 'base': 'LJ', 'letters': /[\u01C7]/g },
        { 'base': 'Lj', 'letters': /[\u01C8]/g },
        { 'base': 'M', 'letters': /[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g },
        { 'base': 'N', 'letters': /[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g },
        { 'base': 'NJ', 'letters': /[\u01CA]/g },
        { 'base': 'Nj', 'letters': /[\u01CB]/g },
        { 'base': 'O', 'letters': /[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g },
        { 'base': 'OI', 'letters': /[\u01A2]/g },
        { 'base': 'OO', 'letters': /[\uA74E]/g },
        { 'base': 'OU', 'letters': /[\u0222]/g },
        { 'base': 'P', 'letters': /[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g },
        { 'base': 'Q', 'letters': /[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g },
        { 'base': 'R', 'letters': /[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g },
        { 'base': 'S', 'letters': /[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g },
        { 'base': 'T', 'letters': /[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g },
        { 'base': 'TZ', 'letters': /[\uA728]/g },
        { 'base': 'U', 'letters': /[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g },
        { 'base': 'V', 'letters': /[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g },
        { 'base': 'VY', 'letters': /[\uA760]/g },
        { 'base': 'W', 'letters': /[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g },
        { 'base': 'X', 'letters': /[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g },
        { 'base': 'Y', 'letters': /[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g },
        { 'base': 'Z', 'letters': /[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g },
        { 'base': 'a', 'letters': /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g },
        { 'base': 'aa', 'letters': /[\uA733]/g },
        { 'base': 'ae', 'letters': /[\u00E6\u01FD\u01E3]/g },
        { 'base': 'ao', 'letters': /[\uA735]/g },
        { 'base': 'au', 'letters': /[\uA737]/g },
        { 'base': 'av', 'letters': /[\uA739\uA73B]/g },
        { 'base': 'ay', 'letters': /[\uA73D]/g },
        { 'base': 'b', 'letters': /[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g },
        { 'base': 'c', 'letters': /[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g },
        { 'base': 'd', 'letters': /[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g },
        { 'base': 'dz', 'letters': /[\u01F3\u01C6]/g },
        { 'base': 'e', 'letters': /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g },
        { 'base': 'f', 'letters': /[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g },
        { 'base': 'g', 'letters': /[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g },
        { 'base': 'h', 'letters': /[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g },
        { 'base': 'hv', 'letters': /[\u0195]/g },
        { 'base': 'i', 'letters': /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g },
        { 'base': 'j', 'letters': /[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g },
        { 'base': 'k', 'letters': /[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g },
        { 'base': 'l', 'letters': /[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g },
        { 'base': 'lj', 'letters': /[\u01C9]/g },
        { 'base': 'm', 'letters': /[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g },
        { 'base': 'n', 'letters': /[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g },
        { 'base': 'nj', 'letters': /[\u01CC]/g },
        { 'base': 'o', 'letters': /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g },
        { 'base': 'oi', 'letters': /[\u01A3]/g },
        { 'base': 'ou', 'letters': /[\u0223]/g },
        { 'base': 'oo', 'letters': /[\uA74F]/g },
        { 'base': 'p', 'letters': /[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g },
        { 'base': 'q', 'letters': /[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g },
        { 'base': 'r', 'letters': /[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g },
        { 'base': 's', 'letters': /[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g },
        { 'base': 't', 'letters': /[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g },
        { 'base': 'tz', 'letters': /[\uA729]/g },
        { 'base': 'u', 'letters': /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g },
        { 'base': 'v', 'letters': /[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g },
        { 'base': 'vy', 'letters': /[\uA761]/g },
        { 'base': 'w', 'letters': /[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g },
        { 'base': 'x', 'letters': /[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g },
        { 'base': 'y', 'letters': /[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g },
        { 'base': 'z', 'letters': /[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g }
    ];
    // @on
})(Utility || (Utility = {}));


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class AbstractFilter {
    constructor(header) {
        this.header = header;
        /**
         * If null, means no filter active
         * If empty, means filter active, but no results
         * If not empty, means filter active, and there are wanted items
         * @type {null}
         * @private
         */
        this._collection = null;
    }
    isActive() {
        return this.collection !== null;
    }
    get collection() {
        return this._collection;
    }
    set collection(value) {
        this._collection = value;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AbstractFilter;



/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(3);


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["add"] = add;
/* harmony export (immutable) */ __webpack_exports__["getById"] = getById;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__js_Controller__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__styles_natural_gallery_scss__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__styles_natural_gallery_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__styles_natural_gallery_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__styles_themes_natural_css__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__styles_themes_natural_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__styles_themes_natural_css__);



if (typeof naturalGalleries !== 'undefined' && naturalGalleries.constructor === Array) {
    __WEBPACK_IMPORTED_MODULE_0__js_Controller__["a" /* Controller */].getInstance().addGalleries(naturalGalleries);
}
function add(gallery) {
    return __WEBPACK_IMPORTED_MODULE_0__js_Controller__["a" /* Controller */].getInstance().addGallery(gallery);
}
function getById(id) {
    __WEBPACK_IMPORTED_MODULE_0__js_Controller__["a" /* Controller */].getInstance().getById(id);
}


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Gallery__ = __webpack_require__(5);

class Controller {
    constructor() {
        /**
         * Used to test the scroll direction
         * Avoid to load more images when scrolling up in the detection zone
         * @type {number}
         */
        this.old_scroll_top = 0;
        this.galleries = [];
        this.bindEvents();
        this.pswp = document.getElementsByClassName('pswp')[0];
    }
    /**
     * Bootstrap galleries
     * For each gallery in the page, set a body container (dom element) and compute images sizes, then add elements to dom container
     */
    addGalleries(galleries = null) {
        galleries.forEach(function (gallery, i) {
            galleries[i] = this.addGallery(gallery);
        }, this);
    }
    addGallery(gallery) {
        if (!gallery) {
            return;
        }
        gallery = new __WEBPACK_IMPORTED_MODULE_0__Gallery__["a" /* Gallery */](gallery, this.pswp);
        this.galleries.push(gallery);
        return gallery;
    }
    static getInstance() {
        return Controller.instance ? Controller.instance : new Controller();
    }
    getById(id) {
        let found = null;
        this.galleries.forEach(function (gallery) {
            if (gallery.id == id) {
                found = gallery;
            }
        });
        return found;
    }
    /**
     * Check whetever we need to resize a gallery (only if parent container width changes)
     */
    resize() {
        this.galleries.forEach(function (gallery) {
            gallery.resize();
        });
    }
    /**
     * Bind generic events that are valid for all galleries like window scroll and resize
     */
    bindEvents() {
        let self = this;
        /**
         * Gallery is paginated.
         * Pages can be added to the bottom of the gallery manually or on scroll
         * Allow scroll if there is only a single gallery on page and no limit specified
         * If the limit is specified, the gallery switch to manual mode.
         */
        document.addEventListener('scroll', function () {
            if (self.galleries.length == 1 && self.galleries[0].options.limit === 0) {
                let gallery = self.galleries[0];
                let endOfGalleryAt = gallery.rootElement.offsetTop + gallery.rootElement.offsetHeight + 60;
                // Avoid to expand gallery if we are scrolling up
                let current_scroll_top = (window.pageYOffset || document.documentElement.scrollTop)
                    - (document.documentElement.clientTop || 0);
                let window_size = window.innerHeight;
                let scroll_delta = current_scroll_top - self.old_scroll_top;
                self.old_scroll_top = current_scroll_top;
                // "enableMoreLoading" is a setting coming from the BE bloking / enabling dynamic loading of thumbnail
                if (scroll_delta > 0 && current_scroll_top + window_size > endOfGalleryAt) {
                    // When scrolling only add a row at once
                    self.galleries[0].addElements(1);
                }
            }
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Controller;

/**
 * Singleton
 * A single controller for rule them (galleries) all
 * @type Controller
 */
Controller.instance = null;


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Item__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__filter_Header__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__filter_SearchFilter__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__filter_CategoryFilter__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Utility__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Organizer__ = __webpack_require__(13);






class Gallery {
    /**
     * Initiate gallery
     * @param position
     * @param options
     * @param categories
     * @param pswp
     */
    constructor(gallery, pswp) {
        /**
         * Default options
         */
        this._options = {
            rowHeight: 350,
            format: 'natural',
            round: 3,
            imagesPerRow: 4,
            margin: 3,
            limit: 0,
            showLabels: 'hover',
            lightbox: true,
            minRowsAtStart: 2,
            showCount: false,
            searchFilter: false,
            categoriesFilter: false,
            showNone: false,
            showOthers: false
        };
        /**
         * Photoswipe images container
         * @type {Array}
         */
        this._pswpContainer = [];
        /**
         * Complete collection of images
         * @type {Array}
         */
        this._collection = [];
        this._categories = [];
        this.pswpElement = pswp;
        for (var key in this.options) {
            if (typeof gallery.options[key] === 'undefined') {
                gallery.options[key] = this.options[key];
            }
        }
        this.options = gallery.options;
        this.categories = gallery.categories ? gallery.categories : [];
        this.rootElement = document.getElementById(gallery.id);
        __WEBPACK_IMPORTED_MODULE_4__Utility__["a" /* Utility */].addClass(this.rootElement, 'natural-gallery');
        if (gallery.images) {
            this.collection = gallery.images;
        }
        // header
        if (this.options.searchFilter || this.options.categoriesFilter || this.options.showCount) {
            this.header = new __WEBPACK_IMPORTED_MODULE_1__filter_Header__["a" /* Header */](this);
            if (this.options.searchFilter) {
                this.header.addFilter(new __WEBPACK_IMPORTED_MODULE_2__filter_SearchFilter__["a" /* SearchFilter */](this.header));
            }
            if (this.options.categoriesFilter) {
                this.header.addFilter(new __WEBPACK_IMPORTED_MODULE_3__filter_CategoryFilter__["a" /* CategoryFilter */](this.header));
            }
        }
        this.render();
        this.bodyWidth = Math.floor(this.bodyElement.getBoundingClientRect().width);
    }
    render() {
        const self = this;
        let noResults = document.createElement('div');
        __WEBPACK_IMPORTED_MODULE_4__Utility__["a" /* Utility */].addClass(noResults, 'natural-gallery-noresults');
        noResults.appendChild(__WEBPACK_IMPORTED_MODULE_4__Utility__["a" /* Utility */].getIcon('icon-noresults'));
        let nextButton = document.createElement('div');
        __WEBPACK_IMPORTED_MODULE_4__Utility__["a" /* Utility */].addClass(nextButton, 'natural-gallery-next');
        nextButton.appendChild(__WEBPACK_IMPORTED_MODULE_4__Utility__["a" /* Utility */].getIcon('icon-next'));
        nextButton.addEventListener('click', function (e) {
            e.preventDefault();
            self.addElements();
        });
        // Add iframe at root level that launches a resize when width change
        let iframe = document.createElement('iframe');
        iframe.addEventListener('load', function () {
            let timer = null;
            this.contentWindow.addEventListener('resize', function () {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    self.resize();
                }, 100);
            });
        });
        this.bodyElement = document.createElement('div');
        __WEBPACK_IMPORTED_MODULE_4__Utility__["a" /* Utility */].addClass(this.bodyElement, 'natural-gallery-body');
        this.bodyElement.appendChild(noResults);
        if (this.header) {
            this.rootElement.appendChild(this.header.render());
        }
        this.rootElement.appendChild(this.bodyElement);
        this.rootElement.appendChild(nextButton);
        this.rootElement.appendChild(iframe);
    }
    /**
     * Initialize items
     * @param items
     */
    appendItems(items) {
        let display = false;
        // if it's first addition of items, display them
        if (this.collection.length === 0) {
            display = true;
        }
        // Complete collection
        items.forEach(function (item) {
            item.id = this._collection.length;
            this._collection.push(new __WEBPACK_IMPORTED_MODULE_0__Item__["a" /* Item */](item, this));
        }, this);
        // Compute sizes
        __WEBPACK_IMPORTED_MODULE_5__Organizer__["a" /* Organizer */].organize(this);
        if (this.header) {
            this.header.refresh();
        }
        if (display) {
            this.addElements();
        }
    }
    style() {
        this.collection.forEach(function (item) {
            item.style();
        });
    }
    /**
     * Add a number of rows to DOM container, and to Photoswipe gallery.
     * If rows are not given, is uses backoffice data or compute according to browser size
     * @param gallery target
     * @param rows
     */
    addElements(rows = null) {
        let collection = this.collection;
        // display because filters may add more images and we have to show it again
        let nextButton = this.rootElement.getElementsByClassName('natural-gallery-next')[0];
        nextButton.style.display = 'block';
        if (this.pswpContainer.length === collection.length) {
            nextButton.style.display = 'none';
            if (collection.length === 0) {
                this.rootElement.getElementsByClassName('natural-gallery-noresults')[0].style.display = 'block';
                this.rootElement.getElementsByClassName('natural-gallery-images')[0].style.display = 'none';
            }
            return;
        }
        if (!rows) {
            rows = this.getRowsPerPage(this);
        }
        let nextImage = this.pswpContainer.length;
        let lastRow = this.pswpContainer.length ? collection[nextImage].row + rows : rows;
        // Select next elements, comparing their rows
        for (let i = nextImage; i < collection.length; i++) {
            let item = collection[i];
            if (item.row < lastRow) {
                this.pswpContainer.push(item.getPswpItem());
                this.bodyElement.appendChild(item.loadElement());
                item.bindClick();
                item.flash();
            }
            // Show / Hide "more" button.
            if (this.pswpContainer.length === collection.length) {
                nextButton.style.display = 'none';
            }
        }
        let noResults = this.rootElement.getElementsByClassName('natural-gallery-noresults')[0];
        if (noResults)
            noResults.style.display = 'none';
        let imageContainer = this.rootElement.getElementsByClassName('natural-gallery-images')[0];
        if (imageContainer)
            imageContainer.style.display = 'block';
        let galleryVisible = this.rootElement.getElementsByClassName('natural-gallery-visible')[0];
        if (galleryVisible)
            galleryVisible.textContent = String(this.pswpContainer.length);
        let galleryTotal = this.rootElement.getElementsByClassName('natural-gallery-total')[0];
        if (galleryTotal)
            galleryTotal.textContent = String(collection.length);
    }
    /**
     * Return number of rows to show per page,
     * If a number of rows are specified in the backoffice, this data is used.
     * If not specified, uses the vertical available space to compute the number of rows to display.
     * There is a letiable in the header of this file to specify the  minimum number of rows for the computation (minNumberOfRowsAtStart)
     * @param gallery
     * @returns {*}
     */
    getRowsPerPage(gallery) {
        if (this.options.limit) {
            return this.options.limit;
        }
        let winHeight = window.outerHeight;
        let galleryVisibleHeight = winHeight - gallery.bodyElement.offsetTop;
        let nbRows = Math.floor(galleryVisibleHeight / (this.options.rowHeight * 0.7)); // ratio to be more close from reality average row height
        return nbRows < this.options.minRowsAtStart ? this.options.minRowsAtStart : nbRows;
    }
    /**
     * Check whetever we need to resize a gallery (only if parent container width changes)
     * The keep full rows, it recomputes sizes with new dimension, and reset everything, then add the same number of row. It results in not partial row.
     */
    resize() {
        let containerWidth = Math.floor(this.bodyElement.getBoundingClientRect().width);
        if (containerWidth != this.bodyWidth) {
            this.bodyWidth = containerWidth;
            __WEBPACK_IMPORTED_MODULE_5__Organizer__["a" /* Organizer */].organize(this);
            let nbRows = this.collection[this.pswpContainer.length - 1].row + 1;
            this.reset();
            this.addElements(nbRows);
        }
    }
    refresh() {
        this.reset();
        __WEBPACK_IMPORTED_MODULE_5__Organizer__["a" /* Organizer */].organize(this);
        this.addElements();
    }
    /**
     * Empty DOM container and PhotoSwipe container
     */
    reset() {
        this.pswpContainer = [];
        this._collection.forEach(function (item) {
            item.remove();
        });
        let results = this.rootElement.getElementsByClassName('natural-gallery-noresults')[0];
        if (results) {
            results.style.display = 'none';
        }
    }
    /**
     * Pseudo attribute, works like a "post-add-images".
     * If gallery config has .images attribute specified before gallery object creation, the constructor will deal with .images attribute to create the official collection
     * If user specifies .images attribute after library load, this function will take care of it.
     * For post load, user needs to keep reference to this object.
     * @param images
     */
    set images(images) {
        this.collection = images;
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get pswpContainer() {
        return this._pswpContainer;
    }
    set pswpContainer(value) {
        this._pswpContainer = value;
    }
    get collection() {
        return this.header && this.header.isFiltered() ? this.header.collection : this._collection;
    }
    getOriginalCollection() {
        return this._collection;
    }
    set collection(items) {
        this._collection = [];
        this.appendItems(items);
    }
    get bodyWidth() {
        return this._bodyWidth;
    }
    set bodyWidth(value) {
        this._bodyWidth = value;
    }
    get bodyElement() {
        return this._bodyElement;
    }
    set bodyElement(value) {
        this._bodyElement = value;
    }
    get rootElement() {
        return this._rootElement;
    }
    set rootElement(value) {
        this._rootElement = value;
    }
    get pswpApi() {
        return this._pswpApi;
    }
    set pswpApi(value) {
        this._pswpApi = value;
    }
    get pswpElement() {
        return this._pswpElement;
    }
    set pswpElement(value) {
        this._pswpElement = value;
    }
    get options() {
        return this._options;
    }
    set options(value) {
        this._options = value;
    }
    get header() {
        return this._header;
    }
    set header(value) {
        this._header = value;
    }
    get categories() {
        return this._categories;
    }
    set categories(value) {
        this._categories = value;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Gallery;



/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utility__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_photoswipe__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_photoswipe___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_photoswipe__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_photoswipe_dist_photoswipe_ui_default__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_photoswipe_dist_photoswipe_ui_default___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_photoswipe_dist_photoswipe_ui_default__);



class Item {
    /**
     * @param fields
     * @param gallery
     */
    constructor(fields, gallery) {
        this.fields = fields;
        this.gallery = gallery;
        this._binded = false;
        this.id = fields.id;
        this.thumbnail = fields.thumbnail;
        this.enlarged = fields.enlarged;
        this.title = this.getTitle(fields);
        this.link = this.getLink(fields);
        this.linkTarget = this.getLinkTarget(fields);
        this.tWidth = fields.tWidth;
        this.tHeight = fields.tHeight;
        this.eWidth = fields.eWidth;
        this.eHeight = fields.eHeight;
        this.categories = fields.categories;
        this.last = fields.last;
        this.createElement();
    }
    getTitle(fields) {
        if (!fields.title) {
            return null;
        }
        return this.getTitleDetails(fields.title).title;
    }
    getLink(fields) {
        if (fields.link) {
            return fields.link;
        }
        return this.getTitleDetails(fields.title).link;
    }
    getLinkTarget(fields) {
        if (fields.linkTarget) {
            return fields.linkTarget;
        }
        return this.getTitleDetails(fields.title).linkTarget;
    }
    getTitleDetails(title) {
        let container = document.createElement('div');
        container.innerHTML = title;
        let links = container.getElementsByTagName("a");
        let details = {
            title: container.textContent,
            link: null,
            linkTarget: null
        };
        if (links[0]) {
            details.link = links[0].getAttribute('href');
            details.linkTarget = links[0].getAttribute('target');
        }
        return details;
    }
    /**
     * Create DOM elements according to element raw data (thumbnail and enlarged urls)
     * Also apply border-radius at this level because it never changed threw time
     * @param element
     * @param gallery
     * @returns {{figure: (*|HTMLElement), image: *}}
     */
    createElement() {
        let options = this.gallery.options;
        let label = null;
        if (this.title && ['true', 'hover'].indexOf(options.showLabels) > -1) {
            label = true;
        }
        let element = document.createElement('div');
        let image = document.createElement('div');
        let link = this.getLinkElement();
        if (options.lightbox && label && link) {
            label = link;
            __WEBPACK_IMPORTED_MODULE_0__Utility__["a" /* Utility */].addClass(label, 'button');
            __WEBPACK_IMPORTED_MODULE_0__Utility__["a" /* Utility */].addClass(image, 'zoomable');
        }
        else if (options.lightbox && label && !link) {
            label = document.createElement('div');
            __WEBPACK_IMPORTED_MODULE_0__Utility__["a" /* Utility */].addClass(element, 'zoomable');
        }
        else if (options.lightbox && !label) {
            // Actually, lightbox has priority on the link that is ignored...
            __WEBPACK_IMPORTED_MODULE_0__Utility__["a" /* Utility */].addClass(element, 'zoomable');
        }
        else if (!options.lightbox && label && link) {
            element = link;
            label = document.createElement('div');
        }
        else if (!options.lightbox && label && !link) {
            label = document.createElement('div');
        }
        else if (!options.lightbox && !label && link) {
            element = link;
            // Pointer cursor is shown, but additionnal effect could be even better.
        }
        __WEBPACK_IMPORTED_MODULE_0__Utility__["a" /* Utility */].addClass(image, 'image');
        __WEBPACK_IMPORTED_MODULE_0__Utility__["a" /* Utility */].addClass(element, 'figure loading visible');
        image.style.backgroundImage = 'url(' + this.thumbnail + ')';
        element.appendChild(image);
        if (options.round) {
            let radius = String(options.round + 'px');
            element.style.borderRadius = radius;
            image.style.borderRadius = radius;
        }
        this.element = element;
        this.image = image;
        if (label) {
            label.textContent = this.title;
            __WEBPACK_IMPORTED_MODULE_0__Utility__["a" /* Utility */].addClass(label, 'title');
            if (options.showLabels == 'hover') {
                __WEBPACK_IMPORTED_MODULE_0__Utility__["a" /* Utility */].addClass(label, 'hover');
            }
            element.appendChild(label);
        }
    }
    getLinkElement() {
        let link = null;
        if (this.link) {
            link = document.createElement('a');
            link.setAttribute('href', this.link);
            __WEBPACK_IMPORTED_MODULE_0__Utility__["a" /* Utility */].addClass(link, 'link');
            if (this.linkTarget) {
                link.setAttribute('target', this.linkTarget);
            }
        }
        return link;
    }
    /**
     * Use computed (organized) data to apply style (size and margin) to elements on DOM
     * Does not apply border-radius because is used to restyle data on browser resize, and border-radius don't change.
     * @param element
     * @param gallery
     */
    style() {
        __WEBPACK_IMPORTED_MODULE_0__Utility__["a" /* Utility */].removeClass(this.element, 'visible');
        this.element.style.width = String(this.width + 'px');
        this.element.style.height = String(this.height + 'px');
        this.element.style.marginRight = String(this.gallery.options.margin + 'px');
        this.element.style.marginBottom = String(this.gallery.options.margin + 'px');
        if (this.last) {
            this.element.style.marginRight = '0';
        }
        this.image.style.width = String(this.width + 'px');
        this.image.style.height = String(this.height + 'px');
        const self = this;
        window.setTimeout(function () {
            __WEBPACK_IMPORTED_MODULE_0__Utility__["a" /* Utility */].addClass(self.element, 'visible');
        }, 0);
    }
    flash() {
        const self = this;
        __WEBPACK_IMPORTED_MODULE_0__Utility__["a" /* Utility */].removeClass(this.element, 'visible');
        window.setTimeout(function () {
            __WEBPACK_IMPORTED_MODULE_0__Utility__["a" /* Utility */].addClass(self.element, 'visible');
        }, 0);
    }
    /**
     * Open photoswipe gallery on click
     * Add elements to gallery when navigating until last element
     * @param image
     * @param gallery
     */
    bindClick() {
        if (!this.gallery.options.lightbox) {
            return;
        }
        const self = this;
        // Avoid multiple bindings
        if (this.binded) {
            return;
        }
        this.binded = true;
        let openPhotoSwipe = function (e) {
            self.openPhotoSwipe.call(self, e, self.element);
        };
        let clickEl = null;
        if (this.link) {
            clickEl = this.image;
        }
        else {
            clickEl = this.element;
        }
        clickEl.addEventListener('click', openPhotoSwipe);
    }
    openPhotoSwipe(e, el) {
        e.preventDefault();
        if (!this.gallery.options.lightbox) {
            return;
        }
        let nodeList = Array.prototype.slice.call(el.parentNode.children);
        let index = nodeList.indexOf(el) - 1;
        let options = {
            index: index,
            bgOpacity: 0.85,
            showHideOpacity: true,
            loop: false
        };
        let pswp = new __WEBPACK_IMPORTED_MODULE_1_photoswipe__(this.gallery.pswpElement, __WEBPACK_IMPORTED_MODULE_2_photoswipe_dist_photoswipe_ui_default__, this.gallery.pswpContainer, options);
        this.gallery.pswpApi = pswp;
        pswp.init();
        let overrideLoop = null;
        // Loading one more page when going to next image
        pswp.listen('beforeChange', function (delta) {
            // Positive delta indicates "go to next" action, we don't load more objects on looping back the gallery (same logic when scrolling)
            if (delta > 0 && pswp.getCurrentIndex() == pswp.items.length - 1) {
                this.gallery.addElements();
            }
            else if (delta === -1 * (pswp.items.length - 1)) {
                overrideLoop = pswp.items.length;
                this.gallery.addElements();
            }
        });
        // After change cannot detect if we are returning back from last to first
        pswp.listen('afterChange', function () {
            if (overrideLoop) {
                pswp.goTo(overrideLoop);
                overrideLoop = null;
            }
        });
    }
    getPswpItem() {
        return {
            src: this._enlarged,
            w: this._eWidth,
            h: this._eHeight,
            title: this._title
        };
    }
    getElement() {
        return this.element;
    }
    /**
     * This function prepare loaded/loading status and return root element.
     * @returns {HTMLElement}
     */
    loadElement() {
        const self = this;
        let img = document.createElement('img');
        img.setAttribute('src', this.thumbnail);
        img.addEventListener('load', function () {
            __WEBPACK_IMPORTED_MODULE_0__Utility__["a" /* Utility */].removeClass(self.element, 'loading');
            __WEBPACK_IMPORTED_MODULE_0__Utility__["a" /* Utility */].addClass(self.element, 'loaded');
        });
        //Detect errored images and hide them smartly
        img.addEventListener('error', function () {
            __WEBPACK_IMPORTED_MODULE_0__Utility__["a" /* Utility */].addClass(self.element, 'errored');
        });
        return this.element;
    }
    remove() {
        if (this.getElement().parentNode) {
            this.getElement().parentNode.removeChild(this.getElement());
        }
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get thumbnail() {
        return this._thumbnail;
    }
    set thumbnail(value) {
        this._thumbnail = value;
    }
    get enlarged() {
        return this._enlarged;
    }
    set enlarged(value) {
        this._enlarged = value;
    }
    get title() {
        return this._title;
    }
    set title(value) {
        this._title = value;
    }
    get tWidth() {
        return this._tWidth;
    }
    set tWidth(value) {
        this._tWidth = value;
    }
    get tHeight() {
        return this._tHeight;
    }
    set tHeight(value) {
        this._tHeight = value;
    }
    get eWidth() {
        return this._eWidth;
    }
    set eWidth(value) {
        this._eWidth = value;
    }
    get eHeight() {
        return this._eHeight;
    }
    set eHeight(value) {
        this._eHeight = value;
    }
    get last() {
        return this._last;
    }
    set last(value) {
        this._last = value;
    }
    get categories() {
        return this._categories;
    }
    set categories(value) {
        this._categories = value;
    }
    get row() {
        return this._row;
    }
    set row(value) {
        this._row = value;
    }
    get height() {
        return this._height;
    }
    set height(value) {
        this._height = value;
    }
    get width() {
        return this._width;
    }
    set width(value) {
        this._width = value;
    }
    get description() {
        return this._description;
    }
    set description(value) {
        this._description = value;
    }
    get binded() {
        return this._binded;
    }
    set binded(value) {
        this._binded = value;
    }
    get link() {
        return this._link;
    }
    set link(value) {
        this._link = value;
    }
    get linkTarget() {
        return this._linkTarget;
    }
    set linkTarget(value) {
        this._linkTarget = value;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Item;



/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*! PhotoSwipe - v4.1.2 - 2017-04-05
* http://photoswipe.com
* Copyright (c) 2017 Dmitry Semenov; */
(function (root, factory) { 
	if (true) {
		!(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.PhotoSwipe = factory();
	}
})(this, function () {

	'use strict';
	var PhotoSwipe = function(template, UiClass, items, options){

/*>>framework-bridge*/
/**
 *
 * Set of generic functions used by gallery.
 * 
 * You're free to modify anything here as long as functionality is kept.
 * 
 */
var framework = {
	features: null,
	bind: function(target, type, listener, unbind) {
		var methodName = (unbind ? 'remove' : 'add') + 'EventListener';
		type = type.split(' ');
		for(var i = 0; i < type.length; i++) {
			if(type[i]) {
				target[methodName]( type[i], listener, false);
			}
		}
	},
	isArray: function(obj) {
		return (obj instanceof Array);
	},
	createEl: function(classes, tag) {
		var el = document.createElement(tag || 'div');
		if(classes) {
			el.className = classes;
		}
		return el;
	},
	getScrollY: function() {
		var yOffset = window.pageYOffset;
		return yOffset !== undefined ? yOffset : document.documentElement.scrollTop;
	},
	unbind: function(target, type, listener) {
		framework.bind(target,type,listener,true);
	},
	removeClass: function(el, className) {
		var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
		el.className = el.className.replace(reg, ' ').replace(/^\s\s*/, '').replace(/\s\s*$/, ''); 
	},
	addClass: function(el, className) {
		if( !framework.hasClass(el,className) ) {
			el.className += (el.className ? ' ' : '') + className;
		}
	},
	hasClass: function(el, className) {
		return el.className && new RegExp('(^|\\s)' + className + '(\\s|$)').test(el.className);
	},
	getChildByClass: function(parentEl, childClassName) {
		var node = parentEl.firstChild;
		while(node) {
			if( framework.hasClass(node, childClassName) ) {
				return node;
			}
			node = node.nextSibling;
		}
	},
	arraySearch: function(array, value, key) {
		var i = array.length;
		while(i--) {
			if(array[i][key] === value) {
				return i;
			} 
		}
		return -1;
	},
	extend: function(o1, o2, preventOverwrite) {
		for (var prop in o2) {
			if (o2.hasOwnProperty(prop)) {
				if(preventOverwrite && o1.hasOwnProperty(prop)) {
					continue;
				}
				o1[prop] = o2[prop];
			}
		}
	},
	easing: {
		sine: {
			out: function(k) {
				return Math.sin(k * (Math.PI / 2));
			},
			inOut: function(k) {
				return - (Math.cos(Math.PI * k) - 1) / 2;
			}
		},
		cubic: {
			out: function(k) {
				return --k * k * k + 1;
			}
		}
		/*
			elastic: {
				out: function ( k ) {

					var s, a = 0.1, p = 0.4;
					if ( k === 0 ) return 0;
					if ( k === 1 ) return 1;
					if ( !a || a < 1 ) { a = 1; s = p / 4; }
					else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
					return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );

				},
			},
			back: {
				out: function ( k ) {
					var s = 1.70158;
					return --k * k * ( ( s + 1 ) * k + s ) + 1;
				}
			}
		*/
	},

	/**
	 * 
	 * @return {object}
	 * 
	 * {
	 *  raf : request animation frame function
	 *  caf : cancel animation frame function
	 *  transfrom : transform property key (with vendor), or null if not supported
	 *  oldIE : IE8 or below
	 * }
	 * 
	 */
	detectFeatures: function() {
		if(framework.features) {
			return framework.features;
		}
		var helperEl = framework.createEl(),
			helperStyle = helperEl.style,
			vendor = '',
			features = {};

		// IE8 and below
		features.oldIE = document.all && !document.addEventListener;

		features.touch = 'ontouchstart' in window;

		if(window.requestAnimationFrame) {
			features.raf = window.requestAnimationFrame;
			features.caf = window.cancelAnimationFrame;
		}

		features.pointerEvent = navigator.pointerEnabled || navigator.msPointerEnabled;

		// fix false-positive detection of old Android in new IE
		// (IE11 ua string contains "Android 4.0")
		
		if(!features.pointerEvent) { 

			var ua = navigator.userAgent;

			// Detect if device is iPhone or iPod and if it's older than iOS 8
			// http://stackoverflow.com/a/14223920
			// 
			// This detection is made because of buggy top/bottom toolbars
			// that don't trigger window.resize event.
			// For more info refer to _isFixedPosition variable in core.js

			if (/iP(hone|od)/.test(navigator.platform)) {
				var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
				if(v && v.length > 0) {
					v = parseInt(v[1], 10);
					if(v >= 1 && v < 8 ) {
						features.isOldIOSPhone = true;
					}
				}
			}

			// Detect old Android (before KitKat)
			// due to bugs related to position:fixed
			// http://stackoverflow.com/questions/7184573/pick-up-the-android-version-in-the-browser-by-javascript
			
			var match = ua.match(/Android\s([0-9\.]*)/);
			var androidversion =  match ? match[1] : 0;
			androidversion = parseFloat(androidversion);
			if(androidversion >= 1 ) {
				if(androidversion < 4.4) {
					features.isOldAndroid = true; // for fixed position bug & performance
				}
				features.androidVersion = androidversion; // for touchend bug
			}	
			features.isMobileOpera = /opera mini|opera mobi/i.test(ua);

			// p.s. yes, yes, UA sniffing is bad, propose your solution for above bugs.
		}
		
		var styleChecks = ['transform', 'perspective', 'animationName'],
			vendors = ['', 'webkit','Moz','ms','O'],
			styleCheckItem,
			styleName;

		for(var i = 0; i < 4; i++) {
			vendor = vendors[i];

			for(var a = 0; a < 3; a++) {
				styleCheckItem = styleChecks[a];

				// uppercase first letter of property name, if vendor is present
				styleName = vendor + (vendor ? 
										styleCheckItem.charAt(0).toUpperCase() + styleCheckItem.slice(1) : 
										styleCheckItem);
			
				if(!features[styleCheckItem] && styleName in helperStyle ) {
					features[styleCheckItem] = styleName;
				}
			}

			if(vendor && !features.raf) {
				vendor = vendor.toLowerCase();
				features.raf = window[vendor+'RequestAnimationFrame'];
				if(features.raf) {
					features.caf = window[vendor+'CancelAnimationFrame'] || 
									window[vendor+'CancelRequestAnimationFrame'];
				}
			}
		}
			
		if(!features.raf) {
			var lastTime = 0;
			features.raf = function(fn) {
				var currTime = new Date().getTime();
				var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				var id = window.setTimeout(function() { fn(currTime + timeToCall); }, timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};
			features.caf = function(id) { clearTimeout(id); };
		}

		// Detect SVG support
		features.svg = !!document.createElementNS && 
						!!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;

		framework.features = features;

		return features;
	}
};

framework.detectFeatures();

// Override addEventListener for old versions of IE
if(framework.features.oldIE) {

	framework.bind = function(target, type, listener, unbind) {
		
		type = type.split(' ');

		var methodName = (unbind ? 'detach' : 'attach') + 'Event',
			evName,
			_handleEv = function() {
				listener.handleEvent.call(listener);
			};

		for(var i = 0; i < type.length; i++) {
			evName = type[i];
			if(evName) {

				if(typeof listener === 'object' && listener.handleEvent) {
					if(!unbind) {
						listener['oldIE' + evName] = _handleEv;
					} else {
						if(!listener['oldIE' + evName]) {
							return false;
						}
					}

					target[methodName]( 'on' + evName, listener['oldIE' + evName]);
				} else {
					target[methodName]( 'on' + evName, listener);
				}

			}
		}
	};
	
}

/*>>framework-bridge*/

/*>>core*/
//function(template, UiClass, items, options)

var self = this;

/**
 * Static vars, don't change unless you know what you're doing.
 */
var DOUBLE_TAP_RADIUS = 25, 
	NUM_HOLDERS = 3;

/**
 * Options
 */
var _options = {
	allowPanToNext:true,
	spacing: 0.12,
	bgOpacity: 1,
	mouseUsed: false,
	loop: true,
	pinchToClose: true,
	closeOnScroll: true,
	closeOnVerticalDrag: true,
	verticalDragRange: 0.75,
	hideAnimationDuration: 333,
	showAnimationDuration: 333,
	showHideOpacity: false,
	focus: true,
	escKey: true,
	arrowKeys: true,
	mainScrollEndFriction: 0.35,
	panEndFriction: 0.35,
	isClickableElement: function(el) {
        return el.tagName === 'A';
    },
    getDoubleTapZoom: function(isMouseClick, item) {
    	if(isMouseClick) {
    		return 1;
    	} else {
    		return item.initialZoomLevel < 0.7 ? 1 : 1.33;
    	}
    },
    maxSpreadZoom: 1.33,
	modal: true,

	// not fully implemented yet
	scaleMode: 'fit' // TODO
};
framework.extend(_options, options);


/**
 * Private helper variables & functions
 */

var _getEmptyPoint = function() { 
		return {x:0,y:0}; 
	};

var _isOpen,
	_isDestroying,
	_closedByScroll,
	_currentItemIndex,
	_containerStyle,
	_containerShiftIndex,
	_currPanDist = _getEmptyPoint(),
	_startPanOffset = _getEmptyPoint(),
	_panOffset = _getEmptyPoint(),
	_upMoveEvents, // drag move, drag end & drag cancel events array
	_downEvents, // drag start events array
	_globalEventHandlers,
	_viewportSize = {},
	_currZoomLevel,
	_startZoomLevel,
	_translatePrefix,
	_translateSufix,
	_updateSizeInterval,
	_itemsNeedUpdate,
	_currPositionIndex = 0,
	_offset = {},
	_slideSize = _getEmptyPoint(), // size of slide area, including spacing
	_itemHolders,
	_prevItemIndex,
	_indexDiff = 0, // difference of indexes since last content update
	_dragStartEvent,
	_dragMoveEvent,
	_dragEndEvent,
	_dragCancelEvent,
	_transformKey,
	_pointerEventEnabled,
	_isFixedPosition = true,
	_likelyTouchDevice,
	_modules = [],
	_requestAF,
	_cancelAF,
	_initalClassName,
	_initalWindowScrollY,
	_oldIE,
	_currentWindowScrollY,
	_features,
	_windowVisibleSize = {},
	_renderMaxResolution = false,
	_orientationChangeTimeout,


	// Registers PhotoSWipe module (History, Controller ...)
	_registerModule = function(name, module) {
		framework.extend(self, module.publicMethods);
		_modules.push(name);
	},

	_getLoopedId = function(index) {
		var numSlides = _getNumItems();
		if(index > numSlides - 1) {
			return index - numSlides;
		} else  if(index < 0) {
			return numSlides + index;
		}
		return index;
	},
	
	// Micro bind/trigger
	_listeners = {},
	_listen = function(name, fn) {
		if(!_listeners[name]) {
			_listeners[name] = [];
		}
		return _listeners[name].push(fn);
	},
	_shout = function(name) {
		var listeners = _listeners[name];

		if(listeners) {
			var args = Array.prototype.slice.call(arguments);
			args.shift();

			for(var i = 0; i < listeners.length; i++) {
				listeners[i].apply(self, args);
			}
		}
	},

	_getCurrentTime = function() {
		return new Date().getTime();
	},
	_applyBgOpacity = function(opacity) {
		_bgOpacity = opacity;
		self.bg.style.opacity = opacity * _options.bgOpacity;
	},

	_applyZoomTransform = function(styleObj,x,y,zoom,item) {
		if(!_renderMaxResolution || (item && item !== self.currItem) ) {
			zoom = zoom / (item ? item.fitRatio : self.currItem.fitRatio);	
		}
			
		styleObj[_transformKey] = _translatePrefix + x + 'px, ' + y + 'px' + _translateSufix + ' scale(' + zoom + ')';
	},
	_applyCurrentZoomPan = function( allowRenderResolution ) {
		if(_currZoomElementStyle) {

			if(allowRenderResolution) {
				if(_currZoomLevel > self.currItem.fitRatio) {
					if(!_renderMaxResolution) {
						_setImageSize(self.currItem, false, true);
						_renderMaxResolution = true;
					}
				} else {
					if(_renderMaxResolution) {
						_setImageSize(self.currItem);
						_renderMaxResolution = false;
					}
				}
			}
			

			_applyZoomTransform(_currZoomElementStyle, _panOffset.x, _panOffset.y, _currZoomLevel);
		}
	},
	_applyZoomPanToItem = function(item) {
		if(item.container) {

			_applyZoomTransform(item.container.style, 
								item.initialPosition.x, 
								item.initialPosition.y, 
								item.initialZoomLevel,
								item);
		}
	},
	_setTranslateX = function(x, elStyle) {
		elStyle[_transformKey] = _translatePrefix + x + 'px, 0px' + _translateSufix;
	},
	_moveMainScroll = function(x, dragging) {

		if(!_options.loop && dragging) {
			var newSlideIndexOffset = _currentItemIndex + (_slideSize.x * _currPositionIndex - x) / _slideSize.x,
				delta = Math.round(x - _mainScrollPos.x);

			if( (newSlideIndexOffset < 0 && delta > 0) || 
				(newSlideIndexOffset >= _getNumItems() - 1 && delta < 0) ) {
				x = _mainScrollPos.x + delta * _options.mainScrollEndFriction;
			} 
		}
		
		_mainScrollPos.x = x;
		_setTranslateX(x, _containerStyle);
	},
	_calculatePanOffset = function(axis, zoomLevel) {
		var m = _midZoomPoint[axis] - _offset[axis];
		return _startPanOffset[axis] + _currPanDist[axis] + m - m * ( zoomLevel / _startZoomLevel );
	},
	
	_equalizePoints = function(p1, p2) {
		p1.x = p2.x;
		p1.y = p2.y;
		if(p2.id) {
			p1.id = p2.id;
		}
	},
	_roundPoint = function(p) {
		p.x = Math.round(p.x);
		p.y = Math.round(p.y);
	},

	_mouseMoveTimeout = null,
	_onFirstMouseMove = function() {
		// Wait until mouse move event is fired at least twice during 100ms
		// We do this, because some mobile browsers trigger it on touchstart
		if(_mouseMoveTimeout ) { 
			framework.unbind(document, 'mousemove', _onFirstMouseMove);
			framework.addClass(template, 'pswp--has_mouse');
			_options.mouseUsed = true;
			_shout('mouseUsed');
		}
		_mouseMoveTimeout = setTimeout(function() {
			_mouseMoveTimeout = null;
		}, 100);
	},

	_bindEvents = function() {
		framework.bind(document, 'keydown', self);

		if(_features.transform) {
			// don't bind click event in browsers that don't support transform (mostly IE8)
			framework.bind(self.scrollWrap, 'click', self);
		}
		

		if(!_options.mouseUsed) {
			framework.bind(document, 'mousemove', _onFirstMouseMove);
		}

		framework.bind(window, 'resize scroll orientationchange', self);

		_shout('bindEvents');
	},

	_unbindEvents = function() {
		framework.unbind(window, 'resize scroll orientationchange', self);
		framework.unbind(window, 'scroll', _globalEventHandlers.scroll);
		framework.unbind(document, 'keydown', self);
		framework.unbind(document, 'mousemove', _onFirstMouseMove);

		if(_features.transform) {
			framework.unbind(self.scrollWrap, 'click', self);
		}

		if(_isDragging) {
			framework.unbind(window, _upMoveEvents, self);
		}

		clearTimeout(_orientationChangeTimeout);

		_shout('unbindEvents');
	},
	
	_calculatePanBounds = function(zoomLevel, update) {
		var bounds = _calculateItemSize( self.currItem, _viewportSize, zoomLevel );
		if(update) {
			_currPanBounds = bounds;
		}
		return bounds;
	},
	
	_getMinZoomLevel = function(item) {
		if(!item) {
			item = self.currItem;
		}
		return item.initialZoomLevel;
	},
	_getMaxZoomLevel = function(item) {
		if(!item) {
			item = self.currItem;
		}
		return item.w > 0 ? _options.maxSpreadZoom : 1;
	},

	// Return true if offset is out of the bounds
	_modifyDestPanOffset = function(axis, destPanBounds, destPanOffset, destZoomLevel) {
		if(destZoomLevel === self.currItem.initialZoomLevel) {
			destPanOffset[axis] = self.currItem.initialPosition[axis];
			return true;
		} else {
			destPanOffset[axis] = _calculatePanOffset(axis, destZoomLevel); 

			if(destPanOffset[axis] > destPanBounds.min[axis]) {
				destPanOffset[axis] = destPanBounds.min[axis];
				return true;
			} else if(destPanOffset[axis] < destPanBounds.max[axis] ) {
				destPanOffset[axis] = destPanBounds.max[axis];
				return true;
			}
		}
		return false;
	},

	_setupTransforms = function() {

		if(_transformKey) {
			// setup 3d transforms
			var allow3dTransform = _features.perspective && !_likelyTouchDevice;
			_translatePrefix = 'translate' + (allow3dTransform ? '3d(' : '(');
			_translateSufix = _features.perspective ? ', 0px)' : ')';	
			return;
		}

		// Override zoom/pan/move functions in case old browser is used (most likely IE)
		// (so they use left/top/width/height, instead of CSS transform)
	
		_transformKey = 'left';
		framework.addClass(template, 'pswp--ie');

		_setTranslateX = function(x, elStyle) {
			elStyle.left = x + 'px';
		};
		_applyZoomPanToItem = function(item) {

			var zoomRatio = item.fitRatio > 1 ? 1 : item.fitRatio,
				s = item.container.style,
				w = zoomRatio * item.w,
				h = zoomRatio * item.h;

			s.width = w + 'px';
			s.height = h + 'px';
			s.left = item.initialPosition.x + 'px';
			s.top = item.initialPosition.y + 'px';

		};
		_applyCurrentZoomPan = function() {
			if(_currZoomElementStyle) {

				var s = _currZoomElementStyle,
					item = self.currItem,
					zoomRatio = item.fitRatio > 1 ? 1 : item.fitRatio,
					w = zoomRatio * item.w,
					h = zoomRatio * item.h;

				s.width = w + 'px';
				s.height = h + 'px';


				s.left = _panOffset.x + 'px';
				s.top = _panOffset.y + 'px';
			}
			
		};
	},

	_onKeyDown = function(e) {
		var keydownAction = '';
		if(_options.escKey && e.keyCode === 27) { 
			keydownAction = 'close';
		} else if(_options.arrowKeys) {
			if(e.keyCode === 37) {
				keydownAction = 'prev';
			} else if(e.keyCode === 39) { 
				keydownAction = 'next';
			}
		}

		if(keydownAction) {
			// don't do anything if special key pressed to prevent from overriding default browser actions
			// e.g. in Chrome on Mac cmd+arrow-left returns to previous page
			if( !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey ) {
				if(e.preventDefault) {
					e.preventDefault();
				} else {
					e.returnValue = false;
				} 
				self[keydownAction]();
			}
		}
	},

	_onGlobalClick = function(e) {
		if(!e) {
			return;
		}

		// don't allow click event to pass through when triggering after drag or some other gesture
		if(_moved || _zoomStarted || _mainScrollAnimating || _verticalDragInitiated) {
			e.preventDefault();
			e.stopPropagation();
		}
	},

	_updatePageScrollOffset = function() {
		self.setScrollOffset(0, framework.getScrollY());		
	};
	


	



// Micro animation engine
var _animations = {},
	_numAnimations = 0,
	_stopAnimation = function(name) {
		if(_animations[name]) {
			if(_animations[name].raf) {
				_cancelAF( _animations[name].raf );
			}
			_numAnimations--;
			delete _animations[name];
		}
	},
	_registerStartAnimation = function(name) {
		if(_animations[name]) {
			_stopAnimation(name);
		}
		if(!_animations[name]) {
			_numAnimations++;
			_animations[name] = {};
		}
	},
	_stopAllAnimations = function() {
		for (var prop in _animations) {

			if( _animations.hasOwnProperty( prop ) ) {
				_stopAnimation(prop);
			} 
			
		}
	},
	_animateProp = function(name, b, endProp, d, easingFn, onUpdate, onComplete) {
		var startAnimTime = _getCurrentTime(), t;
		_registerStartAnimation(name);

		var animloop = function(){
			if ( _animations[name] ) {
				
				t = _getCurrentTime() - startAnimTime; // time diff
				//b - beginning (start prop)
				//d - anim duration

				if ( t >= d ) {
					_stopAnimation(name);
					onUpdate(endProp);
					if(onComplete) {
						onComplete();
					}
					return;
				}
				onUpdate( (endProp - b) * easingFn(t/d) + b );

				_animations[name].raf = _requestAF(animloop);
			}
		};
		animloop();
	};
	


var publicMethods = {

	// make a few local variables and functions public
	shout: _shout,
	listen: _listen,
	viewportSize: _viewportSize,
	options: _options,

	isMainScrollAnimating: function() {
		return _mainScrollAnimating;
	},
	getZoomLevel: function() {
		return _currZoomLevel;
	},
	getCurrentIndex: function() {
		return _currentItemIndex;
	},
	isDragging: function() {
		return _isDragging;
	},	
	isZooming: function() {
		return _isZooming;
	},
	setScrollOffset: function(x,y) {
		_offset.x = x;
		_currentWindowScrollY = _offset.y = y;
		_shout('updateScrollOffset', _offset);
	},
	applyZoomPan: function(zoomLevel,panX,panY,allowRenderResolution) {
		_panOffset.x = panX;
		_panOffset.y = panY;
		_currZoomLevel = zoomLevel;
		_applyCurrentZoomPan( allowRenderResolution );
	},

	init: function() {

		if(_isOpen || _isDestroying) {
			return;
		}

		var i;

		self.framework = framework; // basic functionality
		self.template = template; // root DOM element of PhotoSwipe
		self.bg = framework.getChildByClass(template, 'pswp__bg');

		_initalClassName = template.className;
		_isOpen = true;
				
		_features = framework.detectFeatures();
		_requestAF = _features.raf;
		_cancelAF = _features.caf;
		_transformKey = _features.transform;
		_oldIE = _features.oldIE;
		
		self.scrollWrap = framework.getChildByClass(template, 'pswp__scroll-wrap');
		self.container = framework.getChildByClass(self.scrollWrap, 'pswp__container');

		_containerStyle = self.container.style; // for fast access

		// Objects that hold slides (there are only 3 in DOM)
		self.itemHolders = _itemHolders = [
			{el:self.container.children[0] , wrap:0, index: -1},
			{el:self.container.children[1] , wrap:0, index: -1},
			{el:self.container.children[2] , wrap:0, index: -1}
		];

		// hide nearby item holders until initial zoom animation finishes (to avoid extra Paints)
		_itemHolders[0].el.style.display = _itemHolders[2].el.style.display = 'none';

		_setupTransforms();

		// Setup global events
		_globalEventHandlers = {
			resize: self.updateSize,

			// Fixes: iOS 10.3 resize event
			// does not update scrollWrap.clientWidth instantly after resize
			// https://github.com/dimsemenov/PhotoSwipe/issues/1315
			orientationchange: function() {
				clearTimeout(_orientationChangeTimeout);
				_orientationChangeTimeout = setTimeout(function() {
					if(_viewportSize.x !== self.scrollWrap.clientWidth) {
						self.updateSize();
					}
				}, 500);
			},
			scroll: _updatePageScrollOffset,
			keydown: _onKeyDown,
			click: _onGlobalClick
		};

		// disable show/hide effects on old browsers that don't support CSS animations or transforms, 
		// old IOS, Android and Opera mobile. Blackberry seems to work fine, even older models.
		var oldPhone = _features.isOldIOSPhone || _features.isOldAndroid || _features.isMobileOpera;
		if(!_features.animationName || !_features.transform || oldPhone) {
			_options.showAnimationDuration = _options.hideAnimationDuration = 0;
		}

		// init modules
		for(i = 0; i < _modules.length; i++) {
			self['init' + _modules[i]]();
		}
		
		// init
		if(UiClass) {
			var ui = self.ui = new UiClass(self, framework);
			ui.init();
		}

		_shout('firstUpdate');
		_currentItemIndex = _currentItemIndex || _options.index || 0;
		// validate index
		if( isNaN(_currentItemIndex) || _currentItemIndex < 0 || _currentItemIndex >= _getNumItems() ) {
			_currentItemIndex = 0;
		}
		self.currItem = _getItemAt( _currentItemIndex );

		
		if(_features.isOldIOSPhone || _features.isOldAndroid) {
			_isFixedPosition = false;
		}
		
		template.setAttribute('aria-hidden', 'false');
		if(_options.modal) {
			if(!_isFixedPosition) {
				template.style.position = 'absolute';
				template.style.top = framework.getScrollY() + 'px';
			} else {
				template.style.position = 'fixed';
			}
		}

		if(_currentWindowScrollY === undefined) {
			_shout('initialLayout');
			_currentWindowScrollY = _initalWindowScrollY = framework.getScrollY();
		}
		
		// add classes to root element of PhotoSwipe
		var rootClasses = 'pswp--open ';
		if(_options.mainClass) {
			rootClasses += _options.mainClass + ' ';
		}
		if(_options.showHideOpacity) {
			rootClasses += 'pswp--animate_opacity ';
		}
		rootClasses += _likelyTouchDevice ? 'pswp--touch' : 'pswp--notouch';
		rootClasses += _features.animationName ? ' pswp--css_animation' : '';
		rootClasses += _features.svg ? ' pswp--svg' : '';
		framework.addClass(template, rootClasses);

		self.updateSize();

		// initial update
		_containerShiftIndex = -1;
		_indexDiff = null;
		for(i = 0; i < NUM_HOLDERS; i++) {
			_setTranslateX( (i+_containerShiftIndex) * _slideSize.x, _itemHolders[i].el.style);
		}

		if(!_oldIE) {
			framework.bind(self.scrollWrap, _downEvents, self); // no dragging for old IE
		}	

		_listen('initialZoomInEnd', function() {
			self.setContent(_itemHolders[0], _currentItemIndex-1);
			self.setContent(_itemHolders[2], _currentItemIndex+1);

			_itemHolders[0].el.style.display = _itemHolders[2].el.style.display = 'block';

			if(_options.focus) {
				// focus causes layout, 
				// which causes lag during the animation, 
				// that's why we delay it untill the initial zoom transition ends
				template.focus();
			}
			 

			_bindEvents();
		});

		// set content for center slide (first time)
		self.setContent(_itemHolders[1], _currentItemIndex);
		
		self.updateCurrItem();

		_shout('afterInit');

		if(!_isFixedPosition) {

			// On all versions of iOS lower than 8.0, we check size of viewport every second.
			// 
			// This is done to detect when Safari top & bottom bars appear, 
			// as this action doesn't trigger any events (like resize). 
			// 
			// On iOS8 they fixed this.
			// 
			// 10 Nov 2014: iOS 7 usage ~40%. iOS 8 usage 56%.
			
			_updateSizeInterval = setInterval(function() {
				if(!_numAnimations && !_isDragging && !_isZooming && (_currZoomLevel === self.currItem.initialZoomLevel)  ) {
					self.updateSize();
				}
			}, 1000);
		}

		framework.addClass(template, 'pswp--visible');
	},

	// Close the gallery, then destroy it
	close: function() {
		if(!_isOpen) {
			return;
		}

		_isOpen = false;
		_isDestroying = true;
		_shout('close');
		_unbindEvents();

		_showOrHide(self.currItem, null, true, self.destroy);
	},

	// destroys the gallery (unbinds events, cleans up intervals and timeouts to avoid memory leaks)
	destroy: function() {
		_shout('destroy');

		if(_showOrHideTimeout) {
			clearTimeout(_showOrHideTimeout);
		}
		
		template.setAttribute('aria-hidden', 'true');
		template.className = _initalClassName;

		if(_updateSizeInterval) {
			clearInterval(_updateSizeInterval);
		}

		framework.unbind(self.scrollWrap, _downEvents, self);

		// we unbind scroll event at the end, as closing animation may depend on it
		framework.unbind(window, 'scroll', self);

		_stopDragUpdateLoop();

		_stopAllAnimations();

		_listeners = null;
	},

	/**
	 * Pan image to position
	 * @param {Number} x     
	 * @param {Number} y     
	 * @param {Boolean} force Will ignore bounds if set to true.
	 */
	panTo: function(x,y,force) {
		if(!force) {
			if(x > _currPanBounds.min.x) {
				x = _currPanBounds.min.x;
			} else if(x < _currPanBounds.max.x) {
				x = _currPanBounds.max.x;
			}

			if(y > _currPanBounds.min.y) {
				y = _currPanBounds.min.y;
			} else if(y < _currPanBounds.max.y) {
				y = _currPanBounds.max.y;
			}
		}
		
		_panOffset.x = x;
		_panOffset.y = y;
		_applyCurrentZoomPan();
	},
	
	handleEvent: function (e) {
		e = e || window.event;
		if(_globalEventHandlers[e.type]) {
			_globalEventHandlers[e.type](e);
		}
	},


	goTo: function(index) {

		index = _getLoopedId(index);

		var diff = index - _currentItemIndex;
		_indexDiff = diff;

		_currentItemIndex = index;
		self.currItem = _getItemAt( _currentItemIndex );
		_currPositionIndex -= diff;
		
		_moveMainScroll(_slideSize.x * _currPositionIndex);
		

		_stopAllAnimations();
		_mainScrollAnimating = false;

		self.updateCurrItem();
	},
	next: function() {
		self.goTo( _currentItemIndex + 1);
	},
	prev: function() {
		self.goTo( _currentItemIndex - 1);
	},

	// update current zoom/pan objects
	updateCurrZoomItem: function(emulateSetContent) {
		if(emulateSetContent) {
			_shout('beforeChange', 0);
		}

		// itemHolder[1] is middle (current) item
		if(_itemHolders[1].el.children.length) {
			var zoomElement = _itemHolders[1].el.children[0];
			if( framework.hasClass(zoomElement, 'pswp__zoom-wrap') ) {
				_currZoomElementStyle = zoomElement.style;
			} else {
				_currZoomElementStyle = null;
			}
		} else {
			_currZoomElementStyle = null;
		}
		
		_currPanBounds = self.currItem.bounds;	
		_startZoomLevel = _currZoomLevel = self.currItem.initialZoomLevel;

		_panOffset.x = _currPanBounds.center.x;
		_panOffset.y = _currPanBounds.center.y;

		if(emulateSetContent) {
			_shout('afterChange');
		}
	},


	invalidateCurrItems: function() {
		_itemsNeedUpdate = true;
		for(var i = 0; i < NUM_HOLDERS; i++) {
			if( _itemHolders[i].item ) {
				_itemHolders[i].item.needsUpdate = true;
			}
		}
	},

	updateCurrItem: function(beforeAnimation) {

		if(_indexDiff === 0) {
			return;
		}

		var diffAbs = Math.abs(_indexDiff),
			tempHolder;

		if(beforeAnimation && diffAbs < 2) {
			return;
		}


		self.currItem = _getItemAt( _currentItemIndex );
		_renderMaxResolution = false;
		
		_shout('beforeChange', _indexDiff);

		if(diffAbs >= NUM_HOLDERS) {
			_containerShiftIndex += _indexDiff + (_indexDiff > 0 ? -NUM_HOLDERS : NUM_HOLDERS);
			diffAbs = NUM_HOLDERS;
		}
		for(var i = 0; i < diffAbs; i++) {
			if(_indexDiff > 0) {
				tempHolder = _itemHolders.shift();
				_itemHolders[NUM_HOLDERS-1] = tempHolder; // move first to last

				_containerShiftIndex++;
				_setTranslateX( (_containerShiftIndex+2) * _slideSize.x, tempHolder.el.style);
				self.setContent(tempHolder, _currentItemIndex - diffAbs + i + 1 + 1);
			} else {
				tempHolder = _itemHolders.pop();
				_itemHolders.unshift( tempHolder ); // move last to first

				_containerShiftIndex--;
				_setTranslateX( _containerShiftIndex * _slideSize.x, tempHolder.el.style);
				self.setContent(tempHolder, _currentItemIndex + diffAbs - i - 1 - 1);
			}
			
		}

		// reset zoom/pan on previous item
		if(_currZoomElementStyle && Math.abs(_indexDiff) === 1) {

			var prevItem = _getItemAt(_prevItemIndex);
			if(prevItem.initialZoomLevel !== _currZoomLevel) {
				_calculateItemSize(prevItem , _viewportSize );
				_setImageSize(prevItem);
				_applyZoomPanToItem( prevItem ); 				
			}

		}

		// reset diff after update
		_indexDiff = 0;

		self.updateCurrZoomItem();

		_prevItemIndex = _currentItemIndex;

		_shout('afterChange');
		
	},



	updateSize: function(force) {
		
		if(!_isFixedPosition && _options.modal) {
			var windowScrollY = framework.getScrollY();
			if(_currentWindowScrollY !== windowScrollY) {
				template.style.top = windowScrollY + 'px';
				_currentWindowScrollY = windowScrollY;
			}
			if(!force && _windowVisibleSize.x === window.innerWidth && _windowVisibleSize.y === window.innerHeight) {
				return;
			}
			_windowVisibleSize.x = window.innerWidth;
			_windowVisibleSize.y = window.innerHeight;

			//template.style.width = _windowVisibleSize.x + 'px';
			template.style.height = _windowVisibleSize.y + 'px';
		}



		_viewportSize.x = self.scrollWrap.clientWidth;
		_viewportSize.y = self.scrollWrap.clientHeight;

		_updatePageScrollOffset();

		_slideSize.x = _viewportSize.x + Math.round(_viewportSize.x * _options.spacing);
		_slideSize.y = _viewportSize.y;

		_moveMainScroll(_slideSize.x * _currPositionIndex);

		_shout('beforeResize'); // even may be used for example to switch image sources


		// don't re-calculate size on inital size update
		if(_containerShiftIndex !== undefined) {

			var holder,
				item,
				hIndex;

			for(var i = 0; i < NUM_HOLDERS; i++) {
				holder = _itemHolders[i];
				_setTranslateX( (i+_containerShiftIndex) * _slideSize.x, holder.el.style);

				hIndex = _currentItemIndex+i-1;

				if(_options.loop && _getNumItems() > 2) {
					hIndex = _getLoopedId(hIndex);
				}

				// update zoom level on items and refresh source (if needsUpdate)
				item = _getItemAt( hIndex );

				// re-render gallery item if `needsUpdate`,
				// or doesn't have `bounds` (entirely new slide object)
				if( item && (_itemsNeedUpdate || item.needsUpdate || !item.bounds) ) {

					self.cleanSlide( item );
					
					self.setContent( holder, hIndex );

					// if "center" slide
					if(i === 1) {
						self.currItem = item;
						self.updateCurrZoomItem(true);
					}

					item.needsUpdate = false;

				} else if(holder.index === -1 && hIndex >= 0) {
					// add content first time
					self.setContent( holder, hIndex );
				}
				if(item && item.container) {
					_calculateItemSize(item, _viewportSize);
					_setImageSize(item);
					_applyZoomPanToItem( item );
				}
				
			}
			_itemsNeedUpdate = false;
		}	

		_startZoomLevel = _currZoomLevel = self.currItem.initialZoomLevel;
		_currPanBounds = self.currItem.bounds;

		if(_currPanBounds) {
			_panOffset.x = _currPanBounds.center.x;
			_panOffset.y = _currPanBounds.center.y;
			_applyCurrentZoomPan( true );
		}
		
		_shout('resize');
	},
	
	// Zoom current item to
	zoomTo: function(destZoomLevel, centerPoint, speed, easingFn, updateFn) {
		/*
			if(destZoomLevel === 'fit') {
				destZoomLevel = self.currItem.fitRatio;
			} else if(destZoomLevel === 'fill') {
				destZoomLevel = self.currItem.fillRatio;
			}
		*/

		if(centerPoint) {
			_startZoomLevel = _currZoomLevel;
			_midZoomPoint.x = Math.abs(centerPoint.x) - _panOffset.x ;
			_midZoomPoint.y = Math.abs(centerPoint.y) - _panOffset.y ;
			_equalizePoints(_startPanOffset, _panOffset);
		}

		var destPanBounds = _calculatePanBounds(destZoomLevel, false),
			destPanOffset = {};

		_modifyDestPanOffset('x', destPanBounds, destPanOffset, destZoomLevel);
		_modifyDestPanOffset('y', destPanBounds, destPanOffset, destZoomLevel);

		var initialZoomLevel = _currZoomLevel;
		var initialPanOffset = {
			x: _panOffset.x,
			y: _panOffset.y
		};

		_roundPoint(destPanOffset);

		var onUpdate = function(now) {
			if(now === 1) {
				_currZoomLevel = destZoomLevel;
				_panOffset.x = destPanOffset.x;
				_panOffset.y = destPanOffset.y;
			} else {
				_currZoomLevel = (destZoomLevel - initialZoomLevel) * now + initialZoomLevel;
				_panOffset.x = (destPanOffset.x - initialPanOffset.x) * now + initialPanOffset.x;
				_panOffset.y = (destPanOffset.y - initialPanOffset.y) * now + initialPanOffset.y;
			}

			if(updateFn) {
				updateFn(now);
			}

			_applyCurrentZoomPan( now === 1 );
		};

		if(speed) {
			_animateProp('customZoomTo', 0, 1, speed, easingFn || framework.easing.sine.inOut, onUpdate);
		} else {
			onUpdate(1);
		}
	}


};


/*>>core*/

/*>>gestures*/
/**
 * Mouse/touch/pointer event handlers.
 * 
 * separated from @core.js for readability
 */

var MIN_SWIPE_DISTANCE = 30,
	DIRECTION_CHECK_OFFSET = 10; // amount of pixels to drag to determine direction of swipe

var _gestureStartTime,
	_gestureCheckSpeedTime,

	// pool of objects that are used during dragging of zooming
	p = {}, // first point
	p2 = {}, // second point (for zoom gesture)
	delta = {},
	_currPoint = {},
	_startPoint = {},
	_currPointers = [],
	_startMainScrollPos = {},
	_releaseAnimData,
	_posPoints = [], // array of points during dragging, used to determine type of gesture
	_tempPoint = {},

	_isZoomingIn,
	_verticalDragInitiated,
	_oldAndroidTouchEndTimeout,
	_currZoomedItemIndex = 0,
	_centerPoint = _getEmptyPoint(),
	_lastReleaseTime = 0,
	_isDragging, // at least one pointer is down
	_isMultitouch, // at least two _pointers are down
	_zoomStarted, // zoom level changed during zoom gesture
	_moved,
	_dragAnimFrame,
	_mainScrollShifted,
	_currentPoints, // array of current touch points
	_isZooming,
	_currPointsDistance,
	_startPointsDistance,
	_currPanBounds,
	_mainScrollPos = _getEmptyPoint(),
	_currZoomElementStyle,
	_mainScrollAnimating, // true, if animation after swipe gesture is running
	_midZoomPoint = _getEmptyPoint(),
	_currCenterPoint = _getEmptyPoint(),
	_direction,
	_isFirstMove,
	_opacityChanged,
	_bgOpacity,
	_wasOverInitialZoom,

	_isEqualPoints = function(p1, p2) {
		return p1.x === p2.x && p1.y === p2.y;
	},
	_isNearbyPoints = function(touch0, touch1) {
		return Math.abs(touch0.x - touch1.x) < DOUBLE_TAP_RADIUS && Math.abs(touch0.y - touch1.y) < DOUBLE_TAP_RADIUS;
	},
	_calculatePointsDistance = function(p1, p2) {
		_tempPoint.x = Math.abs( p1.x - p2.x );
		_tempPoint.y = Math.abs( p1.y - p2.y );
		return Math.sqrt(_tempPoint.x * _tempPoint.x + _tempPoint.y * _tempPoint.y);
	},
	_stopDragUpdateLoop = function() {
		if(_dragAnimFrame) {
			_cancelAF(_dragAnimFrame);
			_dragAnimFrame = null;
		}
	},
	_dragUpdateLoop = function() {
		if(_isDragging) {
			_dragAnimFrame = _requestAF(_dragUpdateLoop);
			_renderMovement();
		}
	},
	_canPan = function() {
		return !(_options.scaleMode === 'fit' && _currZoomLevel ===  self.currItem.initialZoomLevel);
	},
	
	// find the closest parent DOM element
	_closestElement = function(el, fn) {
	  	if(!el || el === document) {
	  		return false;
	  	}

	  	// don't search elements above pswp__scroll-wrap
	  	if(el.getAttribute('class') && el.getAttribute('class').indexOf('pswp__scroll-wrap') > -1 ) {
	  		return false;
	  	}

	  	if( fn(el) ) {
	  		return el;
	  	}

	  	return _closestElement(el.parentNode, fn);
	},

	_preventObj = {},
	_preventDefaultEventBehaviour = function(e, isDown) {
	    _preventObj.prevent = !_closestElement(e.target, _options.isClickableElement);

		_shout('preventDragEvent', e, isDown, _preventObj);
		return _preventObj.prevent;

	},
	_convertTouchToPoint = function(touch, p) {
		p.x = touch.pageX;
		p.y = touch.pageY;
		p.id = touch.identifier;
		return p;
	},
	_findCenterOfPoints = function(p1, p2, pCenter) {
		pCenter.x = (p1.x + p2.x) * 0.5;
		pCenter.y = (p1.y + p2.y) * 0.5;
	},
	_pushPosPoint = function(time, x, y) {
		if(time - _gestureCheckSpeedTime > 50) {
			var o = _posPoints.length > 2 ? _posPoints.shift() : {};
			o.x = x;
			o.y = y; 
			_posPoints.push(o);
			_gestureCheckSpeedTime = time;
		}
	},

	_calculateVerticalDragOpacityRatio = function() {
		var yOffset = _panOffset.y - self.currItem.initialPosition.y; // difference between initial and current position
		return 1 -  Math.abs( yOffset / (_viewportSize.y / 2)  );
	},

	
	// points pool, reused during touch events
	_ePoint1 = {},
	_ePoint2 = {},
	_tempPointsArr = [],
	_tempCounter,
	_getTouchPoints = function(e) {
		// clean up previous points, without recreating array
		while(_tempPointsArr.length > 0) {
			_tempPointsArr.pop();
		}

		if(!_pointerEventEnabled) {
			if(e.type.indexOf('touch') > -1) {

				if(e.touches && e.touches.length > 0) {
					_tempPointsArr[0] = _convertTouchToPoint(e.touches[0], _ePoint1);
					if(e.touches.length > 1) {
						_tempPointsArr[1] = _convertTouchToPoint(e.touches[1], _ePoint2);
					}
				}
				
			} else {
				_ePoint1.x = e.pageX;
				_ePoint1.y = e.pageY;
				_ePoint1.id = '';
				_tempPointsArr[0] = _ePoint1;//_ePoint1;
			}
		} else {
			_tempCounter = 0;
			// we can use forEach, as pointer events are supported only in modern browsers
			_currPointers.forEach(function(p) {
				if(_tempCounter === 0) {
					_tempPointsArr[0] = p;
				} else if(_tempCounter === 1) {
					_tempPointsArr[1] = p;
				}
				_tempCounter++;

			});
		}
		return _tempPointsArr;
	},

	_panOrMoveMainScroll = function(axis, delta) {

		var panFriction,
			overDiff = 0,
			newOffset = _panOffset[axis] + delta[axis],
			startOverDiff,
			dir = delta[axis] > 0,
			newMainScrollPosition = _mainScrollPos.x + delta.x,
			mainScrollDiff = _mainScrollPos.x - _startMainScrollPos.x,
			newPanPos,
			newMainScrollPos;

		// calculate fdistance over the bounds and friction
		if(newOffset > _currPanBounds.min[axis] || newOffset < _currPanBounds.max[axis]) {
			panFriction = _options.panEndFriction;
			// Linear increasing of friction, so at 1/4 of viewport it's at max value. 
			// Looks not as nice as was expected. Left for history.
			// panFriction = (1 - (_panOffset[axis] + delta[axis] + panBounds.min[axis]) / (_viewportSize[axis] / 4) );
		} else {
			panFriction = 1;
		}
		
		newOffset = _panOffset[axis] + delta[axis] * panFriction;

		// move main scroll or start panning
		if(_options.allowPanToNext || _currZoomLevel === self.currItem.initialZoomLevel) {


			if(!_currZoomElementStyle) {
				
				newMainScrollPos = newMainScrollPosition;

			} else if(_direction === 'h' && axis === 'x' && !_zoomStarted ) {
				
				if(dir) {
					if(newOffset > _currPanBounds.min[axis]) {
						panFriction = _options.panEndFriction;
						overDiff = _currPanBounds.min[axis] - newOffset;
						startOverDiff = _currPanBounds.min[axis] - _startPanOffset[axis];
					}
					
					// drag right
					if( (startOverDiff <= 0 || mainScrollDiff < 0) && _getNumItems() > 1 ) {
						newMainScrollPos = newMainScrollPosition;
						if(mainScrollDiff < 0 && newMainScrollPosition > _startMainScrollPos.x) {
							newMainScrollPos = _startMainScrollPos.x;
						}
					} else {
						if(_currPanBounds.min.x !== _currPanBounds.max.x) {
							newPanPos = newOffset;
						}
						
					}

				} else {

					if(newOffset < _currPanBounds.max[axis] ) {
						panFriction =_options.panEndFriction;
						overDiff = newOffset - _currPanBounds.max[axis];
						startOverDiff = _startPanOffset[axis] - _currPanBounds.max[axis];
					}

					if( (startOverDiff <= 0 || mainScrollDiff > 0) && _getNumItems() > 1 ) {
						newMainScrollPos = newMainScrollPosition;

						if(mainScrollDiff > 0 && newMainScrollPosition < _startMainScrollPos.x) {
							newMainScrollPos = _startMainScrollPos.x;
						}

					} else {
						if(_currPanBounds.min.x !== _currPanBounds.max.x) {
							newPanPos = newOffset;
						}
					}

				}


				//
			}

			if(axis === 'x') {

				if(newMainScrollPos !== undefined) {
					_moveMainScroll(newMainScrollPos, true);
					if(newMainScrollPos === _startMainScrollPos.x) {
						_mainScrollShifted = false;
					} else {
						_mainScrollShifted = true;
					}
				}

				if(_currPanBounds.min.x !== _currPanBounds.max.x) {
					if(newPanPos !== undefined) {
						_panOffset.x = newPanPos;
					} else if(!_mainScrollShifted) {
						_panOffset.x += delta.x * panFriction;
					}
				}

				return newMainScrollPos !== undefined;
			}

		}

		if(!_mainScrollAnimating) {
			
			if(!_mainScrollShifted) {
				if(_currZoomLevel > self.currItem.fitRatio) {
					_panOffset[axis] += delta[axis] * panFriction;
				
				}
			}

			
		}
		
	},

	// Pointerdown/touchstart/mousedown handler
	_onDragStart = function(e) {

		// Allow dragging only via left mouse button.
		// As this handler is not added in IE8 - we ignore e.which
		// 
		// http://www.quirksmode.org/js/events_properties.html
		// https://developer.mozilla.org/en-US/docs/Web/API/event.button
		if(e.type === 'mousedown' && e.button > 0  ) {
			return;
		}

		if(_initialZoomRunning) {
			e.preventDefault();
			return;
		}

		if(_oldAndroidTouchEndTimeout && e.type === 'mousedown') {
			return;
		}

		if(_preventDefaultEventBehaviour(e, true)) {
			e.preventDefault();
		}



		_shout('pointerDown');

		if(_pointerEventEnabled) {
			var pointerIndex = framework.arraySearch(_currPointers, e.pointerId, 'id');
			if(pointerIndex < 0) {
				pointerIndex = _currPointers.length;
			}
			_currPointers[pointerIndex] = {x:e.pageX, y:e.pageY, id: e.pointerId};
		}
		


		var startPointsList = _getTouchPoints(e),
			numPoints = startPointsList.length;

		_currentPoints = null;

		_stopAllAnimations();

		// init drag
		if(!_isDragging || numPoints === 1) {

			

			_isDragging = _isFirstMove = true;
			framework.bind(window, _upMoveEvents, self);

			_isZoomingIn = 
				_wasOverInitialZoom = 
				_opacityChanged = 
				_verticalDragInitiated = 
				_mainScrollShifted = 
				_moved = 
				_isMultitouch = 
				_zoomStarted = false;

			_direction = null;

			_shout('firstTouchStart', startPointsList);

			_equalizePoints(_startPanOffset, _panOffset);

			_currPanDist.x = _currPanDist.y = 0;
			_equalizePoints(_currPoint, startPointsList[0]);
			_equalizePoints(_startPoint, _currPoint);

			//_equalizePoints(_startMainScrollPos, _mainScrollPos);
			_startMainScrollPos.x = _slideSize.x * _currPositionIndex;

			_posPoints = [{
				x: _currPoint.x,
				y: _currPoint.y
			}];

			_gestureCheckSpeedTime = _gestureStartTime = _getCurrentTime();

			//_mainScrollAnimationEnd(true);
			_calculatePanBounds( _currZoomLevel, true );
			
			// Start rendering
			_stopDragUpdateLoop();
			_dragUpdateLoop();
			
		}

		// init zoom
		if(!_isZooming && numPoints > 1 && !_mainScrollAnimating && !_mainScrollShifted) {
			_startZoomLevel = _currZoomLevel;
			_zoomStarted = false; // true if zoom changed at least once

			_isZooming = _isMultitouch = true;
			_currPanDist.y = _currPanDist.x = 0;

			_equalizePoints(_startPanOffset, _panOffset);

			_equalizePoints(p, startPointsList[0]);
			_equalizePoints(p2, startPointsList[1]);

			_findCenterOfPoints(p, p2, _currCenterPoint);

			_midZoomPoint.x = Math.abs(_currCenterPoint.x) - _panOffset.x;
			_midZoomPoint.y = Math.abs(_currCenterPoint.y) - _panOffset.y;
			_currPointsDistance = _startPointsDistance = _calculatePointsDistance(p, p2);
		}


	},

	// Pointermove/touchmove/mousemove handler
	_onDragMove = function(e) {

		e.preventDefault();

		if(_pointerEventEnabled) {
			var pointerIndex = framework.arraySearch(_currPointers, e.pointerId, 'id');
			if(pointerIndex > -1) {
				var p = _currPointers[pointerIndex];
				p.x = e.pageX;
				p.y = e.pageY; 
			}
		}

		if(_isDragging) {
			var touchesList = _getTouchPoints(e);
			if(!_direction && !_moved && !_isZooming) {

				if(_mainScrollPos.x !== _slideSize.x * _currPositionIndex) {
					// if main scroll position is shifted – direction is always horizontal
					_direction = 'h';
				} else {
					var diff = Math.abs(touchesList[0].x - _currPoint.x) - Math.abs(touchesList[0].y - _currPoint.y);
					// check the direction of movement
					if(Math.abs(diff) >= DIRECTION_CHECK_OFFSET) {
						_direction = diff > 0 ? 'h' : 'v';
						_currentPoints = touchesList;
					}
				}
				
			} else {
				_currentPoints = touchesList;
			}
		}	
	},
	// 
	_renderMovement =  function() {

		if(!_currentPoints) {
			return;
		}

		var numPoints = _currentPoints.length;

		if(numPoints === 0) {
			return;
		}

		_equalizePoints(p, _currentPoints[0]);

		delta.x = p.x - _currPoint.x;
		delta.y = p.y - _currPoint.y;

		if(_isZooming && numPoints > 1) {
			// Handle behaviour for more than 1 point

			_currPoint.x = p.x;
			_currPoint.y = p.y;
		
			// check if one of two points changed
			if( !delta.x && !delta.y && _isEqualPoints(_currentPoints[1], p2) ) {
				return;
			}

			_equalizePoints(p2, _currentPoints[1]);


			if(!_zoomStarted) {
				_zoomStarted = true;
				_shout('zoomGestureStarted');
			}
			
			// Distance between two points
			var pointsDistance = _calculatePointsDistance(p,p2);

			var zoomLevel = _calculateZoomLevel(pointsDistance);

			// slightly over the of initial zoom level
			if(zoomLevel > self.currItem.initialZoomLevel + self.currItem.initialZoomLevel / 15) {
				_wasOverInitialZoom = true;
			}

			// Apply the friction if zoom level is out of the bounds
			var zoomFriction = 1,
				minZoomLevel = _getMinZoomLevel(),
				maxZoomLevel = _getMaxZoomLevel();

			if ( zoomLevel < minZoomLevel ) {
				
				if(_options.pinchToClose && !_wasOverInitialZoom && _startZoomLevel <= self.currItem.initialZoomLevel) {
					// fade out background if zooming out
					var minusDiff = minZoomLevel - zoomLevel;
					var percent = 1 - minusDiff / (minZoomLevel / 1.2);

					_applyBgOpacity(percent);
					_shout('onPinchClose', percent);
					_opacityChanged = true;
				} else {
					zoomFriction = (minZoomLevel - zoomLevel) / minZoomLevel;
					if(zoomFriction > 1) {
						zoomFriction = 1;
					}
					zoomLevel = minZoomLevel - zoomFriction * (minZoomLevel / 3);
				}
				
			} else if ( zoomLevel > maxZoomLevel ) {
				// 1.5 - extra zoom level above the max. E.g. if max is x6, real max 6 + 1.5 = 7.5
				zoomFriction = (zoomLevel - maxZoomLevel) / ( minZoomLevel * 6 );
				if(zoomFriction > 1) {
					zoomFriction = 1;
				}
				zoomLevel = maxZoomLevel + zoomFriction * minZoomLevel;
			}

			if(zoomFriction < 0) {
				zoomFriction = 0;
			}

			// distance between touch points after friction is applied
			_currPointsDistance = pointsDistance;

			// _centerPoint - The point in the middle of two pointers
			_findCenterOfPoints(p, p2, _centerPoint);
		
			// paning with two pointers pressed
			_currPanDist.x += _centerPoint.x - _currCenterPoint.x;
			_currPanDist.y += _centerPoint.y - _currCenterPoint.y;
			_equalizePoints(_currCenterPoint, _centerPoint);

			_panOffset.x = _calculatePanOffset('x', zoomLevel);
			_panOffset.y = _calculatePanOffset('y', zoomLevel);

			_isZoomingIn = zoomLevel > _currZoomLevel;
			_currZoomLevel = zoomLevel;
			_applyCurrentZoomPan();

		} else {

			// handle behaviour for one point (dragging or panning)

			if(!_direction) {
				return;
			}

			if(_isFirstMove) {
				_isFirstMove = false;

				// subtract drag distance that was used during the detection direction  

				if( Math.abs(delta.x) >= DIRECTION_CHECK_OFFSET) {
					delta.x -= _currentPoints[0].x - _startPoint.x;
				}
				
				if( Math.abs(delta.y) >= DIRECTION_CHECK_OFFSET) {
					delta.y -= _currentPoints[0].y - _startPoint.y;
				}
			}

			_currPoint.x = p.x;
			_currPoint.y = p.y;

			// do nothing if pointers position hasn't changed
			if(delta.x === 0 && delta.y === 0) {
				return;
			}

			if(_direction === 'v' && _options.closeOnVerticalDrag) {
				if(!_canPan()) {
					_currPanDist.y += delta.y;
					_panOffset.y += delta.y;

					var opacityRatio = _calculateVerticalDragOpacityRatio();

					_verticalDragInitiated = true;
					_shout('onVerticalDrag', opacityRatio);

					_applyBgOpacity(opacityRatio);
					_applyCurrentZoomPan();
					return ;
				}
			}

			_pushPosPoint(_getCurrentTime(), p.x, p.y);

			_moved = true;
			_currPanBounds = self.currItem.bounds;
			
			var mainScrollChanged = _panOrMoveMainScroll('x', delta);
			if(!mainScrollChanged) {
				_panOrMoveMainScroll('y', delta);

				_roundPoint(_panOffset);
				_applyCurrentZoomPan();
			}

		}

	},
	
	// Pointerup/pointercancel/touchend/touchcancel/mouseup event handler
	_onDragRelease = function(e) {

		if(_features.isOldAndroid ) {

			if(_oldAndroidTouchEndTimeout && e.type === 'mouseup') {
				return;
			}

			// on Android (v4.1, 4.2, 4.3 & possibly older) 
			// ghost mousedown/up event isn't preventable via e.preventDefault,
			// which causes fake mousedown event
			// so we block mousedown/up for 600ms
			if( e.type.indexOf('touch') > -1 ) {
				clearTimeout(_oldAndroidTouchEndTimeout);
				_oldAndroidTouchEndTimeout = setTimeout(function() {
					_oldAndroidTouchEndTimeout = 0;
				}, 600);
			}
			
		}

		_shout('pointerUp');

		if(_preventDefaultEventBehaviour(e, false)) {
			e.preventDefault();
		}

		var releasePoint;

		if(_pointerEventEnabled) {
			var pointerIndex = framework.arraySearch(_currPointers, e.pointerId, 'id');
			
			if(pointerIndex > -1) {
				releasePoint = _currPointers.splice(pointerIndex, 1)[0];

				if(navigator.pointerEnabled) {
					releasePoint.type = e.pointerType || 'mouse';
				} else {
					var MSPOINTER_TYPES = {
						4: 'mouse', // event.MSPOINTER_TYPE_MOUSE
						2: 'touch', // event.MSPOINTER_TYPE_TOUCH 
						3: 'pen' // event.MSPOINTER_TYPE_PEN
					};
					releasePoint.type = MSPOINTER_TYPES[e.pointerType];

					if(!releasePoint.type) {
						releasePoint.type = e.pointerType || 'mouse';
					}
				}

			}
		}

		var touchList = _getTouchPoints(e),
			gestureType,
			numPoints = touchList.length;

		if(e.type === 'mouseup') {
			numPoints = 0;
		}

		// Do nothing if there were 3 touch points or more
		if(numPoints === 2) {
			_currentPoints = null;
			return true;
		}

		// if second pointer released
		if(numPoints === 1) {
			_equalizePoints(_startPoint, touchList[0]);
		}				


		// pointer hasn't moved, send "tap release" point
		if(numPoints === 0 && !_direction && !_mainScrollAnimating) {
			if(!releasePoint) {
				if(e.type === 'mouseup') {
					releasePoint = {x: e.pageX, y: e.pageY, type:'mouse'};
				} else if(e.changedTouches && e.changedTouches[0]) {
					releasePoint = {x: e.changedTouches[0].pageX, y: e.changedTouches[0].pageY, type:'touch'};
				}		
			}

			_shout('touchRelease', e, releasePoint);
		}

		// Difference in time between releasing of two last touch points (zoom gesture)
		var releaseTimeDiff = -1;

		// Gesture completed, no pointers left
		if(numPoints === 0) {
			_isDragging = false;
			framework.unbind(window, _upMoveEvents, self);

			_stopDragUpdateLoop();

			if(_isZooming) {
				// Two points released at the same time
				releaseTimeDiff = 0;
			} else if(_lastReleaseTime !== -1) {
				releaseTimeDiff = _getCurrentTime() - _lastReleaseTime;
			}
		}
		_lastReleaseTime = numPoints === 1 ? _getCurrentTime() : -1;
		
		if(releaseTimeDiff !== -1 && releaseTimeDiff < 150) {
			gestureType = 'zoom';
		} else {
			gestureType = 'swipe';
		}

		if(_isZooming && numPoints < 2) {
			_isZooming = false;

			// Only second point released
			if(numPoints === 1) {
				gestureType = 'zoomPointerUp';
			}
			_shout('zoomGestureEnded');
		}

		_currentPoints = null;
		if(!_moved && !_zoomStarted && !_mainScrollAnimating && !_verticalDragInitiated) {
			// nothing to animate
			return;
		}
	
		_stopAllAnimations();

		
		if(!_releaseAnimData) {
			_releaseAnimData = _initDragReleaseAnimationData();
		}
		
		_releaseAnimData.calculateSwipeSpeed('x');


		if(_verticalDragInitiated) {

			var opacityRatio = _calculateVerticalDragOpacityRatio();

			if(opacityRatio < _options.verticalDragRange) {
				self.close();
			} else {
				var initalPanY = _panOffset.y,
					initialBgOpacity = _bgOpacity;

				_animateProp('verticalDrag', 0, 1, 300, framework.easing.cubic.out, function(now) {
					
					_panOffset.y = (self.currItem.initialPosition.y - initalPanY) * now + initalPanY;

					_applyBgOpacity(  (1 - initialBgOpacity) * now + initialBgOpacity );
					_applyCurrentZoomPan();
				});

				_shout('onVerticalDrag', 1);
			}

			return;
		}


		// main scroll 
		if(  (_mainScrollShifted || _mainScrollAnimating) && numPoints === 0) {
			var itemChanged = _finishSwipeMainScrollGesture(gestureType, _releaseAnimData);
			if(itemChanged) {
				return;
			}
			gestureType = 'zoomPointerUp';
		}

		// prevent zoom/pan animation when main scroll animation runs
		if(_mainScrollAnimating) {
			return;
		}
		
		// Complete simple zoom gesture (reset zoom level if it's out of the bounds)  
		if(gestureType !== 'swipe') {
			_completeZoomGesture();
			return;
		}
	
		// Complete pan gesture if main scroll is not shifted, and it's possible to pan current image
		if(!_mainScrollShifted && _currZoomLevel > self.currItem.fitRatio) {
			_completePanGesture(_releaseAnimData);
		}
	},


	// Returns object with data about gesture
	// It's created only once and then reused
	_initDragReleaseAnimationData  = function() {
		// temp local vars
		var lastFlickDuration,
			tempReleasePos;

		// s = this
		var s = {
			lastFlickOffset: {},
			lastFlickDist: {},
			lastFlickSpeed: {},
			slowDownRatio:  {},
			slowDownRatioReverse:  {},
			speedDecelerationRatio:  {},
			speedDecelerationRatioAbs:  {},
			distanceOffset:  {},
			backAnimDestination: {},
			backAnimStarted: {},
			calculateSwipeSpeed: function(axis) {
				

				if( _posPoints.length > 1) {
					lastFlickDuration = _getCurrentTime() - _gestureCheckSpeedTime + 50;
					tempReleasePos = _posPoints[_posPoints.length-2][axis];
				} else {
					lastFlickDuration = _getCurrentTime() - _gestureStartTime; // total gesture duration
					tempReleasePos = _startPoint[axis];
				}
				s.lastFlickOffset[axis] = _currPoint[axis] - tempReleasePos;
				s.lastFlickDist[axis] = Math.abs(s.lastFlickOffset[axis]);
				if(s.lastFlickDist[axis] > 20) {
					s.lastFlickSpeed[axis] = s.lastFlickOffset[axis] / lastFlickDuration;
				} else {
					s.lastFlickSpeed[axis] = 0;
				}
				if( Math.abs(s.lastFlickSpeed[axis]) < 0.1 ) {
					s.lastFlickSpeed[axis] = 0;
				}
				
				s.slowDownRatio[axis] = 0.95;
				s.slowDownRatioReverse[axis] = 1 - s.slowDownRatio[axis];
				s.speedDecelerationRatio[axis] = 1;
			},

			calculateOverBoundsAnimOffset: function(axis, speed) {
				if(!s.backAnimStarted[axis]) {

					if(_panOffset[axis] > _currPanBounds.min[axis]) {
						s.backAnimDestination[axis] = _currPanBounds.min[axis];
						
					} else if(_panOffset[axis] < _currPanBounds.max[axis]) {
						s.backAnimDestination[axis] = _currPanBounds.max[axis];
					}

					if(s.backAnimDestination[axis] !== undefined) {
						s.slowDownRatio[axis] = 0.7;
						s.slowDownRatioReverse[axis] = 1 - s.slowDownRatio[axis];
						if(s.speedDecelerationRatioAbs[axis] < 0.05) {

							s.lastFlickSpeed[axis] = 0;
							s.backAnimStarted[axis] = true;

							_animateProp('bounceZoomPan'+axis,_panOffset[axis], 
								s.backAnimDestination[axis], 
								speed || 300, 
								framework.easing.sine.out, 
								function(pos) {
									_panOffset[axis] = pos;
									_applyCurrentZoomPan();
								}
							);

						}
					}
				}
			},

			// Reduces the speed by slowDownRatio (per 10ms)
			calculateAnimOffset: function(axis) {
				if(!s.backAnimStarted[axis]) {
					s.speedDecelerationRatio[axis] = s.speedDecelerationRatio[axis] * (s.slowDownRatio[axis] + 
												s.slowDownRatioReverse[axis] - 
												s.slowDownRatioReverse[axis] * s.timeDiff / 10);

					s.speedDecelerationRatioAbs[axis] = Math.abs(s.lastFlickSpeed[axis] * s.speedDecelerationRatio[axis]);
					s.distanceOffset[axis] = s.lastFlickSpeed[axis] * s.speedDecelerationRatio[axis] * s.timeDiff;
					_panOffset[axis] += s.distanceOffset[axis];

				}
			},

			panAnimLoop: function() {
				if ( _animations.zoomPan ) {
					_animations.zoomPan.raf = _requestAF(s.panAnimLoop);

					s.now = _getCurrentTime();
					s.timeDiff = s.now - s.lastNow;
					s.lastNow = s.now;
					
					s.calculateAnimOffset('x');
					s.calculateAnimOffset('y');

					_applyCurrentZoomPan();
					
					s.calculateOverBoundsAnimOffset('x');
					s.calculateOverBoundsAnimOffset('y');


					if (s.speedDecelerationRatioAbs.x < 0.05 && s.speedDecelerationRatioAbs.y < 0.05) {

						// round pan position
						_panOffset.x = Math.round(_panOffset.x);
						_panOffset.y = Math.round(_panOffset.y);
						_applyCurrentZoomPan();
						
						_stopAnimation('zoomPan');
						return;
					}
				}

			}
		};
		return s;
	},

	_completePanGesture = function(animData) {
		// calculate swipe speed for Y axis (paanning)
		animData.calculateSwipeSpeed('y');

		_currPanBounds = self.currItem.bounds;
		
		animData.backAnimDestination = {};
		animData.backAnimStarted = {};

		// Avoid acceleration animation if speed is too low
		if(Math.abs(animData.lastFlickSpeed.x) <= 0.05 && Math.abs(animData.lastFlickSpeed.y) <= 0.05 ) {
			animData.speedDecelerationRatioAbs.x = animData.speedDecelerationRatioAbs.y = 0;

			// Run pan drag release animation. E.g. if you drag image and release finger without momentum.
			animData.calculateOverBoundsAnimOffset('x');
			animData.calculateOverBoundsAnimOffset('y');
			return true;
		}

		// Animation loop that controls the acceleration after pan gesture ends
		_registerStartAnimation('zoomPan');
		animData.lastNow = _getCurrentTime();
		animData.panAnimLoop();
	},


	_finishSwipeMainScrollGesture = function(gestureType, _releaseAnimData) {
		var itemChanged;
		if(!_mainScrollAnimating) {
			_currZoomedItemIndex = _currentItemIndex;
		}


		
		var itemsDiff;

		if(gestureType === 'swipe') {
			var totalShiftDist = _currPoint.x - _startPoint.x,
				isFastLastFlick = _releaseAnimData.lastFlickDist.x < 10;

			// if container is shifted for more than MIN_SWIPE_DISTANCE, 
			// and last flick gesture was in right direction
			if(totalShiftDist > MIN_SWIPE_DISTANCE && 
				(isFastLastFlick || _releaseAnimData.lastFlickOffset.x > 20) ) {
				// go to prev item
				itemsDiff = -1;
			} else if(totalShiftDist < -MIN_SWIPE_DISTANCE && 
				(isFastLastFlick || _releaseAnimData.lastFlickOffset.x < -20) ) {
				// go to next item
				itemsDiff = 1;
			}
		}

		var nextCircle;

		if(itemsDiff) {
			
			_currentItemIndex += itemsDiff;

			if(_currentItemIndex < 0) {
				_currentItemIndex = _options.loop ? _getNumItems()-1 : 0;
				nextCircle = true;
			} else if(_currentItemIndex >= _getNumItems()) {
				_currentItemIndex = _options.loop ? 0 : _getNumItems()-1;
				nextCircle = true;
			}

			if(!nextCircle || _options.loop) {
				_indexDiff += itemsDiff;
				_currPositionIndex -= itemsDiff;
				itemChanged = true;
			}
			

			
		}

		var animateToX = _slideSize.x * _currPositionIndex;
		var animateToDist = Math.abs( animateToX - _mainScrollPos.x );
		var finishAnimDuration;


		if(!itemChanged && animateToX > _mainScrollPos.x !== _releaseAnimData.lastFlickSpeed.x > 0) {
			// "return to current" duration, e.g. when dragging from slide 0 to -1
			finishAnimDuration = 333; 
		} else {
			finishAnimDuration = Math.abs(_releaseAnimData.lastFlickSpeed.x) > 0 ? 
									animateToDist / Math.abs(_releaseAnimData.lastFlickSpeed.x) : 
									333;

			finishAnimDuration = Math.min(finishAnimDuration, 400);
			finishAnimDuration = Math.max(finishAnimDuration, 250);
		}

		if(_currZoomedItemIndex === _currentItemIndex) {
			itemChanged = false;
		}
		
		_mainScrollAnimating = true;
		
		_shout('mainScrollAnimStart');

		_animateProp('mainScroll', _mainScrollPos.x, animateToX, finishAnimDuration, framework.easing.cubic.out, 
			_moveMainScroll,
			function() {
				_stopAllAnimations();
				_mainScrollAnimating = false;
				_currZoomedItemIndex = -1;
				
				if(itemChanged || _currZoomedItemIndex !== _currentItemIndex) {
					self.updateCurrItem();
				}
				
				_shout('mainScrollAnimComplete');
			}
		);

		if(itemChanged) {
			self.updateCurrItem(true);
		}

		return itemChanged;
	},

	_calculateZoomLevel = function(touchesDistance) {
		return  1 / _startPointsDistance * touchesDistance * _startZoomLevel;
	},

	// Resets zoom if it's out of bounds
	_completeZoomGesture = function() {
		var destZoomLevel = _currZoomLevel,
			minZoomLevel = _getMinZoomLevel(),
			maxZoomLevel = _getMaxZoomLevel();

		if ( _currZoomLevel < minZoomLevel ) {
			destZoomLevel = minZoomLevel;
		} else if ( _currZoomLevel > maxZoomLevel ) {
			destZoomLevel = maxZoomLevel;
		}

		var destOpacity = 1,
			onUpdate,
			initialOpacity = _bgOpacity;

		if(_opacityChanged && !_isZoomingIn && !_wasOverInitialZoom && _currZoomLevel < minZoomLevel) {
			//_closedByScroll = true;
			self.close();
			return true;
		}

		if(_opacityChanged) {
			onUpdate = function(now) {
				_applyBgOpacity(  (destOpacity - initialOpacity) * now + initialOpacity );
			};
		}

		self.zoomTo(destZoomLevel, 0, 200,  framework.easing.cubic.out, onUpdate);
		return true;
	};


_registerModule('Gestures', {
	publicMethods: {

		initGestures: function() {

			// helper function that builds touch/pointer/mouse events
			var addEventNames = function(pref, down, move, up, cancel) {
				_dragStartEvent = pref + down;
				_dragMoveEvent = pref + move;
				_dragEndEvent = pref + up;
				if(cancel) {
					_dragCancelEvent = pref + cancel;
				} else {
					_dragCancelEvent = '';
				}
			};

			_pointerEventEnabled = _features.pointerEvent;
			if(_pointerEventEnabled && _features.touch) {
				// we don't need touch events, if browser supports pointer events
				_features.touch = false;
			}

			if(_pointerEventEnabled) {
				if(navigator.pointerEnabled) {
					addEventNames('pointer', 'down', 'move', 'up', 'cancel');
				} else {
					// IE10 pointer events are case-sensitive
					addEventNames('MSPointer', 'Down', 'Move', 'Up', 'Cancel');
				}
			} else if(_features.touch) {
				addEventNames('touch', 'start', 'move', 'end', 'cancel');
				_likelyTouchDevice = true;
			} else {
				addEventNames('mouse', 'down', 'move', 'up');	
			}

			_upMoveEvents = _dragMoveEvent + ' ' + _dragEndEvent  + ' ' +  _dragCancelEvent;
			_downEvents = _dragStartEvent;

			if(_pointerEventEnabled && !_likelyTouchDevice) {
				_likelyTouchDevice = (navigator.maxTouchPoints > 1) || (navigator.msMaxTouchPoints > 1);
			}
			// make variable public
			self.likelyTouchDevice = _likelyTouchDevice; 
			
			_globalEventHandlers[_dragStartEvent] = _onDragStart;
			_globalEventHandlers[_dragMoveEvent] = _onDragMove;
			_globalEventHandlers[_dragEndEvent] = _onDragRelease; // the Kraken

			if(_dragCancelEvent) {
				_globalEventHandlers[_dragCancelEvent] = _globalEventHandlers[_dragEndEvent];
			}

			// Bind mouse events on device with detected hardware touch support, in case it supports multiple types of input.
			if(_features.touch) {
				_downEvents += ' mousedown';
				_upMoveEvents += ' mousemove mouseup';
				_globalEventHandlers.mousedown = _globalEventHandlers[_dragStartEvent];
				_globalEventHandlers.mousemove = _globalEventHandlers[_dragMoveEvent];
				_globalEventHandlers.mouseup = _globalEventHandlers[_dragEndEvent];
			}

			if(!_likelyTouchDevice) {
				// don't allow pan to next slide from zoomed state on Desktop
				_options.allowPanToNext = false;
			}
		}

	}
});


/*>>gestures*/

/*>>show-hide-transition*/
/**
 * show-hide-transition.js:
 *
 * Manages initial opening or closing transition.
 *
 * If you're not planning to use transition for gallery at all,
 * you may set options hideAnimationDuration and showAnimationDuration to 0,
 * and just delete startAnimation function.
 * 
 */


var _showOrHideTimeout,
	_showOrHide = function(item, img, out, completeFn) {

		if(_showOrHideTimeout) {
			clearTimeout(_showOrHideTimeout);
		}

		_initialZoomRunning = true;
		_initialContentSet = true;
		
		// dimensions of small thumbnail {x:,y:,w:}.
		// Height is optional, as calculated based on large image.
		var thumbBounds; 
		if(item.initialLayout) {
			thumbBounds = item.initialLayout;
			item.initialLayout = null;
		} else {
			thumbBounds = _options.getThumbBoundsFn && _options.getThumbBoundsFn(_currentItemIndex);
		}

		var duration = out ? _options.hideAnimationDuration : _options.showAnimationDuration;

		var onComplete = function() {
			_stopAnimation('initialZoom');
			if(!out) {
				_applyBgOpacity(1);
				if(img) {
					img.style.display = 'block';
				}
				framework.addClass(template, 'pswp--animated-in');
				_shout('initialZoom' + (out ? 'OutEnd' : 'InEnd'));
			} else {
				self.template.removeAttribute('style');
				self.bg.removeAttribute('style');
			}

			if(completeFn) {
				completeFn();
			}
			_initialZoomRunning = false;
		};

		// if bounds aren't provided, just open gallery without animation
		if(!duration || !thumbBounds || thumbBounds.x === undefined) {

			_shout('initialZoom' + (out ? 'Out' : 'In') );

			_currZoomLevel = item.initialZoomLevel;
			_equalizePoints(_panOffset,  item.initialPosition );
			_applyCurrentZoomPan();

			template.style.opacity = out ? 0 : 1;
			_applyBgOpacity(1);

			if(duration) {
				setTimeout(function() {
					onComplete();
				}, duration);
			} else {
				onComplete();
			}

			return;
		}

		var startAnimation = function() {
			var closeWithRaf = _closedByScroll,
				fadeEverything = !self.currItem.src || self.currItem.loadError || _options.showHideOpacity;
			
			// apply hw-acceleration to image
			if(item.miniImg) {
				item.miniImg.style.webkitBackfaceVisibility = 'hidden';
			}

			if(!out) {
				_currZoomLevel = thumbBounds.w / item.w;
				_panOffset.x = thumbBounds.x;
				_panOffset.y = thumbBounds.y - _initalWindowScrollY;

				self[fadeEverything ? 'template' : 'bg'].style.opacity = 0.001;
				_applyCurrentZoomPan();
			}

			_registerStartAnimation('initialZoom');
			
			if(out && !closeWithRaf) {
				framework.removeClass(template, 'pswp--animated-in');
			}

			if(fadeEverything) {
				if(out) {
					framework[ (closeWithRaf ? 'remove' : 'add') + 'Class' ](template, 'pswp--animate_opacity');
				} else {
					setTimeout(function() {
						framework.addClass(template, 'pswp--animate_opacity');
					}, 30);
				}
			}

			_showOrHideTimeout = setTimeout(function() {

				_shout('initialZoom' + (out ? 'Out' : 'In') );
				

				if(!out) {

					// "in" animation always uses CSS transitions (instead of rAF).
					// CSS transition work faster here, 
					// as developer may also want to animate other things, 
					// like ui on top of sliding area, which can be animated just via CSS
					
					_currZoomLevel = item.initialZoomLevel;
					_equalizePoints(_panOffset,  item.initialPosition );
					_applyCurrentZoomPan();
					_applyBgOpacity(1);

					if(fadeEverything) {
						template.style.opacity = 1;
					} else {
						_applyBgOpacity(1);
					}

					_showOrHideTimeout = setTimeout(onComplete, duration + 20);
				} else {

					// "out" animation uses rAF only when PhotoSwipe is closed by browser scroll, to recalculate position
					var destZoomLevel = thumbBounds.w / item.w,
						initialPanOffset = {
							x: _panOffset.x,
							y: _panOffset.y
						},
						initialZoomLevel = _currZoomLevel,
						initalBgOpacity = _bgOpacity,
						onUpdate = function(now) {
							
							if(now === 1) {
								_currZoomLevel = destZoomLevel;
								_panOffset.x = thumbBounds.x;
								_panOffset.y = thumbBounds.y  - _currentWindowScrollY;
							} else {
								_currZoomLevel = (destZoomLevel - initialZoomLevel) * now + initialZoomLevel;
								_panOffset.x = (thumbBounds.x - initialPanOffset.x) * now + initialPanOffset.x;
								_panOffset.y = (thumbBounds.y - _currentWindowScrollY - initialPanOffset.y) * now + initialPanOffset.y;
							}
							
							_applyCurrentZoomPan();
							if(fadeEverything) {
								template.style.opacity = 1 - now;
							} else {
								_applyBgOpacity( initalBgOpacity - now * initalBgOpacity );
							}
						};

					if(closeWithRaf) {
						_animateProp('initialZoom', 0, 1, duration, framework.easing.cubic.out, onUpdate, onComplete);
					} else {
						onUpdate(1);
						_showOrHideTimeout = setTimeout(onComplete, duration + 20);
					}
				}
			
			}, out ? 25 : 90); // Main purpose of this delay is to give browser time to paint and
					// create composite layers of PhotoSwipe UI parts (background, controls, caption, arrows).
					// Which avoids lag at the beginning of scale transition.
		};
		startAnimation();

		
	};

/*>>show-hide-transition*/

/*>>items-controller*/
/**
*
* Controller manages gallery items, their dimensions, and their content.
* 
*/

var _items,
	_tempPanAreaSize = {},
	_imagesToAppendPool = [],
	_initialContentSet,
	_initialZoomRunning,
	_controllerDefaultOptions = {
		index: 0,
		errorMsg: '<div class="pswp__error-msg"><a href="%url%" target="_blank">The image</a> could not be loaded.</div>',
		forceProgressiveLoading: false, // TODO
		preload: [1,1],
		getNumItemsFn: function() {
			return _items.length;
		}
	};


var _getItemAt,
	_getNumItems,
	_initialIsLoop,
	_getZeroBounds = function() {
		return {
			center:{x:0,y:0}, 
			max:{x:0,y:0}, 
			min:{x:0,y:0}
		};
	},
	_calculateSingleItemPanBounds = function(item, realPanElementW, realPanElementH ) {
		var bounds = item.bounds;

		// position of element when it's centered
		bounds.center.x = Math.round((_tempPanAreaSize.x - realPanElementW) / 2);
		bounds.center.y = Math.round((_tempPanAreaSize.y - realPanElementH) / 2) + item.vGap.top;

		// maximum pan position
		bounds.max.x = (realPanElementW > _tempPanAreaSize.x) ? 
							Math.round(_tempPanAreaSize.x - realPanElementW) : 
							bounds.center.x;
		
		bounds.max.y = (realPanElementH > _tempPanAreaSize.y) ? 
							Math.round(_tempPanAreaSize.y - realPanElementH) + item.vGap.top : 
							bounds.center.y;
		
		// minimum pan position
		bounds.min.x = (realPanElementW > _tempPanAreaSize.x) ? 0 : bounds.center.x;
		bounds.min.y = (realPanElementH > _tempPanAreaSize.y) ? item.vGap.top : bounds.center.y;
	},
	_calculateItemSize = function(item, viewportSize, zoomLevel) {

		if (item.src && !item.loadError) {
			var isInitial = !zoomLevel;
			
			if(isInitial) {
				if(!item.vGap) {
					item.vGap = {top:0,bottom:0};
				}
				// allows overriding vertical margin for individual items
				_shout('parseVerticalMargin', item);
			}


			_tempPanAreaSize.x = viewportSize.x;
			_tempPanAreaSize.y = viewportSize.y - item.vGap.top - item.vGap.bottom;

			if (isInitial) {
				var hRatio = _tempPanAreaSize.x / item.w;
				var vRatio = _tempPanAreaSize.y / item.h;

				item.fitRatio = hRatio < vRatio ? hRatio : vRatio;
				//item.fillRatio = hRatio > vRatio ? hRatio : vRatio;

				var scaleMode = _options.scaleMode;

				if (scaleMode === 'orig') {
					zoomLevel = 1;
				} else if (scaleMode === 'fit') {
					zoomLevel = item.fitRatio;
				}

				if (zoomLevel > 1) {
					zoomLevel = 1;
				}

				item.initialZoomLevel = zoomLevel;
				
				if(!item.bounds) {
					// reuse bounds object
					item.bounds = _getZeroBounds(); 
				}
			}

			if(!zoomLevel) {
				return;
			}

			_calculateSingleItemPanBounds(item, item.w * zoomLevel, item.h * zoomLevel);

			if (isInitial && zoomLevel === item.initialZoomLevel) {
				item.initialPosition = item.bounds.center;
			}

			return item.bounds;
		} else {
			item.w = item.h = 0;
			item.initialZoomLevel = item.fitRatio = 1;
			item.bounds = _getZeroBounds();
			item.initialPosition = item.bounds.center;

			// if it's not image, we return zero bounds (content is not zoomable)
			return item.bounds;
		}
		
	},

	


	_appendImage = function(index, item, baseDiv, img, preventAnimation, keepPlaceholder) {
		

		if(item.loadError) {
			return;
		}

		if(img) {

			item.imageAppended = true;
			_setImageSize(item, img, (item === self.currItem && _renderMaxResolution) );
			
			baseDiv.appendChild(img);

			if(keepPlaceholder) {
				setTimeout(function() {
					if(item && item.loaded && item.placeholder) {
						item.placeholder.style.display = 'none';
						item.placeholder = null;
					}
				}, 500);
			}
		}
	},
	


	_preloadImage = function(item) {
		item.loading = true;
		item.loaded = false;
		var img = item.img = framework.createEl('pswp__img', 'img');
		var onComplete = function() {
			item.loading = false;
			item.loaded = true;

			if(item.loadComplete) {
				item.loadComplete(item);
			} else {
				item.img = null; // no need to store image object
			}
			img.onload = img.onerror = null;
			img = null;
		};
		img.onload = onComplete;
		img.onerror = function() {
			item.loadError = true;
			onComplete();
		};		

		img.src = item.src;// + '?a=' + Math.random();

		return img;
	},
	_checkForError = function(item, cleanUp) {
		if(item.src && item.loadError && item.container) {

			if(cleanUp) {
				item.container.innerHTML = '';
			}

			item.container.innerHTML = _options.errorMsg.replace('%url%',  item.src );
			return true;
			
		}
	},
	_setImageSize = function(item, img, maxRes) {
		if(!item.src) {
			return;
		}

		if(!img) {
			img = item.container.lastChild;
		}

		var w = maxRes ? item.w : Math.round(item.w * item.fitRatio),
			h = maxRes ? item.h : Math.round(item.h * item.fitRatio);
		
		if(item.placeholder && !item.loaded) {
			item.placeholder.style.width = w + 'px';
			item.placeholder.style.height = h + 'px';
		}

		img.style.width = w + 'px';
		img.style.height = h + 'px';
	},
	_appendImagesPool = function() {

		if(_imagesToAppendPool.length) {
			var poolItem;

			for(var i = 0; i < _imagesToAppendPool.length; i++) {
				poolItem = _imagesToAppendPool[i];
				if( poolItem.holder.index === poolItem.index ) {
					_appendImage(poolItem.index, poolItem.item, poolItem.baseDiv, poolItem.img, false, poolItem.clearPlaceholder);
				}
			}
			_imagesToAppendPool = [];
		}
	};
	


_registerModule('Controller', {

	publicMethods: {

		lazyLoadItem: function(index) {
			index = _getLoopedId(index);
			var item = _getItemAt(index);

			if(!item || ((item.loaded || item.loading) && !_itemsNeedUpdate)) {
				return;
			}

			_shout('gettingData', index, item);

			if (!item.src) {
				return;
			}

			_preloadImage(item);
		},
		initController: function() {
			framework.extend(_options, _controllerDefaultOptions, true);
			self.items = _items = items;
			_getItemAt = self.getItemAt;
			_getNumItems = _options.getNumItemsFn; //self.getNumItems;



			_initialIsLoop = _options.loop;
			if(_getNumItems() < 3) {
				_options.loop = false; // disable loop if less then 3 items
			}

			_listen('beforeChange', function(diff) {

				var p = _options.preload,
					isNext = diff === null ? true : (diff >= 0),
					preloadBefore = Math.min(p[0], _getNumItems() ),
					preloadAfter = Math.min(p[1], _getNumItems() ),
					i;


				for(i = 1; i <= (isNext ? preloadAfter : preloadBefore); i++) {
					self.lazyLoadItem(_currentItemIndex+i);
				}
				for(i = 1; i <= (isNext ? preloadBefore : preloadAfter); i++) {
					self.lazyLoadItem(_currentItemIndex-i);
				}
			});

			_listen('initialLayout', function() {
				self.currItem.initialLayout = _options.getThumbBoundsFn && _options.getThumbBoundsFn(_currentItemIndex);
			});

			_listen('mainScrollAnimComplete', _appendImagesPool);
			_listen('initialZoomInEnd', _appendImagesPool);



			_listen('destroy', function() {
				var item;
				for(var i = 0; i < _items.length; i++) {
					item = _items[i];
					// remove reference to DOM elements, for GC
					if(item.container) {
						item.container = null; 
					}
					if(item.placeholder) {
						item.placeholder = null;
					}
					if(item.img) {
						item.img = null;
					}
					if(item.preloader) {
						item.preloader = null;
					}
					if(item.loadError) {
						item.loaded = item.loadError = false;
					}
				}
				_imagesToAppendPool = null;
			});
		},


		getItemAt: function(index) {
			if (index >= 0) {
				return _items[index] !== undefined ? _items[index] : false;
			}
			return false;
		},

		allowProgressiveImg: function() {
			// 1. Progressive image loading isn't working on webkit/blink 
			//    when hw-acceleration (e.g. translateZ) is applied to IMG element.
			//    That's why in PhotoSwipe parent element gets zoom transform, not image itself.
			//    
			// 2. Progressive image loading sometimes blinks in webkit/blink when applying animation to parent element.
			//    That's why it's disabled on touch devices (mainly because of swipe transition)
			//    
			// 3. Progressive image loading sometimes doesn't work in IE (up to 11).

			// Don't allow progressive loading on non-large touch devices
			return _options.forceProgressiveLoading || !_likelyTouchDevice || _options.mouseUsed || screen.width > 1200; 
			// 1200 - to eliminate touch devices with large screen (like Chromebook Pixel)
		},

		setContent: function(holder, index) {

			if(_options.loop) {
				index = _getLoopedId(index);
			}

			var prevItem = self.getItemAt(holder.index);
			if(prevItem) {
				prevItem.container = null;
			}
	
			var item = self.getItemAt(index),
				img;
			
			if(!item) {
				holder.el.innerHTML = '';
				return;
			}

			// allow to override data
			_shout('gettingData', index, item);

			holder.index = index;
			holder.item = item;

			// base container DIV is created only once for each of 3 holders
			var baseDiv = item.container = framework.createEl('pswp__zoom-wrap'); 

			

			if(!item.src && item.html) {
				if(item.html.tagName) {
					baseDiv.appendChild(item.html);
				} else {
					baseDiv.innerHTML = item.html;
				}
			}

			_checkForError(item);

			_calculateItemSize(item, _viewportSize);
			
			if(item.src && !item.loadError && !item.loaded) {

				item.loadComplete = function(item) {

					// gallery closed before image finished loading
					if(!_isOpen) {
						return;
					}

					// check if holder hasn't changed while image was loading
					if(holder && holder.index === index ) {
						if( _checkForError(item, true) ) {
							item.loadComplete = item.img = null;
							_calculateItemSize(item, _viewportSize);
							_applyZoomPanToItem(item);

							if(holder.index === _currentItemIndex) {
								// recalculate dimensions
								self.updateCurrZoomItem();
							}
							return;
						}
						if( !item.imageAppended ) {
							if(_features.transform && (_mainScrollAnimating || _initialZoomRunning) ) {
								_imagesToAppendPool.push({
									item:item,
									baseDiv:baseDiv,
									img:item.img,
									index:index,
									holder:holder,
									clearPlaceholder:true
								});
							} else {
								_appendImage(index, item, baseDiv, item.img, _mainScrollAnimating || _initialZoomRunning, true);
							}
						} else {
							// remove preloader & mini-img
							if(!_initialZoomRunning && item.placeholder) {
								item.placeholder.style.display = 'none';
								item.placeholder = null;
							}
						}
					}

					item.loadComplete = null;
					item.img = null; // no need to store image element after it's added

					_shout('imageLoadComplete', index, item);
				};

				if(framework.features.transform) {
					
					var placeholderClassName = 'pswp__img pswp__img--placeholder'; 
					placeholderClassName += (item.msrc ? '' : ' pswp__img--placeholder--blank');

					var placeholder = framework.createEl(placeholderClassName, item.msrc ? 'img' : '');
					if(item.msrc) {
						placeholder.src = item.msrc;
					}
					
					_setImageSize(item, placeholder);

					baseDiv.appendChild(placeholder);
					item.placeholder = placeholder;

				}
				

				

				if(!item.loading) {
					_preloadImage(item);
				}


				if( self.allowProgressiveImg() ) {
					// just append image
					if(!_initialContentSet && _features.transform) {
						_imagesToAppendPool.push({
							item:item, 
							baseDiv:baseDiv, 
							img:item.img, 
							index:index, 
							holder:holder
						});
					} else {
						_appendImage(index, item, baseDiv, item.img, true, true);
					}
				}
				
			} else if(item.src && !item.loadError) {
				// image object is created every time, due to bugs of image loading & delay when switching images
				img = framework.createEl('pswp__img', 'img');
				img.style.opacity = 1;
				img.src = item.src;
				_setImageSize(item, img);
				_appendImage(index, item, baseDiv, img, true);
			}
			

			if(!_initialContentSet && index === _currentItemIndex) {
				_currZoomElementStyle = baseDiv.style;
				_showOrHide(item, (img ||item.img) );
			} else {
				_applyZoomPanToItem(item);
			}

			holder.el.innerHTML = '';
			holder.el.appendChild(baseDiv);
		},

		cleanSlide: function( item ) {
			if(item.img ) {
				item.img.onload = item.img.onerror = null;
			}
			item.loaded = item.loading = item.img = item.imageAppended = false;
		}

	}
});

/*>>items-controller*/

/*>>tap*/
/**
 * tap.js:
 *
 * Displatches tap and double-tap events.
 * 
 */

var tapTimer,
	tapReleasePoint = {},
	_dispatchTapEvent = function(origEvent, releasePoint, pointerType) {		
		var e = document.createEvent( 'CustomEvent' ),
			eDetail = {
				origEvent:origEvent, 
				target:origEvent.target, 
				releasePoint: releasePoint, 
				pointerType:pointerType || 'touch'
			};

		e.initCustomEvent( 'pswpTap', true, true, eDetail );
		origEvent.target.dispatchEvent(e);
	};

_registerModule('Tap', {
	publicMethods: {
		initTap: function() {
			_listen('firstTouchStart', self.onTapStart);
			_listen('touchRelease', self.onTapRelease);
			_listen('destroy', function() {
				tapReleasePoint = {};
				tapTimer = null;
			});
		},
		onTapStart: function(touchList) {
			if(touchList.length > 1) {
				clearTimeout(tapTimer);
				tapTimer = null;
			}
		},
		onTapRelease: function(e, releasePoint) {
			if(!releasePoint) {
				return;
			}

			if(!_moved && !_isMultitouch && !_numAnimations) {
				var p0 = releasePoint;
				if(tapTimer) {
					clearTimeout(tapTimer);
					tapTimer = null;

					// Check if taped on the same place
					if ( _isNearbyPoints(p0, tapReleasePoint) ) {
						_shout('doubleTap', p0);
						return;
					}
				}

				if(releasePoint.type === 'mouse') {
					_dispatchTapEvent(e, releasePoint, 'mouse');
					return;
				}

				var clickedTagName = e.target.tagName.toUpperCase();
				// avoid double tap delay on buttons and elements that have class pswp__single-tap
				if(clickedTagName === 'BUTTON' || framework.hasClass(e.target, 'pswp__single-tap') ) {
					_dispatchTapEvent(e, releasePoint);
					return;
				}

				_equalizePoints(tapReleasePoint, p0);

				tapTimer = setTimeout(function() {
					_dispatchTapEvent(e, releasePoint);
					tapTimer = null;
				}, 300);
			}
		}
	}
});

/*>>tap*/

/*>>desktop-zoom*/
/**
 *
 * desktop-zoom.js:
 *
 * - Binds mousewheel event for paning zoomed image.
 * - Manages "dragging", "zoomed-in", "zoom-out" classes.
 *   (which are used for cursors and zoom icon)
 * - Adds toggleDesktopZoom function.
 * 
 */

var _wheelDelta;
	
_registerModule('DesktopZoom', {

	publicMethods: {

		initDesktopZoom: function() {

			if(_oldIE) {
				// no zoom for old IE (<=8)
				return;
			}

			if(_likelyTouchDevice) {
				// if detected hardware touch support, we wait until mouse is used,
				// and only then apply desktop-zoom features
				_listen('mouseUsed', function() {
					self.setupDesktopZoom();
				});
			} else {
				self.setupDesktopZoom(true);
			}

		},

		setupDesktopZoom: function(onInit) {

			_wheelDelta = {};

			var events = 'wheel mousewheel DOMMouseScroll';
			
			_listen('bindEvents', function() {
				framework.bind(template, events,  self.handleMouseWheel);
			});

			_listen('unbindEvents', function() {
				if(_wheelDelta) {
					framework.unbind(template, events, self.handleMouseWheel);
				}
			});

			self.mouseZoomedIn = false;

			var hasDraggingClass,
				updateZoomable = function() {
					if(self.mouseZoomedIn) {
						framework.removeClass(template, 'pswp--zoomed-in');
						self.mouseZoomedIn = false;
					}
					if(_currZoomLevel < 1) {
						framework.addClass(template, 'pswp--zoom-allowed');
					} else {
						framework.removeClass(template, 'pswp--zoom-allowed');
					}
					removeDraggingClass();
				},
				removeDraggingClass = function() {
					if(hasDraggingClass) {
						framework.removeClass(template, 'pswp--dragging');
						hasDraggingClass = false;
					}
				};

			_listen('resize' , updateZoomable);
			_listen('afterChange' , updateZoomable);
			_listen('pointerDown', function() {
				if(self.mouseZoomedIn) {
					hasDraggingClass = true;
					framework.addClass(template, 'pswp--dragging');
				}
			});
			_listen('pointerUp', removeDraggingClass);

			if(!onInit) {
				updateZoomable();
			}
			
		},

		handleMouseWheel: function(e) {

			if(_currZoomLevel <= self.currItem.fitRatio) {
				if( _options.modal ) {

					if (!_options.closeOnScroll || _numAnimations || _isDragging) {
						e.preventDefault();
					} else if(_transformKey && Math.abs(e.deltaY) > 2) {
						// close PhotoSwipe
						// if browser supports transforms & scroll changed enough
						_closedByScroll = true;
						self.close();
					}

				}
				return true;
			}

			// allow just one event to fire
			e.stopPropagation();

			// https://developer.mozilla.org/en-US/docs/Web/Events/wheel
			_wheelDelta.x = 0;

			if('deltaX' in e) {
				if(e.deltaMode === 1 /* DOM_DELTA_LINE */) {
					// 18 - average line height
					_wheelDelta.x = e.deltaX * 18;
					_wheelDelta.y = e.deltaY * 18;
				} else {
					_wheelDelta.x = e.deltaX;
					_wheelDelta.y = e.deltaY;
				}
			} else if('wheelDelta' in e) {
				if(e.wheelDeltaX) {
					_wheelDelta.x = -0.16 * e.wheelDeltaX;
				}
				if(e.wheelDeltaY) {
					_wheelDelta.y = -0.16 * e.wheelDeltaY;
				} else {
					_wheelDelta.y = -0.16 * e.wheelDelta;
				}
			} else if('detail' in e) {
				_wheelDelta.y = e.detail;
			} else {
				return;
			}

			_calculatePanBounds(_currZoomLevel, true);

			var newPanX = _panOffset.x - _wheelDelta.x,
				newPanY = _panOffset.y - _wheelDelta.y;

			// only prevent scrolling in nonmodal mode when not at edges
			if (_options.modal ||
				(
				newPanX <= _currPanBounds.min.x && newPanX >= _currPanBounds.max.x &&
				newPanY <= _currPanBounds.min.y && newPanY >= _currPanBounds.max.y
				) ) {
				e.preventDefault();
			}

			// TODO: use rAF instead of mousewheel?
			self.panTo(newPanX, newPanY);
		},

		toggleDesktopZoom: function(centerPoint) {
			centerPoint = centerPoint || {x:_viewportSize.x/2 + _offset.x, y:_viewportSize.y/2 + _offset.y };

			var doubleTapZoomLevel = _options.getDoubleTapZoom(true, self.currItem);
			var zoomOut = _currZoomLevel === doubleTapZoomLevel;
			
			self.mouseZoomedIn = !zoomOut;

			self.zoomTo(zoomOut ? self.currItem.initialZoomLevel : doubleTapZoomLevel, centerPoint, 333);
			framework[ (!zoomOut ? 'add' : 'remove') + 'Class'](template, 'pswp--zoomed-in');
		}

	}
});


/*>>desktop-zoom*/

/*>>history*/
/**
 *
 * history.js:
 *
 * - Back button to close gallery.
 * 
 * - Unique URL for each slide: example.com/&pid=1&gid=3
 *   (where PID is picture index, and GID and gallery index)
 *   
 * - Switch URL when slides change.
 * 
 */


var _historyDefaultOptions = {
	history: true,
	galleryUID: 1
};

var _historyUpdateTimeout,
	_hashChangeTimeout,
	_hashAnimCheckTimeout,
	_hashChangedByScript,
	_hashChangedByHistory,
	_hashReseted,
	_initialHash,
	_historyChanged,
	_closedFromURL,
	_urlChangedOnce,
	_windowLoc,

	_supportsPushState,

	_getHash = function() {
		return _windowLoc.hash.substring(1);
	},
	_cleanHistoryTimeouts = function() {

		if(_historyUpdateTimeout) {
			clearTimeout(_historyUpdateTimeout);
		}

		if(_hashAnimCheckTimeout) {
			clearTimeout(_hashAnimCheckTimeout);
		}
	},

	// pid - Picture index
	// gid - Gallery index
	_parseItemIndexFromURL = function() {
		var hash = _getHash(),
			params = {};

		if(hash.length < 5) { // pid=1
			return params;
		}

		var i, vars = hash.split('&');
		for (i = 0; i < vars.length; i++) {
			if(!vars[i]) {
				continue;
			}
			var pair = vars[i].split('=');	
			if(pair.length < 2) {
				continue;
			}
			params[pair[0]] = pair[1];
		}
		if(_options.galleryPIDs) {
			// detect custom pid in hash and search for it among the items collection
			var searchfor = params.pid;
			params.pid = 0; // if custom pid cannot be found, fallback to the first item
			for(i = 0; i < _items.length; i++) {
				if(_items[i].pid === searchfor) {
					params.pid = i;
					break;
				}
			}
		} else {
			params.pid = parseInt(params.pid,10)-1;
		}
		if( params.pid < 0 ) {
			params.pid = 0;
		}
		return params;
	},
	_updateHash = function() {

		if(_hashAnimCheckTimeout) {
			clearTimeout(_hashAnimCheckTimeout);
		}


		if(_numAnimations || _isDragging) {
			// changing browser URL forces layout/paint in some browsers, which causes noticable lag during animation
			// that's why we update hash only when no animations running
			_hashAnimCheckTimeout = setTimeout(_updateHash, 500);
			return;
		}
		
		if(_hashChangedByScript) {
			clearTimeout(_hashChangeTimeout);
		} else {
			_hashChangedByScript = true;
		}


		var pid = (_currentItemIndex + 1);
		var item = _getItemAt( _currentItemIndex );
		if(item.hasOwnProperty('pid')) {
			// carry forward any custom pid assigned to the item
			pid = item.pid;
		}
		var newHash = _initialHash + '&'  +  'gid=' + _options.galleryUID + '&' + 'pid=' + pid;

		if(!_historyChanged) {
			if(_windowLoc.hash.indexOf(newHash) === -1) {
				_urlChangedOnce = true;
			}
			// first time - add new hisory record, then just replace
		}

		var newURL = _windowLoc.href.split('#')[0] + '#' +  newHash;

		if( _supportsPushState ) {

			if('#' + newHash !== window.location.hash) {
				history[_historyChanged ? 'replaceState' : 'pushState']('', document.title, newURL);
			}

		} else {
			if(_historyChanged) {
				_windowLoc.replace( newURL );
			} else {
				_windowLoc.hash = newHash;
			}
		}
		
		

		_historyChanged = true;
		_hashChangeTimeout = setTimeout(function() {
			_hashChangedByScript = false;
		}, 60);
	};



	

_registerModule('History', {

	

	publicMethods: {
		initHistory: function() {

			framework.extend(_options, _historyDefaultOptions, true);

			if( !_options.history ) {
				return;
			}


			_windowLoc = window.location;
			_urlChangedOnce = false;
			_closedFromURL = false;
			_historyChanged = false;
			_initialHash = _getHash();
			_supportsPushState = ('pushState' in history);


			if(_initialHash.indexOf('gid=') > -1) {
				_initialHash = _initialHash.split('&gid=')[0];
				_initialHash = _initialHash.split('?gid=')[0];
			}
			

			_listen('afterChange', self.updateURL);
			_listen('unbindEvents', function() {
				framework.unbind(window, 'hashchange', self.onHashChange);
			});


			var returnToOriginal = function() {
				_hashReseted = true;
				if(!_closedFromURL) {

					if(_urlChangedOnce) {
						history.back();
					} else {

						if(_initialHash) {
							_windowLoc.hash = _initialHash;
						} else {
							if (_supportsPushState) {

								// remove hash from url without refreshing it or scrolling to top
								history.pushState('', document.title,  _windowLoc.pathname + _windowLoc.search );
							} else {
								_windowLoc.hash = '';
							}
						}
					}
					
				}

				_cleanHistoryTimeouts();
			};


			_listen('unbindEvents', function() {
				if(_closedByScroll) {
					// if PhotoSwipe is closed by scroll, we go "back" before the closing animation starts
					// this is done to keep the scroll position
					returnToOriginal();
				}
			});
			_listen('destroy', function() {
				if(!_hashReseted) {
					returnToOriginal();
				}
			});
			_listen('firstUpdate', function() {
				_currentItemIndex = _parseItemIndexFromURL().pid;
			});

			

			
			var index = _initialHash.indexOf('pid=');
			if(index > -1) {
				_initialHash = _initialHash.substring(0, index);
				if(_initialHash.slice(-1) === '&') {
					_initialHash = _initialHash.slice(0, -1);
				}
			}
			

			setTimeout(function() {
				if(_isOpen) { // hasn't destroyed yet
					framework.bind(window, 'hashchange', self.onHashChange);
				}
			}, 40);
			
		},
		onHashChange: function() {

			if(_getHash() === _initialHash) {

				_closedFromURL = true;
				self.close();
				return;
			}
			if(!_hashChangedByScript) {

				_hashChangedByHistory = true;
				self.goTo( _parseItemIndexFromURL().pid );
				_hashChangedByHistory = false;
			}
			
		},
		updateURL: function() {

			// Delay the update of URL, to avoid lag during transition, 
			// and to not to trigger actions like "refresh page sound" or "blinking favicon" to often
			
			_cleanHistoryTimeouts();
			

			if(_hashChangedByHistory) {
				return;
			}

			if(!_historyChanged) {
				_updateHash(); // first time
			} else {
				_historyUpdateTimeout = setTimeout(_updateHash, 800);
			}
		}
	
	}
});


/*>>history*/
	framework.extend(self, publicMethods); };
	return PhotoSwipe;
});

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*! PhotoSwipe Default UI - 4.1.2 - 2017-04-05
* http://photoswipe.com
* Copyright (c) 2017 Dmitry Semenov; */
/**
*
* UI on top of main sliding area (caption, arrows, close button, etc.).
* Built just using public methods/properties of PhotoSwipe.
* 
*/
(function (root, factory) { 
	if (true) {
		!(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.PhotoSwipeUI_Default = factory();
	}
})(this, function () {

	'use strict';



var PhotoSwipeUI_Default =
 function(pswp, framework) {

	var ui = this;
	var _overlayUIUpdated = false,
		_controlsVisible = true,
		_fullscrenAPI,
		_controls,
		_captionContainer,
		_fakeCaptionContainer,
		_indexIndicator,
		_shareButton,
		_shareModal,
		_shareModalHidden = true,
		_initalCloseOnScrollValue,
		_isIdle,
		_listen,

		_loadingIndicator,
		_loadingIndicatorHidden,
		_loadingIndicatorTimeout,

		_galleryHasOneSlide,

		_options,
		_defaultUIOptions = {
			barsSize: {top:44, bottom:'auto'},
			closeElClasses: ['item', 'caption', 'zoom-wrap', 'ui', 'top-bar'], 
			timeToIdle: 4000, 
			timeToIdleOutside: 1000,
			loadingIndicatorDelay: 1000, // 2s
			
			addCaptionHTMLFn: function(item, captionEl /*, isFake */) {
				if(!item.title) {
					captionEl.children[0].innerHTML = '';
					return false;
				}
				captionEl.children[0].innerHTML = item.title;
				return true;
			},

			closeEl:true,
			captionEl: true,
			fullscreenEl: true,
			zoomEl: true,
			shareEl: true,
			counterEl: true,
			arrowEl: true,
			preloaderEl: true,

			tapToClose: false,
			tapToToggleControls: true,

			clickToCloseNonZoomable: true,

			shareButtons: [
				{id:'facebook', label:'Share on Facebook', url:'https://www.facebook.com/sharer/sharer.php?u={{url}}'},
				{id:'twitter', label:'Tweet', url:'https://twitter.com/intent/tweet?text={{text}}&url={{url}}'},
				{id:'pinterest', label:'Pin it', url:'http://www.pinterest.com/pin/create/button/'+
													'?url={{url}}&media={{image_url}}&description={{text}}'},
				{id:'download', label:'Download image', url:'{{raw_image_url}}', download:true}
			],
			getImageURLForShare: function( /* shareButtonData */ ) {
				return pswp.currItem.src || '';
			},
			getPageURLForShare: function( /* shareButtonData */ ) {
				return window.location.href;
			},
			getTextForShare: function( /* shareButtonData */ ) {
				return pswp.currItem.title || '';
			},
				
			indexIndicatorSep: ' / ',
			fitControlsWidth: 1200

		},
		_blockControlsTap,
		_blockControlsTapTimeout;



	var _onControlsTap = function(e) {
			if(_blockControlsTap) {
				return true;
			}


			e = e || window.event;

			if(_options.timeToIdle && _options.mouseUsed && !_isIdle) {
				// reset idle timer
				_onIdleMouseMove();
			}


			var target = e.target || e.srcElement,
				uiElement,
				clickedClass = target.getAttribute('class') || '',
				found;

			for(var i = 0; i < _uiElements.length; i++) {
				uiElement = _uiElements[i];
				if(uiElement.onTap && clickedClass.indexOf('pswp__' + uiElement.name ) > -1 ) {
					uiElement.onTap();
					found = true;

				}
			}

			if(found) {
				if(e.stopPropagation) {
					e.stopPropagation();
				}
				_blockControlsTap = true;

				// Some versions of Android don't prevent ghost click event 
				// when preventDefault() was called on touchstart and/or touchend.
				// 
				// This happens on v4.3, 4.2, 4.1, 
				// older versions strangely work correctly, 
				// but just in case we add delay on all of them)	
				var tapDelay = framework.features.isOldAndroid ? 600 : 30;
				_blockControlsTapTimeout = setTimeout(function() {
					_blockControlsTap = false;
				}, tapDelay);
			}

		},
		_fitControlsInViewport = function() {
			return !pswp.likelyTouchDevice || _options.mouseUsed || screen.width > _options.fitControlsWidth;
		},
		_togglePswpClass = function(el, cName, add) {
			framework[ (add ? 'add' : 'remove') + 'Class' ](el, 'pswp__' + cName);
		},

		// add class when there is just one item in the gallery
		// (by default it hides left/right arrows and 1ofX counter)
		_countNumItems = function() {
			var hasOneSlide = (_options.getNumItemsFn() === 1);

			if(hasOneSlide !== _galleryHasOneSlide) {
				_togglePswpClass(_controls, 'ui--one-slide', hasOneSlide);
				_galleryHasOneSlide = hasOneSlide;
			}
		},
		_toggleShareModalClass = function() {
			_togglePswpClass(_shareModal, 'share-modal--hidden', _shareModalHidden);
		},
		_toggleShareModal = function() {

			_shareModalHidden = !_shareModalHidden;
			
			
			if(!_shareModalHidden) {
				_toggleShareModalClass();
				setTimeout(function() {
					if(!_shareModalHidden) {
						framework.addClass(_shareModal, 'pswp__share-modal--fade-in');
					}
				}, 30);
			} else {
				framework.removeClass(_shareModal, 'pswp__share-modal--fade-in');
				setTimeout(function() {
					if(_shareModalHidden) {
						_toggleShareModalClass();
					}
				}, 300);
			}
			
			if(!_shareModalHidden) {
				_updateShareURLs();
			}
			return false;
		},

		_openWindowPopup = function(e) {
			e = e || window.event;
			var target = e.target || e.srcElement;

			pswp.shout('shareLinkClick', e, target);

			if(!target.href) {
				return false;
			}

			if( target.hasAttribute('download') ) {
				return true;
			}

			window.open(target.href, 'pswp_share', 'scrollbars=yes,resizable=yes,toolbar=no,'+
										'location=yes,width=550,height=420,top=100,left=' + 
										(window.screen ? Math.round(screen.width / 2 - 275) : 100)  );

			if(!_shareModalHidden) {
				_toggleShareModal();
			}
			
			return false;
		},
		_updateShareURLs = function() {
			var shareButtonOut = '',
				shareButtonData,
				shareURL,
				image_url,
				page_url,
				share_text;

			for(var i = 0; i < _options.shareButtons.length; i++) {
				shareButtonData = _options.shareButtons[i];

				image_url = _options.getImageURLForShare(shareButtonData);
				page_url = _options.getPageURLForShare(shareButtonData);
				share_text = _options.getTextForShare(shareButtonData);

				shareURL = shareButtonData.url.replace('{{url}}', encodeURIComponent(page_url) )
									.replace('{{image_url}}', encodeURIComponent(image_url) )
									.replace('{{raw_image_url}}', image_url )
									.replace('{{text}}', encodeURIComponent(share_text) );

				shareButtonOut += '<a href="' + shareURL + '" target="_blank" '+
									'class="pswp__share--' + shareButtonData.id + '"' +
									(shareButtonData.download ? 'download' : '') + '>' + 
									shareButtonData.label + '</a>';

				if(_options.parseShareButtonOut) {
					shareButtonOut = _options.parseShareButtonOut(shareButtonData, shareButtonOut);
				}
			}
			_shareModal.children[0].innerHTML = shareButtonOut;
			_shareModal.children[0].onclick = _openWindowPopup;

		},
		_hasCloseClass = function(target) {
			for(var  i = 0; i < _options.closeElClasses.length; i++) {
				if( framework.hasClass(target, 'pswp__' + _options.closeElClasses[i]) ) {
					return true;
				}
			}
		},
		_idleInterval,
		_idleTimer,
		_idleIncrement = 0,
		_onIdleMouseMove = function() {
			clearTimeout(_idleTimer);
			_idleIncrement = 0;
			if(_isIdle) {
				ui.setIdle(false);
			}
		},
		_onMouseLeaveWindow = function(e) {
			e = e ? e : window.event;
			var from = e.relatedTarget || e.toElement;
			if (!from || from.nodeName === 'HTML') {
				clearTimeout(_idleTimer);
				_idleTimer = setTimeout(function() {
					ui.setIdle(true);
				}, _options.timeToIdleOutside);
			}
		},
		_setupFullscreenAPI = function() {
			if(_options.fullscreenEl && !framework.features.isOldAndroid) {
				if(!_fullscrenAPI) {
					_fullscrenAPI = ui.getFullscreenAPI();
				}
				if(_fullscrenAPI) {
					framework.bind(document, _fullscrenAPI.eventK, ui.updateFullscreen);
					ui.updateFullscreen();
					framework.addClass(pswp.template, 'pswp--supports-fs');
				} else {
					framework.removeClass(pswp.template, 'pswp--supports-fs');
				}
			}
		},
		_setupLoadingIndicator = function() {
			// Setup loading indicator
			if(_options.preloaderEl) {
			
				_toggleLoadingIndicator(true);

				_listen('beforeChange', function() {

					clearTimeout(_loadingIndicatorTimeout);

					// display loading indicator with delay
					_loadingIndicatorTimeout = setTimeout(function() {

						if(pswp.currItem && pswp.currItem.loading) {

							if( !pswp.allowProgressiveImg() || (pswp.currItem.img && !pswp.currItem.img.naturalWidth)  ) {
								// show preloader if progressive loading is not enabled, 
								// or image width is not defined yet (because of slow connection)
								_toggleLoadingIndicator(false); 
								// items-controller.js function allowProgressiveImg
							}
							
						} else {
							_toggleLoadingIndicator(true); // hide preloader
						}

					}, _options.loadingIndicatorDelay);
					
				});
				_listen('imageLoadComplete', function(index, item) {
					if(pswp.currItem === item) {
						_toggleLoadingIndicator(true);
					}
				});

			}
		},
		_toggleLoadingIndicator = function(hide) {
			if( _loadingIndicatorHidden !== hide ) {
				_togglePswpClass(_loadingIndicator, 'preloader--active', !hide);
				_loadingIndicatorHidden = hide;
			}
		},
		_applyNavBarGaps = function(item) {
			var gap = item.vGap;

			if( _fitControlsInViewport() ) {
				
				var bars = _options.barsSize; 
				if(_options.captionEl && bars.bottom === 'auto') {
					if(!_fakeCaptionContainer) {
						_fakeCaptionContainer = framework.createEl('pswp__caption pswp__caption--fake');
						_fakeCaptionContainer.appendChild( framework.createEl('pswp__caption__center') );
						_controls.insertBefore(_fakeCaptionContainer, _captionContainer);
						framework.addClass(_controls, 'pswp__ui--fit');
					}
					if( _options.addCaptionHTMLFn(item, _fakeCaptionContainer, true) ) {

						var captionSize = _fakeCaptionContainer.clientHeight;
						gap.bottom = parseInt(captionSize,10) || 44;
					} else {
						gap.bottom = bars.top; // if no caption, set size of bottom gap to size of top
					}
				} else {
					gap.bottom = bars.bottom === 'auto' ? 0 : bars.bottom;
				}
				
				// height of top bar is static, no need to calculate it
				gap.top = bars.top;
			} else {
				gap.top = gap.bottom = 0;
			}
		},
		_setupIdle = function() {
			// Hide controls when mouse is used
			if(_options.timeToIdle) {
				_listen('mouseUsed', function() {
					
					framework.bind(document, 'mousemove', _onIdleMouseMove);
					framework.bind(document, 'mouseout', _onMouseLeaveWindow);

					_idleInterval = setInterval(function() {
						_idleIncrement++;
						if(_idleIncrement === 2) {
							ui.setIdle(true);
						}
					}, _options.timeToIdle / 2);
				});
			}
		},
		_setupHidingControlsDuringGestures = function() {

			// Hide controls on vertical drag
			_listen('onVerticalDrag', function(now) {
				if(_controlsVisible && now < 0.95) {
					ui.hideControls();
				} else if(!_controlsVisible && now >= 0.95) {
					ui.showControls();
				}
			});

			// Hide controls when pinching to close
			var pinchControlsHidden;
			_listen('onPinchClose' , function(now) {
				if(_controlsVisible && now < 0.9) {
					ui.hideControls();
					pinchControlsHidden = true;
				} else if(pinchControlsHidden && !_controlsVisible && now > 0.9) {
					ui.showControls();
				}
			});

			_listen('zoomGestureEnded', function() {
				pinchControlsHidden = false;
				if(pinchControlsHidden && !_controlsVisible) {
					ui.showControls();
				}
			});

		};



	var _uiElements = [
		{ 
			name: 'caption', 
			option: 'captionEl',
			onInit: function(el) {  
				_captionContainer = el; 
			} 
		},
		{ 
			name: 'share-modal', 
			option: 'shareEl',
			onInit: function(el) {  
				_shareModal = el;
			},
			onTap: function() {
				_toggleShareModal();
			} 
		},
		{ 
			name: 'button--share', 
			option: 'shareEl',
			onInit: function(el) { 
				_shareButton = el;
			},
			onTap: function() {
				_toggleShareModal();
			} 
		},
		{ 
			name: 'button--zoom', 
			option: 'zoomEl',
			onTap: pswp.toggleDesktopZoom
		},
		{ 
			name: 'counter', 
			option: 'counterEl',
			onInit: function(el) {  
				_indexIndicator = el;
			} 
		},
		{ 
			name: 'button--close', 
			option: 'closeEl',
			onTap: pswp.close
		},
		{ 
			name: 'button--arrow--left', 
			option: 'arrowEl',
			onTap: pswp.prev
		},
		{ 
			name: 'button--arrow--right', 
			option: 'arrowEl',
			onTap: pswp.next
		},
		{ 
			name: 'button--fs', 
			option: 'fullscreenEl',
			onTap: function() {  
				if(_fullscrenAPI.isFullscreen()) {
					_fullscrenAPI.exit();
				} else {
					_fullscrenAPI.enter();
				}
			} 
		},
		{ 
			name: 'preloader', 
			option: 'preloaderEl',
			onInit: function(el) {  
				_loadingIndicator = el;
			} 
		}

	];

	var _setupUIElements = function() {
		var item,
			classAttr,
			uiElement;

		var loopThroughChildElements = function(sChildren) {
			if(!sChildren) {
				return;
			}

			var l = sChildren.length;
			for(var i = 0; i < l; i++) {
				item = sChildren[i];
				classAttr = item.className;

				for(var a = 0; a < _uiElements.length; a++) {
					uiElement = _uiElements[a];

					if(classAttr.indexOf('pswp__' + uiElement.name) > -1  ) {

						if( _options[uiElement.option] ) { // if element is not disabled from options
							
							framework.removeClass(item, 'pswp__element--disabled');
							if(uiElement.onInit) {
								uiElement.onInit(item);
							}
							
							//item.style.display = 'block';
						} else {
							framework.addClass(item, 'pswp__element--disabled');
							//item.style.display = 'none';
						}
					}
				}
			}
		};
		loopThroughChildElements(_controls.children);

		var topBar =  framework.getChildByClass(_controls, 'pswp__top-bar');
		if(topBar) {
			loopThroughChildElements( topBar.children );
		}
	};


	

	ui.init = function() {

		// extend options
		framework.extend(pswp.options, _defaultUIOptions, true);

		// create local link for fast access
		_options = pswp.options;

		// find pswp__ui element
		_controls = framework.getChildByClass(pswp.scrollWrap, 'pswp__ui');

		// create local link
		_listen = pswp.listen;


		_setupHidingControlsDuringGestures();

		// update controls when slides change
		_listen('beforeChange', ui.update);

		// toggle zoom on double-tap
		_listen('doubleTap', function(point) {
			var initialZoomLevel = pswp.currItem.initialZoomLevel;
			if(pswp.getZoomLevel() !== initialZoomLevel) {
				pswp.zoomTo(initialZoomLevel, point, 333);
			} else {
				pswp.zoomTo(_options.getDoubleTapZoom(false, pswp.currItem), point, 333);
			}
		});

		// Allow text selection in caption
		_listen('preventDragEvent', function(e, isDown, preventObj) {
			var t = e.target || e.srcElement;
			if(
				t && 
				t.getAttribute('class') && e.type.indexOf('mouse') > -1 && 
				( t.getAttribute('class').indexOf('__caption') > 0 || (/(SMALL|STRONG|EM)/i).test(t.tagName) ) 
			) {
				preventObj.prevent = false;
			}
		});

		// bind events for UI
		_listen('bindEvents', function() {
			framework.bind(_controls, 'pswpTap click', _onControlsTap);
			framework.bind(pswp.scrollWrap, 'pswpTap', ui.onGlobalTap);

			if(!pswp.likelyTouchDevice) {
				framework.bind(pswp.scrollWrap, 'mouseover', ui.onMouseOver);
			}
		});

		// unbind events for UI
		_listen('unbindEvents', function() {
			if(!_shareModalHidden) {
				_toggleShareModal();
			}

			if(_idleInterval) {
				clearInterval(_idleInterval);
			}
			framework.unbind(document, 'mouseout', _onMouseLeaveWindow);
			framework.unbind(document, 'mousemove', _onIdleMouseMove);
			framework.unbind(_controls, 'pswpTap click', _onControlsTap);
			framework.unbind(pswp.scrollWrap, 'pswpTap', ui.onGlobalTap);
			framework.unbind(pswp.scrollWrap, 'mouseover', ui.onMouseOver);

			if(_fullscrenAPI) {
				framework.unbind(document, _fullscrenAPI.eventK, ui.updateFullscreen);
				if(_fullscrenAPI.isFullscreen()) {
					_options.hideAnimationDuration = 0;
					_fullscrenAPI.exit();
				}
				_fullscrenAPI = null;
			}
		});


		// clean up things when gallery is destroyed
		_listen('destroy', function() {
			if(_options.captionEl) {
				if(_fakeCaptionContainer) {
					_controls.removeChild(_fakeCaptionContainer);
				}
				framework.removeClass(_captionContainer, 'pswp__caption--empty');
			}

			if(_shareModal) {
				_shareModal.children[0].onclick = null;
			}
			framework.removeClass(_controls, 'pswp__ui--over-close');
			framework.addClass( _controls, 'pswp__ui--hidden');
			ui.setIdle(false);
		});
		

		if(!_options.showAnimationDuration) {
			framework.removeClass( _controls, 'pswp__ui--hidden');
		}
		_listen('initialZoomIn', function() {
			if(_options.showAnimationDuration) {
				framework.removeClass( _controls, 'pswp__ui--hidden');
			}
		});
		_listen('initialZoomOut', function() {
			framework.addClass( _controls, 'pswp__ui--hidden');
		});

		_listen('parseVerticalMargin', _applyNavBarGaps);
		
		_setupUIElements();

		if(_options.shareEl && _shareButton && _shareModal) {
			_shareModalHidden = true;
		}

		_countNumItems();

		_setupIdle();

		_setupFullscreenAPI();

		_setupLoadingIndicator();
	};

	ui.setIdle = function(isIdle) {
		_isIdle = isIdle;
		_togglePswpClass(_controls, 'ui--idle', isIdle);
	};

	ui.update = function() {
		// Don't update UI if it's hidden
		if(_controlsVisible && pswp.currItem) {
			
			ui.updateIndexIndicator();

			if(_options.captionEl) {
				_options.addCaptionHTMLFn(pswp.currItem, _captionContainer);

				_togglePswpClass(_captionContainer, 'caption--empty', !pswp.currItem.title);
			}

			_overlayUIUpdated = true;

		} else {
			_overlayUIUpdated = false;
		}

		if(!_shareModalHidden) {
			_toggleShareModal();
		}

		_countNumItems();
	};

	ui.updateFullscreen = function(e) {

		if(e) {
			// some browsers change window scroll position during the fullscreen
			// so PhotoSwipe updates it just in case
			setTimeout(function() {
				pswp.setScrollOffset( 0, framework.getScrollY() );
			}, 50);
		}
		
		// toogle pswp--fs class on root element
		framework[ (_fullscrenAPI.isFullscreen() ? 'add' : 'remove') + 'Class' ](pswp.template, 'pswp--fs');
	};

	ui.updateIndexIndicator = function() {
		if(_options.counterEl) {
			_indexIndicator.innerHTML = (pswp.getCurrentIndex()+1) + 
										_options.indexIndicatorSep + 
										_options.getNumItemsFn();
		}
	};
	
	ui.onGlobalTap = function(e) {
		e = e || window.event;
		var target = e.target || e.srcElement;

		if(_blockControlsTap) {
			return;
		}

		if(e.detail && e.detail.pointerType === 'mouse') {

			// close gallery if clicked outside of the image
			if(_hasCloseClass(target)) {
				pswp.close();
				return;
			}

			if(framework.hasClass(target, 'pswp__img')) {
				if(pswp.getZoomLevel() === 1 && pswp.getZoomLevel() <= pswp.currItem.fitRatio) {
					if(_options.clickToCloseNonZoomable) {
						pswp.close();
					}
				} else {
					pswp.toggleDesktopZoom(e.detail.releasePoint);
				}
			}
			
		} else {

			// tap anywhere (except buttons) to toggle visibility of controls
			if(_options.tapToToggleControls) {
				if(_controlsVisible) {
					ui.hideControls();
				} else {
					ui.showControls();
				}
			}

			// tap to close gallery
			if(_options.tapToClose && (framework.hasClass(target, 'pswp__img') || _hasCloseClass(target)) ) {
				pswp.close();
				return;
			}
			
		}
	};
	ui.onMouseOver = function(e) {
		e = e || window.event;
		var target = e.target || e.srcElement;

		// add class when mouse is over an element that should close the gallery
		_togglePswpClass(_controls, 'ui--over-close', _hasCloseClass(target));
	};

	ui.hideControls = function() {
		framework.addClass(_controls,'pswp__ui--hidden');
		_controlsVisible = false;
	};

	ui.showControls = function() {
		_controlsVisible = true;
		if(!_overlayUIUpdated) {
			ui.update();
		}
		framework.removeClass(_controls,'pswp__ui--hidden');
	};

	ui.supportsFullscreen = function() {
		var d = document;
		return !!(d.exitFullscreen || d.mozCancelFullScreen || d.webkitExitFullscreen || d.msExitFullscreen);
	};

	ui.getFullscreenAPI = function() {
		var dE = document.documentElement,
			api,
			tF = 'fullscreenchange';

		if (dE.requestFullscreen) {
			api = {
				enterK: 'requestFullscreen',
				exitK: 'exitFullscreen',
				elementK: 'fullscreenElement',
				eventK: tF
			};

		} else if(dE.mozRequestFullScreen ) {
			api = {
				enterK: 'mozRequestFullScreen',
				exitK: 'mozCancelFullScreen',
				elementK: 'mozFullScreenElement',
				eventK: 'moz' + tF
			};

			

		} else if(dE.webkitRequestFullscreen) {
			api = {
				enterK: 'webkitRequestFullscreen',
				exitK: 'webkitExitFullscreen',
				elementK: 'webkitFullscreenElement',
				eventK: 'webkit' + tF
			};

		} else if(dE.msRequestFullscreen) {
			api = {
				enterK: 'msRequestFullscreen',
				exitK: 'msExitFullscreen',
				elementK: 'msFullscreenElement',
				eventK: 'MSFullscreenChange'
			};
		}

		if(api) {
			api.enter = function() { 
				// disable close-on-scroll in fullscreen
				_initalCloseOnScrollValue = _options.closeOnScroll; 
				_options.closeOnScroll = false; 

				if(this.enterK === 'webkitRequestFullscreen') {
					pswp.template[this.enterK]( Element.ALLOW_KEYBOARD_INPUT );
				} else {
					return pswp.template[this.enterK](); 
				}
			};
			api.exit = function() { 
				_options.closeOnScroll = _initalCloseOnScrollValue;

				return document[this.exitK](); 

			};
			api.isFullscreen = function() { return document[this.elementK]; };
		}

		return api;
	};



};
return PhotoSwipeUI_Default;


});


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utility__ = __webpack_require__(0);

class Header {
    /**
     * CONSTRUCTOR
     * @param gallery
     */
    constructor(gallery) {
        /**
         * Complete collection of filtered elements
         * Contains null or array
         * Null means no selection is active
         * Array means a selection is active, even if array is empty. Render empty
         * @type {Array}
         */
        this._collection = null;
        this._filters = [];
        this.gallery = gallery;
    }
    addFilter(filter) {
        this.filters.push(filter);
    }
    refresh() {
        this.filters.forEach(function (filter) {
            filter.render();
        });
    }
    render() {
        let imagesLayout = document.createElement('div');
        __WEBPACK_IMPORTED_MODULE_0__Utility__["a" /* Utility */].addClass(imagesLayout, 'natural-gallery-images sectionContainer');
        imagesLayout.appendChild(__WEBPACK_IMPORTED_MODULE_0__Utility__["a" /* Utility */].getIcon('icon-pict'));
        let sectionName = document.createElement('div');
        __WEBPACK_IMPORTED_MODULE_0__Utility__["a" /* Utility */].addClass(sectionName, 'sectionName');
        sectionName.textContent = 'Images';
        imagesLayout.appendChild(sectionName);
        let galleryVisible = document.createElement('span');
        imagesLayout.appendChild(galleryVisible);
        __WEBPACK_IMPORTED_MODULE_0__Utility__["a" /* Utility */].addClass(galleryVisible, 'natural-gallery-visible');
        let slash = document.createElement('span');
        slash.textContent = '/';
        imagesLayout.appendChild(slash);
        let total = document.createElement('span');
        __WEBPACK_IMPORTED_MODULE_0__Utility__["a" /* Utility */].addClass(total, 'natural-gallery-total');
        imagesLayout.appendChild(total);
        this.element = document.createElement('div');
        this.filters.forEach(function (filter) {
            this.element.appendChild(filter.render());
        }, this);
        __WEBPACK_IMPORTED_MODULE_0__Utility__["a" /* Utility */].addClass(this.element, 'natural-gallery-header');
        this.element.appendChild(imagesLayout);
        return this.element;
    }
    isFiltered() {
        return this.collection !== null;
    }
    /**
     * Filter first by term, then by categories
     * @param gallery
     */
    filter() {
        let filteredCollections = null;
        this.filters.forEach(function (filter) {
            if (filter.isActive()) {
                if (filteredCollections === null) {
                    filteredCollections = filter.collection;
                }
                else {
                    filteredCollections = __WEBPACK_IMPORTED_MODULE_0__Utility__["a" /* Utility */].intersectionBy(filteredCollections, filter.collection, 'id');
                }
            }
        });
        this.collection = filteredCollections; // @todo : do some intelligent things here
        this.gallery.refresh();
    }
    get collection() {
        return this._collection;
    }
    set collection(value) {
        this._collection = value;
    }
    get element() {
        return this._element;
    }
    set element(value) {
        this._element = value;
    }
    get gallery() {
        return this._gallery;
    }
    set gallery(value) {
        this._gallery = value;
    }
    get filters() {
        return this._filters;
    }
    set filters(value) {
        this._filters = value;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Header;



/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utility__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__AbstractFilter__ = __webpack_require__(1);


class SearchFilter extends __WEBPACK_IMPORTED_MODULE_1__AbstractFilter__["a" /* AbstractFilter */] {
    render() {
        let element = document.createElement('div');
        __WEBPACK_IMPORTED_MODULE_0__Utility__["a" /* Utility */].addClass(element, 'natural-gallery-searchTerm sectionContainer');
        element.appendChild(__WEBPACK_IMPORTED_MODULE_0__Utility__["a" /* Utility */].getIcon('icon-search'));
        element.appendChild(this.getInput());
        let label = document.createElement('label');
        __WEBPACK_IMPORTED_MODULE_0__Utility__["a" /* Utility */].addClass(label, 'sectionName');
        label.textContent = 'Search';
        element.appendChild(label);
        let bar = document.createElement('span');
        __WEBPACK_IMPORTED_MODULE_0__Utility__["a" /* Utility */].addClass(bar, 'bar');
        element.appendChild(bar);
        return element;
    }
    getInput() {
        const self = this;
        let input = document.createElement('input');
        input.setAttribute('required', '');
        input.addEventListener('keyup', function (event) {
            let el = this;
            // On escape key, empty field
            if (event.keyCode == 27) {
                el.value = '';
            }
            self.filter(el.value);
        });
        return input;
    }
    filter(val) {
        this.collection = null; // set filter inactive
        let term = __WEBPACK_IMPORTED_MODULE_0__Utility__["a" /* Utility */].removeDiacritics(val).toLowerCase();
        if (term.length > 0) {
            this.collection = []; // filter is active, and at least empty !
            this.header.gallery.getOriginalCollection().forEach(function (item) {
                let needle = __WEBPACK_IMPORTED_MODULE_0__Utility__["a" /* Utility */].removeDiacritics(item.title + " " + (item.description ? item.description : '')).toLowerCase();
                if (needle.search(term) != -1) {
                    this.collection.push(item);
                }
            }, this);
        }
        this.header.filter();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = SearchFilter;



/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__AbstractFilter__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Category__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Utility__ = __webpack_require__(0);



class CategoryFilter extends __WEBPACK_IMPORTED_MODULE_0__AbstractFilter__["a" /* AbstractFilter */] {
    constructor(header) {
        super(header);
        this.header = header;
        this._categories = [];
    }
    set element(value) {
        this._element = value;
    }
    render() {
        this.prepare();
        if (!this.element) {
            this.element = document.createElement('div');
            __WEBPACK_IMPORTED_MODULE_2__Utility__["a" /* Utility */].addClass(this.element, 'natural-gallery-categories sectionContainer');
            let sectionName = document.createElement('div');
            __WEBPACK_IMPORTED_MODULE_2__Utility__["a" /* Utility */].addClass(sectionName, 'sectionName');
            sectionName.textContent = 'Categories';
            this.element.appendChild(sectionName);
        }
        let label = this.element.getElementsByTagName('label')[0];
        if (label) {
            label.parentNode.removeChild(label);
        }
        this.categories.forEach(function (cat) {
            this.element.appendChild(cat.render());
        }, this);
        return this.element;
    }
    prepare() {
        let galleryCategories = [];
        this.header.gallery.categories.forEach(function (cat) {
            galleryCategories.push(new __WEBPACK_IMPORTED_MODULE_1__Category__["a" /* Category */](cat.id, cat.title, this));
        }, this);
        this.none = new __WEBPACK_IMPORTED_MODULE_1__Category__["a" /* Category */](-1, 'None', this);
        this.others = new __WEBPACK_IMPORTED_MODULE_1__Category__["a" /* Category */](-2, 'Others', this);
        // If show unclassified
        if (this.header.gallery.options.showNone && galleryCategories.length) {
            galleryCategories.push(this.none);
        }
        // If show others and there are main categories
        if (this.header.gallery.options.showOthers && galleryCategories.length) {
            galleryCategories.push(this.others);
        }
        let itemCategories = [];
        this.header.gallery.getOriginalCollection().forEach(function (item) {
            // Set category "none" if empty
            if (!item.categories || item.categories && item.categories.length === 0 && this.header.gallery.options.showNone) {
                item.categories = [this.none];
            }
            // Set category "others" if none of categories are used in gallery categories
            if (galleryCategories.length && __WEBPACK_IMPORTED_MODULE_2__Utility__["a" /* Utility */].differenceBy(item.categories, galleryCategories, 'id').length === item.categories.length && this.header.gallery.options.showOthers) {
                item.categories = [this.others];
            }
            // Assign categories as object
            item.categories.forEach(function (cat) {
                itemCategories.push(new __WEBPACK_IMPORTED_MODULE_1__Category__["a" /* Category */](cat.id, cat.title, this));
            }, this);
        }, this);
        // Avoid duplicates
        galleryCategories = __WEBPACK_IMPORTED_MODULE_2__Utility__["a" /* Utility */].uniqBy(galleryCategories, 'id');
        itemCategories = __WEBPACK_IMPORTED_MODULE_2__Utility__["a" /* Utility */].uniqBy(itemCategories, 'id');
        if (galleryCategories.length) {
            this.categories = __WEBPACK_IMPORTED_MODULE_2__Utility__["a" /* Utility */].intersectionBy(galleryCategories, itemCategories, 'id');
        }
        else {
            this.categories = itemCategories;
        }
    }
    filter() {
        let selectedCategories = this.categories.filter(function (cat) {
            return cat.isActive;
        });
        if (selectedCategories.length === this.categories.length) {
            // if all categories are selected
            this.collection = null;
        }
        else if (selectedCategories.length === 0) {
            // if no category is selected
            this.collection = [];
        }
        else {
            let filteredItems = [];
            this.header.gallery.getOriginalCollection().forEach(function (item) {
                if (!item.categories || item.categories && item.categories.length === 0) {
                    if (this.none) {
                        filteredItems.push(item);
                    }
                }
                else {
                    item.categories.some(function (cat1) {
                        let found = selectedCategories.some(function (cat2) {
                            return cat1.id === cat2.id;
                        });
                        if (found) {
                            filteredItems.push(item);
                            return true;
                        }
                    });
                }
            }, this);
            this.collection = filteredItems;
        }
        this.header.filter();
    }
    get categories() {
        return this._categories;
    }
    set categories(value) {
        this._categories = value;
    }
    get others() {
        return this._others;
    }
    set others(value) {
        this._others = value;
    }
    get none() {
        return this._none;
    }
    set none(value) {
        this._none = value;
    }
    get element() {
        return this._element;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = CategoryFilter;



/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utility__ = __webpack_require__(0);

class Category {
    constructor(id, title, filter) {
        this.filter = filter;
        this._isActive = true;
        this.id = id;
        this.title = title;
    }
    render() {
        const self = this;
        this.element = document.createElement('label');
        let input = document.createElement('input');
        input.setAttribute('type', 'checkbox');
        input.setAttribute('checked', 'checked');
        input.addEventListener('change', function () {
            self.isActive = !self.isActive;
            self.filter.filter();
        });
        this.element.appendChild(input);
        let title = document.createElement('span');
        title.textContent = this.title;
        let label = document.createElement('span');
        __WEBPACK_IMPORTED_MODULE_0__Utility__["a" /* Utility */].addClass(label, 'label');
        label.appendChild(__WEBPACK_IMPORTED_MODULE_0__Utility__["a" /* Utility */].getIcon('icon-category'));
        label.appendChild(title);
        this.element.appendChild(label);
        let bar = document.createElement('span');
        __WEBPACK_IMPORTED_MODULE_0__Utility__["a" /* Utility */].addClass(bar, 'bar');
        this.element.appendChild(bar);
        return this.element;
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get title() {
        return this._title;
    }
    set title(value) {
        this._title = value;
    }
    get isActive() {
        return this._isActive;
    }
    set isActive(value) {
        this._isActive = value;
    }
    get element() {
        return this._element;
    }
    set element(value) {
        this._element = value;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Category;



/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Organizer; });
var Organizer;
(function (Organizer) {
    function organize(gallery) {
        if (gallery.options.format == 'natural') {
            this.organizeNatural(gallery.collection, gallery.bodyWidth, gallery.options.rowHeight, gallery.options.margin);
        }
        else if (gallery.options.format == 'square') {
            this.organizeSquare(gallery.collection, gallery.bodyWidth, gallery.options.imagesPerRow, gallery.options.margin);
        }
        gallery.style();
    }
    Organizer.organize = organize;
    /**
     * Compute sizes for images with 1:1 ratio
     * @param elements«
     * @param containerWidth
     * @param nbPictPerRow
     * @param margin
     */
    function organizeSquare(elements, containerWidth, nbPictPerRow, margin) {
        if (!margin) {
            margin = 0;
        }
        if (!nbPictPerRow) {
            nbPictPerRow = 4; // Should match the default value of imagesPerRow field from flexform
        }
        let size = (containerWidth - (nbPictPerRow - 1) * margin) / nbPictPerRow;
        for (let i = 0; i < elements.length; i++) {
            let element = elements[i];
            element.width = Math.floor(size);
            element.height = Math.floor(size);
            element.last = i % nbPictPerRow === nbPictPerRow - 1;
            element.row = Math.floor(i / nbPictPerRow);
        }
    }
    Organizer.organizeSquare = organizeSquare;
    /**
     * Compute sizes for images that keep the most their native proportion
     * @param elements
     * @param containerWidth
     * @param maxRowHeight
     * @param margin
     * @param row
     */
    function organizeNatural(elements, containerWidth, maxRowHeight, margin, row = null) {
        if (!row) {
            row = 0;
        }
        if (!margin) {
            margin = 0;
        }
        if (!maxRowHeight) {
            maxRowHeight = 300; // Should match the default value of thumbnailMaximumHeight field from flexform
        }
        for (let chunkSize = 1; chunkSize <= elements.length; chunkSize++) {
            let chunk = elements.slice(0, chunkSize);
            let rowWidth = this.getRowWidth(maxRowHeight, margin, chunk);
            if (rowWidth >= containerWidth) {
                this.computeSizes(chunk, containerWidth, margin, row);
                this.organizeNatural(elements.slice(chunkSize), containerWidth, maxRowHeight, margin, row + 1);
                break;
            }
            else if (chunkSize == elements.length) {
                // the width is not fixed as we have not enough elements
                // size of images are indexed on max row height.
                this.computeSizes(chunk, null, margin, row, maxRowHeight);
                break;
            }
        }
    }
    Organizer.organizeNatural = organizeNatural;
    function computeSizes(chunk, containerWidth, margin, row, maxRowHeight = null) {
        let rowHeight = containerWidth ? this.getRowHeight(containerWidth, margin, chunk) : maxRowHeight;
        let rowWidth = this.getRowWidth(rowHeight, margin, chunk);
        let excess = containerWidth ? this.apportionExcess(chunk, containerWidth, rowWidth) : 0;
        let decimals = 0;
        for (let i = 0; i < chunk.length; i++) {
            let element = chunk[i];
            let width = this.getImageRatio(element) * rowHeight - excess;
            decimals += width - Math.floor(width);
            width = Math.floor(width);
            if (decimals >= 1 || i === chunk.length - 1 && Math.round(decimals) === 1) {
                width++;
                decimals--;
            }
            element.width = width;
            element.height = Math.floor(rowHeight);
            element.row = row;
            element.last = i == chunk.length - 1;
        }
    }
    Organizer.computeSizes = computeSizes;
    function getRowWidth(maxRowHeight, margin, elements) {
        return margin * (elements.length - 1) + this.getRatios(elements) * maxRowHeight;
    }
    Organizer.getRowWidth = getRowWidth;
    function getRowHeight(containerWidth, margin, elements) {
        return containerWidth / this.getRatios(elements) + margin * (elements.length - 1);
    }
    Organizer.getRowHeight = getRowHeight;
    function getRatios(elements) {
        const self = this;
        let totalWidth = 0;
        for (let i = 0; i < elements.length; i++) {
            totalWidth += self.getImageRatio(elements[i]);
        }
        return totalWidth;
    }
    Organizer.getRatios = getRatios;
    function getImageRatio(el) {
        return Number(el.tWidth) / Number(el.tHeight);
    }
    Organizer.getImageRatio = getImageRatio;
    function apportionExcess(elements, containerWidth, rowWidth) {
        let excess = rowWidth - containerWidth;
        let excessPerItem = excess / elements.length;
        return excessPerItem;
    }
    Organizer.apportionExcess = apportionExcess;
})(Organizer || (Organizer = {}));


/***/ }),
/* 14 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 15 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);
});
//# sourceMappingURL=natural-gallery.js.map
>>>>>>> Update dist files

(this["webpackJsonp@minimal/minimal-kit-react"]=this["webpackJsonp@minimal/minimal-kit-react"]||[]).push([[26],{1529:function(e,t,a){"use strict";var n=a(4),r=n.createContext();t.a=r},1530:function(e,t,a){"use strict";var n=a(4),r=n.createContext();t.a=r},1533:function(e,t,a){"use strict";var n=a(23);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=n(a(119)),o=a(0);t.default=(0,r.default)((0,o.jsx)("path",{d:"M21 11H6.83l3.58-3.59L9 6l-6 6 6 6 1.41-1.41L6.83 13H21z"}),"KeyboardBackspace")},1536:function(e,t,a){"use strict";var n=a(6),r=a(14),o=a(4),i=(a(20),a(19)),c=a(154),l=a(27),d=a(12),s=a(118),u=a(129);function b(e){return Object(s.a)("MuiTableContainer",e)}Object(u.a)("MuiTableContainer",["root"]);var v=a(0),j=["className","component"],p=Object(d.a)("div",{name:"MuiTableContainer",slot:"Root",overridesResolver:function(e,t){return t.root}})({width:"100%",overflowX:"auto"}),O=o.forwardRef((function(e,t){var a=Object(l.a)({props:e,name:"MuiTableContainer"}),o=a.className,d=a.component,s=void 0===d?"div":d,u=Object(r.a)(a,j),O=Object(n.a)({},a,{component:s}),f=function(e){var t=e.classes;return Object(c.a)({root:["root"]},b,t)}(O);return Object(v.jsx)(p,Object(n.a)({ref:t,as:s,className:Object(i.a)(f.root,o),ownerState:O},u))}));t.a=O},1537:function(e,t,a){"use strict";var n=a(14),r=a(6),o=a(4),i=(a(20),a(19)),c=a(154),l=a(1530),d=a(27),s=a(12),u=a(118),b=a(129);function v(e){return Object(u.a)("MuiTable",e)}Object(b.a)("MuiTable",["root","stickyHeader"]);var j=a(0),p=["className","component","padding","size","stickyHeader"],O=Object(s.a)("table",{name:"MuiTable",slot:"Root",overridesResolver:function(e,t){var a=e.ownerState;return[t.root,a.stickyHeader&&t.stickyHeader]}})((function(e){var t=e.theme,a=e.ownerState;return Object(r.a)({display:"table",width:"100%",borderCollapse:"collapse",borderSpacing:0,"& caption":Object(r.a)({},t.typography.body2,{padding:t.spacing(2),color:t.palette.text.secondary,textAlign:"left",captionSide:"bottom"})},a.stickyHeader&&{borderCollapse:"separate"})})),f="table",h=o.forwardRef((function(e,t){var a=Object(d.a)({props:e,name:"MuiTable"}),s=a.className,u=a.component,b=void 0===u?f:u,h=a.padding,m=void 0===h?"normal":h,g=a.size,x=void 0===g?"medium":g,y=a.stickyHeader,w=void 0!==y&&y,k=Object(n.a)(a,p),S=Object(r.a)({},a,{component:b,padding:m,size:x,stickyHeader:w}),z=function(e){var t=e.classes,a={root:["root",e.stickyHeader&&"stickyHeader"]};return Object(c.a)(a,v,t)}(S),T=o.useMemo((function(){return{padding:m,size:x,stickyHeader:w}}),[m,x,w]);return Object(j.jsx)(l.a.Provider,{value:T,children:Object(j.jsx)(O,Object(r.a)({as:b,role:b===f?null:"table",ref:t,className:Object(i.a)(z.root,s),ownerState:S},k))})}));t.a=h},1538:function(e,t,a){"use strict";var n=a(6),r=a(14),o=a(4),i=(a(20),a(19)),c=a(154),l=a(1529),d=a(27),s=a(12),u=a(118),b=a(129);function v(e){return Object(u.a)("MuiTableBody",e)}Object(b.a)("MuiTableBody",["root"]);var j=a(0),p=["className","component"],O=Object(s.a)("tbody",{name:"MuiTableBody",slot:"Root",overridesResolver:function(e,t){return t.root}})({display:"table-row-group"}),f={variant:"body"},h="tbody",m=o.forwardRef((function(e,t){var a=Object(d.a)({props:e,name:"MuiTableBody"}),o=a.className,s=a.component,u=void 0===s?h:s,b=Object(r.a)(a,p),m=Object(n.a)({},a,{component:u}),g=function(e){var t=e.classes;return Object(c.a)({root:["root"]},v,t)}(m);return Object(j.jsx)(l.a.Provider,{value:f,children:Object(j.jsx)(O,Object(n.a)({className:Object(i.a)(g.root,o),as:u,ref:t,role:u===h?null:"rowgroup",ownerState:m},b))})}));t.a=m},1539:function(e,t,a){"use strict";var n=a(5),r=a(6),o=a(14),i=a(4),c=(a(20),a(19)),l=a(154),d=a(83),s=a(1529),u=a(27),b=a(12),v=a(118),j=a(129);function p(e){return Object(v.a)("MuiTableRow",e)}var O=Object(j.a)("MuiTableRow",["root","selected","hover","head","footer"]),f=a(0),h=["className","component","hover","selected"],m=Object(b.a)("tr",{name:"MuiTableRow",slot:"Root",overridesResolver:function(e,t){var a=e.ownerState;return[t.root,a.head&&t.head,a.footer&&t.footer]}})((function(e){var t,a=e.theme;return t={color:"inherit",display:"table-row",verticalAlign:"middle",outline:0},Object(n.a)(t,"&.".concat(O.hover,":hover"),{backgroundColor:a.palette.action.hover}),Object(n.a)(t,"&.".concat(O.selected),{backgroundColor:Object(d.a)(a.palette.primary.main,a.palette.action.selectedOpacity),"&:hover":{backgroundColor:Object(d.a)(a.palette.primary.main,a.palette.action.selectedOpacity+a.palette.action.hoverOpacity)}}),t})),g=i.forwardRef((function(e,t){var a=Object(u.a)({props:e,name:"MuiTableRow"}),n=a.className,d=a.component,b=void 0===d?"tr":d,v=a.hover,j=void 0!==v&&v,O=a.selected,g=void 0!==O&&O,x=Object(o.a)(a,h),y=i.useContext(s.a),w=Object(r.a)({},a,{component:b,hover:j,selected:g,head:y&&"head"===y.variant,footer:y&&"footer"===y.variant}),k=function(e){var t=e.classes,a={root:["root",e.selected&&"selected",e.hover&&"hover",e.head&&"head",e.footer&&"footer"]};return Object(l.a)(a,p,t)}(w);return Object(f.jsx)(m,Object(r.a)({as:b,ref:t,className:Object(c.a)(k.root,n),role:"tr"===b?null:"row",ownerState:w},x))}));t.a=g},1540:function(e,t,a){"use strict";var n=a(5),r=a(14),o=a(6),i=a(4),c=(a(20),a(19)),l=a(154),d=a(83),s=a(25),u=a(1530),b=a(1529),v=a(27),j=a(12),p=a(118),O=a(129);function f(e){return Object(p.a)("MuiTableCell",e)}var h=Object(O.a)("MuiTableCell",["root","head","body","footer","sizeSmall","sizeMedium","paddingCheckbox","paddingNone","alignLeft","alignCenter","alignRight","alignJustify","stickyHeader"]),m=a(0),g=["align","className","component","padding","scope","size","sortDirection","variant"],x=Object(j.a)("td",{name:"MuiTableCell",slot:"Root",overridesResolver:function(e,t){var a=e.ownerState;return[t.root,t[a.variant],t["size".concat(Object(s.a)(a.size))],"normal"!==a.padding&&t["padding".concat(Object(s.a)(a.padding))],"inherit"!==a.align&&t["align".concat(Object(s.a)(a.align))],a.stickyHeader&&t.stickyHeader]}})((function(e){var t=e.theme,a=e.ownerState;return Object(o.a)({},t.typography.body2,{display:"table-cell",verticalAlign:"inherit",borderBottom:"1px solid\n    ".concat("light"===t.palette.mode?Object(d.e)(Object(d.a)(t.palette.divider,1),.88):Object(d.b)(Object(d.a)(t.palette.divider,1),.68)),textAlign:"left",padding:16},"head"===a.variant&&{color:t.palette.text.primary,lineHeight:t.typography.pxToRem(24),fontWeight:t.typography.fontWeightMedium},"body"===a.variant&&{color:t.palette.text.primary},"footer"===a.variant&&{color:t.palette.text.secondary,lineHeight:t.typography.pxToRem(21),fontSize:t.typography.pxToRem(12)},"small"===a.size&&Object(n.a)({padding:"6px 16px"},"&.".concat(h.paddingCheckbox),{width:24,padding:"0 12px 0 16px","& > *":{padding:0}}),"checkbox"===a.padding&&{width:48,padding:"0 0 0 4px"},"none"===a.padding&&{padding:0},"left"===a.align&&{textAlign:"left"},"center"===a.align&&{textAlign:"center"},"right"===a.align&&{textAlign:"right",flexDirection:"row-reverse"},"justify"===a.align&&{textAlign:"justify"},a.stickyHeader&&{position:"sticky",top:0,zIndex:2,backgroundColor:t.palette.background.default})})),y=i.forwardRef((function(e,t){var a,n=Object(v.a)({props:e,name:"MuiTableCell"}),d=n.align,j=void 0===d?"inherit":d,p=n.className,O=n.component,h=n.padding,y=n.scope,w=n.size,k=n.sortDirection,S=n.variant,z=Object(r.a)(n,g),T=i.useContext(u.a),M=i.useContext(b.a),R=M&&"head"===M.variant;a=O||(R?"th":"td");var H=y;!H&&R&&(H="col");var C=S||M&&M.variant,N=Object(o.a)({},n,{align:j,component:a,padding:h||(T&&T.padding?T.padding:"normal"),size:w||(T&&T.size?T.size:"medium"),sortDirection:k,stickyHeader:"head"===C&&T&&T.stickyHeader,variant:C}),D=function(e){var t=e.classes,a=e.variant,n=e.align,r=e.padding,o=e.size,i={root:["root",a,e.stickyHeader&&"stickyHeader","inherit"!==n&&"align".concat(Object(s.a)(n)),"normal"!==r&&"padding".concat(Object(s.a)(r)),"size".concat(Object(s.a)(o))]};return Object(l.a)(i,f,t)}(N),F=null;return k&&(F="asc"===k?"ascending":"descending"),Object(m.jsx)(x,Object(o.a)({as:a,ref:t,className:Object(c.a)(D.root,p),"aria-sort":F,scope:H,ownerState:N},z))}));t.a=y},1541:function(e,t,a){"use strict";var n=a(6),r=a(14),o=a(4),i=(a(20),a(19)),c=a(154),l=a(1529),d=a(27),s=a(12),u=a(118),b=a(129);function v(e){return Object(u.a)("MuiTableHead",e)}Object(b.a)("MuiTableHead",["root"]);var j=a(0),p=["className","component"],O=Object(s.a)("thead",{name:"MuiTableHead",slot:"Root",overridesResolver:function(e,t){return t.root}})({display:"table-header-group"}),f={variant:"head"},h="thead",m=o.forwardRef((function(e,t){var a=Object(d.a)({props:e,name:"MuiTableHead"}),o=a.className,s=a.component,u=void 0===s?h:s,b=Object(r.a)(a,p),m=Object(n.a)({},a,{component:u}),g=function(e){var t=e.classes;return Object(c.a)({root:["root"]},v,t)}(m);return Object(j.jsx)(l.a.Provider,{value:f,children:Object(j.jsx)(O,Object(n.a)({as:u,className:Object(i.a)(g.root,o),ref:t,role:u===h?null:"rowgroup",ownerState:m},b))})}));t.a=m},1822:function(e,t,a){"use strict";a.r(t),a.d(t,"default",(function(){return P}));var n=a(9),r=a(7),o=a(18),i=a(3),c=a.n(i),l=a(4),d=a(1514),s=a(130),u=a(1473),b=a(705),v=a(286),j=a(1536),p=a(1537),O=a(1541),f=a(1539),h=a(1540),m=a(1538),g=a(1505),x=a(84),y=a(287),w=a(52),k=a(49),S=a(65),z=a(1533),T=a.n(z),M=a(472),R=a(120),H=a(77),C=a(48),N=a(68),D=a.n(N),F=a(46),A=a(50),I=a.n(A),B=a(251),U=a(0),L=Object(l.lazy)((function(){return a.e(3).then(a.bind(null,1555))}));function P(){var e,t=Object(R.b)().enqueueSnackbar,a=Object(w.b)(),i=Object(k.g)(),z=Object(x.a)().themeStretch,N=Object(w.c)(M.b),A=N.documents,P=N.companyDetails,E=N.deletedDocType,Y=N.clientList,J=Object(l.useRef)(),V=Object(l.useState)([]),W=Object(o.a)(V,2),_=W[0],q=W[1],K=Object(l.useState)(""),X=Object(o.a)(K,2),G=X[0],Q=X[1],Z=Object(l.useState)(""),$=Object(o.a)(Z,2),ee=$[0],te=$[1],ae=Object(l.useRef)(),ne=Object(l.useRef)();function re(){return(re=Object(r.a)(c.a.mark((function e(){var t,n,r,o;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(null===P||void 0===P||null===(t=P.data)||void 0===t||!t.imageUrl||""===(null===P||void 0===P||null===(n=P.data)||void 0===n?void 0:n.imageUrl)){e.next=6;break}return a(Object(H.d)(!0)),e.next=4,ie(null===P||void 0===P||null===(r=P.data)||void 0===r?void 0:r.imageUrl);case 4:o=e.sent,Q(o);case 6:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function oe(){return(oe=Object(r.a)(c.a.mark((function e(){var t,n,r,o;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(null===P||void 0===P||null===(t=P.data)||void 0===t||!t.sigUrl||""===(null===P||void 0===P||null===(n=P.data)||void 0===n?void 0:n.sigUrl)){e.next=6;break}return a(Object(H.d)(!0)),e.next=4,ie(null===P||void 0===P||null===(r=P.data)||void 0===r?void 0:r.sigUrl);case 4:o=e.sent,te(o);case 6:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function ie(e){return ce.apply(this,arguments)}function ce(){return(ce=Object(r.a)(c.a.mark((function e(t){var a,n;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(""!==t){e.next=4;break}return e.abrupt("return","");case 4:return e.prev=4,e.next=7,fetch(t);case 7:return a=e.sent,e.next=10,a.blob();case 10:return n=e.sent,e.abrupt("return",new Promise((function(e){var t=new FileReader;t.readAsDataURL(n),t.onloadend=function(){var a=t.result;e(a)}})));case 14:e.prev=14,e.t0=e.catch(4),console.log(e.t0);case 17:case"end":return e.stop()}}),e,null,[[4,14]])})))).apply(this,arguments)}function le(){return le=Object(r.a)(c.a.mark((function e(){var o;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!P||!E){e.next=5;break}return a(Object(H.d)(!0)),o="deleted".concat(E),e.next=5,C.b.collection("company").doc(null===P||void 0===P?void 0:P.id).collection(o).orderBy("docDate","desc").get().then(function(){var e=Object(r.a)(c.a.mark((function e(r){var o,i;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:(null===r||void 0===r||null===(o=r.docs)||void 0===o?void 0:o.length)>0?(i=[],null===r||void 0===r||r.docs.forEach((function(e){i.push({id:null===e||void 0===e?void 0:e.id,data:Object(n.a)({},null===e||void 0===e?void 0:e.data())})})),q(i),a(Object(H.d)(!1))):(t("No deleted documents found",{variant:"error"}),q([]),a(Object(H.d)(!1)));case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()).catch((function(e){q([]),t("Error occured while fetching ".concat(E,": ").concat(null===e||void 0===e?void 0:e.message),{variant:"error"}),a(Object(H.d)(!1))}));case 5:case"end":return e.stop()}}),e)}))),le.apply(this,arguments)}return Object(l.useEffect)((function(){ae.current(),ne.current()}),[P]),Object(l.useEffect)((function(){J.current()}),[P,E]),ae.current=function(){return re.apply(this,arguments)},ne.current=function(){return oe.apply(this,arguments)},J.current=function(){return le.apply(this,arguments)},Object(U.jsx)(y.a,{title:"Deleted document",children:Object(U.jsx)(d.a,{maxWidth:!z&&"xl",children:Object(U.jsxs)(s.a,{container:!0,spacing:3,children:[Object(U.jsx)(s.a,{item:!0,xs:12,md:12,children:Object(U.jsxs)(u.a,{spacing:3,direction:"row",alignItems:"center",children:[Object(U.jsx)(b.a,{startIcon:Object(U.jsx)(T.a,{}),variant:"outlined",color:"primary",onClick:function(){return i(S.b.general.app1)},children:"Back"}),Object(U.jsx)(v.a,{variant:"h3",children:"Deleted document section"})]})}),Object(U.jsx)(l.Suspense,{fallback:Object(U.jsx)(U.Fragment,{}),children:Object(U.jsx)(L,{type:"deletedDocument"})}),_&&(null===_||void 0===_?void 0:_.length)>0?Object(U.jsx)(s.a,{item:!0,xs:12,md:12,children:Object(U.jsx)(j.a,{children:Object(U.jsxs)(p.a,{children:[Object(U.jsx)(O.a,{children:Object(U.jsxs)(f.a,{children:[Object(U.jsx)(h.a,{size:"small",align:"center",style:{whiteSpace:"nowrap"},children:"Date time created"}),Object(U.jsx)(h.a,{size:"small",align:"center",style:{whiteSpace:"nowrap"},children:"Client"}),Object(U.jsx)(h.a,{size:"small",align:"center",style:{whiteSpace:"nowrap"},children:"".concat(A&&(null===A||void 0===A?void 0:A.length)>0&&(null===(e=A.find((function(e){return e.id===E})))||void 0===e?void 0:e.title)," number")}),Object(U.jsx)(h.a,{size:"small",align:"center",style:{whiteSpace:"nowrap"},children:"View/download"}),"invoice"!==E?Object(U.jsxs)(U.Fragment,{children:[Object(U.jsx)(h.a,{size:"small",align:"center",style:{whiteSpace:"nowrap"},children:"Vat amount"}),Object(U.jsx)(h.a,{size:"small",align:"center",style:{whiteSpace:"nowrap"},children:"Subtotal amount"})]}):Object(U.jsx)(U.Fragment,{}),Object(U.jsx)(h.a,{size:"small",align:"center",style:{whiteSpace:"nowrap"},children:"Total amount"})]})}),Object(U.jsx)(m.a,{children:null===_||void 0===_?void 0:_.map((function(e){var t,a,r,o,i,c;return Object(U.jsxs)(f.a,{children:[Object(U.jsx)(h.a,{align:"center",size:"small",style:{whiteSpace:"nowrap"},children:D()(null===e||void 0===e||null===(t=e.data)||void 0===t?void 0:t.docDate.toDate()).format("DD-MM-YYYY, HH:MM:ss")}),Object(U.jsx)(h.a,{size:"small",align:"center",style:{whiteSpace:"nowrap"},children:Y&&(null===Y||void 0===Y?void 0:Y.length)>0&&(null===Y||void 0===Y||null===(a=Y.find((function(t){var a;return t.id===(null===e||void 0===e||null===(a=e.data)||void 0===a?void 0:a.clientId)})))||void 0===a?void 0:a.name)}),Object(U.jsx)(h.a,{align:"center",size:"small",style:{whiteSpace:"nowrap"},children:"".concat(null===e||void 0===e||null===(r=e.data)||void 0===r?void 0:r.docString)}),Object(U.jsx)(h.a,{align:"center",size:"small",style:{whiteSpace:"nowrap"},children:Object(U.jsxs)(u.a,{direction:"row",alignItems:"center",justifyContent:"center",spacing:2,children:[Object(U.jsx)(g.a,{variant:"contained",color:"primary",onClick:function(){var t;return Object(B.n)(P,{data:Y&&(null===Y||void 0===Y?void 0:Y.length)>0&&null!==Y&&void 0!==Y&&Y.find((function(t){var a;return t.id===(null===e||void 0===e||null===(a=e.data)||void 0===a?void 0:a.clientId)}))?Object(n.a)({},null===Y||void 0===Y||null===(t=Y.find((function(t){var a;return t.id===(null===e||void 0===e||null===(a=e.data)||void 0===a?void 0:a.clientId)})))||void 0===t?void 0:t.data):null},e,G,ee,"view")},children:Object(U.jsx)(F.a,{icon:"carbon:view"})}),Object(U.jsx)(g.a,{variant:"contained",color:"primary",onClick:function(){var t;return Object(B.n)(P,{data:Y&&(null===Y||void 0===Y?void 0:Y.length)>0&&null!==Y&&void 0!==Y&&Y.find((function(t){var a;return t.id===(null===e||void 0===e||null===(a=e.data)||void 0===a?void 0:a.clientId)}))?Object(n.a)({},null===Y||void 0===Y||null===(t=Y.find((function(t){var a;return t.id===(null===e||void 0===e||null===(a=e.data)||void 0===a?void 0:a.clientId)})))||void 0===t?void 0:t.data):null},e,G,ee,"download")},children:Object(U.jsx)(F.a,{icon:"eva:download-fill"})})]})}),"invoice"!==E?Object(U.jsxs)(U.Fragment,{children:[Object(U.jsx)(h.a,{size:"small",align:"center",style:{whiteSpace:"nowrap"},children:Object(U.jsx)(I.a,{value:Number((null===e||void 0===e||null===(o=e.data)||void 0===o?void 0:o.docVatFee)||0).toFixed(2),displayType:"text",thousandSeparator:!0})}),Object(U.jsx)(h.a,{size:"small",align:"center",style:{whiteSpace:"nowrap"},children:Object(U.jsx)(I.a,{value:Number((null===e||void 0===e||null===(i=e.data)||void 0===i?void 0:i.docSubTotal)||0).toFixed(2),displayType:"text",thousandSeparator:!0})})]}):Object(U.jsx)(U.Fragment,{}),Object(U.jsx)(h.a,{size:"small",align:"center",style:{whiteSpace:"nowrap"},children:Object(U.jsx)(I.a,{value:Number((null===e||void 0===e||null===(c=e.data)||void 0===c?void 0:c.docTotal)||0).toFixed(2),displayType:"text",thousandSeparator:!0})})]})}))})]})})}):Object(U.jsx)(U.Fragment,{})]})})})}}}]);
//# sourceMappingURL=26.e7d28dd2.chunk.js.map
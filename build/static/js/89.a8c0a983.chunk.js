(this["webpackJsonp@minimal/minimal-kit-react"]=this["webpackJsonp@minimal/minimal-kit-react"]||[]).push([[89],{1762:function(e,t,a){"use strict";a.r(t);a(5),a(27);var n=a(9),c=a(6),r=a(18),i=a(3),s=a.n(i),l=a(1398),o=a(1406),u=a(1413),d=a(1465),j=a(1414),b=a(1466),p=a(701),O=a(4),m=a(52),f=a(68),h=a(49),v=a(250),x=a(118),y=a(1548),g=a(72),k=a(1589),w=a(1590),C=a(0);t.default=function(e){var t=e.openDialog,a=e.handleCloseDialog,i=e.adminDetails,D=e.setAdminDetails,N=e.init_admin_list,F=(Object(g.a)().user,i.id),_=i.firstName,S=i.lastName,A=i.contactNumber,U=(i.email,i.password),q=i.role,E=i.access,J=i.sysFunc,P=i.a_comp,T=Object(m.b)(),W=Object(x.b)().enqueueSnackbar,B=Object(O.useState)(0),R=Object(r.a)(B,2),z=R[0],G=R[1],H=Object(O.useState)(!1),I=Object(r.a)(H,2),K=I[0],L=I[1],M=Object(O.useState)([]),Q=Object(r.a)(M,2),V=Q[0],X=Q[1],Y=Object(O.useRef)();function Z(){return(Z=Object(c.a)(s.a.mark((function e(){var a;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(void 0!==J||!t){e.next=7;break}return e.next=3,Object(y.a)(!0);case 3:a=e.sent,D(Object(n.a)(Object(n.a)({},i),{},{sysFunc:a})),e.next=8;break;case 7:!K&&(null===J||void 0===J?void 0:J.length)>0&&t&&$(J);case 8:case"end":return e.stop()}}),e)})))).apply(this,arguments)}Object(O.useEffect)((function(){Y.current()}),[J,t]),Y.current=function(){return Z.apply(this,arguments)};var $=function(){var e=Object(c.a)(s.a.mark((function e(t){var a;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=[],e.next=3,Object(y.a)(!1);case 3:e.sent.forEach((function(e){var n=t.filter((function(t){return t.name===e.name}));0===(null===n||void 0===n?void 0:n.length)?a.push(e):a.push(n[0])})),D(Object(n.a)(Object(n.a)({},i),{},{sysFunc:a})),L(!0);case 7:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();return Object(C.jsx)(C.Fragment,{children:Object(C.jsxs)(l.a,{open:t,maxWidth:"lg",fullWidth:!0,children:[Object(C.jsx)(o.a,{id:"alert-dialog-title",children:"Update a User"}),Object(C.jsxs)(u.a,{style:{height:"auto"},children:[Object(C.jsx)(d.a,{}),Object(C.jsx)("br",{}),0===z?Object(C.jsx)(k.a,{adminDetails:i,setAdminDetails:D,selectedCompanies:V,set_selectedCompanies:X,type:"admin",dialogType:"update"}):1===z?Object(C.jsx)(w.a,{adminDetails:i,setAdminDetails:D,type:"admin",dialogType:"update"}):""]}),Object(C.jsx)(j.a,{children:Object(C.jsxs)(b.a,{spacing:2,direction:"row",children:[0===z?Object(C.jsx)(p.a,{onClick:function(){G(1)},color:"primary",variant:"contained",children:"Next"}):1===z?Object(C.jsxs)(C.Fragment,{children:[Object(C.jsx)(p.a,{onClick:function(){return G(0)},color:"secondary",variant:"contained",children:"Back"}),Object(C.jsx)(p.a,{onClick:function(e){return function(e){if(T(Object(f.d)(!0)),e.preventDefault(),Object(v.b)([_,S,A,U,q]))if(Object(v.c)(U)){var t={id:F,firstName:_,lastName:S,contactNumber:A,password:U,role:q,access:E,sysFunc:J,a_comp:P||[]};h.d.httpsCallable("updateuserbyadminnew")(Object(n.a)({},t)).then((function(e){var t;N&&N(),W((null===e||void 0===e||null===(t=e.data)||void 0===t?void 0:t.result)||"",{variant:"success"}),a(),L(!1),G(0),T(Object(f.d)(!1))})).catch((function(e){var t="";t=e.message?e.message:e,W(t,{variant:"error"}),G(0),a(),L(!1),T(Object(f.d)(!1))}))}else W("Password must be equal or greater than 6 characters",{variant:"error"}),T(Object(f.d)(!1));else W("Please fill in all the inputs",{variant:"error"}),T(Object(f.d)(!1))}(e)},color:"primary",variant:"contained",children:"Update"})]}):"",Object(C.jsx)(p.a,{onClick:function(){a(),G(0),L(!1)},color:"error",variant:"outlined",children:"Cancel"})]})})]})})}}}]);
//# sourceMappingURL=89.a8c0a983.chunk.js.map
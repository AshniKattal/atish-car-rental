(this["webpackJsonp@minimal/minimal-kit-react"]=this["webpackJsonp@minimal/minimal-kit-react"]||[]).push([[36,16],{1526:function(e,t,a){"use strict";var l=a(23);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=l(a(117)),i=a(0);t.default=(0,n.default)((0,i.jsx)("path",{d:"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"}),"Delete")},1530:function(e,t,a){"use strict";var l=a(7),n=a(14),i=a(4),o=(a(20),a(21)),d=a(153),r=a(28),c=a(13),s=a(126),u=a(132);function b(e){return Object(s.a)("MuiTableContainer",e)}Object(u.a)("MuiTableContainer",["root"]);var j=a(0),v=["className","component"],m=Object(c.a)("div",{name:"MuiTableContainer",slot:"Root",overridesResolver:function(e,t){return t.root}})({width:"100%",overflowX:"auto"}),h=i.forwardRef((function(e,t){var a=Object(r.a)({props:e,name:"MuiTableContainer"}),i=a.className,c=a.component,s=void 0===c?"div":c,u=Object(n.a)(a,v),h=Object(l.a)({},a,{component:s}),O=function(e){var t=e.classes;return Object(d.a)({root:["root"]},b,t)}(h);return Object(j.jsx)(m,Object(l.a)({ref:t,as:s,className:Object(o.a)(O.root,i),ownerState:h},u))}));t.a=h},1535:function(e,t,a){"use strict";var l=a(7),n=a(14),i=a(4),o=(a(20),a(21)),d=a(153),r=a(1523),c=a(28),s=a(13),u=a(126),b=a(132);function j(e){return Object(u.a)("MuiTableHead",e)}Object(b.a)("MuiTableHead",["root"]);var v=a(0),m=["className","component"],h=Object(s.a)("thead",{name:"MuiTableHead",slot:"Root",overridesResolver:function(e,t){return t.root}})({display:"table-header-group"}),O={variant:"head"},p="thead",x=i.forwardRef((function(e,t){var a=Object(c.a)({props:e,name:"MuiTableHead"}),i=a.className,s=a.component,u=void 0===s?p:s,b=Object(n.a)(a,m),x=Object(l.a)({},a,{component:u}),f=function(e){var t=e.classes;return Object(d.a)({root:["root"]},j,t)}(x);return Object(v.jsx)(r.a.Provider,{value:O,children:Object(v.jsx)(h,Object(l.a)({as:u,className:Object(o.a)(f.root,i),ref:t,role:u===p?null:"rowgroup",ownerState:x},b))})}));t.a=x},1541:function(e,t,a){"use strict";a.r(t);var l=a(9),n=a(6),i=a(18),o=a(3),d=a.n(o),r=a(4),c=a(50),s=a.n(c),u=a(1479),b=a(1533),j=a(1535),v=a(1534),m=a(1856),h=a(76),O=a(701),p=a(1516),x=a(1466),f=a(286),g=a(1530),y=a(1531),C=a(1532),w=a(1492),k=a(1499),N=a(471),S=a(1857),M=a(1398),R=a(1406),B=a(1413),T=a(1414),z=a(155),I=a(1556),D=a.n(I),F=a(1529),P=a.n(F),H=a(1526),J=a.n(H),A=a(13),L=a(72),W=a(1544),V=a.n(W),Y=a(253),q=a(46),E=a(250),U=a(118),_=a(52),G=a(68),X=a(97),Q=a(69),K=a.n(Q),Z=a(0),$=Object(u.a)({table:{minWidth:650},tableTitle:{fontWeight:"bold"},tableBtnOption:{cursor:"pointer"},tableRow:{cursor:"pointer"},tableCell:{whiteSpace:"nowrap",textOverflow:"ellipsis",overflow:"hidden"},tableCellLeft:{whiteSpace:"nowrap",textOverflow:"ellipsis",overflow:"hidden",borderTopLeftRadius:10,borderBottomLeftRadius:10},tableCellRight:{borderTopRightRadius:10,borderBottomRightRadius:10}}),ee=Object(A.a)(b.a)((function(e){var t,a,l,n=e.theme;return{backgroundColor:"light"===(null===n||void 0===n||null===(t=n.palette)||void 0===t?void 0:t.mode)?null===n||void 0===n||null===(a=n.palette)||void 0===a?void 0:a.primary.light:"dark"===(null===n||void 0===n||null===(l=n.palette)||void 0===l?void 0:l.mode)?n.palette.primary.dark:"transparent"}})),te=Object(A.a)(b.a)((function(e){var t,a,l,n=e.theme;return{"&:nth-of-type(even)":{backgroundColor:"light"===(null===n||void 0===n||null===(t=n.palette)||void 0===t?void 0:t.mode)?null===n||void 0===n||null===(a=n.palette)||void 0===a?void 0:a.primary.lighter:"dark"===(null===n||void 0===n||null===(l=n.palette)||void 0===l?void 0:l.mode)?n.palette.primary.darker:"transparent"}}}));function ae(e,t,a){return t[a]<e[a]?-1:t[a]>e[a]?1:0}function le(e,t){return"desc"===e?function(e,a){return ae(e,a,t)}:function(e,a){return-ae(e,a,t)}}function ne(e,t){var a=e.map((function(e,t){return[e,t]}));return a.sort((function(e,a){var l=t(e[0],a[0]);return 0!==l?l:e[1]-a[1]})),a.map((function(e){return e[0]}))}function ie(e){var t=e.headers,a=e.order,l=e.orderBy,n=e.onRequestSort;return Object(Z.jsx)(j.a,{style:{width:"100%"},children:Object(Z.jsx)(ee,{children:t&&t.map((function(e,t){return Object(Z.jsx)(v.a,{style:{whiteSpace:"nowrap",width:"List"===e.label||"View"===e.label||"Update"===e.label||"Delete"===e.label?75:void 0},align:"Delete"===e.label?"right":"center",sortDirection:l===e.id&&a,children:"List"===e.label||"View"===e.label||"Update"===e.label||"Delete"===e.label?e.label:Object(Z.jsx)(m.a,{active:l===e.id,direction:l===e.id?a:"asc",onClick:(i=e.id,function(e){n(e,i)}),children:e.label})},t);var i}))})})}t.default=function(e){var t,a,o,c,u=e.companyId,m=e.type,I=e.headers,F=e.aCollection,H=e.viewOption,A=e.viewBtnFunc,W=e.addBtnDisplay,Q=e.addBtnLabel,ee=e.addBtnFunc,ae=e.emptyColMsg,oe=e.updateBtnDisplay,de=e.updateBtnFunc,re=e.deleteBtnDisplay,ce=e.deleteBtnFunc,se=e.documentType,ue=e.logo,be=e.companyDetails,je=e.fetchClientSurvey,ve=Object(h.a)(),me=Object(_.b)(),he=$(),Oe=Object(L.a)().user,pe=Object(U.b)().enqueueSnackbar,xe=Object(r.useState)("asc"),fe=Object(i.a)(xe,2),ge=fe[0],ye=fe[1],Ce=Object(r.useState)(""),we=Object(i.a)(Ce,2),ke=we[0],Ne=we[1],Se=Object(r.useState)([]),Me=Object(i.a)(Se,2),Re=Me[0],Be=Me[1],Te=Object(r.useState)(0),ze=Object(i.a)(Te,2),Ie=ze[0],De=ze[1],Fe=Object(r.useState)(50),Pe=Object(i.a)(Fe,2),He=Pe[0],Je=Pe[1],Ae=Object(r.useState)(""),Le=Object(i.a)(Ae,2),We=Le[0],Ve=Le[1],Ye=Object(r.useState)({}),qe=Object(i.a)(Ye,2),Ee=qe[0],Ue=qe[1],_e=Object(r.useState)(!1),Ge=Object(i.a)(_e,2),Xe=Ge[0],Qe=Ge[1],Ke=Object(r.useState)(!1),Ze=Object(i.a)(Ke,2),$e=Ze[0],et=Ze[1],tt=Object(r.useState)([]),at=Object(i.a)(tt,2),lt=at[0],nt=at[1];Math.min(He,F.length-Ie*He);return Object(Z.jsxs)("div",{style:{width:"100%"},children:[Object(Z.jsx)("div",{style:{display:W?"":"none",width:"100%",paddingBottom:"2rem"},children:Object(Z.jsx)(O.a,{startIcon:Object(Z.jsx)(D.a,{}),onClick:function(){return ee()},color:"primary",variant:"contained",disabled:("client"!==m||null===Oe||void 0===Oe||null===(t=Oe.permissions)||void 0===t||null===(a=t.createClientChk)||void 0===a||!a.assignedCompanyId.includes(u))&&("company"!==m&&(("admin"!==m||null===Oe||void 0===Oe||null===(o=Oe.permissions)||void 0===o||null===(c=o.createAdminChk)||void 0===c||!c.assignedCompanyId.includes(u))&&("survey"!==m&&"vehicles"!==m&&"inventory"!==m&&"category"!==m&&"bugsBeGoneCustomCheckboxManagement"!==m))),children:Q})}),Object(Z.jsx)("div",{className:he.root,children:Object(Z.jsx)(p.a,{children:Object(Z.jsx)(x.a,{sx:{mt:1.5,p:1.5},children:F&&0===F.length?Object(Z.jsx)(Z.Fragment,{children:Object(Z.jsx)("div",{style:{width:"100%",padding:"2em"},children:Object(Z.jsx)(f.a,{variant:"h6",component:"h4",style:{fontSize:"1.2em",color:"red"},color:"secondary",children:ae})})}):Object(Z.jsxs)(z.a,{children:[Object(Z.jsx)(g.a,{children:Object(Z.jsxs)(y.a,{border:1,className:he.table,"aria-labelledby":"tableTitle",size:"medium","aria-label":"enhanced table",children:[Object(Z.jsx)(ie,{classes:he,numSelected:Re.length,order:ge,orderBy:ke,onSelectAllClick:function(e){if(e.target.checked){var t=F.map((function(e){return e.name}));Be(t)}else Be([])},onRequestSort:function(e,t){ye(ke===t&&"asc"===ge?"desc":"asc"),Ne(t)},rowCount:F.length,headers:I}),Object(Z.jsx)(C.a,{children:F&&0!==F.length&&ne(F,le(ge,ke)).slice(Ie*He,Ie*He+He).map((function(e,t){var a,i,o,c,b,j,h,p,f,g,y,C,S,M,R=[];for(var B in e)for(var T=0;T<I.length;T++)if(I[T].id===B){R.push({id:I[T].id,value:"".concat(e[B])});break}return"company"!==m||"company"===m&&null!==Oe&&void 0!==Oe&&null!==(a=Oe.permissions)&&void 0!==a&&null!==(i=a.viewCompChk)&&void 0!==i&&i.assignedCompanyId.includes(e.id)?Object(Z.jsx)(r.Fragment,{children:Object(Z.jsxs)(te,{tabIndex:-1,children:["company"!==m?Object(Z.jsx)(v.a,{className:he.tableCellLeft,align:"center",size:"small",children:t+1+")"}):Object(Z.jsx)(Z.Fragment,{}),H?Object(Z.jsx)(v.a,{align:"center",size:"small",children:Object(Z.jsx)(w.a,{title:"View",children:Object(Z.jsx)(k.a,{color:"primary",children:Object(Z.jsx)(V.a,{onClick:function(){return A(e.id,e.data)}})})})}):Object(Z.jsx)(Z.Fragment,{}),oe?Object(Z.jsx)(v.a,{align:"center",size:"small",children:Object(Z.jsx)(w.a,{title:"Update",children:Object(Z.jsx)("span",{children:Object(Z.jsx)(k.a,{color:"primary",disabled:("client"!==m||null===Oe||void 0===Oe||null===(o=Oe.permissions)||void 0===o||null===(c=o.updateClientChk)||void 0===c||!c.assignedCompanyId.includes(u))&&(("company"!==m||null===Oe||void 0===Oe||null===(b=Oe.permissions)||void 0===b||null===(j=b.updateCompChk)||void 0===j||!j.assignedCompanyId.includes(e.id))&&(("admin"!==m||null===Oe||void 0===Oe||null===(h=Oe.permissions)||void 0===h||null===(p=h.updateAdminChk)||void 0===p||!p.assignedCompanyId.includes(u))&&("survey"!==m&&"vehicles"!==m&&"inventory"!==m&&"category"!==m&&"bugsBeGoneCustomCheckboxManagement"!==m))),onClick:function(){return de(e.id,e.data)},children:Object(Z.jsx)(P.a,{className:he.tableBtnOption})})})})}):"",re?Object(Z.jsx)(v.a,{className:he.tableCellRight,align:"right",size:"small",children:Object(Z.jsx)(w.a,{title:"Delete",children:Object(Z.jsx)("span",{children:Object(Z.jsx)(k.a,{color:"error",disabled:("client"!==m||null===Oe||void 0===Oe||null===(f=Oe.permissions)||void 0===f||null===(g=f.deleteClientChk)||void 0===g||!g.assignedCompanyId.includes(u))&&(("company"!==m||null===Oe||void 0===Oe||null===(y=Oe.permissions)||void 0===y||null===(C=y.deleteCompChk)||void 0===C||!C.assignedCompanyId.includes(e.id))&&(("admin"!==m||null===Oe||void 0===Oe||null===(S=Oe.permissions)||void 0===S||null===(M=S.deleteAdminChk)||void 0===M||!M.assignedCompanyId.includes(u))&&("survey"!==m&&"vehicles"!==m&&"inventory"!==m&&"category"!==m&&"bugsBeGoneCustomCheckboxManagement"!==m))),onClick:function(){Ve(null===e||void 0===e?void 0:e.id),Ue(null===e||void 0===e?void 0:e.data),Qe(!0)},children:Object(Z.jsx)(J.a,{className:he.tableBtnOption})})})})}):"",R&&(null===R||void 0===R?void 0:R.map((function(t,a){var i,o,r,c,u,b,j,h,p,f,g;return"dateTimeCreated"===(null===t||void 0===t?void 0:t.id)?Object(Z.jsx)(v.a,{className:he.tableCell,align:"center",size:"small",children:null!==e&&void 0!==e&&null!==(i=e.data)&&void 0!==i&&i.dateTimeCreated&&K()(null===e||void 0===e||null===(o=e.data)||void 0===o?void 0:o.dateTimeCreated.toDate()).format("DD-MM-YYYY HH:mm:ss")||""},a):"featuredImage"===(null===t||void 0===t?void 0:t.id)?Object(Z.jsx)(v.a,{className:he.tableCell,align:"center",size:"small",children:Object(Z.jsx)(x.a,{spacing:1,direction:"row",alignItems:"center",justifyContent:"center",children:null!==e&&void 0!==e&&e.data&&(null===e||void 0===e||null===(r=e.data)||void 0===r||null===(c=r.featuredImage)||void 0===c?void 0:c.length)>0?null===e||void 0===e||null===(u=e.data)||void 0===u?void 0:u.featuredImage.map((function(e,t){return Object(Z.jsx)(Z.Fragment,{children:Object(Z.jsx)(N.a,{sx:{px:.2,overflowX:"scroll"},children:Object(Z.jsx)(X.a,{disabledEffect:!0,alt:"thumb image",src:null===e||void 0===e?void 0:e.downloadURL,sx:{width:50,height:50,borderRadius:1.5,border:"solid 2px ".concat(ve.palette.primary.main)}})},t)})})):""})},a):t&&"sendEmail"===t.id?Object(Z.jsx)(v.a,{className:he.tableCell,align:"center",size:"small",style:{whiteSpace:"nowrap",background:!0===(null===e||void 0===e||null===(b=e.data)||void 0===b?void 0:b.emailAlreadySent)?"#befed5":"transparent"},children:Object(Z.jsx)(O.a,{variant:"contained",color:"primary",onClick:Object(n.a)(d.a.mark((function t(){var a;return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return me(Object(G.d)(!0)),t.next=3,Object(E.m)(be,"sendEmail",null===e||void 0===e?void 0:e.data,null===se||void 0===se?void 0:se.id,ue);case 3:if(null===(a=t.sent)||void 0===a||!a.error){t.next=9;break}pe(null===a||void 0===a?void 0:a.message,{variant:"error"}),me(Object(G.d)(!1)),t.next=14;break;case 9:if(null!==a&&void 0!==a&&a.error){t.next=14;break}return pe(null===a||void 0===a?void 0:a.message,{variant:"success"}),t.next=13,je(null===be||void 0===be?void 0:be.id,null===se||void 0===se?void 0:se.id);case 13:me(Object(G.d)(!1));case 14:case"end":return t.stop()}}),t)}))),children:"Send Email"})},a):t&&"viewDownloadPdf"===t.id?Object(Z.jsx)(v.a,{className:he.tableCell,align:"center",size:"small",children:Object(Z.jsxs)(x.a,{spacing:2,direction:"row",alignItems:"center",children:[Object(Z.jsx)(k.a,{color:"primary",onClick:function(){return Object(E.p)(be,"view",Object(l.a)(Object(l.a)({},null===e||void 0===e?void 0:e.data),{},{id:null===e||void 0===e?void 0:e.id}),null===se||void 0===se?void 0:se.id,ue)},children:Object(Z.jsx)(q.a,{icon:"carbon:view"})}),Object(Z.jsx)(k.a,{color:"primary",onClick:function(){return Object(E.p)(be,"download",Object(l.a)(Object(l.a)({},null===e||void 0===e?void 0:e.data),{},{id:null===e||void 0===e?void 0:e.id}),null===se||void 0===se?void 0:se.id,ue)},children:Object(Z.jsx)(q.a,{icon:"eva:download-fill"})})]})},a):t&&"status"===t.id?Object(Z.jsx)(v.a,{className:he.tableCell,align:"center",size:"small",children:Object(Z.jsx)(Y.a,{variant:"filled",sx:{minWidth:100,minHeight:30},color:"Pending"===t.value?"warning":"Confirmed"===t.value?"success":"Rejected"===t.value?"error":"default",children:t.value})},a):t&&"actualBasicSalary"===t.id?Object(Z.jsx)(v.a,{className:he.tableCell,align:"center",size:"small",children:t&&void 0===t.value?"":t&&t.value?Object(Z.jsx)(s.a,{value:Math.round(Number(t.value)),displayType:"text",thousandSeparator:!0}):""},a):!t||"vatOrNonVatRegistered"!==t.id&&"buyerType"!==t.id?t&&"MRATemplateFlag"===t.id?Object(Z.jsx)(v.a,{className:he.tableCell,align:"center",size:"small",children:t&&JSON.parse(null===t||void 0===t?void 0:t.value)?null===(j=JSON.parse(null===t||void 0===t?void 0:t.value))||void 0===j?void 0:j.title:"Not yet defined"},a):"inventory"===m&&"category"===(null===t||void 0===t?void 0:t.id)?Object(Z.jsx)(v.a,{className:he.tableCell,align:"center",size:"small",children:t&&JSON.parse(null===t||void 0===t?void 0:t.value)?null===(h=JSON.parse(null===t||void 0===t?void 0:t.value))||void 0===h?void 0:h.title:""},a):"categoryDisplay"===(null===t||void 0===t?void 0:t.id)?Object(Z.jsx)(v.a,{className:he.tableCell,align:"center",size:"small",children:t&&JSON.parse(null===t||void 0===t?void 0:t.value)&&(null===(p=JSON.parse(null===t||void 0===t?void 0:t.value))||void 0===p?void 0:p.length)>0?null===(f=JSON.parse(null===t||void 0===t?void 0:t.value))||void 0===f?void 0:f.map((function(e){return(null===e||void 0===e?void 0:e.serviceName)+", "})):""},a):Object(Z.jsx)(v.a,{className:he.tableCell,align:"center",size:"small",children:t&&void 0===t.value?"":t&&t.value?t.value:""},a):Object(Z.jsx)(v.a,{className:he.tableCell,align:"center",size:"small",children:t&&null!==JSON.parse(null===t||void 0===t?void 0:t.value)?null===(g=JSON.parse(null===t||void 0===t?void 0:t.value))||void 0===g?void 0:g.title:"Not yet defined"},a)})))]})},t):Object(Z.jsx)(Z.Fragment,{})}))})]})}),F&&F.length>=1?Object(Z.jsx)(S.a,{rowsPerPageOptions:[50,100,150],component:"div",count:null===F||void 0===F?void 0:F.length,rowsPerPage:He,page:Ie,onPageChange:function(e,t){return De(t)},onRowsPerPageChange:function(e){Je(parseInt(e.target.value,10)),De(0)}}):""]})})})}),Object(Z.jsx)(Z.Fragment,{children:Object(Z.jsxs)(M.a,{open:$e,keepMounted:!0,onClose:function(){return et(!1)},"aria-labelledby":"delete","aria-describedby":"delete",maxWidth:"md",fullWidth:!0,children:[Object(Z.jsx)(R.a,{id:"deleteConfirm",align:"center",children:Object(Z.jsx)(f.a,{children:"Absence total summary"})}),Object(Z.jsxs)(B.a,{style:{minHeight:"auto"},align:"center",children:[Object(Z.jsx)("br",{}),Object(Z.jsx)(f.a,{children:"Quantity applicable for all employees after 1 year of employment"}),Object(Z.jsx)("br",{}),(null===lt||void 0===lt?void 0:lt.length)>0?Object(Z.jsx)(g.a,{children:Object(Z.jsxs)(y.a,{border:1,children:[Object(Z.jsx)(j.a,{children:Object(Z.jsxs)(b.a,{children:[Object(Z.jsx)(v.a,{children:"Absence type"}),Object(Z.jsx)(v.a,{children:"Total number"})]})}),Object(Z.jsx)(C.a,{children:null===lt||void 0===lt?void 0:lt.map((function(e,t){return Object(Z.jsxs)(b.a,{children:[Object(Z.jsx)(v.a,{children:null===e||void 0===e?void 0:e.txt}),Object(Z.jsx)(v.a,{children:null===e||void 0===e?void 0:e.qty})]},t)}))})]})}):Object(Z.jsx)(f.a,{children:"You have not yet provided any details about absences. Please update company to provide absence details."})]}),Object(Z.jsx)(T.a,{children:Object(Z.jsx)(O.a,{variant:"contained",color:"primary",onClick:function(){et(!1),nt([])},children:"Close"})})]})}),Object(Z.jsx)(Z.Fragment,{children:Object(Z.jsxs)(M.a,{open:Xe,keepMounted:!0,onClose:function(){return Qe(!1)},"aria-labelledby":"delete","aria-describedby":"delete",maxWidth:"md",fullWidth:!0,children:[Object(Z.jsx)(R.a,{id:"deleteConfirm",align:"center",children:Object(Z.jsx)(f.a,{children:Object(Z.jsx)("b",{children:"Delete confirmation"})})}),Object(Z.jsxs)(B.a,{style:{minHeight:"auto"},align:"center",children:[Object(Z.jsx)("br",{}),Object(Z.jsx)(f.a,{children:"Are you sure you want to delete this data ?"})]}),Object(Z.jsxs)(T.a,{children:[Object(Z.jsx)(O.a,{variant:"contained",color:"primary",onClick:function(){ce(We,Ee),Ve(""),Ue({}),Qe(!1)},children:"Delete"}),Object(Z.jsx)(O.a,{color:"error",variant:"outlined",onClick:function(){Qe(!1),Ve("")},children:"Close"})]})]})})]})}},1544:function(e,t,a){"use strict";var l=a(23);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=l(a(117)),i=a(0);t.default=(0,n.default)((0,i.jsx)("path",{d:"M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5m0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3"}),"Visibility")}}]);
//# sourceMappingURL=36.d7f7715a.chunk.js.map
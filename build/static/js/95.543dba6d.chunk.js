(this["webpackJsonp@minimal/minimal-kit-react"]=this["webpackJsonp@minimal/minimal-kit-react"]||[]).push([[95],{1757:function(e,a,t){"use strict";t.r(a);var n=t(9),i=t(6),c=t(18),l=t(3),r=t.n(l),o=t(1398),s=t(1406),m=t(1413),b=t(145),d=t(1513),j=t(1482),u=t(286),p=t(701),O=t(133),g=t(1491),v=t(1414),x=t(4),h=t(52),f=t(72),y=t(154),N=t(68),k=t(157),C=t(49),T=t(250),A=t(118),w=t(472),R=t(0);a.default=function(e){var a=e.openDialog,t=e.handleCloseDialog,l=e.companyDetails,S=e.setCompanyDetails,z=e.initializeCompanies,W=l.id,I=l.name,D=l.vatPercentage,U=l.imageName,V=l.imageSig,M=l.imageUrl,P=l.sigUrl,L=l.stampName,B=l.stampUrl,F=l.companyType,q=l.vatOrNonVatRegistered,_=l.tan,H=l.address,J=l.email,E=l.contactNumber,K=l.mobileNumber,Y=l.brn,G=l.beneficiaryName,Q=l.bankName,X=l.bankAccNo,Z=l.bankIban,$=l.bankSwiftCode,ee=l.MRATemplateFlag,ae=l.displayMRAFiscalisationButton,te=l.documentTemplate,ne=Object(A.b)().enqueueSnackbar,ie=Object(h.b)(),ce=Object(f.a)().user,le=Object(h.c)(k.c),re=Object(h.c)(y.c).companyList,oe=Object(x.useState)(""),se=Object(c.a)(oe,2),me=se[0],be=se[1],de=Object(x.useState)(""),je=Object(c.a)(de,2),ue=je[0],pe=je[1],Oe=Object(x.useState)(""),ge=Object(c.a)(Oe,2),ve=ge[0],xe=ge[1],he=function(){var e=Object(i.a)(r.a.mark((function e(a){var c,o,s,m,b,d,j,u,p,O,g,v,x,h,f;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(""===(null===ce||void 0===ce?void 0:ce.id)){e.next=62;break}if(a.preventDefault(),ie(Object(N.d)(!0)),""!==I){e.next=8;break}ie(Object(k.d)({counter:le.counter+1,message:"Input with star cannot be blank",variant:"error"})),ie(Object(N.d)(!1)),e.next=60;break;case 8:if(q){e.next=13;break}ie(Object(k.d)({counter:le.counter+1,message:"Please define if company is VAT registered or not",variant:"error"})),ie(Object(N.d)(!1)),e.next=60;break;case 13:if("VATR"!==(null===q||void 0===q?void 0:q.id)||_&&(!_||8===(null===_||void 0===_?void 0:_.length))){e.next=18;break}ie(Object(k.d)({counter:le.counter+1,message:"Please provide a Vat Registration Number and should be of 8 characters",variant:"error"})),ie(Object(N.d)(!1)),e.next=60;break;case 18:if(c=(c=null===l||void 0===l?void 0:l.name.replace(/\s/g,"")).toLowerCase(),o="",""===me){e.next=29;break}return s=C.c.storage().ref(),m=s.child("/photo/companyLogo/".concat(c,"/f_png/").concat(me.name)),e.next=26,m.put(me);case 26:return e.next=28,m.getDownloadURL();case 28:o=e.sent;case 29:if(b="",""===ue){e.next=38;break}return d=C.c.storage().ref(),j=d.child("/photo/companySignature/".concat(c,"/f_png/").concat(ue.name)),e.next=35,j.put(ue);case 35:return e.next=37,j.getDownloadURL();case 37:b=e.sent;case 38:if(u="",""===ve){e.next=47;break}return p=C.c.storage().ref(),O=p.child("/photo/companyStamp/".concat(c,"/f_png/").concat(ve.name)),e.next=44,O.put(ve);case 44:return e.next=46,O.getDownloadURL();case 46:u=e.sent;case 47:g={},g=""!==o?Object(n.a)(Object(n.a)({},g),{},{imageName:U,imageUrl:o}):Object(n.a)(Object(n.a)({},g),{},{imageName:U||"",imageUrl:M||""}),g=""!==b?Object(n.a)(Object(n.a)({},g),{},{imageSig:V,sigUrl:b}):Object(n.a)(Object(n.a)({},g),{},{imageSig:V||"",sigUrl:P||""}),g=""!==u?Object(n.a)(Object(n.a)({},g),{},{stampName:L,stampUrl:u}):Object(n.a)(Object(n.a)({},g),{},{stampName:L||"",stampUrl:B||""}),v=[],null===re||void 0===re||re.forEach((function(e){e.id===W&&e.name!==I?v.push(Object(n.a)(Object(n.a)({},e),{},{name:I})):v.push(e)})),v.sort(Object(T.e)("name")),x=C.b.collection("company").doc(W),h=C.b.collection("company").doc("companyIds"),(f=C.b.batch()).set(x,Object(n.a)(Object(n.a)({name:I||"",vatPercentage:D||0},g),{},{companyType:F||"",vatOrNonVatRegistered:q||null,tan:_||"",address:H||"",email:J||"",contactNumber:E||"",mobileNumber:K||"",brn:Y||"",beneficiaryName:G||"",bankName:Q||"",bankAccNo:X||"",bankIban:Z||"",bankSwiftCode:$||"",MRATemplateFlag:ee||null,displayMRAFiscalisationButton:ae||!1,documentTemplate:te||""}),{merge:!0}),f.set(h,{companyIdArray:v}),f.commit().then(Object(i.a)(r.a.mark((function e(){var a;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(T.j)(null===ce||void 0===ce?void 0:ce.id,null===ce||void 0===ce?void 0:ce.a_comp,null===ce||void 0===ce?void 0:ce.role);case 2:(a=e.sent).error?ne(a.msg||"",{variant:a.variant}):ie(Object(y.d)(a)),z&&z(),ie(Object(w.g)(void 0)),ie(Object(w.c)(void 0)),ie(Object(w.d)(void 0)),ne("Company successfully updated",{variant:"success"}),t(),ie(Object(N.d)(!1));case 11:case"end":return e.stop()}}),e)})))).catch((function(e){ne("Error occured while updating company: ".concat(null===e||void 0===e?void 0:e.message),{variant:"error"}),ie(Object(N.d)(!1))}));case 60:e.next=64;break;case 62:ne("Your session has been terminated due to greater than 30 minutes of inactivity. Please log in again.",{variant:"error"}),ie(Object(N.d)(!1));case 64:case"end":return e.stop()}}),e)})));return function(a){return e.apply(this,arguments)}}(),fe=function(e,a){if(e.preventDefault(),e.target.files&&e.target.files.length>0){var t=e.target.files[0],i=t.type;["image/jpeg","image/png"].includes(i)?"logo"===a?(be(t),S(Object(n.a)(Object(n.a)({},l),{},{imageName:t.name}))):"signature"===a?(pe(t),S(Object(n.a)(Object(n.a)({},l),{},{imageSig:t.name}))):"stamp"===a&&(xe(t),S(Object(n.a)(Object(n.a)({},l),{},{stampName:t.name}))):ie(Object(k.d)({counter:le.counter+1,message:"Sorry you should upload only images with type image/jpeg and image/png",variant:"error"}))}},ye=function(e){"signature"===e?(pe(""),S(Object(n.a)(Object(n.a)({},l),{},{imageSig:"",sigUrl:""}))):"logo"===e?(be(""),S(Object(n.a)(Object(n.a)({},l),{},{imageName:"",imageUrl:""}))):"stamp"===e&&(xe(""),S(Object(n.a)(Object(n.a)({},l),{},{stampName:"",stampUrl:""})))};return Object(R.jsx)(R.Fragment,{children:Object(R.jsxs)(o.a,{style:{width:"100%"},maxWidth:"lg",fullWidth:!0,open:a,onClose:t,children:[Object(R.jsx)(s.a,{id:"alert-dialog-title",children:"Update company"}),Object(R.jsxs)(m.a,{children:[Object(R.jsx)(b.a,{size:"small",variant:"outlined",margin:"normal",required:!0,fullWidth:!0,name:"name",label:"Name",type:"text",id:"name",value:I||"",onChange:function(e){S(Object(n.a)(Object(n.a)({},l),{},{name:e.target.value}))}}),Object(R.jsx)(b.a,{variant:"outlined",margin:"normal",fullWidth:!0,name:"vatPercentage",label:"VAT Percentahe",type:"number",id:"vatPercentage",size:"small",value:D||0,onChange:function(e){S(Object(n.a)(Object(n.a)({},l),{},{vatPercentage:e.target.value}))}}),Object(R.jsx)("div",{style:{paddingTop:"1rem"}}),Object(R.jsx)(d.a,{size:"small",variant:"outlined",fullWidth:!0,style:{marginTop:"1em"},children:Object(R.jsxs)(j.a,{size:"small",native:!0,placeholder:"Please choose a company type",value:F||"",required:!0,onChange:function(e){S(Object(n.a)(Object(n.a)({},l),{},{companyType:e.target.value}))},inputProps:{name:"companyType",id:"companyType"},children:[Object(R.jsx)("option",{value:"",children:"Please choose a Company Type *"}),Object(R.jsx)("option",{value:"Individual",children:"Individual"}),Object(R.jsx)("option",{value:"Company",children:"Company"}),Object(R.jsx)("option",{value:"Other",children:"Other"})]})}),Object(R.jsx)("div",{style:{paddingTop:"1rem"}}),Object(R.jsxs)(u.a,{children:["Upload Image Logo"," ",Object(R.jsx)("span",{style:{color:"red"},children:"(Max Size of 25 KB)"}),":"," ",U]}),Object(R.jsxs)("div",{style:{display:"flex",flexDirection:"row",alignItems:"center"},children:[Object(R.jsx)(b.a,{variant:"outlined",size:"small",fullWidth:!0,name:"image",type:"file",id:"image",accept:".png,.jpeg",onChange:function(e){return fe(e,"logo")}}),Object(R.jsx)("div",{style:{padding:"1em"}}),Object(R.jsx)(p.a,{color:"primary",variant:"contained",disabled:""===U,onClick:function(){return ye("logo")},children:"Clear"})]}),Object(R.jsx)("div",{style:{paddingTop:"1rem"}}),Object(R.jsxs)(u.a,{children:["Upload Signature Image"," ",Object(R.jsx)("span",{style:{color:"red"},children:"(Max Size of 25 KB)"}),":"," ",V]}),Object(R.jsxs)("div",{style:{display:"flex",flexDirection:"row",alignItems:"center"},children:[Object(R.jsx)(b.a,{variant:"outlined",size:"small",fullWidth:!0,name:"imageSig",type:"file",id:"imageSig",accept:".png,.jpeg",onChange:function(e){return fe(e,"signature")}}),Object(R.jsx)("div",{style:{padding:"1em"}}),Object(R.jsx)(p.a,{color:"primary",variant:"contained",disabled:""===V,onClick:function(){return ye("signature")},children:"Clear"})]}),Object(R.jsx)("div",{style:{paddingTop:"1rem"}}),Object(R.jsxs)(u.a,{children:["Upload Stamp Image"," ",Object(R.jsx)("span",{style:{color:"red"},children:"(Max Size of 25 KB)"}),":"," ",L]}),Object(R.jsxs)("div",{style:{display:"flex",flexDirection:"row",alignItems:"center"},children:[Object(R.jsx)(b.a,{variant:"outlined",size:"small",fullWidth:!0,name:"stampName",type:"file",id:"stampName",accept:".png,.jpeg",onChange:function(e){return fe(e,"stamp")}}),Object(R.jsx)("div",{style:{padding:"1em"}}),Object(R.jsx)(p.a,{color:"primary",variant:"contained",disabled:""===L,onClick:function(){return ye("stamp")},children:"Clear"})]}),Object(R.jsx)("br",{}),Object(R.jsx)("br",{}),Object(R.jsxs)(O.a,{container:!0,spacing:3,children:[Object(R.jsx)(O.a,{item:!0,xs:12,sm:6,md:4,children:Object(R.jsx)(g.a,{ListboxProps:{style:{maxHeight:"70vh",marginTop:"1.5em"}},size:"small",label:"Apply MRA Template",id:"mra-template-application-drop-down",options:[{value:!0,title:"Apply"},{value:!1,title:"Do not apply"}],value:ee,renderInput:function(e){return Object(R.jsx)(b.a,Object(n.a)(Object(n.a)({},e),{},{label:"Apply MRA Template"}))},required:!0,onChange:function(e,a,t){e.preventDefault(),"removeOption"!==t&&"clear"!==t&&a?S(Object(n.a)(Object(n.a)({},l),{},{MRATemplateFlag:a})):"removeOption"!==t&&"clear"!==t||S(Object(n.a)(Object(n.a)({},l),{},{MRATemplateFlag:null}))},getOptionLabel:function(e){return(null===e||void 0===e?void 0:e.title)||""},fullWidth:!0})}),Object(R.jsx)(O.a,{item:!0,xs:12,sm:6,md:4,children:Object(R.jsx)(g.a,{ListboxProps:{style:{maxHeight:"70vh",marginTop:"1.5em"}},size:"small",label:"Show MRA send for Fiscalisation button",id:"fiscalisation-button-display",options:[!0,!1],value:ae,renderInput:function(e){return Object(R.jsx)(b.a,Object(n.a)(Object(n.a)({},e),{},{label:"Show MRA send for Fiscalisation button"}))},required:!0,onChange:function(e,a,t){e.preventDefault(),"removeOption"!==t&&"clear"!==t&&a?S(Object(n.a)(Object(n.a)({},l),{},{displayMRAFiscalisationButton:a})):"removeOption"!==t&&"clear"!==t||S(Object(n.a)(Object(n.a)({},l),{},{displayMRAFiscalisationButton:!1}))},getOptionLabel:function(e){return!0===e?"Show":"Do not show"},fullWidth:!0})}),ce&&"super-admin"===(null===ce||void 0===ce?void 0:ce.role)?Object(R.jsx)(O.a,{item:!0,xs:12,sm:6,md:4,children:Object(R.jsx)(g.a,{ListboxProps:{style:{maxHeight:"70vh",marginTop:"1.5em"}},size:"small",label:"Document template",id:"document-template-drop-down",options:JSON.parse('["std", "transport", "slarks", "smart_promote", "flexitrans"]'),value:te,renderInput:function(e){return Object(R.jsx)(b.a,Object(n.a)(Object(n.a)({},e),{},{label:"Document template"}))},required:!0,onChange:function(e,a,t){e.preventDefault(),"removeOption"!==t&&"clear"!==t&&a?S(Object(n.a)(Object(n.a)({},l),{},{documentTemplate:a})):"removeOption"!==t&&"clear"!==t||S(Object(n.a)(Object(n.a)({},l),{},{documentTemplate:null}))},getOptionLabel:function(e){return e||""},fullWidth:!0})}):Object(R.jsx)(R.Fragment,{}),Object(R.jsx)(O.a,{item:!0,xs:12,sm:6,md:4,children:Object(R.jsx)(g.a,{ListboxProps:{style:{maxHeight:"70vh"}},size:"small",label:"VAT/Non VAT Registered",id:"transaction-type-drop-down",options:JSON.parse('[{"id":"VATR","title":"VAT Registered"},{"id":"NVTR","title":"Non VAT Registered"}]'),value:q,renderInput:function(e){return Object(R.jsx)(b.a,Object(n.a)(Object(n.a)({},e),{},{label:"VAT/Non VAT Registered"}))},required:!0,onChange:function(e,a,t){e.preventDefault(),"removeOption"!==t&&"clear"!==t&&a?S(Object(n.a)(Object(n.a)({},l),{},{vatOrNonVatRegistered:a})):"removeOption"!==t&&"clear"!==t||S(Object(n.a)(Object(n.a)({},l),{},{vatOrNonVatRegistered:null}))},getOptionLabel:function(e){return(null===e||void 0===e?void 0:e.title)||""},fullWidth:!0})}),Object(R.jsx)(O.a,{item:!0,xs:12,sm:6,md:4,children:Object(R.jsx)(b.a,{size:"small",variant:"outlined",fullWidth:!0,name:"vatRegistrationNumber",label:"VAT",type:"number",id:"vatRegistrationNumber",value:_||"",onChange:function(e){S(Object(n.a)(Object(n.a)({},l),{},{tan:e.target.value}))}})}),Object(R.jsx)(O.a,{item:!0,xs:12,sm:6,md:4,children:Object(R.jsx)(b.a,{size:"small",variant:"outlined",fullWidth:!0,name:"brn",label:"BRN",type:"text",id:"brn",value:Y||"",onChange:function(e){S(Object(n.a)(Object(n.a)({},l),{},{brn:e.target.value}))}})}),Object(R.jsx)(O.a,{item:!0,xs:12,sm:6,md:4,children:Object(R.jsx)(b.a,{size:"small",variant:"outlined",fullWidth:!0,name:"address",label:"Address",type:"text",id:"address",value:H||"",onChange:function(e){S(Object(n.a)(Object(n.a)({},l),{},{address:e.target.value}))}})}),Object(R.jsx)(O.a,{item:!0,xs:12,sm:6,md:4,children:Object(R.jsx)(b.a,{size:"small",variant:"outlined",fullWidth:!0,name:"contactNumber",label:"Contact Number",type:"text",id:"contactNumber",value:E||"",onChange:function(e){S(Object(n.a)(Object(n.a)({},l),{},{contactNumber:e.target.value}))}})}),Object(R.jsx)(O.a,{item:!0,xs:12,sm:6,md:4,children:Object(R.jsx)(b.a,{size:"small",variant:"outlined",fullWidth:!0,name:"mobileNumber",label:"Mobile Number",type:"text",id:"mobileNumber",value:K||"",onChange:function(e){S(Object(n.a)(Object(n.a)({},l),{},{mobileNumber:e.target.value}))}})}),Object(R.jsx)(O.a,{item:!0,xs:12,sm:6,md:4,children:Object(R.jsx)(b.a,{size:"small",variant:"outlined",fullWidth:!0,name:"email",label:"Email",type:"text",id:"email",value:J||"",onChange:function(e){S(Object(n.a)(Object(n.a)({},l),{},{email:e.target.value}))}})}),Object(R.jsx)(O.a,{item:!0,xs:12,sm:6,md:4,children:Object(R.jsx)(b.a,{size:"small",variant:"outlined",fullWidth:!0,name:"beneficiaryName",label:"Beneficiary name",type:"text",id:"beneficiaryName",value:G||"",onChange:function(e){S(Object(n.a)(Object(n.a)({},l),{},{beneficiaryName:e.target.value}))}})}),Object(R.jsx)(O.a,{item:!0,xs:12,sm:6,md:4,children:Object(R.jsx)(b.a,{size:"small",variant:"outlined",fullWidth:!0,name:"bankName",label:"Bank name",type:"text",id:"bankName",value:Q||"",onChange:function(e){S(Object(n.a)(Object(n.a)({},l),{},{bankName:e.target.value}))}})}),Object(R.jsx)(O.a,{item:!0,xs:12,sm:6,md:4,children:Object(R.jsx)(b.a,{size:"small",variant:"outlined",fullWidth:!0,name:"bankAccNo",label:"Bank Acc No",type:"text",id:"bankAccNo",value:X||"",onChange:function(e){S(Object(n.a)(Object(n.a)({},l),{},{bankAccNo:e.target.value}))}})}),Object(R.jsx)(O.a,{item:!0,xs:12,sm:6,md:4,children:Object(R.jsx)(b.a,{size:"small",variant:"outlined",fullWidth:!0,name:"bankIban",label:"Bank IABN",type:"text",id:"bankIban",value:Z||"",onChange:function(e){S(Object(n.a)(Object(n.a)({},l),{},{bankIban:e.target.value}))}})}),Object(R.jsx)(O.a,{item:!0,xs:12,sm:6,md:4,children:Object(R.jsx)(b.a,{size:"small",variant:"outlined",fullWidth:!0,name:"bankSwiftCode",label:"Bank Swift Code",type:"text",id:"bankSwiftCode",value:$||"",onChange:function(e){S(Object(n.a)(Object(n.a)({},l),{},{bankSwiftCode:e.target.value}))}})})]})]}),Object(R.jsxs)(v.a,{children:[Object(R.jsx)(p.a,{onClick:function(e){return he(e)},color:"primary",variant:"contained",children:"Update"}),Object(R.jsx)(p.a,{onClick:t,color:"error",variant:"outlined",children:"Cancel"})]})]})})}}}]);
//# sourceMappingURL=95.543dba6d.chunk.js.map
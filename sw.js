if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let l={};const o=e=>i(e,t),u={module:{uri:t},exports:l,require:o};s[t]=Promise.all(n.map((e=>u[e]||o(e)))).then((e=>(r(...e),l)))}}define(["./workbox-5ffe50d4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-iqkmqcNt.css",revision:null},{url:"assets/index-QLjIaqAi.js",revision:null},{url:"assets/index.es-D9zFyhYR.js",revision:null},{url:"assets/react-B3v7JCnE.js",revision:null},{url:"assets/ukr-DMEi-le4.js",revision:null},{url:"index.html",revision:"3f99f1645b1a8ba67219ac8e30111dda"},{url:"registerSW.js",revision:"7d342873385b2fee54db87bd63409c99"},{url:"manifest.webmanifest",revision:"58c0c481340a5e2f2cc4aac34866122f"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));

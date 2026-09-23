<template><span class="skeleton-block" aria-hidden="true"></span></template>
<style scoped>
.skeleton-block{display:block;position:relative;overflow:hidden;isolation:isolate;background:#ebe5dc;border-radius:4px;min-height:10px;width:100%}
.skeleton-block::after{content:"";position:absolute;inset:0;background:linear-gradient(100deg,transparent 15%,#ffffff70 48%,transparent 80%);transform:translateX(-100%);animation:skeleton-sweep 1.9s ease-in-out infinite}
@keyframes skeleton-sweep{to{transform:translateX(100%)}}
@media(prefers-reduced-motion:reduce){.skeleton-block::after{animation:none;display:none}}
</style>

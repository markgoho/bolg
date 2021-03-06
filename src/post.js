function setBookmark() {
  // var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
  const body = document.body;
  const html = document.documentElement;
  const documentHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
  const postMeta = document.querySelector('meta[property="id"]');
  const postId = postMeta ? postMeta.getAttribute('content') : null;
  const scrollPosition = window.pageYOffset || html.scrollTop;
  const scrollPercent = scrollPosition / documentHeight;

  if (!window.localStorage) return;
  
  window.localStorage.setItem('bookmark', JSON.stringify({
    scrollPercent,
    url: window.location.href,
    postId,
  }));
}
window.onload = function onLoad() {
  window.onbeforeunload = setBookmark;
  window.onunload = setBookmark;
}

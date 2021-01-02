var data = "";

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function() {
  if(this.readyState === 4) {
    console.log(this.responseText);
  }
});

xhr.open("DELETE", "127.0.0.1:3000/books/9781788619");
xhr.setRequestHeader("Authorization", "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmVkZjhmMmRmODAzNjBmNjAzZDYwZTkiLCJpYXQiOjE2MDk1NDU2MzksImV4cCI6MTYxMDE1MDQzOX0.VEnHkNiX33rBKJ_wgVd4x3XX3srdvq-9LO19ih-d4Bw");
xhr.setRequestHeader("", "");

xhr.send(data);
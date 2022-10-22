// This function is called when any image tag fails to load.
function fixMIME(img)
{

  // First of all, try to guess the MIME type based on the file extension.
  var mime;
  switch (img.src.toLowerCase().slice(-4))
  {
    case ".svg": case "svgz": mime = "svg+xml"; break;
    default: return;
  }

  // Attempt to download the image data via an XMLHttpRequest.
  var xhr = new XMLHttpRequest();
  xhr.onload = function()
  {
    // Blob > ArrayBuffer: http://stackoverflow.com/a/15981017/4200092
    var reader = new FileReader();
    reader.onload = function()
    {
      // TypedArray > Base64 text: http://stackoverflow.com/a/12713326/4200092
      var data = String.fromCharCode.apply(null, new Uint8Array(this.result));
      img.src = "data:image/" + mime + ";base64," + btoa(data);
    };
    reader.readAsArrayBuffer(this.response);
  };
  xhr.open("get", img.src, true);
  xhr.responseType = "blob";
  xhr.send();

}

// Fix all images on page
document.addEventListener("DOMContentLoaded", function() {
  var t = document.getElementsByTagName("img");
  for (var i = 0; i < t.length; ++i) { fixMIME(t[i]); }
}, false);

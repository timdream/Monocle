Monocle.Dimensions.VerticalWriting = function (pageDiv) {

  var API = { constructor: Monocle.Dimensions.VerticalWriting }
  var k = API.constants = API.constructor;
  var p = API.properties = {
    page: pageDiv,
    reader: pageDiv.m.reader,
    dirty: true
  }


  function initialize() {
    p.reader.listen('monocle:componentchange', componentChanged);
  }


  function hasChanged() {
    //TBD
    return true;
  }


  function measure() {
    //TBD
  }


  function pages() {
    //TBD
    return 1;
  }


  function percentageThroughOfId(id) {
    //TBD
    return 0;
  }


  function componentChanged(evt) {
    if (evt.m['page'] != p.page) { return; }
    var doc = evt.m['document'];
    Monocle.Styles.applyRules(doc.body, k.BODY_STYLES);

    // BROWSERHACK: WEBKIT bug - iframe needs scrollbars explicitly disabled.
    if (Monocle.Browser.is.WebKit) {
      doc.documentElement.style.overflow = 'hidden';
    }

    // Inject Taketori script
    var s = doc.createElement('script');
    s.src = Monocle.Dimensions.VerticalWriting.TaketoriURL;
    doc.body.appendChild(s);

    var opts = Monocle.Dimensions.VerticalWriting.TaketoriOptions;
    //opts.height = p.page.m.sheafDiv.clientHeight.toString(10) + 'px';
    opts.height = doc.defaultView.innerHeight.toString(10) + 'px';
    opts.toggleable = false;

    // Invoke Taketori when ready
    var t = window.setInterval(
      function () {
        if (!doc.defaultView.Taketori) return;
        window.clearTimeout(t);
        var o = doc.createElement('div');
        o.style.width = '100%';
        o.style.height = '100%';
        while (doc.body.firstChild) {
          o.appendChild(doc.body.firstChild);
        }
        o.id = 'taketori-body';
        doc.body.appendChild(o);
        (new doc.defaultView.Taketori()).set(opts).element('taketori-body').toVertical(false);

      },
      20
    );

    p.dirty = true;
  }

  function locusToOffset(locus) {
    //TBD
    return 0;
  }


  function translateToLocus(locus) {
    //TBD
    return 0;
  }


  API.hasChanged = hasChanged;
  API.measure = measure;
  API.pages = pages;
  API.percentageThroughOfId = percentageThroughOfId;

  API.locusToOffset = locusToOffset;
  API.translateToLocus = translateToLocus;

  initialize();

  return API;
}


Monocle.Dimensions.VerticalWriting.BODY_STYLES = {
  "position": "absolute",
  "height": "100%"
}

Monocle.Dimensions.VerticalWriting.TaketoriURL = '';
Monocle.Dimensions.VerticalWriting.TaketoriOptions = {};

if (Monocle.Browser.has.iframeDoubleWidthBug) {
  Monocle.Dimensions.VerticalWriting.BODY_STYLES["min-width"] = "200%";
} else {
  Monocle.Dimensions.VerticalWriting.BODY_STYLES["width"] = "100%";
}

/* Overwrite default style rules in Reader since we are not using columns 
 * and max-width should not applied to rotated blocks.
 */
Monocle.Reader.DEFAULT_STYLE_RULES = [
//  "html * {" +
//    "text-rendering: auto !important;" +
//    "word-wrap: break-word !important;" +
//  "}" +
  "body {" +
    "margin: 0 !important;" +
    "padding: 0 !important;" +
    "-webkit-text-size-adjust: none;" +
  "}"// +
//  "img, video, object {" +
//    "max-height: 90% !important;" +
//  "}"
];

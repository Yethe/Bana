(function(funcName, baseObj) {
    // The public function name defaults to window.docReady
    // but you can pass in your own object and own function name and those will be used
    // if you want to put them in a different namespace
    funcName = funcName || "docReady";
    baseObj = baseObj || window;
    var readyList = [];
    var readyFired = false;
    var readyEventHandlersInstalled = false;

    // call this when the document is ready
    // this function protects itself against being called more than once
    function ready() {
        if (!readyFired) {
            // this must be set to true before we start calling callbacks
            readyFired = true;
            for (var i = 0; i < readyList.length; i++) {
                // if a callback here happens to add new ready handlers,
                // the docReady() function will see that it already fired
                // and will schedule the callback to run right after
                // this event loop finishes so all handlers will still execute
                // in order and no new ones will be added to the readyList
                // while we are processing the list
                readyList[i].fn.call(window, readyList[i].ctx);
            }
            // allow any closures held by these functions to free
            readyList = [];
        }
    }

    function readyStateChange() {
        if ( document.readyState === "complete" ) {
            ready();
        }
    }

    // This is the one public interface
    // docReady(fn, context);
    // the context argument is optional - if present, it will be passed
    // as an argument to the callback
    baseObj[funcName] = function(callback, context) {
        if (typeof callback !== "function") {
            throw new TypeError("callback for docReady(fn) must be a function");
        }
        // if ready has already fired, then just schedule the callback
        // to fire asynchronously, but right away
        if (readyFired) {
            setTimeout(function() {callback(context);}, 1);
            return;
        } else {
            // add the function and context to the list
            readyList.push({fn: callback, ctx: context});
        }
        // if document already ready to go, schedule the ready function to run
        if (document.readyState === "complete") {
            setTimeout(ready, 1);
        } else if (!readyEventHandlersInstalled) {
            // otherwise if we don't have event handlers installed, install them
            if (document.addEventListener) {
                // first choice is DOMContentLoaded event
                document.addEventListener("DOMContentLoaded", ready, false);
                // backup is window load event
                window.addEventListener("load", ready, false);
            } else {
                // must be IE
                document.attachEvent("onreadystatechange", readyStateChange);
                window.attachEvent("onload", ready);
            }
            readyEventHandlersInstalled = true;
        }
    }
})("docReady", window);


docReady(function() {

  pagemap(document.querySelector('#map'), {
      viewport: null,
      styles: {
          // 'h1': `rgba(0,0,0,0.10)`,
          '.selected .plant': 'rgba(230,111,0,0.5)', // 199, 212, 116
          '.plant': 'rgba(199,212,116,0.5)', // 199, 212, 116
          '.intro': 'rgba(92,148,187,0.2)' // 199, 212, 116
      },
      back: 'rgba(46,74,93,0.03)', // 92, 148, 187
      view: 'rgba(46,74,93,0.10)', // 92, 148, 187
      drag: 'rgba(0,0,0,0.13)',
      interval: null
  });

  const tobi = new Tobi({docClose: false});

  if(window.location.hash !== '') {
    const el = document.querySelector(window.location.hash);
    if (el && el.classList) {
      el.parentElement.parentElement.classList.add("selected");
    }
  }
});


// Go to stuff

/* These are the modifications: */
history.pushState = ( f => function pushState(){
    var ret = f.apply(this, arguments);
    window.dispatchEvent(new Event('pushstate'));
    window.dispatchEvent(new Event('locationchange'));
    return ret;
})(history.pushState);

history.replaceState = ( f => function replaceState(){
    var ret = f.apply(this, arguments);
    window.dispatchEvent(new Event('replacestate'));
    window.dispatchEvent(new Event('locationchange'));
    return ret;
})(history.replaceState);

window.addEventListener('popstate',()=>{
    window.dispatchEvent(new Event('locationchange'))
});

window.addEventListener('locationchange', function(){

    var pastSelected = document.getElementsByClassName('selected');
    [].forEach.call(pastSelected, function(el) {
      el.classList.remove("selected");
    });

    const el = document.querySelector(window.location.hash);
    if (el && el.classList) {
      el.parentElement.parentElement.classList.add("selected");
    }
})

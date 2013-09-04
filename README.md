# Kern.js

fork of v2 (by wturrell)  
The aim of this is to fix a few bugs and generally improve the UX / reduce friction. Feedback welcome!

### How to Use

- Create a bookmarklet with the URL

`javascript:(function(){document.body.appendChild(document.createElement('script')).src='http://wturrell.github.com/kern.js/kern.js';})();`

- Browse to page you want to adjust (ensure it has jQuery loaded)
- Launch bookmarklet
- Click on the text you want to adjust (can be headings and certain other tags, captions, quotes etc.)
- Adjust kerning, size, line height, absolute position and rotation for each character
- Generate HTML and CSS code needed
- Press `?` for help

KernJS emulates what lettering.JS does, but you don't need lettering.JS installed to be able to use it. You have a choice between using lettering.JS to create `span` tags for individual letters on page load, or 
including them in your actual HTML.

### Changelog

*Wed 4 Sep 2013*

- `[` and `]` keyboard shortcuts for moving to previous/next character
- Character you are currently editing is highlighted
- Highlight text that can be edited when you hover over it
- `?` shows help window
- Code improvements

*Tue 3 Sep 2013*

- Bugfix: you can now select headings in top 65 pixels of page (used to be stuck behind kernjs controls)
- compatible with extra tags (not just `h1` to `h6`) — `li`,`p`,`strong`,`em`,`b`,`label`,`address`,`figcaption`,`blockquote`,`cite` and `legend`
- Press `m` to *m*ove the controls out of the way (toggle between top and bottom of page)
- cursor changes to drag and drop icon over characters than can be moved

*Mon 2 Sep 2013*

- now compatible with jQuery v1.10 (as per RichardHabeeb's fork)
- help text below controls and hover over the buttons to see description and keyboard shortcut
- Press `g` to show *g*enerated CSS
- Press `esc` to dismiss generated code window (as well as clicking elsewhere on page)
- alert dialog if you try and run kern.js on a page without jQuery loaded
- Use `j` or `k` or left and right arrow keys to adjust kerning by one pixel
- press `x` to toggle between ems and pixels in generated CSS
- HTML/CSS box taller to reduce scrolling
- Don't use `vertical-align: top` for characters that only have simple kerning
- shows all the HTML you need (I *think* this used to be there),  not just CSS. e.g. `<span class="char1">A</span>`
- Fixed: bounding box round element shown in correct position if page has been scrolled, also matches size of element (hardcoded margins often gave unpredicatable results)
- Fixed: Double click textarea selects all code, not just current line

### Browser Compatibility

- Early days - tested in Chrome (29.0.1547.62) and Firefox (23.0.1) for Mac.

### Known issues
- Does not work if the selected element contains any other HTML tags (such as line breaks, spans, etc).
- Not compatible with Opera (seemingly ignores click/mousedown/mouseup events, also `unselectable="on"` attribute - ideas welcome).
- Button positioning in Firefox

# Kern.js

fork of v2 (by wturrell)  
The aim of this is to fix a few bugs and generally improve the UX / reduce friction. Feedback welcome!

### How to Use

- Create a bookmarklet 
- Browse to page you want to adjust (ensure it has jQuery loaded)
- Launch bookmarklet
- Click on the text you want to adjust (can be headings and certain other tags, captions, quotes etc.)
- Box will appear around text
- Adjust kerning, size, line height, absolute position and rotation for each character
- Generate HTML and CSS code needed

### Changelog

*Mon 2 Sep 2013*

- now compatible with jQuery v1.10 (as per RichardHabeeb's fork)
- help text below controls and hover over the buttons to see description and keyboard shortcut
- Press `g` to show generated CSS
- Press `esc` to dismiss generated code window (as well as clicking elsewhere on page)
- alert dialog if you try and run kern.js on a page without jQuery loaded
- Use `j` or `k` or left and right arrow keys to adjust kerning by one pixel
- press `x` to quickly toggle between ems and pixels in generated CSS
- HTML/CSS box is taller to reduce scrolling
- should be compatible with extra tags: just `h1` to `h6`) — `address`,`figcaption`,`blockquote`,`caption`,`label` and `legend`
- Don't use `vertical-align: top` for characters that only have simple kerning
- shows all the HTML you need (I *think* this used to be there),  not just CSS. e.g. `<span class="char1">A</span>`
- Fixed: bounding box round element shown in correct position if page has been scrolled, also matches size of element (hardcoded margins often gave unpredicatable results)
- Fixed: Double click textarea selects all code, not just current line

### Browser Compatibility

- Early days - tested in Chrome (29.0.1547.62) and Firefox (23.0.1) for Mac. Still doesn't work with Opera.

### Known issues
- Does not work if the selected element contains any other HTML tags (such as line breaks, spans, etc).

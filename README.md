##contenteditable simple solution

####ContentEditable Weirdness with Blaze.

Many developers experienced problems working with editable DOM elements (i.e. where contentEditable=="true"). The main issue is repeated text fragments in multiline content. The problem is illustrated by @serviewcare [here](https://github.com/serviewcare/contenteditable).

Various attempts to fix the issue, including deleting added nodes appeared to be only temporary workarounds due to changes in Blaze API and behaviour. [The solution](https://github.com/eluck/contenteditable) by @eluc focused on the link between editable content nodes and $blaze_range object. I analyzed the data structure created by Blaze and here are my findings:
* content of editable element is a collection of nodes
* when the content is rendered by Blaze each node is added to DOMrange.members collection
* $blaze_range reference is added to node
* no such link is created when content is added by users 
* it is possible to add the link using $blaze_range.addMember method. 
* We could use this to solve the problem, but I couldn't find correct blaze_range reference when content consists of a single line of text. **Please, let me know if you know how to get this reference.**  

I changed the template structure and its helpers so that I can always get the $blaze_range, but it appeared that much simpler than manipulating the DOMrange collection is *isolating editable content from Blaze generated DOM elements*:

1. simplify the template so the entire editable element with its content is provided by single helper.
```
<template name="contenteditable">
  <h1>Content Editable Test</h1>
  <h3 tabindex=0>Click in the box below, type some multi-lined content, and then click out of it.</h3>
  {{#with content}}
    {{{editable}}}
  {{/with}}
</template>
```
2. create new "editable" helper: 
```
Template.contenteditable.editable = function () {
  return '<div class="cr-note" contenteditable="true" tabindex=0>' + this.note + '</div>';
};
```

This way blaze_range does not reference the content but the **div.cr-note** element. Content can be saved and is reactively updated when data source is changed. 


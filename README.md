##contenteditable simple solution

####ContentEditable Weirdness with Blaze.

Many developers experienced problems working with editable DOM elements (i.e. where contentEditable=="true"). The main issue is repeated text fragments in multiline content. The problem is described in [issue 1964](https://github.com/meteor/meteor/issues/1964) and illustrated by @serviewcare [here](https://github.com/serviewcare/contenteditable).

Various attempts to fix the issue, including deleting added nodes appeared to be only temporary workarounds due to changes in Blaze API and behaviour. [The solution](https://github.com/eluck/contenteditable) by @eluc focused on the link between editable content nodes and `Blaze.DOMRange` object. Here are the findings of the data structure and behaviour of editable content element:
* content of editable element is a collection of any variaty of nodes (e.g. Chrome and Firefox DOM structures are different) 
* when the content is rendered by Blaze each node is added to `DOMRange.members` collection (`$blaze_range` reference is added to nodes, except text nodes) 
* any content added by users is not in members collection (and has no `$blaze_range` reference)
* it is possible to add or remove the link using `DOMRange.addMember` and `DOMRange.removeMember` methods
* `DOMRange.setMembers` is also available to replace entire members collection in one go
* reference to _DOMRange representing the content can be get in helper or event handler with `Blaze.currentView._domrange`.

DOMRange methods can be used to solve the original problem, integrate external packages or develop a custom collaborative editor. 

There is much simpler way to assure the content is saved and updated reactively correctly. **We can isolate editable content from Blaze generated DOM elements using this method**:

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


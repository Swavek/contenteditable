Content = new Meteor.Collection('content');

if(Meteor.isServer) {
	var content = Content.findOne();
	if(content == null)
	   content = Content.insert({note: 'Type some multiline content here.'})
}

if (Meteor.isClient) {

  Template.contenteditable.content = function () {
	return Content.findOne();
  };

  Template.contenteditable.events( {
    
	'focus div.cr-note': function( evt) {
		evt.stopPropagation();
		Editor.Edit( this, evt.target);
	},
	
    'blur div.cr-note':  function( evt) {
		evt.stopPropagation();	
		Editor.Save( this, evt.target);
	}
	 
  } );

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

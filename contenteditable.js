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

  Template.contenteditable.editable = function () {
  	return '<div class="cr-note" contenteditable="true" tabindex=0>' + this.note + '</div>';
  };

  Template.contenteditable.events( {
    	
    'blur div.cr-note':  function( evt) {
		var content = $( evt.target).html();		
		Content.update( this._id, 
			{ 
				$set: { note: content} 
			} 
		);
	}
	 
  } );

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

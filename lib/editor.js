
Editor = {	

	//cached list of currently focused element nodes 
	Delta: [],

	//cache original nodes of target element
	Cache: function( target) {
		this.Delta = [];

		//save each node reference, NOT reference to childNodes 
		var nodes = target.childNodes;
		for( var i = 0; i < nodes.length; i++) {
			this.Delta.push( nodes[ i] );
		}
	},

	//makes target content editable
	//is executed when target gets focus
	Edit: function( item, target) {
		if( !target.isContentEditable) {
			target.contentEditable = 'true';

			//cache blaze nodes
			this.Cache( target);						
		}
	},

	//finds non-blaze nodes to be removed after content save 
	Prune: function( target) {
		var nodes = target.childNodes;
		var delta = this.Delta;
		var gamma = [];
		for( var i = 0; i < nodes.length; i++) {
			var node = nodes[ i];
			if( !_.contains( delta, node ) ) {
				gamma.push( node );
			} 
			//delta nodes list should include non-blaze nodes for future
			delta.push( node );
		}

		return gamma; 
	},

	//saves the target element contents
	//is executed when target loses focus
	Save: function( data, target) {
		if( !target.isContentEditable) return;
		
		target.contentEditable = 'inherit';
		var content = $( target).html();
		
		var gamma = this.Prune( target);
		Content.update( data._id, 
			{ 
				$set: { note: content} 
			}, 
			//clear non-blaze nodes after succesful update
			function() {
				for( var i = 0; i < gamma.length; i++) {
					target.removeChild( gamma[ i] );
				}
			} 
		);
	}
}

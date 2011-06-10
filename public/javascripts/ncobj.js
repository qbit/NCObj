$( document ).ready( function() {
	$( '#submit' ).click( function() {
		var o = {};
		$( '#form :input' ).each( function() {
			if ( this.name !== '' ) o[this.name] = $(this).val();
		});

		$.post( '/', o, function( data ) {
			console.log( data );
		});

		return false;
	});
});

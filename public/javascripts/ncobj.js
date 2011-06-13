$( document ).ready( function() {
	$( '#msg' ).html( 'Please wait... Generating obj file....' );
	$( '#msg' ).hide();
	$( '#submit' ).click( function() {
		var o = {};
		$( '#form :input' ).each( function() {
			if ( this.name !== '' ) o[this.name] = $(this).val();
		});

		$( '#msg' ).show( 'slow' );

		$.post( '/', o, function( data ) {
			$( '#msg' ).hide( 'slow' );
			$( '#dl' ).show( 'slow' );
			var l = $( '<ul>' );
			for ( var d in data ) {
				l.append( $( '<li>' ).append( $( '<a>' ).attr( 'href', data[d] ).html( data[d] ) ) );
			}
			$( '#dl' ).append( l );
		});

		return false;
	});
});

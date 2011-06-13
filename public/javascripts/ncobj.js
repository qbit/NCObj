$( document ).ready( function() {
	$( '#msg' ).html( 'Please wait... Generating obj file....' );
	$( '#submit' ).click( function() {
		var o = {};
		$( '#form :input' ).each( function() {
			if ( this.name !== '' ) o[this.name] = $(this).val();
		});

		$( '#msg' ).show( 'slow' );

		$.post( '/', o, function( data ) {
			$( '#msg' ).hide( 'slow' );
			$( '#dl' ).show( 'slow' );
			for ( var d in data ) {
				$( '#dl' ).append( $( '<a>' ).attr( 'href', data[d] ).html( data[d] ) );
				$( 'dl' ).append( $( '<br>' ));
			}
		});

		return false;
	});
});

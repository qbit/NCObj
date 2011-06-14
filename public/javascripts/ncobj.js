$( document ).ready( function() {
	$( '#msg' ).hide();
	$( '#submit' ).click( function() {
		var o = {};
		$( '#overlay' ).addClass( 'fullscreen' );
		$( '#overlay' ).show();
		$( '#form :input' ).each( function() {
			if ( this.name === 'overwrite' ) {
				if ( $( this ).is( ":checked" ) ) {
					o[this.name] = '1';
				} else {
					o[this.name] = '0';
				}
			} else {
				if ( this.name !== '' ) o[this.name] = $(this).val();
			}
		});

		$( '#msg' ).show( 'slow' );

		$.post( '/', o, function( data ) {
			$( '#overlay' ).removeClass( 'fullscreen' );
			$( '#overlay' ).hide();
			$( '#msg' ).hide( 'slow' );
			$( '#dl' ).html('').show( 'slow' );
			var l = $( '<ul>' );
			console.log( data );
			for ( var d in data ) {
				var style = "mtl";
				if ( d === 'objFile' ) style = "obj";
				l.append( $( '<li>' ).addClass( style ).append( $( '<a>' ).attr( 'href', data[d] ).html( data[d] ) ) );
			}
			$( '#dl' ).append( l );
		});

		return false;
	});
});

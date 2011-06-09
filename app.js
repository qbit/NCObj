var config = {
	world: "/home/mine/minecraft_server/world",
	mcobj: __dirname + '/mcobj',
	cpu: 2,
	size: 20,
	output_base: __dirname + '/tmp/',
	debug: true
};

var express = require( 'express' );
var app = module.exports = express.createServer( );

app.configure( function( ){
	app.set( 'views', __dirname + '/views' );
	app.set( 'view engine', 'jade' );
	app.use( express.bodyParser( ) );
	app.use( express.methodOverride( ) );
	app.use( app.router );
	app.use( express.static( __dirname + '/public' ) );
});

app.get( '/', function( req, res ){
	res.render( 'index' );
});

app.post( '/', function( req, res ) {
	var x = req.body.loc.x / 16,
		y = req.body.loc.y / 16,
		z = req.body.loc.z / 16,
		size = req.body.size || config.size;
	if ( config.debug ) console.log( "X: %d, Y: %d: Z: %d", x, y, z );


});

app.listen( 3000 );
console.log( "NCObj listening on port %d", app.address( ).port );

var config = {
	world: "/home/mine/minecraft_server/world",
	mcobj: __dirname + '/bin/mcobj',
	cpu: 2,
	size: 20,
	output_base: __dirname + '/tmp/',
	debug: true
};

var exec = require( 'child_process' ).exec;
var fs = require( 'fs' );
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
		s = req.body.size || config.size;
	if ( config.debug ) console.log( "X: %d, Y: %d: Z: %d", x, y, z );
	var cmd = config.mcobj + " -x="+x+" -y="+y+" -z="+z+" -s="+s+" -o="+config.output_base + "asdf.obj";
	console.log( "'%s'", cmd );
	var child = exec( cmd, function( error, stdout, stdin ) {
		if ( error )  {
			console.log( error );
			return error;
		} else {
			fs.readFile( config.output_base + 'asdf.obj', function( err, data ) {
				if ( err ) return res.render( '404' );
				res.writeHead( 200, { 'Content-Type': 'text/plain' } );
				res.end( data, 'utf8' );
			});
		}
	});
});

app.listen( 3000 );
console.log( "NCObj listening on port %d", app.address( ).port );

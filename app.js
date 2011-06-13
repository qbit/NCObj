#!/usr/bin/env node

var config = {
	world: "/home/mine/minecraft_server/world",
	mcobj: __dirname + '/bin/mcobj',
	cpu: 2,
	size: 20,
	output_base: __dirname + '/public/tmp/',
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
	app.use( express.cookieParser( ) );
	app.use( express.session( { secret: "mcpewpew" } ));
	app.use( express.methodOverride( ) );
	app.use( app.router );
	app.use( express.static( __dirname + '/public' ) );
});

app.get( '/', function( req, res ){
	res.render( 'index' );
});

app.post( '/', function( req, res ) {

	var error = {};

	var x = Math.floor( req.body.x / 16 ),
		y = Math.floor( req.body.y / 16 ),
		z = Math.floor( req.body.z / 16 ),
		s = req.body.size || config.size;

	if ( isNaN( x ) ) error.x = true;
	if ( isNaN( y ) ) error.y = true;
	if ( isNaN( z ) ) error.z = true;
	if ( isNaN( s ) ) error.s = true;

	if ( config.debug ) console.log( "X: %d, Y: %d: Z: %d", x, y, z );
	
	if ( error.x || error.y || error.z || error.s ) {
		res.writeHead( 200, { 'Content-Type': 'text/plain' } );
		res.end( error );
	} else {
		var cmd = [
			config.mcobj,
			"-x=" + x,
			"-y=" + y,
			"-z=" + z,
			"-cpu=" + config.cpu,
			"-cx=" + x,
			"-cz=" + z,
			"-s=" + s,
			"-o=" + config.output_base + req.session.lastAccess + ".obj",
			config.world
		].join( " " );


		if ( config.debug ) console.log( "Command is: '%s'", cmd );

		var child = exec( cmd, function( error, stdout, stdin ) {
			if ( error )  {
				console.log( error );
				return error;
			} else {
				var d = {};
				d.objFile = '/tmp/' + req.session.lastAccess + '.obj';
				d.mtlFile = '/tmp/' + req.session.lastAccess + '.mtl';
				console.log( d );
				res.writeHead( 200, { 'Content-Type': 'application/json' } );
				res.end( JSON.stringify( d ) );
				// fs.readFile( config.output_base + req.session.lastAccess + '.obj', function( err, data ) {
				// 	if ( err ) return res.render( '404' );
				// 	res.writeHead( 200, { 'Content-Type': 'text/plain' } );
				// 	res.end( data, 'utf8' );
				// });
			}
		});
	}
});

app.listen( 3000 );
console.log( "NCObj listening on port %d", app.address( ).port );

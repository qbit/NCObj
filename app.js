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

function has_existing( fb ) {
	var ret = false;
	var files = fs.readdirSync( config.output_base ); 
	for ( var i = 0, len = files.length; i < len; i++ ) {
		if ( files[i] === fb + '.obj' ) ret = true ;
	}
	return ret;
}

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

	var overwrite = req.body.overwrite;

	if ( isNaN( x ) ) error.x = true;
	if ( isNaN( y ) ) error.y = true;
	if ( isNaN( z ) ) error.z = true;
	if ( isNaN( s ) ) error.s = true;

	if ( config.debug ) console.log( "X: %d, Y: %d: Z: %d OVERWRITE: %s", x, y, z, overwrite );
	
	if ( error.x || error.y || error.z || error.s ) {
		res.writeHead( 200, { 'Content-Type': 'text/plain' } );
		res.end( error );
	} else {

		var file_name = "output" + x + y + z + s;

		var cmd = [
			config.mcobj,
			"-x=" + x,
			"-y=" + y,
			"-z=" + z,
			"-cpu=" + config.cpu,
			"-cx=" + x,
			"-cz=" + z,
			"-s=" + s,
			"-o=" + config.output_base + file_name + ".obj",
			config.world
		].join( " " );


		if ( config.debug ) console.log( "Command is: '%s'", cmd );

		if ( has_existing( file_name ) && ! overwrite ) {
			if ( config.debug ) console.log( "Sending existing files: %s", file_name );
			var d = {};
			d.objFile = '/tmp/' + file_name + '.obj';
			d.mtlFile = '/tmp/' + file_name + '.mtl';

			res.writeHead( 200, { 'Content-Type': 'application/json' } );
			res.end( JSON.stringify( d ) );
		} else {
			if ( config.debug ) console.log( "Generating new files: %s", file_name );
			var child = exec( cmd, function( error, stdout, stdin ) {
				if ( error )  {
					console.log( error );
					return error;
				} else {
					var d = {};
					d.objFile = '/tmp/' + file_name + '.obj';
					d.mtlFile = '/tmp/' + file_name + '.mtl';

					res.writeHead( 200, { 'Content-Type': 'application/json' } );
					res.end( JSON.stringify( d ) );
				}
			});
		}
	}
});

app.listen( 3000 );
console.log( "NCObj listening on port %d", app.address( ).port );

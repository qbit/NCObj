#!/usr/bin/env node

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

	var error = {};

	if ( ! req.body.x.match( /^[-+]?[0-9]+(\.[0-9]+)?$|^[-]?[0-9]+$/ ) ) error.x = true;
	if ( ! req.body.y.search( /^[-+]?[0-9]+(\.[0-9]+)?$|^[-]?[0-9]+$/ ) ) error.y = true;
	if ( ! req.body.z.search( /^[-+]?[0-9]+(\.[0-9]+)?$|^[-]?[0-9]+$/ ) ) error.z = true;
	if ( ! req.body.size.search( /^[-+]?[0-9]+$/ ) ) error.s = true;

	if ( error.x || error.y || error.z || error.s ) {
		console.log( error );
		res.writeHead( 200, { 'Content-Type': 'text/plain' } );
		return res.end( [ error ] );
	}
	
	var x = Math.floor( req.body.x / 16 ),
		y = Math.floor( req.body.y / 16 ),
		z = Math.floor( req.body.z / 16 ),
		s = req.body.size || config.size;

	if ( config.debug ) console.log( "X: %d, Y: %d: Z: %d", x, y, z );
	
	var cmd = [
		config.mcobj,
		"-x=" + x,
		"-y=" + y,
		"-z=" +z,
		"-cpu=" + config.cpu,
		"-cx=" + x,
		"-cz=" + z,
		"-o=" + config.output_base + "asdf.obj",
		config.world
	].join( " " );


	if ( config.debug ) console.log( "Command is: '%s'", cmd );

	var child = exec( cmd, function( error, stdout, stdin ) {
		if ( config.debug ) console.log( stdout );
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

const express = require( 'express' );
const { isWebUri } = require( 'valid-url' );
const { getScreenShot } = require( './screenshot.js' );
const { getErroImage } = require( '../utils/helperUtils.js' );
const app = express();

const port = process.env.PORT || 3000;

app.use( ( req, res, next ) => {
    res.setHeader( 'Content-Type', 'application/json' );

    console.log( `incoming request: ${req.method} : ${req.protocol}://${req.hostname}${req.path}` ); // eslint-disable-line

    next();
} );


app.get( '/', async ( req, res ) => {
    res.setHeader( 'Content-Type', 'image/jpeg' );
    const { url, w, h, q } = req.query;

    // url is set as parameter and the url is a valid url
    if ( url && !isWebUri( url ) ) {
        const image = getErroImage( 'url-not-valid' );
        res.write( image );

        res.end();

        return;
    }

    const image = await getScreenShot( url, {
        width   : parseInt( w, 10 ),
        height  : parseInt( h, 10 ),
        quality : parseInt( q, 10 ),
    } );

    res.write( image );
    res.end();
} );


app.get( '/:url', ( req, res ) => {

    const { url } = req.params;

    if ( !url && !validUrl( url ) ) {
        res.send( JSON.stringify( {
            error   : true,
            message : 'no url is set',
        } ) );

        return;
    }


    res.send( '...' );
} );


app.listen( port, () => {
    console.log( `Example app listening on port ${port}!` ); // eslint-disable-line
} );

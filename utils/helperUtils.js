const url = require( 'url' );
const fs = require( 'fs' );
/**
 * checks if a given url string is a valid url
 *
 * @param {string} str  an url string
 * @returns {boolean} is valid url or not
 */
function validUrl( str ) {

    try {
        url.parse( str );

        return true;
    } catch ( error ) {
        return false;
    }
}

/**
 * gets an error image to send to the browser in case of
 * an error
 *
 * @param {string} errorCode
 * @return {buffer} error image file
 */
function getErroImage( errorCode ) {

    const errors = [ 'url-not-valid', 'general-error', 'website-error' ];

    const index = errors.indexOf( errorCode );

    if ( index === -1 ) return null;

    const fileName = `${errors[ index ]}.jpg`;
    const file = fs.readFileSync( `${__dirname}/../server/errors/${fileName}` );

    return file;
}

module.exports = {
    validUrl,
    getErroImage,
};

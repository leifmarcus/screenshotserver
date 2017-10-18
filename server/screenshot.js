const { isWebUri } = require( 'valid-url' );
const puppeteer = require( 'puppeteer' );
const url = require( 'url' );
const { getErroImage } = require( '../utils/helperUtils.js' );

const SCREEN_WIDTH = 1440;
const SCREEN_HEIGHT = 800;
const JPG_QUALITY = 100;

/**
 * gets a screenshot of a web page
 *
 * @param {string} screenShotUrl
 * @param {Object} options,
 *
 * @return {Object} return an object with message
 */
async function getScreenShot( screenShotUrl, options ) {

    if ( !isWebUri( screenShotUrl ) ) {
        return getErroImage( 'url-not-valid' );
    }

    const width = options.width || SCREEN_WIDTH;
    const height = options.height || SCREEN_HEIGHT;
    const quality = options.quality || JPG_QUALITY;

    const parsedUrl = url.parse( screenShotUrl );
    const imageHostName = parsedUrl.hostname || 'no-hostname-set';

    const imagePath = parsedUrl.pathname === '/' ? '' : parsedUrl.pathname.replace( /\//g, '--' );

    const imageName = `${imageHostName}${imagePath}__${width}x${height}.jpg`;


    const browser = await puppeteer.launch( { args : [ '--no-sandbox' ] } );
    const page = await browser.newPage();

    await page.setViewport( {
        width             : width,
        height            : height,
        deviceScaleFactor : 2,
    } );

    await page.goto( screenShotUrl, {
        waitUntil           : 'networkidle',
        networkIdleTimeout  : 3000,
        networkIdleInflight : 10,
    } );
    console.log( `-- opened screenShotUrl: ${screenShotUrl}` ); // eslint-disable-line

    const screenshot = await page.screenshot( {
        // path     : `${__dirname}/../screenshots/${imageName}`,
        type     : 'jpeg',
        quality  : quality,
        fullPage : true,
    } );
    console.log( '-- screenshot taken' ); // eslint-disable-line

    await browser.close();

    return screenshot;
}

module.exports = {
    getScreenShot,
};

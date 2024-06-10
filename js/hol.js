/**
 * An object in the hol namespace contains
 * captions organized by language. When ES6
 * modules are fully supported, this should be
 * ported to a separate module.
 * */

const captions = [];
captions['en'] = {};
captions['en'].strCloseX = '×';
captions['en'].strFile = 'File';
captions['en'].strLoadFile = 'Load file...';
captions['en'].strPasteGeoJSON = 'Paste GeoJSON...'
captions['en'].strPasteHere = 'Paste a single GeoJSON Feature here';
captions['en'].strSaveGeoJSON = 'Save GeoJSON...';
captions['en'].strSetup = 'Setup...';
captions['en'].strMapArea = 'Map area';
captions['en'].strDraw = 'Draw';
captions['en'].strLoad = 'Load';
captions['en'].strLoading = 'Loading...';
captions['en'].strInfo = 'Information about this map.';
captions['en'].strMenuToggle = '≡';
captions['en'].strOk = '✔';
captions['en'].strEdit = '🖉';
captions['en'].strLocationsByCat = 'Features by category';
captions['en'].strSearch = 'Search the map features.';
captions['en'].strReadMore = 'Read more...';
captions['en'].strUnnamedFeat = 'unnamed feature';
captions['en'].strNetworkError = 'There was a network error.';
captions['en'].strToggleTracking = 'Toggle tracking of my location on the map.';
captions['en'].strShowHideAllFeats = 'Show/hide all features';
captions['en'].strGeoLocNotSupported = 'Sorry, your browser does not support geolocation tracking.';
captions['en'].strGeoLocRequiresTLS = 'Geolocation tracking requires a secure connection (https).';
captions['en'].strNewTaxonomy = 'Add taxonomy';
captions['en'].strNewCategory = 'Add category';
captions['en'].strGetTaxonomyName = 'Type a name for your new taxonomy:'
captions['en'].strGetCategoryName = 'Type a name for your new category:';
captions['en'].strGetCategoryDesc = 'Type a brief description for your new category:';
captions['en'].strGetFeatureName = 'Type a name for your new feature:';
captions['en'].strStopDrawing = 'Stop drawing';
captions['en'].strClear = 'Clear';
captions['en'].strDrawnFeatures = 'Drawn features';
captions['en'].strDrawnFeaturesDesc = 'Features drawn during the current session';
captions['en'].strEditThisFeature = 'Edit a copy of this feature by clicking on the edit button above.';
captions['en'].strTimeline = 'Timeline';
captions['en'].strPlay = 'Play the timeline.'
captions['en'].strStopPlay = 'Stop the timeline playback.'
captions['en'].strStepForward = 'Step forward in the timeline.'
captions['en'].strStepBackward = 'Step backward in the timeline.'


/** @constant const VERSION
 *  Version of this library.
 *  @type {string}
 *  @default
 */
const VERSION = '1.2b';

/** @constant const OLVERSION
 *  Latest release of OpenLayers with which this codebase was tested.
 *  @type {string}
 *  @default
 */
const OLVERSION = ol.util.VERSION;

/**
 * Constants in hol namespace used
 * for tracking the process of complex
 * interactions between the navigation
 * panel and the features on the map.
 */

/** @constant const NAV_IDLE No action to show or hide
 *                 features is currently happening.
 *  @type {number}
 *  @default
 */
const NAV_IDLE = 0;

/** @constant const NAV_SHOWHIDING_FEATURES Another
 *                     user action has triggered the
 *                     showing/hiding of features, and thatusing
 *                     process is not yet complete.
 *  @type {number}
 *  @default
 */
const NAV_SHOWHIDING_FEATURES = 1;

/** @constant const NAV_HARMONIZING_FEATURE_CHECKBOXES
 *                     A process of showing and hiding
 *                     features triggered by the user is
 *                     currently making sure all the checkboxes
 *                     in the navigation panel for each feature
 *                     are in the same state.
 *  @type {number}
 *  @default
 */
const NAV_HARMONIZING_FEATURE_CHECKBOXES = 2;

/** @constant const NAV_HARMONIZING_CATEGORY_CHECKBOXES
 *                     A process of showing and hiding
 *                     features triggered by the user is
 *                     currently making sure all the checkboxes
 *                     in the navigation panel for for categories
 *                     reflect the combined state of their descendant
 *                     feature checkboxes.
 *  @type {number}
 *  @default
 */
const NAV_HARMONIZING_CATEGORY_CHECKBOXES = 3;

/** @constant const NAV_SHOWHIDING_CATEGORY
 *                     A process of showing or hiding
 *                     an entire category of features
 *                     is currently in progress.
 *  @type {number}
 *  @default
 */
const NAV_SHOWHIDING_CATEGORY = 4;

class Util {
    /**
     * Ten maximally distinct colours, useful when using many categories on a layer.
     * @type {string[]}
     * @memberOf hol.Util
     */
    tenColors = ['rgb(85, 0, 0)', 'rgb(0, 85, 0)', 'rgb(0, 0, 85)', 'rgb(85, 85, 0)', 'rgb(85, 0, 85)', 'rgb(0, 85, 85)', 'rgb(150, 0, 0)', 'rgb(0, 130, 0)', 'rgb(0, 0, 150)', 'rgb(0, 0, 0)'];
    /**
     * @description Set of distinct colours, initially set to the ten defaults.
     * The end-user can override these colours if they wish. By default,
     * identical to hol.Util.tenColors.
     * @type {string[]}
     * @memberOf hol.Util
     */
    colorSet = this.tenColors;
    /**
     * @description Opacity setting for lines and the outline of shapes, defaulting to '0.6'.
     *              Made into a variable so that projects can override it.
     * @type {string}
     * @memberOf hol.Util
     */
    lineOpacity = '0.6';

    /**
     * @description Opacity setting for the interior of shapes, defaulting to '0.2'.
     *              Made into a variable so that projects can override it.
     * @type {string}
     * @memberOf hol.Util
     */
    shapeOpacity = '0.2';
    /**
     * @description Array of strings representing ten maximally distinct colours,
     * with an alpha setting of hol.Util.lineOpacity (default 0.6).
     * @type {string[]}
     * @memberOf hol.Util
     */
    tenTranslucentColors = [];


    /**
     * @description Below anonymous function just populates the tenTranslucentColors array.
     */
    function() {
        let i, maxi;
        for (i = 0, maxi = this.tenColors.length; i < maxi; i++) {
            this.tenTranslucentColors.push(this.getColorWithAlpha(i, this.lineOpacity));
        }
    };

    /**
     * @description Set of distinct colours, with an alpha setting of 0.6. Initially set to
     * the hol.Util.tenTranslucentColors, but can be overridden by the end user.
     * @type {string[]}
     * @memberOf hol.Util
     */

    translucentColorSet = this.tenTranslucentColors;

    constructor() {
    }

    /**
     * @description Helper method to avoid repeated code instances.
     * @type
     * @memberOf hol.Util
     * @param {number} dx
     * @param {number[]} end
     * @param {number[]} start
     * @param {number} dy
     * @param {number} rotation
     * @param {any[]} midPoint
     */

    getPointGeometry(dx, end, start, dy, rotation, midPoint) {
        dx = end[0] - start[0];
        dy = end[1] - start[1];
        rotation = Math.atan2(dy, dx);
        //We want the arrow in the middle of the segment.
        midPoint = [start[0] + Math.round((end[0] - start[0]) / 2), start[1] + Math.round((end[1] - start[1]) / 2)];
        return {rotation, midPoint};
    }

    /**
     * A utility function which shows the current version of this code and
     * the last version of OpenLayers with which it was tested.
     * @function hol.Util.showVersion
     * @memberof hol.Util
     * @description Outputs the version string to the console and returns it too.
     * @returns {string} The same string as is output to the console.
     */
    showVersion() {
        const verString = 'hol (HCMC OpenLayers) JS version ' + hol.VERSION + ' tested with OpenLayers ' + hol.OLVERSION + '.';
        console.log(verString);
        return verString;
    };

    /**
     * A utility function borrowed with thanks from here:
     * http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
     * @function hol.Util.crudeHash
     * @memberof hol.Util
     * @description Creates a crude
     *                  one-way hash from an input string.
     * @param {string} s The input string.
     * @returns {number} A 32-bit integer.
     */
    crudeHash(s) {
        let hash = 0, strlen = s.length, i, c;
        if (strlen === 0) {
            return hash;
        }
        for (i = 0; i < strlen; i++) {
            c = s.charCodeAt(i);
            hash = ((hash << 5) - hash) + c;
            hash &= hash; // Convert to 32bit integer
        }
        return hash;
    };

    /**
     * @description Get one of the distinct colours, but combine it with a translucency level.
     * @method hol.Util.getColorWithAlpha Get one of the distinct colours, but
     *                                    combine it with a translucency level.
     * @param {number} catNum Number of the category
     * @param {string} alpha Alpha value (decimal between 0 and 1) in the form of a string.
     * @returns {string} String value of colour.
     */

    getColorWithAlpha(catNum, alpha) {
        const rgb = this.tenColors[catNum % 10].replace('rgb\(', '').replace('\)', '').split('\s*,\s*');
        return 'rgba(' + rgb.join(', ') + ', ' + alpha + ')';
    };

    /**
     * @description Get the current main colour for a specific category,
     * based on its index number.
     * @function hol.Util.getColorForCategory
     * @memberof hol.Util
     * @param  {number} catNum Number of the category.
     * @return {string}
     */
    getColorForCategory(catNum) {
        return this.colorSet[catNum % this.colorSet.length];
    };

    /**
     * @description Get the current translucent colour for a specific category,
     * based on its index
     * @function hol.Util.getTranslucentColorForCategory
     * @memberof hol.Util
     * @param  {number} catNum Number of the category.
     * @return {string}
     */
    getTranslucentColorForCategory(catNum) {
        return this.translucentColorSet[catNum % this.translucentColorSet.length];
    };

    /**
     * @function hol.Util.getCenter
     * @memberof hol.Util
     * @description Calculates the centre
     *               point of an ol.Extent object.
     * @return {number[]} Array of two integers for x and y.
     * @param extent
     */
    getCenter(extent) {
        let x, y;
        x = extent[0] + (extent[2] - extent[0]);
        y = extent[1] + (extent[3] - extent[1]);
        return [x, y];
    };

    /**
     * @function hol.Util.escapeXml
     * @memberof hol.Util
     * @description Escapes a block of XML so that it
     *              can be shown in literal form.
     * @param  {string} xml XML code.
     * @return {string} Escaped string
     */
    escapeXml(xml) {
        return xml.replace(/</g, '&lt;').replace(/&amp;/g, '&amp;amp;').replace(/\n/g, '<br/>');
    };

    /**
     * A function in the hol.Util namespace which returns
     * an ol.style.Style object which renders a feature as
     * essentially invisible.
     * @function hol.Util.getHiddenStyle
     * @memberof hol.Util
     * @description returns the default
     *                    style for features when they are
     *                    not visible on the map.
     * @returns {object} ol.style.Style
     */

    getHiddenStyle() {
        return new ol.style.Style({
            image: new ol.style.Circle({
                fill: new ol.style.Fill({
                    color: 'rgba(255,255,255,0)'
                }),
                stroke: new ol.style.Stroke({
                    color: 'rgba(255,255,0,0)',
                    width: 16
                }),
                radius: 30
            }),
            fill: new ol.style.Fill({
                color: 'rgba(255,255,255,0)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(255,255,255,0)',
                width: 12
            })
        });
    };

    /**
     * A function in the hol.Util namespace which returns
     * an ol.style.Style object which is used for drawing
     * operations.
     * @function hol.Util.getDrawingStyle
     * @memberof hol.Util
     * @description returns the default
     *                    style for drawing new features on
     *                    the map when feature-editing is
     *                    enabled.
     * @returns {object} ol.style.Style
     */
    getDrawingStyle() {
        return new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, ' + hol.Util.shapeOpacity + ')'
            }),
            stroke: new ol.style.Stroke({
                color: '#ffcc33',
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#ffcc33'
                })
            })
        });
    };

    /**
     * A function in the hol.Util namespace which returns
     * an ol.style.Style object designed for rendering a
     * user-dragged box on the map.
     * @function hol.Util.getDragBoxStyle
     * @memberof hol.Util
     * @description returns the default
     *                    style for a box drawn by the user
     *                    on the map using the mouse.
     * @returns {object} ol.style.Style
     */
    getDragBoxStyle() {
        return new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#33ff33',
                width: 1
            })
        });
    };

    /**
     * An immediately-executed function in the hol.Util
     *                   namespace which maintains
     *                   an incrementing counter, used for
     *                   purposes such as providing a high
     *                   zIndex to make selected objects
     *                   appear above others in their layer.
     * @function hol.Util.counter
     * @memberof hol.Util
     * @description returns a function which
     *                   returns an incremented counter value.
     * @returns {function} a function which returns an integer.
     */
    counter = (function () {
        let c = 1000; //initial value.
        return function () {
            return c++;
        };
    })();

    /**
     * A function in the hol.Util namespace which returns
     * an ol.style.Style object which renders a feature as
     * it would appear when highlighted.
     * @function hol.Util.getSelectedStyle
     * @memberof hol.Util
     * @description returns default
     *                    style for features when they are
     *                    selected on the map.
     * @param {string} catIcon Path to the icon for the category
     (may be null).
     * @param {Array}  catIconDim Array of width,height in pixels of the
     *                            category icon (may be null).
     * @returns {function} Function which returns an Array of ol.style.Style
     */
    getSelectedStyle(catIcon, catIconDim) {
        //We use a closure to get a self-incrementing zIndex.
        let newZ = this.counter();
        return (feature, resolution) => {
            let catNum, catCol, geometry, dx, dy, rotation, midPoint, styles, offY;
            catNum = feature.getProperties().showingCat;
            catCol = this.getColorForCategory(catNum);

            //Default values for category icon.
            if (catIcon == null) {
                catIcon = 'js/placemark.png';
            }
            if (catIconDim == null) {
                catIconDim = [20, 30];
            }
            offY = Math.round(catIconDim[1] / 2) + 4;

            styles =
                [
                    new ol.style.Style({
                        image: new ol.style.Icon({
                            src: catIcon,
                            imgSize: catIconDim,
                            anchor: [0.5, 1],
                            color: 'rgba(255,0,255,1)'
                        }),
                        stroke: new ol.style.Stroke({
                            color: 'rgba(255,0,255,0.6)',
                            width: 8
                        }),
                        zIndex: newZ
                    }),
                    new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: '#ffffff',
                            width: 3
                        }),
                        text: new ol.style.Text({
                            font: '1em sans-serif',
                            offsetY: offY,
                            fill: new ol.style.Fill({color: catCol}),
                            stroke: new ol.style.Stroke({color: 'rgba(255, 255, 255, 1)', width: 3}),
                            text: feature.getProperties().name
                        }),
                        zIndex: newZ
                    })
                ];
            //If the feature is a directional LineString, we need to add arrows, assuming the
            //segment is long enough to fit one in.
            if (feature.getProperties().directional) {
                geometry = feature.getGeometry();
                // todo: check to see if this is working
                geometry.forEachSegment((start, end) => {
                        let pixLen = Math.round(new ol.geom.LineString([start, end]).getLength() / resolution);
                        if (pixLen > 25) {
                            const __ret = this.getPointGeometry(dx, end, start, dy, rotation, midPoint);
                            rotation = __ret.rotation;
                            midPoint = __ret.midPoint;
                            styles.push(new ol.style.Style({
                                geometry: new ol.geom.Point(midPoint),
                                image: new ol.style.RegularShape({
                                    fill: new ol.style.Fill({color: 'rgba(255,0,255,1)'}),
                                    points: 3,
                                    radius: 10,
                                    rotation: -rotation,
                                    angle: Math.PI / 2 // rotate 90°
                                })
                            }));
                        }
                    }
                );
            }
            return styles;
        };
    };

    /**
     * A function in the hol.Util namespace which returns
     * an ol.style.Style object which renders a feature
     * intended to be used to track the user's location
     * on the map.
     * @function hol.Util.getUserLocationStyle
     * @memberof hol.Util
     * @description returns default style for a feature
     *                      which tracks the user's location
     *                      on the map.
     * @returns {function} ol.FeatureStyleFunction
     */
    getUserLocationStyle() {
        return function (feature, resolution) {
            return [new ol.style.Style({
                image: new ol.style.Icon({
                    src: 'js/userLocation.png',
                    imgSize: [30, 30],
                    anchor: [0.5, 0.5]
                })
                /*image: new ol.style.Circle({
                  radius: 12,
                  fill: new ol.style.Fill({
                      color: '#f00'
                  }),
                  stroke: new ol.style.Stroke({
                    color: '#ff0',
                    width: 6
                  })
                }),
                text: new ol.style.Text({
                  font: '5em sans-serif',
                  fill: new ol.style.Fill({color: '#f00'}),
                  stroke: new ol.style.Stroke({color: '#ff0', width: 10}),
                  text: '⌖',
                  textBaseline: 'bottom'
                })*/
            })]
        };
    };

    /**
     * A function in the hol.Util namespace which returns
     * an ol.FeatureStyleFunction object which renders a feature as
     * it would appear as a member of a specified category.
     * @function hol.Util.getCategoryStyle
     * @memberof hol.Util
     * @description returns a constructed ol.FeatureStyleFunction
     *                    for features when they are
     *                    rendered normally on the map.
     * @param {number} catNum Index of the category in its array.
     * @param {string} catIcon Path to the icon for this category
     (may be null).
     * @param {Array}  catIconDim Array of width,height in pixels of the
     *                            category icon (may be null).
     * @returns {function} ol.FeatureStyleFunction
     */
    getCategoryStyle(catNum, catIcon, catIconDim) {
        let col, transCol;
        col = this.getColorForCategory(catNum);
        transCol = this.getColorWithAlpha(catNum, this.shapeOpacity);

        //Default values for category icon.
        if (catIcon == null) {
            catIcon = 'js/placemark.png';
        }
        if (catIconDim == null) {
            catIconDim = [20, 30];
        }

        return (feature, resolution) => {
            let lineWidth, geomType, geometry, dx, dy, rotation, midPoint;
            lineWidth = 2;
            geomType = feature.getGeometry().getType();
            if (((geomType === 'LineString') && !(feature.getProperties().directional)) || (geomType === 'MultiLineString') || (geomType === 'GeometryCollection')) {
                lineWidth = 5;
            }

            let styles =
                [new ol.style.Style({
                    /*image: new ol.style.Circle({
                      fill: new ol.style.Fill({
                        color: transCol
                      }),
                      stroke: new ol.style.Stroke({
                        color: col,
                        width: 2
                      }),
                      radius: 10
                    }),*/
                    image: new ol.style.Icon({
                        src: catIcon,
                        imgSize: catIconDim,
                        anchor: [0.5, 1],
                        color: col
                    }),
                    fill: new ol.style.Fill({
                        color: transCol
                    }),
                    stroke: new ol.style.Stroke({
                        color: col,
                        width: lineWidth
                    })
                })];
            //If the feature is a directional LineString, we need to add arrows, assuming the
            //segment is long enough to fit one in.
            if (feature.getProperties().directional) {
                geometry = feature.getGeometry();
                // todo: check to see if this is working
                geometry.forEachSegment((start, end) => {
                    let pixLen = Math.round(new ol.geom.LineString([start, end]).getLength() / resolution);
                    if (pixLen > 25) {
                        const __ret = this.getPointGeometry(dx, end, start, dy, rotation, midPoint);
                        rotation = __ret.rotation;
                        midPoint = __ret.midPoint;
                        styles.push(new ol.style.Style({
                            geometry: new ol.geom.Point(midPoint),
                            image: new ol.style.RegularShape({
                                fill: new ol.style.Fill({color: col}),
                                points: 3,
                                radius: 10,
                                rotation: -rotation,
                                angle: Math.PI / 2 // rotate 90°
                            })
                        }));
                    }
                });
            }
            return styles;
        };
    };

    /** Utility function which is passed an ol.Extent (minx, miny, maxx, maxy)
     and returns the area of the rectangle.
     *  @method hol.Util.getSize Utility function for calculating the size of an ol.Extent.
     *  @param   {ol.Extent} extent
     *  @returns {number} The width * height of the extent.
     * */
    getSize(extent) {
        let w, h;
        w = extent[2] - extent[0];
        h = extent[3] - extent[1];
        return (w * h);
    };

    /** Utility function which is passed a user-created name and
     *          returns a valid id constructed from it.
     *  @method hol.Util.idFromName Utility function for constructing
     *                   a valid QName from a prose string.
     *  @param   {string} name
     *  @returns {string} The constructed ud.
     * */
    idFromName(name) {
        //Get rid of unwanted chars.
        let candidate = name.replace(/[^A-Za-z0-9]+/g, '').replace(/^[^A-Za-z]+/, '');
        //Lowercase the first letter.
        candidate = candidate.substring(0, 1).toLowerCase() + candidate.substring(1);
        return candidate;
    };

    /**
     * A function in the hol.Util namespace which expands and
     * contracts a category in the navigation panel.
     * @function hol.Util.expandCollapseCategory
     * @memberof hol.Util
     * @description expands or
     *              contracts a category in the
     *              navigation panel.
     * @param {object} sender The HTML element from which the
     *                        call originates.
     * @param {number} catNum
     */
    expandCollapseCategory(sender, catNum) {
        let p = sender.parentNode;
        let cat = null;
        if (p.classList.contains('headless')) {
            return;
        }
        if (p.classList.contains('expanded')) {
            p.classList.remove('expanded');
        } else {
            p.classList.add('expanded');
            if (catNum > -1) {
                cat = this.taxonomies[this.currTaxonomy].categories[catNum];
                if ((typeof cat.desc !== 'undefined') && (cat.desc.length > 0)) {
                    this.deselectFeature();
                    this.infoDiv.querySelector('h2').innerHTML = cat.name;
                    this.infoDiv.querySelector("div[id='infoContent']").innerHTML = cat.desc;
                    if (this.allowDrawing) {
                        this.infoDiv.querySelector("button[id='btnEditFeature']").style.display = 'none';
                    }
                    this.rewriteHolLinks(this.infoDiv);
                    this.infoDiv.style.display = 'block';
                }
            }
        }
    };

    /**
     * @description A specific exception type we need to tell the user about.
     * @constructor hol.Util.DataNotFoundError
     * @memberof hol.Util
     * @param {string} missingData Specifics of the data which is missing.
     * @param {string} dataFile The file in which the data was expected to be found.
     */
    DataNotFoundError(missingData, dataFile) {
        this.message = 'Error: ' + missingData + ' not found in the JSON file ' + dataFile + '.';
        this.stack = (new Error()).stack;
        // todo: not sure about the 2-line bit that follows, in terms of where they should be placed
        Object.setPrototypeOf(this.DataNotFoundError.prototype, Error.prototype);
        this.DataNotFoundError.prototype.name = 'hol.Util.DataNotFoundError';
    };

    /**
     * @description Simple test function. Throws up an alert.
     * @function test
     * @param {string} inStr String to show in alert.
     * @memberof hol.Util
     */
    test(inStr) {
        alert('hol.Util.test has been called with ' + inStr + '.');
    };

    /**
     * Method for retrieving JSON from a URL using
     * XMLHttpRequest. Stolen from:
     * https://github.com/mdn/promises-test/blob/gh-pages/index.html
     * with thanks.
     *
     * Call like this:
     *
     *  hol.Util.ajaxRetrieve('json/myfile.json', 'json').then(function(response) {
     *  // The first runs when the promise resolves, with the request.response
     *  // specified within the resolve() method.
     *  something.something = JSON.Parse(response);
     *  // The second runs when the promise
     *  // is rejected, and logs the Error specified with the reject() method.
     *    }, function(Error) {
     *      console.log(Error);
     *  });
     *
     * @function hol.Util.ajaxRetrieve
     * @memberof hol.Util
     * @description Method for retrieving JSON from a URL using
     * XMLHttpRequest. Stolen from:
     * https://github.com/mdn/promises-test/blob/gh-pages/index.html
     * with thanks.
     * @param {string} url URL from which to retrieve target file.
     * @param {XMLHttpRequestResponseType} responseType the mime type of the target document.
     * @return Promise
     */
    ajaxRetrieve(url, responseType) {
        // Create new promise with the Promise() constructor;
        // This has as its argument a function
        // with two parameters, resolve and reject

        return new Promise(function (resolve, reject) {
            // Standard XHR to load a JSON file
            let request = new XMLHttpRequest();
            request.open('GET', url);
            request.responseType = responseType;
            // When the request loads, check whether it was successful
            request.onload = function () {
                if (request.status === 200) {
                    // If successful, resolve the promise by passing back the request response
                    resolve(request.response);
                } else {
                    // If it fails, reject the promise with a error message
                    reject(Error(responseType.toUpperCase() + ' file ' + url + 'did not load successfully; error code: ' + request.statusText));
                }
            };
            request.onerror = function () {
                // Also deal with the case when the entire request fails to begin with
                // This is probably a network error, so reject the promise with an appropriate message
                reject(Error(this.captions.strNetworkError));
            };
            // Send the request
            request.send();
        });
    };

    /**
     * Function for parsing a URL query string.
     *
     * @function hol.Util.getQueryParam
     * @memberof hol.Util
     * @description parses a URL query
     *         string and returns a value for a specified param name.
     * @param {string} param The name of the param name to search for.
     * @returns {string} the value of the param, or an empty string.
     */
    getQueryParam(param) {
        let sp = new URLSearchParams(decodeURI(document.location.search));
        let val = sp.get(param);
        return val ? val.trim() : '';
    };

}

/**
 * hol.VectorLayer class is the core class which is
 * instantiated to create the vector layer on the map.
 * When constructing, pass it a pointer to the map,
 * along with the URLs of the JSON files for categories
 * and GeoJSON features, and it will take care of the
 * rest.
 *
 * @class hol.VectorLayer
 * @constructs hol.VectorLayer
 * @param {ol.Map} map OpenLayers3 ol.Map object on
 *        which the vector layer will be constructed.
 * @param {string} featuresUrl URL of the GeoJSON file
 *        which contains the features for the layer.
 *
 */
class VectorLayer {
    constructor(olMap, featuresUrl, options) {
        this.olMap = olMap;
        this.featuresUrl = featuresUrl;
        this.options = options;
        try {
            //Setting for testing new features.
            this.testing = this.options.testing || false;
            this.allowUpload = this.options.allowUpload || false;
            this.allowDrawing = this.options.allowDrawing || false;
            this.allowTaxonomyEditing = this.options.allowTaxonomyEditing || false;
            this.allFeaturesTaxonomy = (this.options.allFeaturesTaxonomy /*&& !this.allowDrawing*/) || false;
            //If multiple taxonomies are being used, and this is true, then
            //generate an additional taxonomy which combines everything. If
            //you combine this with drawing, though, things get messy.
            this.initialTaxonomyId = this.options.initialTaxonomyId || ''; //Either the id of a taxonomy, or the value 'holAllTaxonomies'
            //for the allFeaturesTaxonomy.

            this.msPlayInterval = (this.options.msPlayInterval === undefined) ? 1500 : this.options.msPlayInterval;
            this.pageLang = document.querySelector('html').getAttribute('lang') || 'en';
            this.collator = new Intl.Collator(this.pageLang);

            this.linkPrefix = this.options.linkPrefix || ''; //Prefix to be added to all linked document paths before retrieval.
            //To be set by the host application if required.

            this.onReadyFunction = this.options.onReadyFunction || null;
            //A function to be called when the object has been fully constructed.

            this.trackUserLocation = this.options.trackUserLocation || false;
            //Whether geolocation tracking should be turned on automatically
            this.allowUserTracking = this.options.allowUserTracking || false;
            //Whether a button is provided for users to turn on tracking.

            this.timelinePanZoom = (this.options.timelinePanZoom === undefined) ? true : this.options.timelinePanZoom;
            //Whether to pan/zoom to frame current features
            //when a timeline step happens.

            this.geolocationId = -1;                   //Will hold the id of the position watcher if tracking is turned on.

            this.userPositionMarker = null;            //Pointer to a feature used as a position marker for user tracking.

            this.docBody = document.getElementsByTagName('body')[0];
            //Stash a convenient ref to the body of the host document.

            this.captionLang = document.getElementsByTagName('html')[0].getAttribute('lang') || 'en'; //Document language.
            this.captions = hol.captions[this.captionLang];
            //Pointer to the caption object we're going to use.


            this.map = this.olMap;                          //The OpenLayers map object.
            this.mapTitle = '';                        //If a map title is specified in the GeoJSON, it will be stored here.
            this.view = this.map.getView();            //Pointer to the ol.View.
            this.featuresUrl = this.featuresUrl || '';      //URL of the JSON file containing all the features.
            this.startupDoc = this.options.startupDoc || '';//If there is an initial document to show in the left panel.
            this.geojsonFileName = '';                 //Will contain a filename for data download if needed.
            this.draw = null;                          //Will point to drawing interaction if invoked.
            this.modify = null;                        //Will point to modify interaction if invoked.
            this.currDrawGeometryType = '';            //Will hold e.g. 'Point', 'GeometryCollection'.
            this.currDrawGeometry = null;              //Will hold an actual ol geometry object.
            this.drawingFeatures = null;               //Will point to an ol.Collection() if invoked.
            this.featureOverlay = null;                //Will carry drawn features if invoked.
            this.coordsBox = null;                     //Will point to a box containing drawing coords.
            this.acceptCoords = null;                  //Will point to a button to accept drawn coords.
            this.splash = this.getSplashScreen();

            this.source = null;                        //Will point to the ol.source.Vector.
            this.tmpSource = null;                     //Will be used to load more features without discarding existing set.
            this.taxonomiesLoaded = false;             //Need to know when the taxonomies have been constructed.
            this.features = [];                        //This is set to point to the features of the source after loading.
            this.baseFeature = null;                   //Will hold a pointer to the base map feature which is never shown but
            //carries the complete set of taxonomies and other map-wide properties.
            this.taxonomies = [];                      //Holds the reconstructed taxonomy/category sets after loading.
            this.currTaxonomy = -1;                    //Holds the index of the taxonomy currently being displayed in the
            //navigation panel.
            this.featsLoaded = false;                  //Good to know when loading of features is done.
            this.featureDisplayStatus = NAV_IDLE;  //Makes sure we don't try to do two things at the same time.
            this.toolbar = null;                       //Pointer to the toolbar after we have created it.
            this.iButton = null;                       //Pointer to Information button after we have created it.
            this.userTrackButton = null;               //Pointer to user location tracking button if it is created.
            this.mobileMenuToggleButton = null;        //Pointer to button which toggles the menu display in mobile view.
            this.taxonomySelector = null;              //Pointer to the taxonomy selector on the toolbar.
            this.navPanel = null;                      //Pointer to the navPanel after we have created it.
            this.navInput = null;                      //Pointer to the nav search input box after we've created it.
            this.featureCheckboxes = null;             //Will be a nodeList of all checkboxes for features.
            this.categoryCheckboxes = null;            //Will be a nodeList of all checkboxes for categories.
            this.allFeaturesCheckbox = null;           //Will be a pointer to the show/hide all features checkbox.
            this.selectedFeature = -1;                 //Will contain the index of the currently-selected feature, or -1.
            this.selectedFeatureNav = null;            //Will contain a pointer to the navigation panel list item for
            //the selected feature.
            this.docTitle = null;                      //Will contain a pointer to the title span on the left of the toolbar.
            this.menu = null;                          //Will contain a pointer to menu-like controls for editing etc.
            this.fileMenu = null;                      //Will contain a pointer to file upload/download control menu.
            this.setupMenu = null;                     //Will contain a pointer to map setup menu.
            this.drawMenu = null;                      //Will contain a pointer to the drawing menu.

            this.timelineData = null;                  //Will be populated from the richTimelinePoints property of the base feature.
            this.timeline = null;                      //Will contain a pointer to the timeline control, if one is constructed.
            this.timelinePoints = [];                  //Will be populated with objects for start and end points, labels, and lists of features.
            this.lastTimelineFeatNums = new Set();     //Will hold the numbers of features shown the last time a timeline change happened.
            this.playInterval = null;                  //Will store the interval pointer when playing the timeline.
            this.playButton = null;                    //Will contain a pointer to the timeline play control, if one is constructed.
            this.stepForwardButton = null;             //Will contain a pointer to the timeline step forward control, if one is constructed.
            this.stepBackButton = null;                //Will contain a pointer to the timeline step back control, if one is constructed.
            this.playImg = null;                       //Will contain a pointer to an SVG image for the button if required.

            // Start by creating the toolbar for the page.
            this.buildToolbar();

            // Next we create a div for displaying external retrieved documents.
            this.docDisplayDiv = document.createElement('div');
            this.docDisplayDiv.setAttribute('id', 'holDocDisplay');
            // We need to avoid this thing flashing on the screen just when it's added to the DOM.
            this.docDisplayDiv.setAttribute('style', 'display: none;');
            this.docDisplayDiv.classList.add('hidden');
            this.closeBtn = document.createElement('span');
            this.closeBtn.setAttribute('class', 'closeBtn');
            this.closeBtn.appendChild(document.createTextNode(this.captions.strCloseX));
            this.closeBtn.addEventListener('click', function (e) {
                e.target.parentNode.classList.add('hidden');
                this.docDisplayFrame.setAttribute('src', '');
            }.bind(this), false);
            this.docDisplayDiv.appendChild(closeBtn);
            this.docDisplayFrame = document.createElement('iframe');
            this.docDisplayFrame.setAttribute('id', 'holDocDisplayFrame');
            this.docDisplayDiv.appendChild(this.docDisplayFrame);
            this.docBody.appendChild(this.docDisplayDiv);
            this.docDisplayDiv.setAttribute('style', '');

            // Add an event listener to fix hol: links whenever a document is loaded.
            this.docDisplayFrame.addEventListener('load', function () {
                try {
                    this.rewriteHolLinks(this.docDisplayFrame.contentDocument.getElementsByTagName('body')[0]);
                } catch (e) {
                }
            }.bind(this), false);

            // Now we create a box-dragging feature.
            this.dragBox = new ol.interaction.DragBox({
                condition: ol.events.condition.platformModifierKeyOnly,
                style: hol.Util.getDragBoxStyle()
            });
            this.dragBox.on('boxend', function (e) {
                var boxExtent = this.dragBox.getGeometry().getExtent();
                this.zoomToBox(boxExtent);
            }.bind(this));

            this.map.addInteraction(this.dragBox);

            // Add the click function to the map, even though there's nothing to receive it yet.
            this.map.on('click', function (evt) {
                this.selectFeatureFromPixel(evt.pixel);
            }.bind(this));

            // Add the vector layer, with no source for the moment.
            this.layer = new ol.layer.Vector({style: hol.Util.getHiddenStyle});
            this.map.addLayer(this.layer);

            // Now various extra optional features.

            if (this.allowUpload === true) {
                this.setupUpload();
            }

            if (this.allowDrawing === true) {
                this.setupDrawing();
            }
            if (this.allowTaxonomyEditing === true) {
                this.setupTaxonomyEditing();
            }

            // Now start loading vector data.
            if (this.featuresUrl !== '') {
                this.loadGeoJSONFromString(this.featuresUrl);
                this.geojsonFileName = this.featuresUrl.split(/(\\|\/)/).pop();
            }

        } catch (e) {
            console.error(e.message);
        }

    }


}


export {
    captions, Util, VectorLayer, VERSION, OLVERSION, NAV_SHOWHIDING_FEATURES, NAV_HARMONIZING_CATEGORY_CHECKBOXES,
    NAV_HARMONIZING_FEATURE_CHECKBOXES, NAV_IDLE, NAV_SHOWHIDING_CATEGORY
};

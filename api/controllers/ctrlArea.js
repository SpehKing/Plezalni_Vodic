const AreaModel = require('../models/area'); //import model
// This is the controller for the route GET /plezalisce/razdalja
/**
 * @openapi
 *  /plezalisce/razdalja:
 *   get:
 *    summary: Retrieve area within a given distance.
 *    description: Retrieve **area within a given distance** from a given location.
 *    tags: [Areas]
 *    parameters:
 *     - name: lat
 *       in: query
 *       required: true
 *       description: <b>latitude</b> of the location
 *       schema:
 *        type: number
 *        minimum: -180
 *        maximum: 180
 *       example: 46.050129
 *     - name: lng
 *       in: query
 *       required: true
 *       description: <b>longitude</b> of the location
 *       schema:
 *        type: number
 *        minimum: -90
 *        maximum: 90
 *       example: 14.469027
 *     - name: distance
 *       in: query
 *       schema:
 *        type: number
 *        minimum: 0
 *        default: 5
 *       description: maximum <b>distance</b> in kilometers
 *     - name: nResults
 *       in: query
 *       schema:
 *        type: integer
 *        minimum: 1
 *        default: 10
 *       description: maximum <b>number of results</b>
 *    responses:
 *     '200':
 *      description: <b>OK</b>, with list of areas.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/Area'
 *        example:
 *         - _id: 65674317bfef937f4c7aaff9
 *           name: "Costiera"
 *           description: "Obalna cesta, ki se s Kraške planote mimo Sesljana vije proti Trstu, j…"
 *           best_period: "Plezati je možno vse leto, vendar je poleti večkrat prevroče; takrat j…"
 *           characteristics: "Odličen apnenec nudi plezanje po luknjicah v navpičnih ali rahlo previ…"
 *           image: ""
 *           coordinates: [45.743785, 13.665776]
 *           routes: []
 *           comments: []
 *     '400':
 *      description: <b>Bad Request</b>, with error message.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorMessage'
 *        example:
 *         message: "Query parameters 'lng' and 'lat' are required"
 *     '404':
 *      description: <b>Not Found</b>, with error message.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorMessage'
 *        example:
 *         message: "No areas found."
 *     '500':
 *      description: <b>Internal Server Error</b>, with error message.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorMessage'
 *        example:
 *         message: "geo near accepts just one argument when querying for a GeoJSON point. Extra field found: $maxDistance: 5000.0"
 */
const areaListByDistance = async (req, res) => {
  let lng = parseFloat(req.query.lng);
  let lat = parseFloat(req.query.lat);
  let distance = parseFloat(req.query.maxDistance);
  distance = 1000 * (isNaN(distance) ? 5 : distance);
  let nResults = parseInt(req.query.nResults);
  nResults = isNaN(nResults) ? 10 : nResults;
  console.log(`lng: ${lng}, lat: ${lat}, distance: ${distance}, nResults: ${nResults}`); // Log the input values
  if (!lng || !lat)
    res
      .status(400)
      .json({ message: "Query parameters 'lng' and 'lat' are required." });
  else {
    try {
      let areas = await AreaModel.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [lng, lat],
            },
            distanceField: "distance",
            spherical: true,
            maxDistance: distance,
          },
        },
        { $project: { comments: false, id: false } },
        { $limit: nResults },
      ]);
      console.log(areas); // Log the result of the database query
      if (!areas || areas.length == 0) {
        res.status(404).json({ message: "No areas found." });
        return;
      }
      res.status(200).json({ areas, status: "OK" });
    } catch (err) {
      console.error(err); // Log any errors that occur
      res.status(500).json({ message: err.message });
    }
  }
};



// This is the controller for the route GET /plezalisce/:areaId
/**
 * @openapi
 * /plezalisce/{areaId}:
 *   get:
 *     summary: Retrieve details of a specific area
 *     tags:
 *       - Areas
 *     parameters:
 *       - in: path
 *         name: areaId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the area to be retrieved
 *     responses:
 *       '200':
 *         description: Successfully retrieved the details of the area
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The ID of the area
 *                 name:
 *                   type: string
 *                   description: The name of the area
 *       '404':
 *         description: Not Found. Area not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating the reason for the not found status
 *       '500':
 *         description: Internal Server Error. Something went wrong on the server.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating the internal server error
 */
const areaReadOne = async (req, res) => {
  try {
    console.log('Area ID:', req.params.areaId);
    let areaInstance = await AreaModel.findById(req.params.areaId)
      .select("_id")
      .select("name")
      .select("description")
      .select("best_period")
      .select("characteristics")
      .select("image")
      .select("coordinates")
      .select("routes")
      .select("comments")
      .select("rating")
      .lean()
      .exec();
      if (!areaInstance)
        res.status(404).json({
        message: `Area with id '${req.params.areaId}' not found`,
      });
    else res.status(200).json(areaInstance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//has to be CHANGED when implementing areaListCodelist
/**
 * @openapi
 * /plezalisce/codelist:
 *   get:
 *     summary: Retrieve a list of areas with their codes
 *     tags:
 *       - Areas
 *     responses:
 *       '200':
 *         description: Successfully retrieved the list of areas with codes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status message indicating a successful request
 *       '500':
 *         description: Internal Server Error. Something went wrong on the server.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating the internal server error
 */
const areaListCodelist = (req, res) => {
  res.status(200).json({ status: "OK" });
};


/**
 * @openapi
 * /plezalisce:
 *   get:
 *     summary: Retrieve a list of areas
 *     tags:
 *       - Areas
 *     responses:
 *       '200':
 *         description: Successfully retrieved the list of areas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The ID of the area
 *                   name:
 *                     type: string
 *                     description: The name of the area
 *                   code:
 *                     type: string
 *                     description: The code of the area
 *       '500':
 *         description: Internal Server Error. Something went wrong on the server.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating the internal server error
 */
const areaReadAll = async (req, res) => {
  try {
    const areas = await AreaModel.find()
      .lean()
      .exec();
      console.log(areas);

    res.status(200).json(areas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  areaListByDistance,
  areaListCodelist,
  areaReadOne,
  areaReadAll
};
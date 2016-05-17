var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Aminer = mongoose.model('Aminer');

var page_limit = 10;


/**
 * @api {get} /aminer Query Aminer database
 * @apiName Aminer
 * @apiGroup Aminer
 *
 * @apiParam {Number} index Unique ID of the article.
 * @apiParam {String} publication Users unique ID.
 * @apiParam {String} title Title of article.
 * @apiParam {Number} year Year.
 * @apiParam {Number} page Pagination.
 *
 * @apiSuccess {String} index Index of article.
 * @apiSuccess {String} publication  Publication of article.
 * @apiSuccess {String} title  Title of article.
 * @apiSuccess {String} abstract  Abstract of article.
 * @apiSuccess {String[]} authors  Authors.
 * @apiSuccess {String[]} references  References.
 * @apiSuccess {String} year  Year of publication.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "err":false,
 *          "message":"Documents found successfully",
 *          "data":[
 *              {
 *                  "_id":"56bd754087290e1671193a21",
 *                  "index":"1272418",
 *                  "publication":"Expert Syst. Appl.",
 *                  "title":"Locally edge-adapted distance for image interpolation based on genetic fuzzy system.",
 *                  "abstract":"",
 *                  "year":"2010",
 *                  "references":["808173","947678","1150324"],
 *                  "authors":[]
 *              }
 *          ]
 *     }
 */
router.get('/', function(req, res) {

    var query = Aminer.find({});

    if (req.query.index) query.where('index', req.query.index);
    if (req.query.publication) query.where('publication', req.query.publication);
    if (req.query.title) query.where('title', req.query.title);
    if (req.query.year) query.where('year', req.query.year.toString());

    if (req.query.page) query.skip(req.query.page * page_limit);

    query.limit(page_limit);

    query.exec(function (err, data) {

        if (err) {

            return res.json({
                err: true,
                message: 'Unexpected error has occured'
            });

        } else if (data) {

            return res.json({
                err: false,
                message: 'Documents found successfully',
                data: data
            });

        } else {

            return res.json({
                err: false,
                message: 'No matching documents found :/'
            });

        }
    });

});

module.exports = router;
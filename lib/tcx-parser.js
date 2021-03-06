var xml2js = require('xml2js'), parser = new xml2js.Parser();
var fs = require('fs');

var ATTRIBUTE_NAME = '$';

var Trackpoint = function() {
	this.lat = null;
	this.lng = null;
	this.altitude = null;
	this.time = null;
	this.speed = null;
	this.distance = null;
};
var getTrackpoint = function(trackPoint) {
	var point = new Trackpoint();
	if(trackPoint.Position) {
		point.lat = parseFloat(trackPoint.Position[0].LatitudeDegrees);
		point.lng = parseFloat(trackPoint.Position[0].LongitudeDegrees);
	}
	point.altitude = parseFloat(trackPoint.AltitudeMeters);
	point.distance = parseFloat(trackPoint.DistanceMeters);
	point.speed = parseFloat(trackPoint.Extensions[0].TPX[0].Speed);
	point.time = new Date(trackPoint.Time);
	return point;
};

var getTrk = function(trks) {
	var returnTrks = [], trkpts, trkpt;
	var i, len, j, jlen;
	if(!( trks instanceof Array)) {
		trks = [trks];
	}
	for( i = 0, len = trks.length; i < len; i++) {
		trkpts = trks[i].Lap[0].Track[0].Trackpoint;
		for( j = 0, jlen = trkpts.length; j < jlen; j++) {
			trkpt = getTrackpoint(trkpts[j]);
			returnTrks.push(trkpt);
		}
	}

	return returnTrks;
};

var tcxParse = function(data, callback) {
	parser.parseString(data, function(err, result) {
		if(err) {
			return callback(err, null);
		}

		callback(null, getTrk(result.TrainingCenterDatabase.Activities[0].Activity));
	});
};
var tcxParseFile = function(filename, callback) {
	fs.readFile(filename, function(err, result) {
		if(err) {
			return callback(err, null);
		}
		tcxParse(result, callback);
	});
};

module.exports = {
	tcxParse : tcxParse,
	tcxParseFile : tcxParseFile
};

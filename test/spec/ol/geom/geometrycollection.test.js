import _ol_geom_Geometry_ from '../../../../src/ol/geom/Geometry.js';
import _ol_geom_GeometryCollection_ from '../../../../src/ol/geom/GeometryCollection.js';
import _ol_geom_LineString_ from '../../../../src/ol/geom/LineString.js';
import _ol_geom_Point_ from '../../../../src/ol/geom/Point.js';
import _ol_geom_Polygon_ from '../../../../src/ol/geom/Polygon.js';

describe('ol.geom.GeometryCollection', function() {

  var outer = [[0, 0], [0, 10], [10, 10], [10, 0], [0, 0]];
  var inner1 = [[1, 1], [2, 1], [2, 2], [1, 2], [1, 1]];
  var inner2 = [[8, 8], [9, 8], [9, 9], [8, 9], [8, 8]];

  describe('constructor', function() {

    var line, multi, point, poly;
    beforeEach(function() {
      point = new _ol_geom_Point_([10, 20]);
      line = new _ol_geom_LineString_([[10, 20], [30, 40]]);
      poly = new _ol_geom_Polygon_([outer, inner1, inner2]);
      multi = new _ol_geom_GeometryCollection_([point, line, poly]);
    });

    it('creates a geometry collection from an array of geometries', function() {
      expect(multi).to.be.a(_ol_geom_GeometryCollection_);
      expect(multi).to.be.a(_ol_geom_Geometry_);
    });

    it('fires a change event when one of its component changes',
        function(done) {
          multi.on('change', function() {
            done();
          });
          point.setCoordinates([10, 10]);
        }
    );

    it('deregister old components', function() {
      multi.setGeometries([poly]);
      multi.on('change', function() {
        expect().fail();
      });
      point.setCoordinates([10, 10]);
    });

    it('register new components', function(done) {
      var point2 = new _ol_geom_Point_([10, 20]);
      multi.setGeometriesArray([point2]);
      multi.on('change', function() {
        done();
      });
      point2.setCoordinates([10, 10]);
    });

  });

  describe('#getGeometries', function() {

    it('returns a collection of geometries', function() {
      var point = new _ol_geom_Point_([10, 20]);
      var line = new _ol_geom_LineString_([[10, 20], [30, 40]]);
      var poly = new _ol_geom_Polygon_([outer, inner1, inner2]);
      var multi = new _ol_geom_GeometryCollection_([point, line, poly]);

      var geometries = multi.getGeometries();
      expect(geometries).to.be.an(Array);
      expect(geometries).to.have.length(3);
      expect(geometries[0]).to.be.a(_ol_geom_Point_);
      expect(geometries[1]).to.be.a(_ol_geom_LineString_);
      expect(geometries[2]).to.be.a(_ol_geom_Polygon_);
    });

  });

  describe('#clone()', function() {

    it('has a working clone method', function() {
      var point = new _ol_geom_Point_([10, 20]);
      var line = new _ol_geom_LineString_([[10, 20], [30, 40]]);
      var poly = new _ol_geom_Polygon_([outer, inner1, inner2]);
      var multi = new _ol_geom_GeometryCollection_([point, line, poly]);
      var clone = multi.clone();
      expect(clone).to.not.be(multi);
      var geometries = clone.getGeometries();
      expect(geometries[0].getCoordinates()).to.eql([10, 20]);
      expect(geometries[1].getCoordinates()).to.eql([[10, 20], [30, 40]]);
      expect(geometries[2].getCoordinates()).to.eql([outer, inner1, inner2]);
    });

    it('does a deep clone', function() {
      var point = new _ol_geom_Point_([30, 40]);
      var originalGeometries = [point];
      var multi = new _ol_geom_GeometryCollection_(originalGeometries);
      var clone = multi.clone();
      var clonedGeometries = clone.getGeometries();
      expect(clonedGeometries).not.to.be(originalGeometries);
      expect(clonedGeometries).to.have.length(originalGeometries.length);
      expect(clonedGeometries).to.have.length(1);
      expect(clonedGeometries[0]).not.to.be(originalGeometries[0]);
      expect(clonedGeometries[0].getCoordinates()).
          to.eql(originalGeometries[0].getCoordinates());
    });

  });

  describe('#getExtent()', function() {

    it('returns the bounding extent', function() {
      var point = new _ol_geom_Point_([10, 2]);
      var line = new _ol_geom_LineString_([[1, 20], [30, 40]]);
      var multi = new _ol_geom_GeometryCollection_([point, line]);
      var extent = multi.getExtent();
      expect(extent[0]).to.be(1);
      expect(extent[2]).to.be(30);
      expect(extent[1]).to.be(2);
      expect(extent[3]).to.be(40);
    });

  });

  describe('#intersectsExtent()', function() {

    var point, line, poly, multi;

    beforeEach(function() {
      point = new _ol_geom_Point_([5, 20]);
      line = new _ol_geom_LineString_([[10, 20], [30, 40]]);
      poly = new _ol_geom_Polygon_([outer, inner1, inner2]);
      multi = new _ol_geom_GeometryCollection_([point, line, poly]);
    });

    it('returns true for intersecting point', function() {
      expect(multi.intersectsExtent([5, 20, 5, 20])).to.be(true);
    });

    it('returns true for intersecting part of lineString', function() {
      expect(multi.intersectsExtent([25, 35, 30, 40])).to.be(true);
    });

    it('returns true for intersecting part of polygon', function() {
      expect(multi.intersectsExtent([0, 0, 5, 5])).to.be(true);
    });

    it('returns false for non-matching extent within own extent', function() {
      var extent = [0, 35, 5, 40];
      expect(poly.intersectsExtent(extent)).to.be(false);
    });

  });

  describe('#setGeometries', function() {

    var line, multi, point, poly;
    beforeEach(function() {
      point = new _ol_geom_Point_([10, 20]);
      line = new _ol_geom_LineString_([[10, 20], [30, 40]]);
      poly = new _ol_geom_Polygon_([outer, inner1, inner2]);
      multi = new _ol_geom_GeometryCollection_([point, line, poly]);
    });

    it('fires a change event', function() {
      var listener = sinon.spy();
      multi.on('change', listener);
      multi.setGeometries([point, line, poly]);
      expect(listener.calledOnce).to.be(true);
    });

    it('updates the extent', function() {
      expect(multi.getExtent()).to.eql([0, 0, 30, 40]);
      line.setCoordinates([[10, 20], [300, 400]]);
      expect(multi.getExtent()).to.eql([0, 0, 300, 400]);
    });

  });

  describe('#scale()', function() {

    it('scales a collection', function() {
      var geom = new _ol_geom_GeometryCollection_([
        new _ol_geom_Point_([-1, -2]),
        new _ol_geom_LineString_([[0, 0], [1, 2]])
      ]);
      geom.scale(10);
      var geometries = geom.getGeometries();
      expect(geometries[0].getCoordinates()).to.eql([-10, -20]);
      expect(geometries[1].getCoordinates()).to.eql([[0, 0], [10, 20]]);
    });

    it('accepts sx and sy', function() {
      var geom = new _ol_geom_GeometryCollection_([
        new _ol_geom_Point_([-1, -2]),
        new _ol_geom_LineString_([[0, 0], [1, 2]])
      ]);
      geom.scale(2, 3);
      var geometries = geom.getGeometries();
      expect(geometries[0].getCoordinates()).to.eql([-2, -6]);
      expect(geometries[1].getCoordinates()).to.eql([[0, 0], [2, 6]]);
    });

    it('accepts an anchor', function() {
      var geom = new _ol_geom_GeometryCollection_([
        new _ol_geom_Point_([-1, -2]),
        new _ol_geom_LineString_([[0, 0], [1, 2]])
      ]);
      geom.scale(10, 15, [-1, -2]);
      var geometries = geom.getGeometries();
      expect(geometries[0].getCoordinates()).to.eql([-1, -2]);
      expect(geometries[1].getCoordinates()).to.eql([[9, 28], [19, 58]]);
    });

  });

  describe('#transform()', function() {

    var line, multi, point;
    beforeEach(function() {
      point = new _ol_geom_Point_([10, 20]);
      line = new _ol_geom_LineString_([[10, 20], [30, 40]]);
      multi = new _ol_geom_GeometryCollection_([point, line]);
    });

    it('transforms all geometries', function() {
      multi.transform('EPSG:4326', 'EPSG:3857');

      var geometries = multi.getGeometries();
      expect(geometries[0]).to.be.a(_ol_geom_Point_);
      expect(geometries[1]).to.be.a(_ol_geom_LineString_);

      var coords = geometries[0].getCoordinates();
      expect(coords[0]).to.roughlyEqual(1113194.90, 1e-2);
      expect(coords[1]).to.roughlyEqual(2273030.92, 1e-2);

      coords = geometries[1].getCoordinates();
      expect(coords[0][0]).to.roughlyEqual(1113194.90, 1e-2);
      expect(coords[0][1]).to.roughlyEqual(2273030.92, 1e-2);
      expect(coords[1][0]).to.roughlyEqual(3339584.72, 1e-2);
      expect(coords[1][1]).to.roughlyEqual(4865942.27, 1e-2);
    });

  });

});

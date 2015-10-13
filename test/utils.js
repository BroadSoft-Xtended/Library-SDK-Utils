var expect = require('expect')

describe('utils', function() {

  before(function() {
    utils = require('../');
  });
  
  it('isValidUsPstn', function() {
    expect(utils.isValidUsPstn('240-534-2345')).toEqual( true);
    expect(utils.isValidUsPstn('1240-534-2345')).toEqual( true);
    expect(utils.isValidUsPstn('1(240)-(534)-(2345)')).toEqual( true);
    expect(utils.isValidUsPstn('(240)-(534)-(2345)')).toEqual( true);
    expect(utils.isValidUsPstn('(240)(534)(2345)')).toEqual( true);
    expect(utils.isValidUsPstn('22345678908')).toEqual( false);
    expect(utils.isValidUsPstn('asasdasdas')).toEqual( false);
  });

  it('addUrlParams', function() {
    var url = 'http://test.com?a=1';
    var params = {b: 2, c: 3}
    expect(utils.addUrlParams(url, params)).toEqual(url+'&b=2&c=3');
  })

  it('addUrlParams with encoded param', function() {
    var url = 'http://test.com?a=1';
    var params = {b: 2, c: 'http://test.com?param1=test1'}
    expect(utils.addUrlParams(url, params)).toEqual(url+'&b=2&c=http%3A%2F%2Ftest.com%3Fparam1%3Dtest1');
  })

  it('addUrlParams with array', function() {
    var url = 'http://test.com';
    var params = {arr: ['A', 'B', 'C']}
    expect(utils.addUrlParams(url, params)).toEqual(url+'?arr=A&arr=B&arr=C');
  })

});
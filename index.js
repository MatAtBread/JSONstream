var stream = require('stream');

const JSONStream = function(options) {
  if (!(this instanceof JSONStream))
    return new JSONStream(options);
  this.json = '';
  options = options || {};
  options.objectMode = true ;
  return stream.Transform.call(this,options);
};

JSONStream.prototype = Object.create(stream.Transform.prototype,{constuctor:{value:JSONStream}});

JSONStream.prototype.tryJsonParts = function() {
  while (this.json) {
    var result;
    try {
      result = JSON.parse(this.json) ;
      this.push(result) ;
      this.json = '' ;
      return ;
    } catch (ex) {
      if (ex.message === "Unexpected end of JSON input") {
        return ; // Not a complete object
      }
      var p = ex.message.match(/Unexpected token { in JSON at position ([0-9]+)/) ;
      if (!p)
        throw ex ;
      result = JSON.parse(this.json.slice(0,+p[1])) ;
      this.push(result) ;
      this.json = this.json.slice(+p[1]);
    }
  }
}

JSONStream.prototype._transform = function(chunk,encoding,done) {
  this.json += chunk.toString();
  // Push any complete objects
  this.tryJsonParts() ;
  done() ;
}

JSONStream.prototype._flush = function (done) {
  // Push any complete objects
  this.tryJsonParts() ;
  done();
}

module.exports = JSONStream;

if (require.main === module) {
  /* Basic test from STDIN */
  let transform = x => x;
  if (process.argv[2]) {
    x = new Function("_","return ("+process.argv[2]+")");
  }
  var s = new JSONStream() ;
  s.on('data', object => console.log(x(object)));
  process.stdin.pipe(s);
}

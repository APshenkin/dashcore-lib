/* eslint-disable */
// TODO: Remove previous line and work through linting issues at next edit

var Hash = require('../../crypto/hash');
var Signer = require('../../crypto/signer');

/**
 * @constructor
 */
function AbstractPayload() {

}

/**
 *
 * @param [options]
 * @param {Boolean} options.skipSignature - skip signature when serializing. Needed for signing payload
 * @return {Buffer}
 */
AbstractPayload.prototype.toBuffer = function(options) {
  throw new Error('Not implemented');
};

AbstractPayload.calculateInputsHash = function(tx) {
  const inputs = [];
  tx.inputs.forEach((input) => {
    inputs.push(input.toBufferWriter().bufs[0]);
    inputs.push(input.toBufferWriter().bufs[1]);
  });

  return Hash.sha256sha256(Buffer.concat(inputs)).reverse().toString('hex')
}

/**
 * @param [options]
 * @param {Boolean} options.skipSignature - skip signature when serializing. Needed for signing payload
 * @return {Object}
 */
AbstractPayload.prototype.toJSON = function(options) {
  throw new Error('Not implemented');
};

/**
 * @param [options]
 * @param {Boolean} options.skipSignature - skip signature when serializing. Needed for signing payload
 * @return {string}
 */
AbstractPayload.prototype.toString = function(options) {
  return this.toBuffer().toString('hex');
};

/**
 * @param [options]
 * @param {Boolean} options.skipSignature - skip signature when serializing. Needed for signing payload
 * @return {Buffer} - hash
 */
AbstractPayload.prototype.getHash = function(options) {
  return Hash.sha256sha256(this.toBuffer(options));
};

/**
 * Signs payload
 * @param {string|PrivateKey} privateKey
 * @return {AbstractPayload}
 */
AbstractPayload.prototype.sign = function(privateKey) {
  var payloadHash = this.getHash({ skipSignature: true });
  var signatureBuffer = Signer.signHash(payloadHash, privateKey);
  this.payloadSig = signatureBuffer.toString('hex');
  this.payloadSigSize = this.payloadSig.length / 2;
  return this;
};

/**
 * Verify payload signature
 * @param {string|Buffer} publicKeyId
 * @return {boolean}
 */
AbstractPayload.prototype.verifySignature = function (publicKeyId) {
  var payloadHash = this.getHash({ skipSignature: true });
  var signatureBuffer = Buffer.from(this.payloadSig, 'hex');
  return Signer.verifyHashSignature(payloadHash, signatureBuffer, publicKeyId);
};

module.exports = AbstractPayload;

const { stitchSchemas } = require('@graphql-tools/stitch');
const userSchema = require('./userSchema');
const productSchema = require('./productSchema');

const gatewaySchema = stitchSchemas({
  subschemas: [
    { schema: userSchema },
    { schema: productSchema },
  ],
});

module.exports = gatewaySchema;


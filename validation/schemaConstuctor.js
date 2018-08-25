module.exports = function schemeConstruct(model) {
  const { rawAttributes } = model;
  const schema = {
    'type': 'object',
    'properties': null,
    'additionalProperties': false,
  };

  const properties = {};
  const attrNames = Object.keys(rawAttributes)
    .filter(attrName => attrName !== 'id' && attrName !== 'createdAt' && attrName !== 'updatedAt');
  const attrVals = Object.values(rawAttributes);
  attrNames.forEach((attrName) => {
    attrVals.forEach((value) => {
      if (value.fieldName === attrName) {
        const type = value.type.constructor.name.toLowerCase();
        if (type === 'enum') {
          properties[attrName] = { 'type': typeof value.values[0], 'enum': value.values };
        } else if (type === 'float') {
          properties[attrName] = { 'type': 'number' };
        } else if (type === 'date') {
          properties[attrName] = { 'type': 'string', 'format': 'date'/* , 'required': true */ };
        } else {
          properties[attrName] = { 'type': type/* , 'required': true */ };
        }
      }
    });
  });
  schema.properties = properties;
  return schema;
};


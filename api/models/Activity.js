/**
 * Activity.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    title: {
      type: 'string',
      required: true,
      maxLength: 200,
    },
    shortDescription: {
      type: 'string',
      required: true,
      maxLength: 250,
    },
    description: {
      type: 'string',
      required: true,
      columnType: 'text'
    },
    type: {
      type: 'string',
      required: true,
      maxLength: 200,
    },
    location: {
      type: 'string',
      required: true,
      maxLength: 200,
    },
    startDate: {
      type: 'string',
    },
    startTime: {
      type: 'string',
    },
    endDate: {
      type: 'string',
    },
    endTime: {
      type: 'string',
    },
    subject: {
      type: 'string',
      required: true,
      maxLength: 200,
    },
    otherSubject: {
      type: 'string',
      maxLength: 200,
    },
    targetPeleton: {
      type: 'boolean',
      defaultsTo: false,
    },
    targetInzetbaarPersoneel: {
      type: 'boolean',
      defaultsTo: false,
    },
    targetKader: {
      type: 'boolean',
      defaultsTo: false,
    },
    deadline: {
      type: 'string',
    },
    update: {
      type: 'number',
      defaultsTo: 0,
    },
  },
};


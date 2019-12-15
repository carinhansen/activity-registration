/**
 * UserActivity.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    activityId: {
      type: 'number',
    },
    userId: {
      type: 'number',
    },
    present: {
      type: 'number',
      defaultsTo: 0,
    }
  },
};


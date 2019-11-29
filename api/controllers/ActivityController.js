/**
 * ActivityController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  add: function(req, res){
    res.view('pages/add-activity');
  },
  overview: function(req, res){
    Activity.find({}).exec((err, activities) => {
      if(err){
        res.send(500, {error: 'DB Error'});
      }
      res.view('pages/activity-overview', {activities: activities});
    });
  },
  create:function(req, res){
    let title = req.body.title;
    let description = req.body.description;

    Activity.create({title:title, description:description}).exec((err) => {
      if(err){
        res.send(500, {error: 'DB Error'});
      }
      res.redirect('/activiteiten');
    });
  },
  detail: async function(req, res){
    let activity = await Activity.findOne({id:req.params.id});

    res.view('pages/detail', {activity: activity});

  }
};


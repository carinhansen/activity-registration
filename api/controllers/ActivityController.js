/**
 * ActivityController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  add: async function(req, res){
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
  create: async function(req, res){
    let title = req.body.title;
    let description = req.body.description;
    let shortDescription = req.body.shortDescription;
    let type = req.body.type;
    let location = req.body.location;
    let startDate = req.body.startDate;
    let startTime = req.body.startTime;
    let endDate = req.body.endDate;
    let endTime = req.body.endTime;
    let subject = req.body.subject;
    let otherSubject = req.body.otherSubject;
    let targetPeleton = req.body.targetPeleton;
    let targetInzetbaarPersoneel = req.body.targetInzetbaarPersoneel;
    let targetKader = req.body.targetKader;
    let deadline = req.body.deadline;


    Activity.create({title:title, description:description, shortDescription:shortDescription, type:type, location:location, startDate:startDate, startTime:startTime, endDate:endDate, endTime:endTime, subject:subject, otherSubject:otherSubject, targetPeleton:targetPeleton, targetInzetbaarPersoneel: targetInzetbaarPersoneel, targetKader: targetKader, deadline:deadline}).exec((err) => {
      if(err){
        res.send(500, {error: 'DB Error'});
      }
      res.redirect('/activiteiten');
    });
  },
  edit: async function(req, res){
    let usersInActivity = new Array();
    let usersNotInActivity = new Array();
    let userIds = new Array();

    let activity = await Activity.findOne({id:req.params.id});

    let userActivity = await UserActivity.find({activityId: req.params.id});

    for(let i = 0; i < userActivity.length; i++){
      userIds.push(userActivity[i].userId);
    }

    if(userActivity) {
      usersInActivity = await User.find({id: userIds, isSuperAdmin: false});
      usersNotInActivity = await User.find({id: {'!=': userIds}, isSuperAdmin: false});

      res.view('pages/edit-activity', {activity:activity, usersIn: usersInActivity, usersOut: usersNotInActivity});
    } else {
      let users = await User.find({isSuperAdmin: false});

      res.view('pages/edit-activity', {activity:activity, usersIn: usersInActivity, usersOut: users});
    }
  },
  update: async function(req, res){
    let title = req.body.title;
    let description = req.body.description;
    let shortDescription = req.body.shortDescription;
    let type = req.body.type;
    let location = req.body.location;
    let startDate = req.body.startDate;
    let startTime = req.body.startTime;
    let endDate = req.body.endDate;
    let endTime = req.body.endTime;
    let subject = req.body.subject;
    let targetPeleton = req.body.targetPeleton;
    let targetInzetbaarPersoneel = req.body.targetInzetbaarPersoneel;
    let targetKader = req.body.targetKader;
    let users = req.body.userID;

    let activity = await Activity.findOne({id: req.params.id});
    let addUpdateCount = activity.update += 1;

    // removes users that were previously added but are not selected after edit
    await UserActivity.destroy({activityId: req.params.id, userId: {'!=': users}});

    // add all selected users from checkbox
    for(let i = 0; i < users.length; i++){
      let addUser = users[i];
      let checkUserInAcitvity = await UserActivity.findOne({activityId: req.params.id, userId: addUser});

      if(!checkUserInAcitvity){
        await UserActivity.create({activityId: req.params.id, userId: addUser});
      }
    }

    Activity.updateOne({id: req.params.id},{title:title, description:description, shortDescription:shortDescription, type:type, location:location, startDate:startDate, startTime:startTime, endDate:endDate, endTime:endTime, subject:subject, targetPeleton:targetPeleton, targetInzetbaarPersoneel: targetInzetbaarPersoneel, targetKader: targetKader, update: addUpdateCount}).exec((err) => {
      if(err){
        res.send(500, {error: 'DB Error'});
      }

      res.redirect('/activiteiten');
    });
  },
  detail: async function(req, res){
    let activity = await Activity.findOne({id:req.params.id});

    let userActivities = await UserActivity.find({activityId:req.params.id, present: 0});

    let allUsers = new Array();
    for (let user of userActivities) {
      let fullActivity = await User.findOne({id:user.userId});
      allUsers.push(fullActivity);
    }


    let presentUsers = await UserActivity.find({activityId:req.params.id, present: 1});

    let allPresentUsers = new Array();
    for (let presentUser of presentUsers) {
      let fullActivity = await User.findOne({id:presentUser.userId});
      allPresentUsers.push(fullActivity);
    }

    res.view('pages/detail', {activity: activity, users: allUsers, presentUsers: allPresentUsers});

  },
  delete:function(req, res){
    Activity.destroy({id:req.params.id}).exec((err) => {
      if(err){
        res.send(500, {error: 'DB Error'});
      }
      res.redirect('/activiteiten');
    });

    return false;
  },
  personalOverview:async function(req,res){
    let userActivities = await UserActivity.find({userId:req.me.id});
    let allActivities = new Array();
    for (let activity of userActivities) {
      let fullActivity = await Activity.findOne({id:activity.activityId});
      allActivities.push(fullActivity);
    }

    let nearActivities = new Array();
    for (let nearActivity of userActivities) {
      let fullActivity = await Activity.findOne({id:nearActivity.activityId});


      for(let i = 0; i <= 7; i++){
        let currentDate = new Date();
        let futureDate = currentDate.getDate() + i;
        currentDate.setDate(futureDate);

        let newYear = currentDate.getFullYear();
        let newMonth = currentDate.getMonth() + 1;
        if(newMonth < 10){
          newMonth = '0' + newMonth;
        }
        let newDay = currentDate.getDate();
        if(newDay < 10){
          newDay = '0' + newDay;
        }

        let date = newYear + '-' + newMonth + '-' + newDay;

        if(fullActivity.startDate === date) {
          nearActivities.push(fullActivity);
        }
      }
    }




    let editActivities = new Array();
    for (let editActivity of userActivities) {
      let fullActivity = await Activity.findOne({id:editActivity.activityId});

      if(fullActivity.update >= 2) {
        editActivities.push(fullActivity);
      }
    }

    res.view('pages/personal-overview', {activities: allActivities, edits: editActivities, nearActivities: nearActivities});
  },
  present: async function(req, res){
    let present = await UserActivity.find({activityId: req.params.id, userId: req.me.id});

    UserActivity.update({id: present[0].id},{present: 1}).exec((err) => {
      if(err){
        res.send(500, {error: 'DB Error'});
      }
      res.redirect('/persoonlijk-overzicht');
    });
  },
  notPresent: async function(req, res){
    let present = await UserActivity.find({activityId: req.params.id, userId: req.me.id});

    UserActivity.update({id: present[0].id},{present: 2}).exec((err) => {
      if(err){
        res.send(500, {error: 'DB Error'});
      }
      res.redirect('/persoonlijk-overzicht');
    });
  },
};


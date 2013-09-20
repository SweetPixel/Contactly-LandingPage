Emails = new Meteor.Collection("emails")

EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


// Github account usernames of admin users
var ADMIN_USERS = ['aliirz'];
function isAdmin(userId) {
  var user = Meteor.users.findOne({_id: userId});
  try {
    return ADMIN_USERS.indexOf(user.services.github.username) !== -1
  } catch(e) {
    return false;
  }
}

if (Meteor.isClient) {
  Meteor.subscribe('userData');
  Meteor.subscribe('emails');
  Template.signup.events({
    'submit form' :function(evt, tmpl){
      var email = tmpl.find('input').value, doc = {email: email, referrer: document.referrer, timestamp: new Date()}
      if(EMAIL_REGEX.test(email)){
        Session.get("showBadEmail",false);
        Meteor.call("sendEmail","ali@sweetpixelstudios.com",email,"A new signup","Hello "+email+" would like to signup.");
        Session.set("emailSubmitted",true);
      }
      else
      {
        Session.set("showBadEmail",true);
      }
      return false;
    }
  });

  Template.signup.showBadEmail = function(){
    return Session.get("showBadEmail");
  };

  Template.signup.emailSubmitted = function(){
    return Session.get("emailSubmitted");
  };

  
}

if (Meteor.isServer) {
  Meteor.methods({
    sendEmail: function(to, from, subject, text){
      check([to, from, subject, text],[String]);
      this.unblock();
      Email.send({
        to: to,
        from: from,
        subject: subject,
        text: text
      });
    }
  })
}
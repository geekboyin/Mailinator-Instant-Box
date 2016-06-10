(function($) {
  /* Focus on search field when open popup */
  $('#email-form input').focus();

  const HOUR_IN_SECONDS = 3600;
  const DAY_IN_SECONDS = 86400;
  const WEEK_IN_SECONDS = 604800;
  const MONTH_IN_SECONDS = 2678400;
  const YEAR_IN_SECONDS = 31536000;

  var numberEnding = function(number) {
    return (number > 1) ? 's' : '';
  }

  var humanTimeDiff = function(time) {
    if(time < 60) {
      time = "a moment";
    } else if(time >= 60 && time < HOUR_IN_SECONDS) {
      time = Math.round(time / 60);
      time = time + " minute" + numberEnding(time);
    } else if(time >= HOUR_IN_SECONDS && time < DAY_IN_SECONDS) {
      time = Math.round(time / HOUR_IN_SECONDS);
      time = time + " hour" + numberEnding(time);
    } else if(time >= DAY_IN_SECONDS && time < WEEK_IN_SECONDS) {
      time = Math.round(time / DAY_IN_SECONDS);
      time = time + " day" + numberEnding(time);
    } else if(time >= WEEK_IN_SECONDS && time < MONTH_IN_SECONDS) {
      time = Math.round(time / WEEK_IN_SECONDS);
      time = time + " week" + numberEnding(time);
    } else if(time >= MONTH_IN_SECONDS && time < YEAR_IN_SECONDS) {
      time = Math.round(time / MONTH_IN_SECONDS);
      time = time + " month" + numberEnding(time);
    } else if(time >= YEAR_IN_SECONDS) {
      time = Math.round(time / YEAR_IN_SECONDS);
      time = time + " year" + numberEnding(time);
    }

    return time;
  }

  /******************
   | COMPONENTS
   ******************/
  var InboxDetail = Vue.extend({
    template: '#inbox-detail-template',
    props: ['detail'],
    data: function() {
      return {
        showButton: true,
        showDetail: true
      }
    },
    methods: {
      closeDetail: function() {
        var self = this;
        self.showButton = false;
        setTimeout(function() {
          self.showDetail = false;
        }, 1000);
      }
    }
  });

  var InboxItem = Vue.extend({
    template: '#inbox-item-template',
    props: ['model'],
    components: {
      'inbox-detail': InboxDetail
    },
    data: function() {
      return {
        inboxDetail: '',
        showDetail: false
      }
    },
    computed: {
      humanTimeDiff: function() {
        return humanTimeDiff(this.model.seconds_ago);
      }
    },
    methods: {
      fetchMail: function(msgid, event) {
        event.preventDefault();
        var self = this;
        var target = $(event.currentTarget);
        $.ajax({
          method: 'GET',
          dataType: 'jsonp',
          url: 'https://mailinator.com/fetchmail?zone=public',
          data: {
            msgid: msgid
          },
          beforeSend: function() {
          },
          success: function(response) {
            self.inboxDetail = response.data;
            self.showDetail = true;
          },
          complete: function() {
          }
        });
      }
    }
  });

  var ListInbox = Vue.extend({
    template: '#list-inbox-template',
    props: ['collection'],
    components: {
      'inbox-item': InboxItem
    }
  });

  /* App container */
  var MailinatorBox = new Vue({
    el: '#app',
    components: {
      'list-inbox': ListInbox
    },
    data: {
      listInbox: '',
      mail: 'mjebuyer',
      isFetching: false
    },
    ready: function() {
      $(this.el).find('#email-form input').focus();
    },
    computed: {
      isEmpty: function() {
        return (this.listInbox.length == 0) ? true : false;
      }
    },
    methods: {
      fetchInbox: function(event) {
        var self = this;
        var target = $(event.currentTarget);
        $.ajax({
          method: 'GET',
          dataType: 'json',
          url: 'https://mailinator.com/api/webinbox2',
          data: {
            public_to: self.mail
          },
          beforeSend: function() {
            target.blur();
            self.isFetching = true;
          },
          success: function(response) {
            self.listInbox = response.public_msgs.reverse();
          },
          complete: function() {
            target.focus();
            self.isFetching = false;
          }
        })
      }
    }
  });
})(jQuery);
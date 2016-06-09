(function($) {
  /******************
   | COMPONENTS
   ******************/
  var InboxItem = Vue.extend({
    template: '#inbox-item-template',
    props: ['model']
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
    },
    ready: function() {
      this.getInbox();
    },
    methods: {
      getInbox: function() {
        $.ajax({
          method: 'GET',
          dataType: 'jsonp',
          url: 'https://mailinator.com/api/webinbox2?x=2',
          data: {
            public_to: 'mjebuyer'
          },
          beforeSend: function() {

          },
          success: function(response) {
            
          }
        })
      }
    }
  });
})(jQuery);
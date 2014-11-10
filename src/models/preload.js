/*globals define*/
define(function(require, exports, module) {
    
    // var Player              = require('models/player'),
        // Game                = require('models/game'),
        // Sport               = require('models/sport'),
        // RelationshipCode    = require('models/relationship_code'),
    // var User                = require('models/user');
    // var FriendModel                = require('models/friend');
    // var GroupModel                = require('models/group');
    // var InvoiceModel                = require('models/invoice');
    // var MessageModel                = require('models/message');
    // var ActionModel                = require('models/action');

    module.exports = function(App){

        // Load our existing models first
        // - should have already been loaded into App.Data (or similar)
        // - initiate a fetcs

        // Preload the necessary models by fetching from the server
        console.info('preloading models');

        // Load JSON data
        var BoothList         = JSON.parse(require('text!models/data/booth_list.json'));
        var PartyList         = JSON.parse(require('text!models/data/party_list.json'));
        var SpeakerList         = JSON.parse(require('text!models/data/speaker_list.json'));
        var TipsList         = JSON.parse(require('text!models/data/tip_list.json'));

        // App.Data.UserFriends = new FriendModel.FriendCollection([],{
        //     type: 'friend'
        // });



        // // Firebase
        // // - needs auth
        // App.Data.User.populated().then(function(){
        //     var firebase = new Firebase(App.Credentials.firebase_url + 'users/' + App.Data.User.get('_id'));
        //     firebase.on('child_changed', function (snapshot) {
        //         console.info('firebase child_added');
        //         App.Events.trigger('firebase.child_added', snapshot);
        //     });
        // });

        // Collections and Models preloading


        return;

        if(App.Data.User.get('_id')){
            // Logged in

            // App.Data.UserFriends.fetch({prefill: true});

            // Groups/batches
            App.Data.GroupCollection = new GroupModel.GroupCollection([],{
                '$filter' : {
                    tags: {
                        '$ne' : 'complete'
                    }
                }
            });
            App.Data.GroupCollection.on('sync', function(){
                // App.Views.MainFooter.Tabs.buttons[0].setOptions({
                //     content: '<i class="icon ion-android-lightbulb"></i><div><span class="ellipsis-all">'+App.Data.GroupCollection.totalResults+' Jobs</span></div>'
                // });
                // App.Data.GroupCollection.totalResults;
            });
            App.Data.GroupCollection.fetch();

            // // Invoices
            // App.Data.InvoiceCollection = new InvoiceModel.InvoiceCollection([],{
            //     '$filter' : {
            //         tags: {
            //             '$ne' : 'complete'
            //         }
            //     }
            // });
            // App.Data.InvoiceCollection.on('sync', function(){
            //     App.Views.MainFooter.Tabs.buttons[1].setOptions({
            //         content: '<i class="icon ion-social-usd"></i><div><span class="ellipsis-all">'+App.Data.InvoiceCollection.totalResults+' Invoices</span></div>'
            //     });
            //     App.Data.InvoiceCollection.totalResults;
            // });
            // App.Data.InvoiceCollection.fetch();

            // // // Updates
            // // App.Data.ActionCollection = new ActionModel.ActionCollection([],{
            // //     // type: 'friend'
            // // });
            // // App.Data.ActionCollection.on('sync', function(){
            // //     App.Views.MainFooter.Tabs.buttons[1].setOptions({
            // //         content: '<i class="icon ion-android-sort"></i><div><span class="ellipsis-all">'+App.Data.ActionCollection.totalResults+' Updates</span></div>'
            // //     });
            // //     App.Data.ActionCollection.totalResults;
            // // });
            // // App.Data.ActionCollection.fetch();

            // // Unread Messages
            // App.Data.MessageCollection = new MessageModel.MessageCollection([],{
            //     '$filter' : {
            //         to_user_id: App.Data.User.get('_id'),
            //         read: false
            //     }
            // });
            // App.Data.MessageCollection.on('sync', function(){
            //     App.Views.MainFooter.Tabs.buttons[2].setOptions({
            //         content: '<i class="icon ion-android-inbox"></i><div><span class="ellipsis-all">'+App.Data.MessageCollection.totalResults+' Msgs</span></div>'
            //     });
            //     App.Data.MessageCollection.totalResults;
            // });
            // App.Data.MessageCollection.fetch();

            // console.log('Logged in, preloading');
            // console.log(App);
            // debugger;
            // App.Data.Sports = new Sport.SportCollection();
            // App.Data.Sports.fetch({prefill: true});


            // debugger;
        } else {
            // Not logged in
            // - probably not fetching anything!
            // debugger;
        }
        
        // // Player List
        // App.Data.Players = new Player.PlayerCollection();
        // App.Data.Players.fetch({prefill: true});

        return true;

    };

});

/*globals define*/
define(function(require, exports, module) {

    var Engine = require('famous/core/Engine');
    var View = require('famous/core/View');
    var ScrollView = require('famous/views/Scrollview');
    var SequentialLayout = require('famous/views/SequentialLayout');
    var Surface = require('famous/core/Surface');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Modifier = require('famous/core/Modifier');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Transitionable     = require('famous/transitions/Transitionable');
    var Transform = require('famous/core/Transform');
    var Matrix = require('famous/core/Transform');
    var RenderNode         = require('famous/core/RenderNode')

    var Utility = require('famous/utilities/Utility');
    var Timer = require('famous/utilities/Timer');

    // Helpers
    var Utils = require('utils');
    var $ = require('jquery-adapter');
    var Handlebars = require('lib2/handlebars-helpers');

    var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');
    var NavigationBar = require('famous/widgets/NavigationBar');
    var GridLayout = require("famous/views/GridLayout");

    // Subviews
    var StandardHeader = require('views/common/StandardHeader');

    // Extras
    var Credentials         = JSON.parse(require('text!credentials.json'));
    var numeral = require('lib2/numeral.min');

    // Data
    var BoothList         = JSON.parse(require('text!models/data/booth_list.json'));

    // // Side menu of options
    // var GameMenuView      = require('views/Game/GameMenu');

    // // Models
    // var GameModel = require('models/game');
    // var PlayerModel = require('models/player');
    // var MediaModel = require('models/media');

    // Templates
    var Handlebars          = require('lib2/handlebars-adapter');
    var tpl_booth      = require('text!./tpl/Booth.html');
    var template_booth = Handlebars.compile(tpl_booth);

    function PageView(params) {
        var that = this;
        View.apply(this, arguments);
        this.params = params;

        // create the layout
        this.layout = new HeaderFooterLayout({
            headerSize: App.Defaults.Header.size,
            footerSize: 60
        });

        this.createHeader();
        this.createContent();

        this.add(this.layout);
    }

    PageView.prototype = Object.create(View.prototype);
    PageView.prototype.constructor = PageView;
    
    PageView.prototype.createHeader = function(){
        var that = this;
        
        // create the header
        this.header = new StandardHeader({
            content: " Find Killer Booth Swag",
            classes: ["normal-header","text-center"],
            backClasses: ["normal-header"],
            backContent: false,
            moreClasses: ["normal-header"],
            moreContent: false, // '<span class="icon ion-navicon-round"></span>'
        }); 
        // this.header._eventOutput.on('back',function(){
        //     App.history.back();//.history.go(-1);
        // });
        this.header.navBar.title.on('click',function(){
            // that.refreshData();
        });
        this.header._eventOutput.on('more',function(){
            // if(that.model.get('CarPermission.coowner')){
            //     App.history.navigate('car/permission/' + that.model.get('_id'), {trigger: true});
            // }
            // that.menuToggle();
        });
        this._eventOutput.on('inOutTransition', function(args){
            this.header.inOutTransition.apply(this.header, args);
        })

        // // Node for Modifier and background
        // this.HeaderNode = new RenderNode();
        // this.HeaderNode.add(this.headerBg);
        // this.HeaderNode.add(this.header.StateModifier).add(this.header);

        // Attach header to the layout        
        this.layout.header.add(this.header);

    };
    
    PageView.prototype.createContent = function(){
        var that = this;

        this.contentView = new View();
        this.contentView.Scrollview = new ScrollView();
        this.contentView.Scrollview.Views = [];

        this.addSurfaces();

        this.contentView.Scrollview.sequenceFrom(this.contentView.Scrollview.Views);

        this.contentView.add(this.contentView.Scrollview);

        this.ContentStateModifier = new StateModifier();
        this.layout.content.add(this.ContentStateModifier).add(Utils.usePlane('content')).add(this.contentView);

    };

    PageView.prototype.addSurfaces = function(){
        var that = this;

        this.createMapButton();

        // sort
        BoothList = _.sortBy(BoothList, function(item){
            return item.Company.toString().toLowerCase();
        });

        // add each template
        BoothList.forEach(function(boothItem){
            // console.log(boothItem);
            var Booth = new Surface({
                content: template_booth(boothItem),
                size: [undefined, true],
                classes: ['booth-list-item']
            });
            Booth.View = new View();
            Booth.View.getSize = function(){
                // console.log(Booth._trueSize);
                return [undefined, Booth._trueSize ? Booth._trueSize[1]:1];
            };
            Booth.pipe(that.contentView.Scrollview);

            Booth.View.add(Booth);

            that.contentView.Scrollview.Views.push(Booth.View);
        });

    };

    PageView.prototype.createMapButton = function(){
        var that = this;
        
        // Add map link
        var Map = new Surface({
            content: '<i class="icon ion-map"></i>&nbsp;&nbsp;&nbsp; View Map PDF',
            wrap: '<div class="outward-button"></div>',
            size: [undefined, true],
            classes: ['button-outwards-default']
        });
        Map.on('click', function(){
            // window.open('http://s15.a2zinc.net/clients/T3Expo/AWSreInvent/Public/Eventmap.aspx', '_system');
            window.open('https://reinvent.awsevents.com/files/reInvent-Maps.pdf', '_system');
        });
        Map.View = new View();
        Map.View.getSize = function(){
            // console.log(Map._trueSize);
            return [undefined, Map._trueSize ? Map._trueSize[1]:1];
        };
        Map.pipe(that.contentView.Scrollview);

        Map.View.add(Map);

        that.contentView.Scrollview.Views.push(Map.View);
    };

    PageView.prototype.refreshData = function(){
        return;
    };

    PageView.prototype.inOutTransition = function(direction, otherViewName, transitionOptions, delayShowing, otherView, goingBack){
        var that = this;

        this._eventOutput.emit('inOutTransition', arguments);

        switch(direction){
            case 'hiding':

                switch(otherViewName){

                    default:
                        // Overwriting and using default identity
                        transitionOptions.outTransform = Transform.identity;

                        Timer.setTimeout(function(){

                            // Bring content back
                            that.ContentStateModifier.setTransform(Transform.translate(window.innerWidth * (goingBack ? 1.5:-1.5),0,0), transitionOptions.outTransition);

                        }, delayShowing);

                        break;
                }

                break;

            case 'showing':
                if(this._refreshData){
                    Timer.setTimeout(this.refreshData.bind(this), 1000);
                }
                this._refreshData = true;
                switch(otherViewName){

                    default:

                        // No animation by default
                        transitionOptions.inTransform = Transform.identity;

                        // // Default header opacity
                        // that.header.StateModifier.setOpacity(0);

                        // Default position
                        that.ContentStateModifier.setTransform(Transform.translate(window.innerWidth * (goingBack ? 1.5:-1.5), 0, 0));

                        // Content
                        // - extra delay
                        Timer.setTimeout(function(){

                            // Bring content back
                            that.ContentStateModifier.setTransform(Transform.translate(0,0,0), transitionOptions.inTransition);

                        }, delayShowing + transitionOptions.outTransition.duration);


                        break;
                }
                break;
        }
        
        return transitionOptions;
    };


    PageView.DEFAULT_OPTIONS = {
        header: {
            size: [undefined, 50],
        },
        footer: {
            size: [0,0]
        },
        content: {
            size: [undefined, undefined],
            inTransition: true,
            outTransition: true,
            overlap: true
        }
    };

    module.exports = PageView;

});

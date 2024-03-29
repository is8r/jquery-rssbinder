/*
 * //////////////////////////////////////////////////////////////////////
 * rssbinder
 * 
 * @description bind rss feeds.
 * @version 1.0
 * @date October-2011
 * @author Yu Ishihara - http://hommebrew.com/
 * @requires jQuery v1.6 or later, google ajax API
 * @example http://is8r.github.com/jquery-plugin/rssbinder/
 * 
 * 
 * @howtouse

//head
	<!--dyrect-->
	<style type="text/css">
	#feed
	{
		width: 500px;
		margin: 0 auto;
	}
	ul.list-feed
	{
		_zoom: 1;
		overflow: hidden;
	    border-top: 1px dotted #ddd;
	    border-bottom: 1px dotted #ddd;
    }
	ul.list-feed li
	{
	    margin-top: -1px;
	    border-top: 1px dotted #ddd;
	}
	ul.list-feed li a
	{
		display: block;
		padding: 10px;
		font-size: 16px;
		line-height: 1.8em;
		text-decoration: none;
	}
	ul.list-feed li a:hover
	{
		background: #f2f2f2;
	}
	ul.list-feed li .date
	{
		font-size: 9px;
		margin: 0 10px 0 0;
		color: #222;
		float:left;
		display: block;
	}
	ul.list-feed li .title
	{
		overflow:auto;
		zoom:1;
	}
	
	</style>
	<script type="text/javascript"><!--
	$(function() {
		var urls = [
			'http://b.hatena.ne.jp/hotentry.rss?mode=general',
			'http://kyoko-np.net/index.xml',
			'http://b.hatena.ne.jp/hotentry/knowledge.rss'
		];
	  	$('#feed ul.list-feed').rssbinder({
	  		urls:urls,
	  		max:20
	  	});
	  	
	});
	// --></script>

//body
	<div id="feed">
	<ul class="list-feed">
	</ul>
	</div>
 
 * //////////////////////////////////////////////////////////////////////
*/

//

//load googlefeeds
google.load("feeds", "1");

(function($){
	
	//////////////////////////////////////////////////////////////////////
	
    $.fn.rssbinder = function( option ) {
		option = $.extend({
			urls: [],
			titles: [],
			max: 5,//表示する記事の数
			max_single: 5,//一つのフィードから持ってくる記事の数
			//
			entryArray: [],
			entryNum: 0,
			loadCount: 0,
			isReady: false,
			base: null,
			feed: null,
			
			//
			name: 'rssbinder'
		}, option);
        return this.each(function() {
            
			option.base = $(this);
			
			if(option.isReady) return;
			option.isReady = true;
			option.base.empty();
			
			for (var i = 0; i < option.urls.length; i++) {
				$.rssbinder.feedAdd(option, option.urls[i], i);
			}
            
            
        });
    };
	
	//////////////////////////////////////////////////////////////////////
	
    $.rssbinder = {
        feedAdd : function(option, rssUrl, boolNum){
			var feed = new google.feeds.Feed(rssUrl);
			feed.setNumEntries(option.max_single);
			feed.load(function(result) {
				var obj;
				var data;
				if (!result.error) {
					for (var i = 0; i < result.feed.entries.length; i++) {
						data = {};
						data = result.feed.entries[i];
						var date = new Date(result.feed.entries[i].publishedDate);
						data.sortDate = ( date.getFullYear()*10000 ) + ( (date.getMonth() + 1)*100 ) + date.getDate();
						data.blogName = result.feed.title;
						data.resultfeedUrl = result.feed.feedUrl;
						option.entryArray[option.entryNum] = data;
						option.entryNum+=1;
					}
				}
				
				option.loadCount++;	
				if(option.loadCount == option.urls.length){
					$.rssbinder.feedOutput(option);
				}
			});
        },
        feedOutput : function(option){
			var useFeed = "";
			option.entryArray = $.rssbinder.asort(option.entryArray, "sortDate");
			for (var i = 0; i < option.max; i++) {
				if(option.entryArray[i]) {
					var blogId = -1;
					try {
						blogId = option.urls.indexOf(option.entryArray[i].resultfeedUrl);
					} catch(e){};
					var entry = option.entryArray[i];
					
					if(entry.title.indexOf('PR:') != -1) {
						option.max += 1;
					} else {
						option.base.append($.rssbinder.returnHtml(option, entry, blogId));
					}
				}
			}
        },
        returnHtml : function(option, entry, id){
        	console.log(entry.blogName);
        	
			var html = '';
			var date = new Date(entry.publishedDate);
			var blogName = '';
			if(option.titles.length == 0) blogName = entry.blogName;
			else if(id != -1) blogName = option.titles[id];
			var yymmdd = date.getFullYear() + '.' + $.rssbinder.zero(date.getMonth()+1) + '.' + $.rssbinder.zero(date.getDate());
			
			html += '<li><a href="'+entry.link+'" target="blank"><p class="date">'+yymmdd+'</p> <p class="title">'+entry.title+' <span class="blogName">['+blogName+']</span></p></a></li>';
			
			return html;
        },
        asort : function(ar, key){
			return ar.sort ( function (b1, b2) { return b1[key] > b2[key] ? -1 : 1; } );
        },
        zero : function(n){
        	return (n < 10)?"0"+n:n;
        }
    }
	
	//////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////
	
})(jQuery);


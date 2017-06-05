(function(){

$(window).on("load", function() { 
	sessionStorage.clear();
	if(ajaxInit() != null)
	{
		loadArticles();
	}

	switchLTR();
	menu();
});

//----------------

function ajaxInit()
{
	var request = false;
    try {
    	request = new XMLHttpRequest();
	} catch(error1) {
    	try {
     		 request = new ActiveXObject("Msxml2.XMLHTTP");
		} catch(error2) {
    		try {
        		request = new ActiveXObject("Microsoft.XMLHTTP");                
     		} catch(error3) {
        		request = false;
				}
    		}
  		}
  	return request;
} 

function loadArticles()
{
	var root = "http://jsonplaceholder.typicode.com";
	$.ajax({
		url: root + "/posts",
	 	method: "GET",
	 	dataType: "json"
	}).then(function(data) {
		articlesPerSite = 10;
		renderArticles(data, articlesPerSite);	
	});
}

function loadSigleArticle(ID)
{
	var root = "http://jsonplaceholder.typicode.com";
	$.ajax({
		url: root + "/posts/"+ID,
		method: "GET",
		dataType: "json"
	}).then(function(data) {
		renderSingleArticel(data);
	});
}

function renderArticles(data, range = 10, page=0){
	var session_page = sessionStorage.getItem("current-page");
	if (session_page === null)
	{
		sessionStorage.setItem("current-page", 0);
	}else{
		page = session_page;
	}
	var articleContainer = $("#articlesList");
	var newData = sliceData(data, range);
	pagesNumber = newData.length;
	newData[page].forEach(function(data) {
	    var div = 
	    `<div class="col-xs-12 single-article" data-id="`+data.id+`"">  
	    	<div class="article_title col-xs-12">
	    		<h3>`+
	    			data.id + ` ` + data.title+
	    		`</h3>
	    	</div>
	    </div>`;
	    articleContainer.append(div);
	});

	if(pagesNumber - 1> sessionStorage.getItem("current-page"))
	{
		var loadMore = ``;
		loadMore = `<span class="loadmore-button">Load More</span>`;
		loadMore = `<div class="loadmore col-xs-12">`+loadMore+`</div>`;
		articleContainer.append(loadMore);
	}

	$( ".loadmore span.loadmore-button" ).one( "click", function() {
		  $(this).closest(".loadmore").fadeOut();
			var page_n = sessionStorage.getItem("current-page");
			sessionStorage.setItem("current-page", parseInt(page_n)+1);
			setTimeout(
			 	function() 
			  	{
			    renderArticles(data);
			  	}, 1000
			);
		});

	$(".single-article").click(function(){
		var article_id = $(this).closest(".single-article").data("id");
		loadSigleArticle(article_id);
	});
};

function renderSingleArticel (data){
	var articleContainer = $("#articlesList");
	articleContainer.empty();
	var div = 
	    `<div class="col-xs-12">  
	    	<div class="title">
	    		<h2>`+
	    			data.title+
	    		`</h2>
	    	</div>
	    	<article>`+
	    			data.body+
    		`</article>
    		<div class="return">
    			<button class="btn button_return">Return</button>
    		</div>
	    </div>`;
	articleContainer.append(div);
	$( ".button_return" ).click(function() {
		articleContainer.empty();
		sessionStorage.setItem("current-page", 0);
    	loadArticles();
	});
};


function sliceData(data, range){
	var newData = [];
	for (i = 0 ; i<data.length ; i+=range) {
	    newData.push(data.slice(i,i+range));
	}
	return newData;
};


function switchLTR(){
	$("#cmn-toggle-4").change(function() {
	  	
	  	if ($("#cmn-toggle-4").is(":checked")){
  			$("main").addClass("rtl");

	  	}else{
  			$("main").removeClass("rtl");
	  	}
	});
}


function menu()
{
	$(".mobile-menu").click(function(){
		if($( "#menu" ).hasClass("visible-menu"))
		{
			$( "#menu" ).stop().removeClass("visible-menu");
		}else{
			$( "#menu" ).stop().addClass("visible-menu");
		}
	});

}

}());
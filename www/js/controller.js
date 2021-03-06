//var tags = ["seleccion", "creacion", "filtrado", "modificacion de css","animacion","ready","attr","append", "fadeout", "click", "transicion"];
var tags = [];
var selectedTags = [];
//var selectedTags = ["animacion"];

// SNIPPETS OBJECTS ARE ON snippets.js
var snippets = [];
var selectedSnippets = [] // = snippets.slice(); // A WAY OF COPYING BY VALUE, WORKS ONLY WITH PRIMITIVES/IMMUTABLES

var lightBox;

$(document).ready(function(){

      // FETCHING THE DATA FROM SERVER, IF SUCCESFUL, TRIGGERS BUILDING ALL
      // DYNAMIC ELEMENTS IN WEBPAGE
      fetchSnippetsFromServer();

      // ATTACH BEHAVIORS to form.submit() event
      $("#snippetForm").submit( function (){
            console.log("-||SUBMIT BUTTON BEHAVIOUR");
            
            var $submitButton = $(".featherlight #formSubmitButton");
            $submitButton.attr("disabled",true);
            $submitButton.attr("value","Subiendo Snippet..!!");
            $submitButton.css({"background-color":"white"});            
            

            // CLOSE THE CURRENT featherlight LIGTHBOX, AFTER 2 SECONDS
            setTimeout(function(){
                  $.featherlight.current().close();
            },2000);

            // RELOAD(hardReload=true) THE PAGE AFTER FADING OUT LIGHTBOX
            setTimeout(function(){
                  window.location.reload(true);
            },3000);

            return true;
      });

      $("#lightBoxTrigger").click(function(){
            console.log("-|| Opening LightBox Form");
            
            // REASSIGN TAB INDICES
            // BECAUSE LIGHTBOX FUCKS THEM UP (SETS THEM ALL TO -1).
            // WAIT a little SECOND FOR THE LIGHTBOX TO COMPLETELY BUILD
            setTimeout(function(){
               $(".featherlight").find("input[name='titulo']").attr("tabindex","1");
               $(".featherlight").find("textarea[name='code']").attr("tabindex","2");
               $(".featherlight").find("textarea[name='descripcion']").attr("tabindex","3");
               $(".featherlight").find("input[name='tags[0]']").attr("tabindex","4");
               $(".featherlight").find("input[name='tags[1]']").attr("tabindex","5");
               $(".featherlight").find("input[name='tags[2]']").attr("tabindex","6");
               $(".featherlight").find("#formSubmitButton").attr("tabindex","7");

               // AGREGAR UN SUBRAYADO AL TITULO
               //var titulo = $(".featherlight h1");
               //titulo.css({"border-bottom":"solid 1px #757575"});

            },10);
            
            

      });


});

function fetchSnippetsFromServer(){

      var simpleFormDownloadJsonURL = "https://getsimpleform.com/messages.json?api_token=2c5bf8d6e2e41ba746173130af8c4401";
      
      $.ajax(simpleFormDownloadJsonURL, {
            // ASYNCHRONOUS REQUEST: ONLY BUILD THE WEBPAGE DYN ELEMENTS WHEN 
            // REQUEST RESPONSE IS "complete"
            complete: function(data) {

                  var preSnippets = JSON.parse(data.responseText); // WITH A LOT OF STUFF OTHER THAN THE SNIPPET DATA

                  // PUSH THE USEFULL DATA TO SNIPPET ARRAY
                  for (var index = 0; index < preSnippets.length; index++) {
                        snippets.push(preSnippets[index].data);                    
                  }

                  // HAVE ALL SNIPPETS SELECTED AT FIRST
                  selectedSnippets = snippets.slice(); // A WAY OF COPYING BY VALUE, WORKS ONLY WITH PRIMITIVES/IMMUTABLES
                  
                  console.log(JSON.parse(data.responseText));                  
                  console.log("-|| Data Fetched");

                  buildNavigationTagsFromSnippets();
                  createNavigation();
                  createSnippetContainers();
                  buildSearchBox();

            },
            dataType: 'json'
          })
}

function buildSearchBox(){
// SEARCH BOX FUNCTIONALITY IN JQueryUI

      console.log("-|| BUILDING SEARCH-BOX");


      $( function() {
            $( "#tagSearch" ).autocomplete({
                  source: tags,
                  select: function (event, ui) {
                        var seleccion = ui.item.value;
                        filtrar(seleccion);
                        ui.item.value = "";
                        console.log("|| Seleccionaste ==> " + seleccion);
                  }
            });
      });
}


function createSnippetContainers(){

   console.log("-|| BUILDING SNIPPET CONTAINERS");
      
   var $snippetArea = $("#snippetArea");

   updateSelectedSnippetsArray(selectedTags);

   //$snippetArea.children(".snippetContainer").remove();
   //$snippetArea.children(".snippetContainer").fadeOut(500);
   removeSnippetsFromView();
   generateSnippetsCode();



   //$("li").css("background-color", "red");
}

function generateSnippetsCode(){
   var $snippetArea = $("#snippetArea");

   var $snippetsInView = $snippetArea.children();

   for (var i = 0; i < selectedSnippets.length; i++) {

      if(!isSnippetInView(selectedSnippets[i], $snippetsInView)){
         var $titulo = $("<h1>",{"text":selectedSnippets[i].titulo});
         var $code = $("<code>", {"text":selectedSnippets[i].code,"class":"language-js"});
         var $preCode = $("<pre>");
         $preCode.append($code);
         var $descripcion = $("<p>",{"text":selectedSnippets[i].descripcion,"class":"snippetDescription"});

         // USING THE MAP FUNCTION TU TURN THE TAGS (SUB)OBJECT, AS RETURNED BY THE SERVER, TO AN ARRAY
         // FROM => {0:"tag1", 1:"tag2"} => to => ["tag1", "tag2"]
         var snippetTagsAsArray = $.map(selectedSnippets[i].tags, function(value,index){
            return [value];
         });

         var $tags = $("<p>",{"text":snippetTagsAsArray,"class":"snippetTags"});

         var $nuevoSnippet = $("<div>",{"class":"snippetContainer"});

         //var mergedHTMLs = $titulo.innerHTML() + $code.innerHTML() + $descripcion.innerHTML();
         //var mergedHTMLs = $titulo.append($code).append($descripcion);
         //$nuevoSnippet.html(mergedHTMLs);

         $nuevoSnippet.append($titulo);
         $nuevoSnippet.append($preCode);
         $nuevoSnippet.append($descripcion);
         $nuevoSnippet.append($tags);



         $snippetArea.append($nuevoSnippet);
         //$("#snippetArea").append($("<div>",{"class":"snippetContainer", "text":"AppendedSnippet"}));
      }
   }


   Prism.highlightAll();

}

function removeSnippetsFromView(){

      // REMOVE THE VIEW SNIPPETS THAT DO NOT MATCH THE
      // TITLE OF THE MODEL SNIPPETS.

      var snippetsInView = $("#snippetArea").children();
      var titlesOfSnippetsToUpdate = getNewSnippetsTitles();

      snippetsInView.each(function(index, element){
         var tituloInView = $(element).children("h1").html();
         if(titlesOfSnippetsToUpdate.indexOf(tituloInView) == -1){
            $(this).remove();
         }

      });

}

function getNewSnippetsTitles(){
   var titles = [];
   for (var i = 0; i < selectedSnippets.length; i++) {
      titles.push(selectedSnippets[i].title);
   }
   return titles;
}

function isSnippetInView(snippet, $snippetsInView){

   $snippetsInView.each(function(index, element){
      var tituloInView = $(element).children("h1").html();
      if(tituloInView == snippet.titulo){
         return true;
      }

   });
   return false;
}

function createNavigation(){

      console.log("-|| BUILDING NAVIGATION DOM ELEMENTS");
      
   var $navContainer = $(".navContainer");

   for (var i = 0; i < tags.length; i++) {
      var $newNavTag = $("<li>",{"text":tags[i],"class":"activeTag"});

      $navContainer.append($newNavTag);
   }

   // ATTACHED CLICK HANDLER TO NavButtons
   $(".navContainer").click(iniciarFiltroPorClick);

   
}

function buildNavigationTagsFromSnippets(){
   console.log("-|| BUILDING NAV TAGS (FROM SNIPPETS)");
   for (var i = 0; i < snippets.length; i++) {

      var snippetTagsAsObjects = snippets[i].tags;

      // USING THE MAP FUNCTION TU TURN THE TAGS (SUB)OBJECT, AS RETURNED BY THE SERVER, TO AN ARRAY
      // FROM => {0:"tag1", 1:"tag2"} => to => ["tag1", "tag2"]
      var snippetTags = $.map(snippetTagsAsObjects, function(value,index){
            return [value];
      });


      for (var j = 0; j < snippetTags.length; j++) {
         if(tags.indexOf(snippetTags[j]) == -1){
            tags.push(snippetTags[j]);
         }
      }
   }

   selectedTags = tags;
}

$("#resetFilter").click(function(){
   filtrar("reset");
});

function iniciarFiltroPorClick(event){
   var navButtonText = $(event.target).text();
   if($(event.target).is("li")){ // TO AVOID CLICKING ANYWHERE ELSE INSIDE navContainer
      filtrar(navButtonText);
   }
}
function filtrar(tagName){
   //$(event.target).fadeOut();

   // UPDATE DATA
   updateSelectedTagsArray(tagName);
   updateSelectedSnippetsArray(selectedTags);

   //$(event.currentTarget).children("li").css({"background-color":"skyblue"})
   //$(".navContainer").children("li").css({"background-color":"skyblue"})
   //$(event.target).css({"background-color":"teal"})

   // UPDATE VIEW - NAVIGATION
   var $navButtons = $(".navContainer").children("li");

   $navButtons.each(function(index,element){
      for (var i = 0; i < selectedTags.length; i++) {
         if($(element).text() == selectedTags[i]){
            //$(element).css({"background-color":"var(--accent-color)", "color":"var(--light-primary-color)"});
            $(element).attr("class","activeTag");
            break;
         } else {
            //$(element).css({"background-color":"var(--light-primary-color)", "color":"var(--secondary-text-color)"});
            $(element).attr("class","inactiveTag");
         }
      }

   });

   // UPDATE VIEW - SNIPPETS
   createSnippetContainers();

}

function updateSelectedTagsArray(tagName){

   if(tagName == "X"){
      selectedTags = tags;
      return;
   }
   // IF AT INIT STATE (ALL TAGS SELECTED), CLEAR selectedTags
   if(selectedTags.length == tags.length){
      selectedTags = [];
   }

   // IF IT DOESN'T ALREADY EXIST
   if(selectedTags.indexOf(tagName) == -1){
      selectedTags.push(tagName);
   } else {
      selectedTags.splice(selectedTags.indexOf(tagName),1);
   }
}

function updateSelectedSnippetsArray(tagArray){

   // INIT STATE

   //if(selectedTags.length == tags.length){
      selectedSnippets = [];
   //}

   for (var i = 0; i < snippets.length; i++) {

      var snippetTagsAsObjects = snippets[i].tags;

      // USING THE MAP FUNCTION TU TURN THE TAGS (SUB)OBJECT, AS RETURNED BY THE SERVER, TO AN ARRAY
      // FROM => {0:"tag1", 1:"tag2"} => to => ["tag1", "tag2"]
      var snippetsTags = $.map(snippetTagsAsObjects, function(value,index){
            return [value];
      });

      for (var j = 0; j < selectedTags.length; j++) {
            if(snippetsTags.indexOf(tagArray[j]) != -1){
               selectedSnippets.push(snippets[i]);
               break;
            }
      }
   }

}

function sendData() {
      console.log("|| SENDING DATA....");
      var simpleFormUploadURL = "https://getsimpleform.com/messages?form_api_token=0b3c3e652847c8217439a9b8f752320e";
      
      $.post( simpleFormUploadURL, $(".featherlight").find('form').serialize(), function(data) {
            console.log("Data Sent");
            },
            'json' // I expect a JSON response
      );
      
}

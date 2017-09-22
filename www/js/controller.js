var tags = ["seleccion", "filtrado", "modificacion de css","animacion","ready","attr","animate"];

//var selectedTags = tags;
var selectedTags = ["animacion"];

var snippets = [
   {
      titulo: "Seleccion de HTML",
      code: 'var $elemento = $("#selector p")',
      descripcion: "Selecciona y guarda el elemento con ese ID, como un objeto JQuery",
      tags: ["seleccion", "js", "jquery"]
   },
   {
      titulo: "Fade Out",
      code: "Snippet de Codigo",
      descripcion: "Explicacion del Snippet",
      tags: ["animacion","animate"]
   },
   {
      titulo: "document.ready",
      code: "Snippet de Codigo",
      descripcion: "Explicacion del Snippet",
      tags: ["ready","jquery"]
   }
]
var selectedSnippets = snippets.slice(); // A WAY OF COPYING BY VALUE, WORKS ONLY WITH PRIMITIVES/IMMUTABLES


$(document).ready(function(){
   createNavigation();
   //createSnippetContainers();
});

/*
function createSnippetContainers_Old(){
   var $snippetArea = $("#snippetArea");

   for (var i = 0; i < snippets.length; i++) {
      var $titulo = $("<h1>",{"text":snippets[i].titulo});
      var $code = $("<p>", {"text":snippets[i].code});
      var $descripcion = $("<p>",{"text":snippets[i].descripcion});

      var $nuevoSnippet = $("<div>",{"class":"snippetContainer"});

      //var mergedHTMLs = $titulo.innerHTML() + $code.innerHTML() + $descripcion.innerHTML();
      //var mergedHTMLs = $titulo.append($code).append($descripcion);
      //$nuevoSnippet.html(mergedHTMLs);

      $nuevoSnippet.append($titulo);
      $nuevoSnippet.append($code);
      $nuevoSnippet.append($descripcion);


      $snippetArea.append($nuevoSnippet);
      //$("#snippetArea").append($("<div>",{"class":"snippetContainer", "text":"AppendedSnippet"}));
   }

   //$("li").css("background-color", "red");

}
*/

function createSnippetContainers(){
   var $snippetArea = $("#snippetArea");

   updateSelectedSnippetsArray(selectedTags);

   $snippetArea.children(".snippetContainer").remove();

   for (var i = 0; i < selectedSnippets.length; i++) {
      var $titulo = $("<h1>",{"text":selectedSnippets[i].titulo});
      var $code = $("<p>", {"text":selectedSnippets[i].code,"class":"snippetCode"});
      var $descripcion = $("<p>",{"text":selectedSnippets[i].descripcion,"class":"snippetDescription"});

      var $nuevoSnippet = $("<div>",{"class":"snippetContainer"});

      //var mergedHTMLs = $titulo.innerHTML() + $code.innerHTML() + $descripcion.innerHTML();
      //var mergedHTMLs = $titulo.append($code).append($descripcion);
      //$nuevoSnippet.html(mergedHTMLs);

      $nuevoSnippet.append($titulo);
      $nuevoSnippet.append($code);
      $nuevoSnippet.append($descripcion);


      $snippetArea.append($nuevoSnippet);
      //$("#snippetArea").append($("<div>",{"class":"snippetContainer", "text":"AppendedSnippet"}));
   }

   //$("li").css("background-color", "red");

}

function createNavigation(){
   var $navContainer = $(".navContainer");

   for (var i = 0; i < tags.length; i++) {
      var $newNavTag = $("<li>",{"text":tags[i],"class":"activeTag"});

      $navContainer.append($newNavTag);
   }

   // ATTACHED CLICK HANDLER TO NavButtons
   $(".navContainer").click(iniciarFiltroPorClick);


}

$("#resetFilter").click(function(){
   filtrar("reset");
});

function iniciarFiltroPorClick(event){
   filtrar($(event.target).text());
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
   // INIT STATE
   if(selectedTags.length == tags.length){
      selectedTags = [];
   }

   // IF IT DOESN'T ALREADY EXIST
   if(selectedTags.indexOf(tagName) == -1){
      selectedTags.push(tagName);
   }
}

function updateSelectedSnippetsArray(tagArray){

   // INIT STATE

   //if(selectedTags.length == tags.length){
      selectedSnippets = [];
   //}

   for (var i = 0; i < snippets.length; i++) {
      var snippetsTags = snippets[i].tags;

      for (var j = 0; j < selectedTags.length; j++) {
            if(snippetsTags.indexOf(tagArray[j]) != -1){
               selectedSnippets.push(snippets[i]);
               break;
            }
      }
   }

}

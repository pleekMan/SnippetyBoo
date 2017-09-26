var tags = ["seleccion", "creacion", "filtrado", "modificacion de css","animacion","ready","attr","append", "fadeout", "click", "transicion"];

var selectedTags = tags;
//var selectedTags = ["animacion"];

var snippets = [
   {
      titulo: "Seleccion de HTML",
      code: 'var $elemento = $("#selector p")',
      descripcion: "Selecciona y guarda el elemento con ese ID, como un objeto JQuery",
      tags: ["seleccion", "js", "jquery"]
   },
   {
      titulo: "Crear un Elemento y asignar attributos",
      code: 'var $nuevoLi = $("<li>",{"text": "Un elemento de la lista"});',
      descripcion: "Crea un nuevo elemento y asigna el attributo TEXT",
      tags: ["creacion", "js", "jquery"]
   },
   {
      titulo: "Crear Elemento y append()",
      code: 'var $nuevoLi = $("<li>",{"text": "Otro elemento en la lista"});\n$("#miLista").append($nuevoLi);',
      descripcion: "Crear un Elemento y lo agrega a un lista preExistente",
      tags: ["creacion", "js", "jquery","append"]
   },
   {
      titulo: "Fade Out",
      code: '$("h1").click(function(){\n\t$(this).fadeOut();\n});',
      descripcion: "Al apretarse un elemento <h1>, éste mismo transiciona a invisible. Al terminar la animación -> display:none.",
      tags: ["animacion","fadeout", "click"]
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
   createSnippetContainers();

   // SEARCH BOX FUNCTIONALITY IN JQueryUI
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

});



function createSnippetContainers(){
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
         var $tags = $("<p>",{"text":selectedSnippets[i].tags,"class":"snippetTags"});

         var $nuevoSnippet = $("<div>",{"class":"snippetContainer"});

         //var mergedHTMLs = $titulo.innerHTML() + $code.innerHTML() + $descripcion.innerHTML();
         //var mergedHTMLs = $titulo.append($code).append($descripcion);
         //$nuevoSnippet.html(mergedHTMLs);

         $nuevoSnippet.append($titulo);
         $nuevoSnippet.append($preCode);
         $nuevoSnippet.append($descripcion);
         $nuevoSnippet.append($tags);



         $snippetArea.prepend($nuevoSnippet);
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

function isSnippetInView(snippet, snippetsInView){

   snippetsInView.each(function(index, element){
      var tituloInView = $(element).children("h1").html();
      if(tituloInView == snippet.titulo){
         return true;
      }

   });
   return false;
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
      var snippetsTags = snippets[i].tags;

      for (var j = 0; j < selectedTags.length; j++) {
            if(snippetsTags.indexOf(tagArray[j]) != -1){
               selectedSnippets.push(snippets[i]);
               break;
            }
      }
   }

}

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

import Controller from '@ember/controller';

export default class DocsPluginsTutoWithFullExampleController extends Controller {
  init() {
    const markdownContent = `#Full guide on plugins creation and usage
    
Welcome to this tutorial ! We will walk you through the editor possibilities 
with the help of a demo application. 
    
## Setting up the stack

To run that stack you will need to have npm, docker and ember installed.

Backend

    git clone https://github.com/lblod/app-rdfa-editor-demo.git
    cd app-rdfa-editor-demo
    docker-compose up

Frontend

    git clone https://github.com/lblod/frontend-rdfa-editor-demo.git
    cd frontend-rdfa-editor-demo
    npm install
    ember serve --proxy http://host

## Adding the editor to your app

To use the editor in your app all you first need to install the ember-rdfa-editor plugin.

    ember install @lblod/ember-rdfa-editor

You then have to import it in your template. The wrapping div is used to define the context of the editor. 
Here, we indicate it is a Document.

    frontend-rdfa-editor-demo/app/templates/editor/index.hbs

    <div prefix="foaf: http://xmlns.com/foaf/0.1/" typeof="foaf:Document" resource="#">
      {{rdfa/rdfa-editor class="rdfa-editor" profile=profile value=editorDocument.content rdfaEditorInit=(action "handleRdfaEditorInit")}}
    </div>

## Adding an existing plugins : date and date-overwrite

You can reuse existing plugins to enhance your editor. We will go over two examples of plugin integration here.

### ember-rdfa-editor-date-plugin

This plugin allows you to insert a date in the editor. When you type 'DD/MM/YYYY' a card should pop up, 
asking you if you want to insert it as a date with the appropriate rdfa tags.

We first need to install the plugin

    ember install @lblod/ember-rdfa-editor-date-plugin

We then have to configure the backend to ensure our document expects a date

    app-rdfa-editor-demo/config/resources/domain.lisp

    (define-resource document ()
    :class (s-prefix "foaf:Document")
    :properties \`((:date :datetime ,(s-prefix "dct:created")))
    :resource-base (s-url "http://data.notable.redpencil.io/document/")
    :features '(include-uri)
    :on-path "documents")

And finally allow our plugin in the frontend

    frontend-rdfa-editor-demo/app/config/editor-profiles.js

    export default {
      default: [
        "rdfa-editor-date-plugin"
      ],
      all: [
        "rdfa-editor-date-plugin"
      ],
      none: []
    };

Now you should be able to insert a date in your document ! When you click on the insert button on the card, the 
following HTML will be inserted in your document.


### ember-rdfa-editor-date-overwrite-plugin

This plugin allows you to change a date in your document, RDFa content included.

We first need to install the plugin

    ember install @lblod/ember-rdfa-editor-date-overwrite-plugin

Then insert in the content of our editor the following

    <span property="ns:aProperty" datatype="xsd:date" content="2012-12-12">12 december 2012</span>

And finally allow our plugin in the frontend

    frontend-rdfa-editor-demo/app/config/editor-profiles.js

    export default {
      default: [
        "rdfa-editor-date-overwrite-plugin"
      ],
      all: [
        "rdfa-editor-date-overwrite-plugin"
      ],
      none: []
    };

If you now click on the date in the editor, a card will pop up, allowing you to change the date.

## Create new plugins

### Generating the plugin code

For this we will have to follow this steps:

#### Create an addon

    ember addon ember-rdfa-editor-your-name-plugin

#### add the package scope to package.json

    emacs # (or your editor of choice)

#### install this addon

    ember install @lblod/ember-rdfa-editor-plugin-generator

#### generate the plugin scaffold

    ember g editor-plugin your-name

### Customizing our plugin

In this tutorial we are going to create a plugin that generates automatic links to wikipedia when we type \`dbp:word\`. When the plugin gets generated we will have to focus on 3 main files:
- \`addon/services/rdfa-editor-your-name-plugin.js\`
- \`addon/components/editor-plugins/your-name-card.js\`
- \`addon/templates/components/editor-plugins/your-name-card.js\`

The first one is the service where we will identify the relevant text on the editor and generate cards for it. In this case our relevant text is everything of the type \`dbp:word\` and the card will ask the user if he wants to replace it for the wikipedia link.

#### Service
This is the file \`addon/services/rdfa-editor-your-name-plugin.js\`. Here we will have to modify 2 methods:
- \`detectRelevantContext\`: this method receives a context and returns a \`Boolean\` indicating if the context is relevant to our plugin or not, the context is a complex object representing a section of the document, you can read more about it here. For this use case we will use its \`text\` property where we can use RegEx to see if it matches the structure \`dbp:word\`.
- \`generateHintsForContext\`: this method receives a context that we already know that's relevant and creates a hint for it, we can completely customize the hint and card generation process but we will follow the one that's already there, for that we will need to create a card with a text and a location, the location is the characters that we will highlight, and the text is some text we will pass down to the card, in this case we will get the location of the characters that form the string \`dbp:word\` and will pass down \`word\` as a string.

#### Plugin Component
This is related to the file \`addon/components/editor-plugins/your-name-card.js\`. In this file we will provide you with one function \`getDbpediaOptions\` that basically gets the term and set the variable this.options containing an array with all the relevant options found on dppedia in order to link to wikipedia. We will also link this function to the \`willRender\` hook of the component, so it will run before showing the card.
For this file you will have to create new function called \`generateLink\` and modify the \`insert\` action.
- \`generateLink\`: this method is very basic, it will just generate the link html getting the first option from the this.options array. The link will be like \`https://en.wikipedia.org/wiki/Word\`, also we will have to use the js \`encodeURI\` method in order to escape the string.
- \`insert\`: this method basically selects the highlighted string that we get from the hint (we get the location on the component) and replaces it by the link generated on the previous method. For this we can use the \`selectHighlight\` and the \`update\` methods on the editor

#### Template
This is related to the file \`addon/templates/components/editor-plugins/your-name-card.js\` this is the simplest step, we just have to replace the text in the card by a question asking the user if he wants to replace the text by a link to the word we got in the options, for this we will use the ember get helper that has the following structure \`{{get array index}}\`
`;
    this.set('markdown', markdownContent);
  }
}

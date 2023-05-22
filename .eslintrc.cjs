/** @type {import('@typescript-eslint/utils').TSESLint.Linter.Config} */
const config = {
    rules: {
        'no-restricted-syntax': [
            'warn',
            // Warn on nesting <a> elements, <button> elements and framework <Link> components inside of each other
            {
                selector:
                    "JSXElement[openingElement.name.name='a'] > JSXElement[openingElement.name.name=/^a|button|Link$/]",
                message:
                    'Invalid DOM Nesting: anchor elements cannot have anchor elements, button elements or Link components as children',
            },
            {
                selector:
                    "JSXElement[openingElement.name.name='button'] > JSXElement[openingElement.name.name=/^a|button|Link$/]",
                message:
                    'Invalid DOM Nesting: button elements cannot have anchor elements, button elements or Link components as children',
            },
            {
                selector:
                    "JSXElement[openingElement.name.name='Link'] > JSXElement[openingElement.name.name=/^a|button|Link$/]",
                message:
                    'Invalid DOM Nesting: Link components cannot have anchor elements, button elements or Link components as children',
            },
            // Warn on nesting of non-<li> elements inside of <ol> and <ul> elements
            {
                selector:
                    "JSXElement[openingElement.name.name=/^ol|ul$/] > JSXElement[openingElement.name.name!='li'][openingElement.name.name!=/^[A-Z]/]",
                message:
                    'Invalid DOM Nesting: ol and ul elements cannot have non-li elements as children',
            },
            // Warn on nesting common invalid elements inside of <p> elements
            {
                selector:
                    "JSXElement[openingElement.name.name='p'] > JSXElement[openingElement.name.name=/^div|h1|h2|h3|h4|h5|h6|hr|ol|p|table|ul$/]",
                message:
                    'Invalid DOM Nesting: p elements cannot have div, h1, h2, h3, h4, h5, h6, hr, ol, p, table or ul elements as children',
            },
            // Warn on nesting any invalid elements inside of <table> elements
            {
                selector:
                    "JSXElement[openingElement.name.name='table'] > JSXElement[openingElement.name.name!=/^caption|colgroup|tbody|tfoot|thead$/][openingElement.name.name!=/^[A-Z]/]",
                message:
                    'Invalid DOM Nesting: table elements cannot have element which are not caption, colgroup, tbody, tfoot or thead elements as children',
            },
            // Warn on nesting any invalid elements inside of <tbody>, <thead> and <tfoot> elements
            {
                selector:
                    "JSXElement[openingElement.name.name=/tbody|thead|tfoot/] > JSXElement[openingElement.name.name!='tr'][openingElement.name.name!=/^[A-Z]/]",
                message:
                    'Invalid DOM Nesting: tbody, thead and tfoot elements cannot have non-tr elements as children',
            },
            // Warn on nesting any invalid elements inside of <tr> elements
            {
                selector:
                    "JSXElement[openingElement.name.name='tr'] > JSXElement[openingElement.name.name!=/th|td/][openingElement.name.name!=/^[A-Z]/]",
                message:
                    'Invalid DOM Nesting: tr elements cannot have elements which are not th or td elements as children',
            },
        ],
    },
};

module.exports = config;

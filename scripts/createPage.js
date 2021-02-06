'use strict';

const inquirer = require('inquirer');

inquirer
  .prompt([
    {
      type: 'input',
      name: 'path',
      message: 'URL path of the new page',
      transformer(value) {
        return value.startsWith('/') ? value : `/${value}`;
      },
    },
  ])
  .then((answers) => {
    console.log(answers);
  })
  .catch((error) => {
    console.error(error);
  });

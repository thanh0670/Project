const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Swagger',
        description: 'Swagger',
    },
    host: 'localhost:8000',
    schemes: ['http'],
};


const outputFile = '../src/utils/swagger/swagger-output.json';
const endpointsFiles = ['../src/app/app'];
const swaggerGenerate = () => {
    swaggerAutogen(outputFile, endpointsFiles, doc);
}

swaggerGenerate();
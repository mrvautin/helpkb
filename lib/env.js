const path = require('path');
const fs = require('fs');
const os = require('os');

const varRegex = /\$[A-Z_]*/g;

let parsedEnv;

const readEnv = () => {
    const devEnvFiles = [
        path.join(__dirname, '..', '..', '.env'),
        path.join(__dirname, '..', '..', '.env.development'),
        path.join(__dirname, '..', '..', '.env.local'),
        path.join(__dirname, '..', '..', '.env.development.local'),
    ];
    const testEnvFiles = [
        path.join(__dirname, '..', '..', '.env'),
        path.join(__dirname, '..', '..', '.env.test'),
        path.join(__dirname, '..', '..', '.env.test.local'),
    ];
    const prodEnvFiles = [
        path.join(__dirname, '..', '..', '.env'),
        path.join(__dirname, '..', '..', '.env.production'),
        path.join(__dirname, '..', '..', '.env.local'),
        path.join(__dirname, '..', '..', '.env.production.local'),
    ];

    if (!process.env.NODE_ENV) {
        console.log('ERROR: No NODE_ENV environment variable has been set.');
        process.exit();
    }

    const nodeEnv = process.env.NODE_ENV.toLowerCase();
    const devEnvs = ['development', 'dev'];
    const testEnvs = ['test', 'testing'];
    const prodEnvs = ['production', 'prod'];
    // DEV
    if (devEnvs.includes(nodeEnv)) {
        parseEnvFiles(devEnvFiles);
    }
    // TEST
    if (testEnvs.includes(nodeEnv)) {
        parseEnvFiles(testEnvFiles);
    }
    // PROD
    if (prodEnvs.includes(nodeEnv)) {
        parseEnvFiles(prodEnvFiles);
    }

    return parsedEnv;
};

const parseEnvFiles = files => {
    files.forEach(file => {
        if (fs.existsSync(file)) {
            const envContents = fs.readFileSync(file, 'utf8');
            parseEnv(envContents);
        }
    });
};

const parseEnv = contents => {
    const lines = contents.split(os.EOL);
    const parsed = {};

    // Loop and grab all values and variables
    lines.forEach(line => {
        const [variable, ...value] = line.split('=');
        parsed[variable] = value[0];
    });

    // Replace variables
    for (const variable in parsed) {
        const value = parsed[variable];
        if (value) {
            const variables = value.match(varRegex);
            if (variables && variables.length > 0) {
                let newVal = value;
                variables.forEach(variable => {
                    newVal = newVal.replace(
                        variable,
                        parsed[variable.replace('$', '')],
                    );
                });
                parsed[variable] = newVal;
            }
        }
    }
    Object.assign(process.env, parsed);
    parsedEnv = parsed;
    return parsed;
};

module.exports = {
    readEnv,
};

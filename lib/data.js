const matter = require('gray-matter');

const validateMatter = content => {
    const parsedMatter = matter(content);

    // Check required matter
    if (!parsedMatter.data.title || parsedMatter.data.title === '') {
        return {
            matterError:
                'Parameter "title" missing from matter. Check "title" is set correctly',
        };
    }
    if (!parsedMatter.data.url || parsedMatter.data.url === '') {
        return {
            matterError:
                'Parameter "url" missing from matter. Check "url" is set correctly',
        };
    }
    if (typeof parsedMatter.data.published === 'undefined') {
        return {
            matterError:
                'Parameter "published" missing from matter. Check "published" is set correctly',
        };
    }
    if (typeof parsedMatter.data.published !== 'boolean') {
        return {
            matterError:
                'Check the "published" value. Can be: "true" or "false"',
        };
    }

    return parsedMatter;
};

const convertBool = value => {
    if (typeof value === 'boolean') {
        return value;
    }
    if (typeof value === 'number') {
        return value === 1;
    }
    return value === 'true';
};

module.exports = {
    validateMatter,
    convertBool,
};

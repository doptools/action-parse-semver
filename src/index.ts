import { Semversion } from '@doptools/tslib-semver';
import { getInput, setOutput } from '@actions/core';

const versionRaw = getInput('version', { required: true });
const versionRegex = getInput('versionRegex', { required: true });

const errOnInvalidIn = getInput('errorOnInvalid', { required: false });
let errOnInvalid = true;
switch (errOnInvalidIn.trim().toLowerCase()) {
    case '':
    case 'false':
    case '0':
        errOnInvalid = false;
        break;

}

let version = versionRaw;
try {
    if (versionRegex) {
        const matches = new RegExp(versionRegex, 'g').exec(versionRaw);
        if (matches === null) {
            throw new Error(`No match found in '${versionRaw}' for '${versionRegex}'`);
        }
        if (matches.length > 2) {
            throw new Error(`Found more than one match in '${versionRaw}' for '${versionRegex}'`);
        }
        version = matches[1];
    }
} catch (e) {
    if (errOnInvalid) {
        throw e;
    }
}

const semVer = new Semversion(version);
if (errOnInvalid && !semVer.isValid) {
    throw new Error(`'${version}' is not a valid semver`);
}
if (semVer.isValid) {
    setOutput('build', semVer.build);
    setOutput('version', semVer.version);
    setOutput('full', semVer.full);
    setOutput('hasBuild', semVer.hasBuild);
    setOutput('isPrerelease', semVer.isPrerelease);
    setOutput('isValid', semVer.isValid);
    setOutput('major', semVer.major);
    setOutput('minor', semVer.minor);
    setOutput('patch', semVer.patch);
    setOutput('prerelease', semVer.prerelease);
    setOutput('prereleaseId', semVer.prereleaseId);
    setOutput('raw', semVer.raw);
} else {
    setOutput('raw', version);
    setOutput('isValid', false);
}

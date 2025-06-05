const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

class LLVMCoverageReader {

    constructor() { }

    async summarize() {
        try {
            // Find the report
            const workspace = process.env["GITHUB_WORKSPACE"];
            const outputDir = `${workspace}/.build/debug/codecov/`;
            const files = fs.readdirSync(outputDir);
            const jsonExport = files.filter((file) => file.endsWith('.json'))[0];
            const file = `${outputDir}${jsonExport}`;
            console.log(`Reading LLVM Coverage Report [${file}]`);

            const data = require(file);
            console.log(data);

            // Read the code coverage percentage
            const percentage = data['data'][0]['files'][0]['summary']['lines']['percent'].toFixed(1);
            console.log(`Coverage Percentage [${percentage}]`);
            core.setOutput("percentage", percentage);

        } catch (error) {
            console.log(`Error reading file [${error}]`);
            core.setOutput("percentage", "error");
        }
    }
}

new LLVMCoverageReader().summarize()

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

            // Create 2 groups of files (Source + Source&Test)
            const testAndSourceFiles = data['data'][0]['files'].filter((file) => !file.filename.includes('.build'));
            const sourceFiles = testAndSourceFiles.filter((file) => !file.filename.includes('Tests'));
            
            // Iterate through the source files
            var sourceLineCount = 0;
            var sourceLinesCovered = 0;
            for (const i in sourceFiles) {
                let filename = sourceFiles[i].filename;
                let percent = sourceFiles[i]['summary']['lines']['percent'];
                let count = sourceFiles[i]['summary']['lines']['count'];
                let covered = sourceFiles[i]['summary']['lines']['covered'];
                //console.log(i, filename, covered, count, percent);
                sourceLineCount += sourceFiles[i]['summary']['lines']['count'];
                sourceLinesCovered += sourceFiles[i]['summary']['lines']['covered'];
            }

            // Iterate through the source and test files
            var testAndSourceLineCount = 0;
            var testAndSourceLinesCovered = 0;
            for (const i in testAndSourceFiles) {
                let filename = testAndSourceFiles[i].filename;
                let percent = testAndSourceFiles[i]['summary']['lines']['percent'];
                let count = testAndSourceFiles[i]['summary']['lines']['count'];
                let covered = testAndSourceFiles[i]['summary']['lines']['covered'];
                //console.log(i, filename, covered, count, percent);
                testAndSourceLineCount += testAndSourceFiles[i]['summary']['lines']['count'];
                testAndSourceLinesCovered += testAndSourceFiles[i]['summary']['lines']['covered'];
            }

            const sourcePercentage = ((sourceLinesCovered / sourceLineCount) * 100);
            const testAndSourcePercentage = ((testAndSourceLinesCovered / testAndSourceLineCount) * 100);
            // Average the 2 percentages together (what Xcode does).
            const avergagePercentage = ((sourcePercentage + testAndSourcePercentage) / 200.0) * 100;
            console.log('Percentages', sourcePercentage, testAndSourcePercentage);
            
            const percentage = avergagePercentage.toFixed(0);
            console.log(`Coverage Percentage [${avergagePercentage}]`);
            core.setOutput("percentage", percentage);

        } catch (error) {
            console.log(`Error reading file [${error}]`);
            core.setOutput("percentage", "error");
        }
    }
}

new LLVMCoverageReader().summarize()

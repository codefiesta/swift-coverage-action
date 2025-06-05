![Swift 6.0+](https://img.shields.io/badge/Swift-6.0%2B-tomato.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-indigo.svg)](https://opensource.org/licenses/MIT)

# Swift Coverage Action

Swift Coverage Action is a simple Github action that parses a swift test coverage report and outputs a percentage for displaying a badge.

## Usage
The following is an example of how to setup a Github action that extracts the percentage output from the Swift Coverage Action and pushes the output (code coverage percentage) into the [Dynamic Badges Action](https://github.com/marketplace/actions/dynamic-badges).

```yml
name: Swift Coverage

jobs:
  build:
    runs-on: macos-15
    steps:
    - uses: actions/checkout@v4
    - name: Build
      run: swift build -v
    - name: Test
      run: swift test --enable-code-coverage
    - id: coverage
      uses: codefiesta/swift-coverage-action@0.0.1
    - name: badge
      # Only run the badge update if we are pushing to main
      if: github.ref == 'refs/heads/main'
      uses: schneegans/dynamic-badges-action@v1.7.0
      with:
        auth: ${{secrets.GIST_SECRET}}
        gistID: <GIST_ID>
        filename: coverage.json
        label: Coverage
        message: ${{steps.coverage.outputs.percentage}}%
        color: white

```
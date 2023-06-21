const fs = require('fs');

class BookIndexer {
  constructor() {
    this.pages = [];
    this.excludedWords = [];
    this.wordIndex = {};
  }

  readPages(pageFiles) {
    for (const file of pageFiles) {
      const pageContent = fs.readFileSync(file, 'utf8');
      this.pages.push(pageContent);
    }
  }

  readExcludedWords(excludedWordsFile) {
    const excludedWordsContent = fs.readFileSync(excludedWordsFile, 'utf8');
    this.excludedWords = excludedWordsContent.split('\n');
  }

  generateIndex() {
    for (let i = 0; i < this.pages.length; i++) {
      const page = this.pages[i];
      const words = page.split(/\W+/);

      for (const word of words) {
        if (this.excludedWords.includes(word)) {
          continue;
        }

        if (!this.wordIndex[word]) {
          this.wordIndex[word] = [];
        }

        if (!this.wordIndex[word].includes(i + 1)) {
          this.wordIndex[word].push(i + 1);
        }
      }
    }
  }

  sortIndex() {
    const sortedKeys = Object.keys(this.wordIndex).sort();

    const sortedIndex = {};
    for (const key of sortedKeys) {
      sortedIndex[key] = this.wordIndex[key];
    }

    this.wordIndex = sortedIndex;
  }

  saveIndexToFile(outputFile) {
    let output = '';
    for (const word in this.wordIndex) {
      const pages = this.wordIndex[word].join(',');
      output += `${word} : ${pages}\n`;
    }

    fs.writeFileSync(outputFile, output);
  }
}

// Usage
const bookIndexer = new BookIndexer();
bookIndexer.readPages(['Page1.txt', 'Page2.txt', 'Page3.txt']);
bookIndexer.readExcludedWords('exclude-words.txt');
bookIndexer.generateIndex();
bookIndexer.sortIndex();
bookIndexer.saveIndexToFile('index.txt');